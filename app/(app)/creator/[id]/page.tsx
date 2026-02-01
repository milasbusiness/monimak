"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { PostCard } from "@/components/post-card";
import { MediaLightbox } from "@/components/media-lightbox";
import { SubscribeCTA } from "@/components/subscribe-cta";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { mockCreators } from "@/lib/mock/data";
import { usePosts, useSubscriptions } from "@/lib/store";
import { Post } from "@/lib/types";
import { getInitials, formatNumber } from "@/lib/utils";
import { MapPin, Calendar, Link2, MessageCircle } from "lucide-react";
import { motion } from "framer-motion";

// Required for static export with dynamic routes
export function generateStaticParams() {
  return mockCreators.map((creator) => ({
    id: creator.id,
  }));
}

export default function CreatorProfilePage() {
  const params = useParams();
  const creatorId = params.id as string;
  const creator = mockCreators.find((c) => c.id === creatorId);
  const { posts } = usePosts();
  const { isSubscribed, toggleSubscription } = useSubscriptions();
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  if (!creator) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400">Creator not found</p>
      </div>
    );
  }

  const subscribed = isSubscribed(creator.id);
  const creatorPosts = posts.filter((p) => p.creatorId === creator.id);

  return (
    <div className="min-h-screen">
      {/* Banner */}
      <div className="relative h-64 bg-gradient-to-br from-purple-900 to-pink-900">
        {creator.banner && (
          <img
            src={creator.banner}
            alt={creator.name}
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
      </div>

      {/* Profile Info */}
      <div className="max-w-5xl mx-auto px-4 -mt-20 relative z-10">
        <div className="flex flex-col md:flex-row gap-6 items-start md:items-end mb-6">
          <Avatar className="h-32 w-32 ring-4 ring-black border-4 border-purple-500/50">
            <AvatarImage src={creator.avatar} alt={creator.name} />
            <AvatarFallback className="text-3xl">
              {getInitials(creator.name)}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-white">{creator.name}</h1>
              {creator.isVerified && (
                <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                  Verified ✓
                </Badge>
              )}
            </div>
            <p className="text-gray-400 mb-4">@{creator.username}</p>

            <div className="flex flex-wrap gap-6 text-sm mb-4">
              <div>
                <span className="font-bold text-white">
                  {formatNumber(creator.subscriberCount)}
                </span>
                <span className="text-gray-400 ml-1">subscribers</span>
              </div>
              <div>
                <span className="font-bold text-white">
                  {formatNumber(creator.postCount)}
                </span>
                <span className="text-gray-400 ml-1">posts</span>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              variant={subscribed ? "outline" : "gradient"}
              size="lg"
              className={`${!subscribed && "glow-pink"}`}
              onClick={() => toggleSubscription(creator.id)}
            >
              {subscribed ? "Subscribed ✓" : `Subscribe - $${creator.subscriptionPrice}/mo`}
            </Button>
            <Button variant="outline" size="lg" className="glass border-gray-700">
              <MessageCircle className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Bio & Details */}
        <div className="glass rounded-xl p-6 mb-6 border-gray-800">
          <p className="text-gray-300 mb-4">{creator.bio}</p>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {creator.tags.map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="bg-gray-800 text-gray-300 border-gray-700"
              >
                {tag}
              </Badge>
            ))}
          </div>

          <div className="flex flex-wrap gap-4 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>Joined January 2024</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span>Los Angeles, CA</span>
            </div>
            <div className="flex items-center gap-2">
              <Link2 className="w-4 h-4" />
              <a href="#" className="text-pink-400 hover:text-pink-300">
                portfolio.com
              </a>
            </div>
          </div>
        </div>

        {/* Subscribe CTA for non-subscribers */}
        {!subscribed && (
          <div className="mb-6">
            <SubscribeCTA
              creatorName={creator.name}
              price={creator.subscriptionPrice}
              onSubscribe={() => toggleSubscription(creator.id)}
            />
          </div>
        )}

        {/* Tabs */}
        <Tabs defaultValue="posts" className="space-y-6">
          <TabsList className="glass border-gray-800">
            <TabsTrigger value="posts">Posts</TabsTrigger>
            <TabsTrigger value="about">About</TabsTrigger>
          </TabsList>

          <TabsContent value="posts">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {creatorPosts.map((post) => (
                <motion.div
                  key={post.id}
                  whileHover={{ scale: 1.02 }}
                  className="relative aspect-square rounded-lg overflow-hidden cursor-pointer group"
                  onClick={() => {
                    if (!post.isLocked || subscribed) {
                      setSelectedPost(post);
                    }
                  }}
                >
                  <img
                    src={post.mediaUrl}
                    alt={post.caption}
                    className={`w-full h-full object-cover ${
                      post.isLocked && !subscribed ? "blur-xl" : ""
                    }`}
                  />
                  {post.isLocked && !subscribed && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <div className="text-center px-4">
                        <div className="w-12 h-12 bg-pink-500 rounded-full flex items-center justify-center mx-auto mb-2">
                          <span className="text-2xl">🔒</span>
                        </div>
                        <p className="text-sm text-white font-medium">
                          Subscribe to unlock
                        </p>
                      </div>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <p className="text-white text-sm line-clamp-2">
                        {post.caption}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="about">
            <div className="glass rounded-xl p-6 border-gray-800">
              <h3 className="text-xl font-semibold mb-4">About {creator.name}</h3>
              <p className="text-gray-300 mb-6">{creator.bio}</p>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-2">Content Categories</h4>
                  <div className="flex flex-wrap gap-2">
                    {creator.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="bg-gray-800">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Subscription Benefits</h4>
                  <ul className="space-y-2 text-sm text-gray-300">
                    <li>✨ Exclusive photos & videos</li>
                    <li>💬 Direct messaging access</li>
                    <li>🎁 Behind-the-scenes content</li>
                    <li>⭐ Early access to new posts</li>
                  </ul>
                </div>
              </div>
            </div>
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
