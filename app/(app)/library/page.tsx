"use client";

import { useState } from "react";
import { PostCard } from "@/components/post-card";
import { CreatorCard } from "@/components/creator-card";
import { MediaLightbox } from "@/components/media-lightbox";
import { EmptyState } from "@/components/empty-state";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { usePosts, useAuth } from "@/lib/store";
import { mockCreators } from "@/lib/mock/data";
import { Post } from "@/lib/types";
import { Bookmark, Users } from "lucide-react";

export default function LibraryPage() {
  const { posts } = usePosts();
  const { user } = useAuth();
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  const savedPosts = posts.filter((p) => user?.savedPosts.includes(p.id));
  const subscribedCreators = mockCreators.filter((c) =>
    user?.subscriptions.includes(c.id)
  );

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
            {subscribedCreators.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {subscribedCreators.map((creator) => (
                  <CreatorCard key={creator.id} creator={creator} />
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
                  const creator = mockCreators.find(
                    (c) => c.id === post.creatorId
                  );
                  if (!creator) return null;

                  return (
                    <PostCard
                      key={post.id}
                      post={post}
                      creator={creator}
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
        post={selectedPost}
        open={!!selectedPost}
        onClose={() => setSelectedPost(null)}
      />
    </div>
  );
}
