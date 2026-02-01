"use client";

import { CreatorCard } from "@/components/creator-card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Database } from "@/lib/database.types";
import { Search, TrendingUp } from "lucide-react";
import { useState } from "react";
import { toggleSubscription } from "../home/actions";
import { useRouter } from "next/navigation";

type Creator = Database['public']['Tables']['creators']['Row'] & {
  profiles: Database['public']['Tables']['profiles']['Row']
}

interface DiscoverClientProps {
  creators: Creator[]
  userSubscriptions?: string[]
}

export function DiscoverClient({ creators, userSubscriptions = [] }: DiscoverClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const filteredCreators = creators.filter(
    (creator) =>
      creator.profiles.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      creator.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (creator.tags || []).some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      )
  );

  // Extract unique tags from creators
  const allTags = Array.from(
    new Set(
      creators.flatMap((c) => c.tags || [])
    )
  ).slice(0, 6);

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

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="sticky top-0 z-30 border-b border-gray-800 bg-gray-950/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-4 py-6 space-y-4">
          <h1 className="text-2xl font-bold gradient-text flex items-center gap-2">
            <TrendingUp className="w-6 h-6" />
            Discover Creators
          </h1>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              placeholder="Search creators, tags, or categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 glass border-gray-800 h-12"
            />
          </div>

          {/* Popular Tags */}
          {allTags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {allTags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="bg-gray-800/50 hover:bg-gray-800 cursor-pointer border-gray-700 transition-colors"
                  onClick={() => setSearchQuery(tag)}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto p-4">
        <Tabs defaultValue="all" className="space-y-6">
          <TabsList className="glass border-gray-800">
            <TabsTrigger value="all">All Creators</TabsTrigger>
            <TabsTrigger value="trending">Trending</TabsTrigger>
            <TabsTrigger value="new">New</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCreators.map((creator) => (
                <CreatorCard
                  key={creator.id}
                  creator={convertCreator(creator)}
                  isSubscribed={userSubscriptions.includes(creator.id)}
                  onSubscribe={() => handleSubscribe(creator.id)}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="trending" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCreators
                .sort((a, b) => (b.subscriber_count || 0) - (a.subscriber_count || 0))
                .map((creator) => (
                  <CreatorCard
                    key={creator.id}
                    creator={convertCreator(creator)}
                    isSubscribed={userSubscriptions.includes(creator.id)}
                    onSubscribe={() => handleSubscribe(creator.id)}
                  />
                ))}
            </div>
          </TabsContent>

          <TabsContent value="new" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...filteredCreators]
                .reverse()
                .map((creator) => (
                  <CreatorCard
                    key={creator.id}
                    creator={convertCreator(creator)}
                    isSubscribed={userSubscriptions.includes(creator.id)}
                    onSubscribe={() => handleSubscribe(creator.id)}
                  />
                ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
