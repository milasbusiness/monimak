"use client";

import { Post, Creator } from "@/lib/types";
import { Heart, MessageCircle, Bookmark, Lock, Play } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate, getInitials, formatNumber } from "@/lib/utils";
import { usePosts, useSubscriptions } from "@/lib/store";
import { motion } from "framer-motion";
import { useState } from "react";

interface PostCardProps {
  post: Post;
  creator: Creator;
  onImageClick?: () => void;
}

export function PostCard({ post, creator, onImageClick }: PostCardProps) {
  const { toggleLike, toggleSave } = usePosts();
  const { isSubscribed } = useSubscriptions();
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  
  const subscribed = isSubscribed(creator.id);
  const canView = !post.isLocked || subscribed;

  const handleLike = () => {
    setIsLiked(!isLiked);
    toggleLike(post.id);
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
    toggleSave(post.id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="overflow-hidden bg-gray-900/50 border-gray-800 hover:border-gray-700 transition-all">
        {/* Header */}
        <div className="p-4 flex items-center gap-3">
          <Avatar className="h-10 w-10 ring-2 ring-purple-500/20">
            <AvatarImage src={creator.avatar} alt={creator.name} />
            <AvatarFallback>{getInitials(creator.name)}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-white">{creator.name}</h3>
              {creator.isVerified && (
                <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-xs">
                  ✓
                </Badge>
              )}
            </div>
            <p className="text-sm text-gray-400">{formatDate(post.createdAt)}</p>
          </div>
        </div>

        {/* Media */}
        <div className="relative aspect-square bg-gray-950">
          <img
            src={post.mediaUrl}
            alt={post.caption}
            className={`w-full h-full object-cover ${!canView ? "blur-2xl" : ""}`}
            onClick={canView ? onImageClick : undefined}
          />
          
          {post.type === "video" && canView && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="bg-black/50 backdrop-blur-sm rounded-full p-4">
                <Play className="w-8 h-8 text-white" fill="white" />
              </div>
            </div>
          )}

          {!canView && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm">
              <div className="text-center px-6">
                <Lock className="w-12 h-12 text-pink-500 mx-auto mb-4" />
                <h4 className="text-xl font-bold text-white mb-2">
                  Subscribers Only
                </h4>
                <p className="text-gray-300 mb-4">
                  Subscribe to {creator.name} to unlock this content
                </p>
                <Button
                  variant="gradient"
                  className="glow-pink"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Would trigger subscribe flow
                  }}
                >
                  Subscribe for ${creator.subscriptionPrice}/month
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="p-4 space-y-3">
          <div className="flex items-center gap-4">
            <button
              onClick={handleLike}
              className="flex items-center gap-2 text-gray-400 hover:text-pink-500 transition-colors"
            >
              <Heart
                className="w-6 h-6"
                fill={isLiked ? "#ec4899" : "none"}
              />
              <span className="text-sm font-medium">
                {formatNumber(post.likes)}
              </span>
            </button>
            <button className="flex items-center gap-2 text-gray-400 hover:text-blue-500 transition-colors">
              <MessageCircle className="w-6 h-6" />
              <span className="text-sm font-medium">
                {formatNumber(post.comments)}
              </span>
            </button>
            <button
              onClick={handleSave}
              className="ml-auto text-gray-400 hover:text-yellow-500 transition-colors"
            >
              <Bookmark
                className="w-6 h-6"
                fill={isSaved ? "#eab308" : "none"}
              />
            </button>
          </div>

          {/* Caption */}
          <div className="text-sm">
            <span className="font-semibold text-white">{creator.name}</span>{" "}
            <span className="text-gray-300">{post.caption}</span>
          </div>

          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs text-blue-400 hover:text-blue-300 cursor-pointer"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  );
}
