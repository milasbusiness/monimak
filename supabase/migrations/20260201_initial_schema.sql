-- Enums for type safety
create type public.user_role as enum ('user', 'creator', 'admin');
create type public.post_type as enum ('image', 'video');
create type public.post_visibility as enum ('public', 'subscribers');

-- Profiles: Extends auth.users with app data
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  name text not null,
  avatar_url text,
  role user_role not null default 'user',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Creators: Additional info for users who are creators
create table public.creators (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade unique not null,
  username text unique not null,
  bio text,
  banner_url text,
  subscription_price numeric(10,2) default 9.99,
  is_verified boolean default false,
  subscriber_count integer default 0,
  post_count integer default 0,
  tags text[] default '{}',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Posts: Creator content
create table public.posts (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid references public.creators(id) on delete cascade not null,
  type post_type not null,
  media_url text not null,
  thumbnail_url text,
  caption text,
  tags text[] default '{}',
  visibility post_visibility not null default 'public',
  likes_count integer default 0,
  comments_count integer default 0,
  created_at timestamptz default now()
);

-- Subscriptions: User-Creator relationships
create table public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  creator_id uuid references public.creators(id) on delete cascade not null,
  created_at timestamptz default now(),
  unique(user_id, creator_id)
);

-- Saved Posts: User favorites
create table public.saved_posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  post_id uuid references public.posts(id) on delete cascade not null,
  created_at timestamptz default now(),
  unique(user_id, post_id)
);

-- Enable RLS on all tables
alter table public.profiles enable row level security;
alter table public.creators enable row level security;
alter table public.posts enable row level security;
alter table public.subscriptions enable row level security;
alter table public.saved_posts enable row level security;

-- Profiles: Users can read all, but only update their own
create policy "Profiles are viewable by everyone"
  on public.profiles for select
  to authenticated, anon
  using (true);

create policy "Users can update own profile"
  on public.profiles for update
  to authenticated
  using ((select auth.uid()) = id);

-- Creators: Public read, only creator can update their own
create policy "Creators are viewable by everyone"
  on public.creators for select
  to authenticated, anon
  using (true);

create policy "Users can create creator profile"
  on public.creators for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

create policy "Creators can update own profile"
  on public.creators for update
  to authenticated
  using ((select auth.uid()) = user_id);

-- Posts: Public/subscriber based on visibility
create policy "Public posts viewable by everyone"
  on public.posts for select
  to authenticated, anon
  using (
    visibility = 'public' OR
    creator_id in (
      select creator_id from public.subscriptions
      where user_id = (select auth.uid())
    )
  );

create policy "Creators can manage own posts"
  on public.posts for all
  to authenticated
  using (
    creator_id in (
      select id from public.creators where user_id = (select auth.uid())
    )
  );

-- Subscriptions: Users manage their own
create policy "Users can view own subscriptions"
  on public.subscriptions for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "Users can manage own subscriptions"
  on public.subscriptions for all
  to authenticated
  using ((select auth.uid()) = user_id);

-- Saved Posts: Users manage their own
create policy "Users can manage own saved posts"
  on public.saved_posts for all
  to authenticated
  using ((select auth.uid()) = user_id);

-- Trigger: Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, name, avatar_url, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'avatar_url',
    coalesce((new.raw_user_meta_data->>'role')::public.user_role, 'user')
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Indexes for performance
create index idx_profiles_email on public.profiles(email);
create index idx_creators_user_id on public.creators(user_id);
create index idx_posts_creator_id on public.posts(creator_id);
create index idx_subscriptions_user_id on public.subscriptions(user_id);
create index idx_subscriptions_creator_id on public.subscriptions(creator_id);
create index idx_saved_posts_user_id on public.saved_posts(user_id);
create index idx_saved_posts_post_id on public.saved_posts(post_id);
