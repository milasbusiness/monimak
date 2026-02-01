"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { X } from "lucide-react";
import { Post } from "@/lib/types";

interface MediaLightboxProps {
  post: Post | null;
  open: boolean;
  onClose: () => void;
}

export function MediaLightbox({ post, open, onClose }: MediaLightboxProps) {
  if (!post) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className="max-w-4xl bg-black/95 border-gray-800 p-0"
        onClose={onClose}
      >
        <div className="relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 bg-black/50 rounded-full hover:bg-black/70 transition-colors"
          >
            <X className="w-6 h-6 text-white" />
          </button>
          
          <div className="flex items-center justify-center min-h-[60vh] max-h-[85vh]">
            <img
              src={post.mediaUrl}
              alt={post.caption}
              className="max-w-full max-h-[85vh] object-contain"
            />
          </div>
          
          {post.caption && (
            <div className="p-6 bg-gradient-to-t from-black/80 to-transparent">
              <p className="text-white text-sm">{post.caption}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
