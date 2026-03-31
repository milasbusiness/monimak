-- ============================================================
-- Monimak V2 Schema Migration
-- Builds on top of 20260201_initial_schema.sql
-- Adds: subscription billing fields, per-user likes,
--        messaging system, quick reply templates
-- ============================================================

-- ------------------------------------------------------------
-- 1. ALTER EXISTING TABLES
-- ------------------------------------------------------------

-- Subscriptions: add billing/expiration fields for future payments
ALTER TABLE public.subscriptions
  ADD COLUMN status text NOT NULL DEFAULT 'active'
    CHECK (status IN ('active', 'expired', 'cancelled', 'pending')),
  ADD COLUMN expires_at timestamptz,
  ADD COLUMN price_at_time numeric(10,2),
  ADD COLUMN renewed_at timestamptz;

-- Posts: add updated_at column
ALTER TABLE public.posts
  ADD COLUMN updated_at timestamptz DEFAULT now();

-- ------------------------------------------------------------
-- 2. NEW TABLES
-- ------------------------------------------------------------

-- Post likes: per-user like tracking
CREATE TABLE public.post_likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  post_id uuid REFERENCES public.posts(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, post_id)
);

-- Message threads
CREATE TABLE public.message_threads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Message thread participants (who is in each thread)
CREATE TABLE public.message_thread_participants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id uuid REFERENCES public.message_threads(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  last_read_at timestamptz,
  created_at timestamptz DEFAULT now(),
  UNIQUE(thread_id, user_id)
);

-- Messages
CREATE TABLE public.messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id uuid REFERENCES public.message_threads(id) ON DELETE CASCADE NOT NULL,
  sender_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  content text NOT NULL CHECK (char_length(content) BETWEEN 1 AND 5000),
  created_at timestamptz DEFAULT now()
);

-- Quick reply templates for creators
CREATE TABLE public.quick_reply_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id uuid REFERENCES public.creators(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL CHECK (char_length(name) BETWEEN 1 AND 200),
  content text NOT NULL CHECK (char_length(content) BETWEEN 1 AND 2000),
  created_at timestamptz DEFAULT now()
);

-- ------------------------------------------------------------
-- 3. INDEXES
-- ------------------------------------------------------------

CREATE INDEX idx_post_likes_user_id ON public.post_likes(user_id);
CREATE INDEX idx_post_likes_post_id ON public.post_likes(post_id);
CREATE INDEX idx_post_likes_user_post ON public.post_likes(user_id, post_id);
CREATE INDEX idx_message_threads_updated ON public.message_threads(updated_at DESC);
CREATE INDEX idx_message_participants_user ON public.message_thread_participants(user_id);
CREATE INDEX idx_message_participants_thread ON public.message_thread_participants(thread_id);
CREATE INDEX idx_messages_thread_id ON public.messages(thread_id);
CREATE INDEX idx_messages_created ON public.messages(created_at);
CREATE INDEX idx_quick_replies_creator ON public.quick_reply_templates(creator_id);
CREATE INDEX idx_subscriptions_status ON public.subscriptions(status);
CREATE INDEX idx_subscriptions_expires ON public.subscriptions(expires_at);
CREATE INDEX idx_posts_created ON public.posts(created_at DESC);
CREATE INDEX idx_posts_visibility ON public.posts(visibility);

-- ------------------------------------------------------------
-- 4. TRIGGERS
-- ------------------------------------------------------------

-- Auto-increment/decrement posts.likes_count when post_likes changes
CREATE OR REPLACE FUNCTION public.handle_post_like_change()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE posts SET likes_count = likes_count + 1 WHERE id = NEW.post_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE posts SET likes_count = GREATEST(likes_count - 1, 0) WHERE id = OLD.post_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$;

CREATE TRIGGER on_post_like_change
  AFTER INSERT OR DELETE ON public.post_likes
  FOR EACH ROW EXECUTE FUNCTION public.handle_post_like_change();

-- Auto-update updated_at on posts
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_post_updated
  BEFORE UPDATE ON public.posts
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Auto-update message_threads.updated_at when a new message is inserted
CREATE OR REPLACE FUNCTION public.handle_thread_message()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE message_threads SET updated_at = now() WHERE id = NEW.thread_id;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_new_message
  AFTER INSERT ON public.messages
  FOR EACH ROW EXECUTE FUNCTION public.handle_thread_message();

-- Auto-increment/decrement creators.subscriber_count on subscription changes
CREATE OR REPLACE FUNCTION public.handle_subscription_change()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE creators SET subscriber_count = subscriber_count + 1 WHERE id = NEW.creator_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE creators SET subscriber_count = GREATEST(subscriber_count - 1, 0) WHERE id = OLD.creator_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$;

CREATE TRIGGER on_subscription_change
  AFTER INSERT OR DELETE ON public.subscriptions
  FOR EACH ROW EXECUTE FUNCTION public.handle_subscription_change();

-- ------------------------------------------------------------
-- 5. ROW LEVEL SECURITY
-- ------------------------------------------------------------

-- Enable RLS on new tables
ALTER TABLE public.post_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.message_threads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.message_thread_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quick_reply_templates ENABLE ROW LEVEL SECURITY;

-- Post likes: anyone authenticated can see likes, users manage their own
CREATE POLICY "Anyone can view post likes"
  ON public.post_likes FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can like posts"
  ON public.post_likes FOR INSERT
  TO authenticated
  WITH CHECK ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users can unlike posts"
  ON public.post_likes FOR DELETE
  TO authenticated
  USING ((SELECT auth.uid()) = user_id);

-- Message threads: only participants can see threads
CREATE POLICY "Participants can view threads"
  ON public.message_threads FOR SELECT
  TO authenticated
  USING (
    id IN (
      SELECT thread_id FROM public.message_thread_participants
      WHERE user_id = (SELECT auth.uid())
    )
  );

CREATE POLICY "Authenticated users can create threads"
  ON public.message_threads FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Message thread participants: users can see their own participations
CREATE POLICY "Users can view own participations"
  ON public.message_thread_participants FOR SELECT
  TO authenticated
  USING ((SELECT auth.uid()) = user_id OR thread_id IN (
    SELECT thread_id FROM public.message_thread_participants
    WHERE user_id = (SELECT auth.uid())
  ));

CREATE POLICY "Authenticated users can add participants"
  ON public.message_thread_participants FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update own participation"
  ON public.message_thread_participants FOR UPDATE
  TO authenticated
  USING ((SELECT auth.uid()) = user_id);

-- Messages: participants can view messages in their threads
CREATE POLICY "Participants can view messages"
  ON public.messages FOR SELECT
  TO authenticated
  USING (
    thread_id IN (
      SELECT thread_id FROM public.message_thread_participants
      WHERE user_id = (SELECT auth.uid())
    )
  );

CREATE POLICY "Participants can send messages"
  ON public.messages FOR INSERT
  TO authenticated
  WITH CHECK (
    (SELECT auth.uid()) = sender_id
    AND thread_id IN (
      SELECT thread_id FROM public.message_thread_participants
      WHERE user_id = (SELECT auth.uid())
    )
  );

-- Quick reply templates: creators manage their own
CREATE POLICY "Creators can view own templates"
  ON public.quick_reply_templates FOR SELECT
  TO authenticated
  USING (
    creator_id IN (
      SELECT id FROM public.creators WHERE user_id = (SELECT auth.uid())
    )
  );

CREATE POLICY "Creators can manage own templates"
  ON public.quick_reply_templates FOR ALL
  TO authenticated
  USING (
    creator_id IN (
      SELECT id FROM public.creators WHERE user_id = (SELECT auth.uid())
    )
  );

-- ------------------------------------------------------------
-- 6. UPDATE EXISTING RLS POLICIES
-- ------------------------------------------------------------

-- Drop and recreate the posts SELECT policy to also check subscription status
DROP POLICY IF EXISTS "Public posts viewable by everyone" ON public.posts;

CREATE POLICY "Posts viewable based on visibility and subscription"
  ON public.posts FOR SELECT
  TO authenticated, anon
  USING (
    visibility = 'public'
    OR creator_id IN (
      SELECT creator_id FROM public.subscriptions
      WHERE user_id = (SELECT auth.uid())
        AND status = 'active'
        AND (expires_at IS NULL OR expires_at > now())
    )
  );

-- Allow creators to also view their own subscriber-only posts
-- (the existing "Creators can manage own posts" policy covers this for authenticated creators)

-- Update subscriptions policies to handle new fields
DROP POLICY IF EXISTS "Users can manage own subscriptions" ON public.subscriptions;

CREATE POLICY "Users can insert own subscriptions"
  ON public.subscriptions FOR INSERT
  TO authenticated
  WITH CHECK ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users can update own subscriptions"
  ON public.subscriptions FOR UPDATE
  TO authenticated
  USING ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users can delete own subscriptions"
  ON public.subscriptions FOR DELETE
  TO authenticated
  USING ((SELECT auth.uid()) = user_id);

-- Creators can view subscriptions to their content (for dashboard stats)
CREATE POLICY "Creators can view subscriptions to their content"
  ON public.subscriptions FOR SELECT
  TO authenticated
  USING (
    (SELECT auth.uid()) = user_id
    OR creator_id IN (
      SELECT id FROM public.creators WHERE user_id = (SELECT auth.uid())
    )
  );

-- Drop the old select-only policy since the new one above covers it
DROP POLICY IF EXISTS "Users can view own subscriptions" ON public.subscriptions;

-- ------------------------------------------------------------
-- 7. STORAGE BUCKETS (run via Supabase dashboard or supabase CLI)
-- These are SQL commands for Supabase storage setup
-- ------------------------------------------------------------

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  ('avatars', 'avatars', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']),
  ('banners', 'banners', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']),
  ('post-media', 'post-media', true, 104857600, ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/webm'])
ON CONFLICT (id) DO NOTHING;

-- Storage policies: authenticated users can upload to their own folder
CREATE POLICY "Users can upload avatars"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'avatars' AND (storage.foldername(name))[1] = (SELECT auth.uid())::text);

CREATE POLICY "Users can update own avatars"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'avatars' AND (storage.foldername(name))[1] = (SELECT auth.uid())::text);

CREATE POLICY "Anyone can view avatars"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload banners"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'banners' AND (storage.foldername(name))[1] = (SELECT auth.uid())::text);

CREATE POLICY "Users can update own banners"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'banners' AND (storage.foldername(name))[1] = (SELECT auth.uid())::text);

CREATE POLICY "Anyone can view banners"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'banners');

CREATE POLICY "Creators can upload post media"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'post-media' AND (storage.foldername(name))[1] = (SELECT auth.uid())::text);

CREATE POLICY "Creators can update own post media"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'post-media' AND (storage.foldername(name))[1] = (SELECT auth.uid())::text);

CREATE POLICY "Anyone can view post media"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'post-media');

CREATE POLICY "Users can delete own avatars"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'avatars' AND (storage.foldername(name))[1] = (SELECT auth.uid())::text);

CREATE POLICY "Users can delete own banners"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'banners' AND (storage.foldername(name))[1] = (SELECT auth.uid())::text);

CREATE POLICY "Creators can delete own post media"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'post-media' AND (storage.foldername(name))[1] = (SELECT auth.uid())::text);
