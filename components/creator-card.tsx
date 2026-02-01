"use client";

import { Creator } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getInitials, formatNumber } from "@/lib/utils";
import { motion } from "framer-motion";
import Link from "next/link";

interface CreatorCardProps {
  creator: Creator;
  isSubscribed?: boolean;
  onSubscribe?: () => void;
}

export function CreatorCard({ creator, isSubscribed = false, onSubscribe }: CreatorCardProps) {
  const subscribed = isSubscribed;

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="overflow-hidden bg-gray-900/50 border-gray-800 hover:border-gray-700 transition-all">
        {/* Banner */}
        <div className="relative h-32 bg-gradient-to-br from-purple-900 to-pink-900">
          {creator.banner && (
            <img
              src={creator.banner}
              alt={creator.name}
              className="w-full h-full object-cover"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </div>

        <CardContent className="p-4 -mt-8 relative">
          <div className="flex items-end justify-between mb-3">
            <Avatar className="h-20 w-20 ring-4 ring-gray-900 border-2 border-purple-500/30">
              <AvatarImage src={creator.avatar} alt={creator.name} />
              <AvatarFallback className="text-lg">
                {getInitials(creator.name)}
              </AvatarFallback>
            </Avatar>
            
            {creator.isVerified && (
              <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                Verified ✓
              </Badge>
            )}
          </div>

          <div className="space-y-2 mb-4">
            <Link href={`/creator/${creator.id}`}>
              <h3 className="font-bold text-lg text-white hover:text-pink-400 transition-colors">
                {creator.name}
              </h3>
            </Link>
            <p className="text-sm text-gray-400">@{creator.username}</p>
            <p className="text-sm text-gray-300 line-clamp-2">{creator.bio}</p>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-4 mb-4 text-sm">
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

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {creator.tags.slice(0, 3).map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="bg-gray-800 text-gray-300 border-gray-700"
              >
                {tag}
              </Badge>
            ))}
          </div>

          {/* CTA */}
          <Button
            variant={subscribed ? "outline" : "gradient"}
            className={`w-full ${!subscribed && "glow-pink"}`}
            onClick={onSubscribe}
          >
            {subscribed ? "Subscribed" : `Subscribe - $${creator.subscriptionPrice}/mo`}
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}
