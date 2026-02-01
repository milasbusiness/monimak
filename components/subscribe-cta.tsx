"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, Lock, Star } from "lucide-react";
import { motion } from "framer-motion";

interface SubscribeCTAProps {
  creatorName: string;
  price: number;
  onSubscribe: () => void;
}

export function SubscribeCTA({ creatorName, price, onSubscribe }: SubscribeCTAProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="glass border-pink-500/30 p-6 relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 via-purple-500/10 to-indigo-500/10" />
        
        <div className="relative z-10">
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 bg-gradient-to-br from-pink-500 to-purple-500 rounded-full glow-pink">
              <Lock className="w-8 h-8 text-white" />
            </div>
          </div>
          
          <h3 className="text-xl font-bold text-center mb-2 gradient-text">
            Unlock Exclusive Content
          </h3>
          
          <p className="text-center text-gray-300 mb-6">
            Subscribe to {creatorName} for unlimited access to all exclusive posts, stories, and direct messages.
          </p>

          <div className="space-y-3 mb-6">
            {[
              "Full access to all locked posts",
              "Exclusive behind-the-scenes content",
              "Direct messaging with creator",
              "Support your favorite creator",
            ].map((feature, index) => (
              <div key={index} className="flex items-center gap-3">
                <Star className="w-4 h-4 text-yellow-500 flex-shrink-0" />
                <span className="text-sm text-gray-300">{feature}</span>
              </div>
            ))}
          </div>

          <Button
            variant="gradient"
            className="w-full glow-pink"
            size="lg"
            onClick={onSubscribe}
          >
            <Sparkles className="w-5 h-5 mr-2" />
            Subscribe for ${price}/month
          </Button>

          <p className="text-xs text-center text-gray-400 mt-4">
            Cancel anytime. Auto-renews monthly.
          </p>
        </div>
      </Card>
    </motion.div>
  );
}
