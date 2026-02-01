"use client";

import { useState } from "react";
import { PostCard } from "@/components/post-card";
import { MediaLightbox } from "@/components/media-lightbox";
import { EmptyState } from "@/components/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { usePosts } from "@/lib/store";
import { mockCreators } from "@/lib/mock/data";
import { Post } from "@/lib/types";
import { Sparkles } from "lucide-react";

export default function HomePage() {
  const { posts } = usePosts();
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(false);

  // Sort posts by date (newest first)
  const sortedPosts = [...posts].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
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
        {loading ? (
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
            const creator = mockCreators.find((c) => c.id === post.creatorId);
            if (!creator) return null;

            return (
              <PostCard
                key={post.id}
                post={post}
                creator={creator}
                onImageClick={() => {
                  if (!post.isLocked) {
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
        post={selectedPost}
        open={!!selectedPost}
        onClose={() => setSelectedPost(null)}
      />
    </div>
  );
}
