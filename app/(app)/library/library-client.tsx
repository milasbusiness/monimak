"use client";

import { useState } from "react";
import { PostCard } from "@/components/post-card";
import { CreatorCard } from "@/components/creator-card";
import { MediaLightbox } from "@/components/media-lightbox";
import { EmptyState } from "@/components/empty-state";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Database } from "@/lib/database.types";
import { Bookmark, Users } from "lucide-react";
import { toggleSubscription } from "../home/actions";
import { useRouter } from "next/navigation";

type Post = Database['public']['Tables']['posts']['Row'] & {
  creators: Database['public']['Tables']['creators']['Row'] & {
    profiles: Database['public']['Tables']['profiles']['Row']
  }
}

type Creator = Database['public']['Tables']['creators']['Row'] & {
  profiles: Database['public']['Tables']['profiles']['Row']
}

interface LibraryClientProps {
  subscriptions: Creator[]
  savedPosts: Post[]
}

export function LibraryClient({ subscriptions, savedPosts }: LibraryClientProps) {
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const router = useRouter();

  const handleSubscribe = async (creatorId: string) => {
    try {
      await toggleSubscription(creatorId);
      router.refresh();
    } catch (error) {
      console.error('Failed to toggle subscription:', error);
    }
  };

  // Convert database creator to component format
  const convertCreator = (creator: Creator) => ({
    id: creator.id,
    name: creator.profiles.name,
    username: creator.username,
    avatar: creator.profiles.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(creator.profiles.name)}`,
    banner: creator.banner_url || undefined,
    bio: creator.bio || '',
    subscriberCount: creator.subscriber_count || 0,
    postCount: creator.post_count || 0,
    subscriptionPrice: Number(creator.subscription_price) || 0,
    isVerified: creator.is_verified || false,
    tags: creator.tags || [],
  });

  // Convert database post to component format
  const convertPost = (post: Post) => ({
    id: post.id,
    creatorId: post.creators.id,
    type: post.type,
    mediaUrl: post.media_url,
    thumbnailUrl: post.thumbnail_url || undefined,
    caption: post.caption || '',
    tags: post.tags || [],
    visibility: post.visibility,
    isLocked: post.visibility === 'subscribers',
    likes: post.likes_count || 0,
    comments: post.comments_count || 0,
    createdAt: new Date(post.created_at || 0),
  });

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="sticky top-0 z-30 border-b border-gray-800 bg-gray-950/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold gradient-text flex items-center gap-2">
            <Bookmark className="w-6 h-6" />
            Your Library
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto p-4">
        <Tabs defaultValue="subscriptions" className="space-y-6">
          <TabsList className="glass border-gray-800">
            <TabsTrigger value="subscriptions">
              <Users className="w-4 h-4 mr-2" />
              Subscriptions
            </TabsTrigger>
            <TabsTrigger value="saved">
              <Bookmark className="w-4 h-4 mr-2" />
              Saved Posts
            </TabsTrigger>
          </TabsList>

          <TabsContent value="subscriptions">
            {subscriptions.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {subscriptions.map((creator) => (
                  <CreatorCard
                    key={creator.id}
                    creator={convertCreator(creator)}
                    isSubscribed={true}
                    onSubscribe={() => handleSubscribe(creator.id)}
                  />
                ))}
              </div>
            ) : (
              <EmptyState
                icon={Users}
                title="No subscriptions yet"
                description="Subscribe to creators to see them here"
                action={{
                  label: "Discover Creators",
                  onClick: () => (window.location.href = "/discover"),
                }}
              />
            )}
          </TabsContent>

          <TabsContent value="saved">
            {savedPosts.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-6">
                {savedPosts.map((post) => {
                  const creator = post.creators;
                  if (!creator) return null;

                  return (
                    <PostCard
                      key={post.id}
                      post={convertPost(post)}
                      creator={convertCreator(creator)}
                      onImageClick={() => setSelectedPost(post)}
                    />
                  );
                })}
              </div>
            ) : (
              <EmptyState
                icon={Bookmark}
                title="No saved posts"
                description="Save posts to view them later"
              />
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Lightbox */}
      <MediaLightbox
        post={selectedPost ? convertPost(selectedPost) : null}
        open={!!selectedPost}
        onClose={() => setSelectedPost(null)}
      />
    </div>
  );
}
