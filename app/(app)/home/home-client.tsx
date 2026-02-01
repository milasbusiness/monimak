"use client";

import { useState } from "react";
import { PostCard } from "@/components/post-card";
import { MediaLightbox } from "@/components/media-lightbox";
import { EmptyState } from "@/components/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { Database } from "@/lib/database.types";
import { Sparkles } from "lucide-react";
import { toggleLike, toggleSave } from "./actions";

type Post = Database['public']['Tables']['posts']['Row'] & {
  creators: Database['public']['Tables']['creators']['Row'] & {
    profiles: Database['public']['Tables']['profiles']['Row']
  }
}

type Creator = Database['public']['Tables']['creators']['Row'] & {
  profiles: Database['public']['Tables']['profiles']['Row']
}

interface HomeClientProps {
  posts: Post[]
  isLoading?: boolean
}

export function HomeClient({ posts, isLoading }: HomeClientProps) {
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  // Sort posts by date (newest first)
  const sortedPosts = [...posts].sort(
    (a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
  );

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="sticky top-0 z-30 border-b border-gray-800 bg-gray-950/80 backdrop-blur-xl">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold gradient-text flex items-center gap-2">
            <Sparkles className="w-6 h-6" />
            Your Feed
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto p-4 space-y-6">
        {isLoading ? (
          // Loading skeletons
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="space-y-4">
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </div>
              <Skeleton className="aspect-square w-full rounded-lg" />
            </div>
          ))
        ) : sortedPosts.length > 0 ? (
          // Posts
          sortedPosts.map((post) => {
            const creator = post.creators;
            if (!creator) return null;

            // Convert database post to component format
            const postData = {
              id: post.id,
              creatorId: creator.id,
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
            };

            const creatorData = {
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
            };

            return (
              <PostCard
                key={post.id}
                post={postData}
                creator={creatorData}
                onImageClick={() => {
                  if (!postData.isLocked) {
                    setSelectedPost(post);
                  }
                }}
              />
            );
          })
        ) : (
          <EmptyState
            icon={Sparkles}
            title="No posts yet"
            description="Subscribe to creators to see their content in your feed"
          />
        )}
      </div>

      {/* Lightbox */}
      <MediaLightbox
        post={selectedPost ? {
          id: selectedPost.id,
          creatorId: selectedPost.creators.id,
          type: selectedPost.type,
          mediaUrl: selectedPost.media_url,
          thumbnailUrl: selectedPost.thumbnail_url || undefined,
          caption: selectedPost.caption || '',
          tags: selectedPost.tags || [],
          visibility: selectedPost.visibility,
          isLocked: selectedPost.visibility === 'subscribers',
          likes: selectedPost.likes_count || 0,
          comments: selectedPost.comments_count || 0,
          createdAt: new Date(selectedPost.created_at || 0),
        } : null}
        open={!!selectedPost}
        onClose={() => setSelectedPost(null)}
      />
    </div>
  );
}
