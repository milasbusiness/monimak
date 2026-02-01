"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatNumber } from "@/lib/utils";
import {
  DollarSign,
  Users,
  FileText,
  MessageCircle,
  TrendingUp,
  ArrowUpRight,
} from "lucide-react";
import { motion } from "framer-motion";
import { Database } from "@/lib/database.types";

type Post = Database['public']['Tables']['posts']['Row']

interface AdminDashboardClientProps {
  stats: {
    totalRevenue: number;
    subscribers: number;
    posts: number;
    messages: number;
  };
  recentPosts: Post[];
}

export function AdminDashboardClient({ stats, recentPosts }: AdminDashboardClientProps) {
  const statCards = [
    {
      title: "Total Revenue",
      value: `$${formatNumber(stats.totalRevenue)}`,
      change: "+12.5%",
      icon: DollarSign,
      color: "from-green-500 to-emerald-500",
    },
    {
      title: "Subscribers",
      value: formatNumber(stats.subscribers),
      change: "+8.2%",
      icon: Users,
      color: "from-blue-500 to-cyan-500",
    },
    {
      title: "Total Posts",
      value: formatNumber(stats.posts),
      change: "+4.1%",
      icon: FileText,
      color: "from-purple-500 to-pink-500",
    },
    {
      title: "Messages",
      value: formatNumber(stats.messages),
      change: "+15.3%",
      icon: MessageCircle,
      color: "from-orange-500 to-red-500",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="sticky top-0 z-30 border-b border-gray-800 bg-gray-950/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold gradient-text flex items-center gap-2">
            <TrendingUp className="w-6 h-6" />
            Creator Dashboard
          </h1>
          <p className="text-gray-400 mt-1">Welcome back! Here's your overview</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto p-4 space-y-6">
        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card className="glass border-gray-800 hover:border-gray-700 transition-all">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}
                    >
                      <stat.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex items-center gap-1 text-green-500 text-sm font-medium">
                      <ArrowUpRight className="w-4 h-4" />
                      {stat.change}
                    </div>
                  </div>
                  <p className="text-gray-400 text-sm mb-1">{stat.title}</p>
                  <p className="text-3xl font-bold text-white">{stat.value}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Revenue Chart Placeholder */}
        <Card className="glass border-gray-800">
          <CardHeader>
            <CardTitle>Revenue Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center bg-gradient-to-br from-purple-900/20 to-pink-900/20 rounded-lg border border-gray-800">
              <div className="text-center">
                <TrendingUp className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">Revenue chart coming soon</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Recent Posts */}
          <Card className="glass border-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Recent Posts</span>
                <FileText className="w-5 h-5 text-gray-400" />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentPosts.length > 0 ? (
                recentPosts.map((post) => (
                  <div
                    key={post.id}
                    className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-800/50 transition-colors"
                  >
                    <img
                      src={post.media_url}
                      alt={post.caption || 'Post'}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white truncate mb-1">
                        {post.caption || 'No caption'}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-gray-400">
                        <span>{formatNumber(post.likes_count || 0)} likes</span>
                        <span>{formatNumber(post.comments_count || 0)} comments</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-400 text-center py-8">No posts yet</p>
              )}
            </CardContent>
          </Card>

          {/* Top Subscribers */}
          <Card className="glass border-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Top Supporters</span>
                <Users className="w-5 h-5 text-gray-400" />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { name: "Emily Chen", amount: 149, avatar: "EC" },
                { name: "Marcus Johnson", amount: 129, avatar: "MJ" },
                { name: "Sofia Rodriguez", amount: 119, avatar: "SR" },
                { name: "Alex Kim", amount: 99, avatar: "AK" },
                { name: "Jordan Lee", amount: 89, avatar: "JL" },
              ].map((supporter, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-800/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center text-white font-medium">
                      {supporter.avatar}
                    </div>
                    <span className="text-sm text-white">{supporter.name}</span>
                  </div>
                  <span className="text-sm font-medium text-green-500">
                    ${supporter.amount}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="glass border-gray-800">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <button
                onClick={() => (window.location.href = "/admin/upload")}
                className="p-4 rounded-lg border border-gray-800 hover:border-pink-500/50 hover:bg-gray-800/50 transition-all group"
              >
                <FileText className="w-8 h-8 text-gray-400 group-hover:text-pink-500 mb-2 transition-colors" />
                <p className="font-medium text-white mb-1">Create Post</p>
                <p className="text-sm text-gray-400">Upload new content</p>
              </button>

              <button
                onClick={() => (window.location.href = "/admin/messages")}
                className="p-4 rounded-lg border border-gray-800 hover:border-purple-500/50 hover:bg-gray-800/50 transition-all group"
              >
                <MessageCircle className="w-8 h-8 text-gray-400 group-hover:text-purple-500 mb-2 transition-colors" />
                <p className="font-medium text-white mb-1">Messages</p>
                <p className="text-sm text-gray-400">Manage conversations</p>
              </button>

              <button className="p-4 rounded-lg border border-gray-800 hover:border-blue-500/50 hover:bg-gray-800/50 transition-all group">
                <TrendingUp className="w-8 h-8 text-gray-400 group-hover:text-blue-500 mb-2 transition-colors" />
                <p className="font-medium text-white mb-1">Analytics</p>
                <p className="text-sm text-gray-400">View detailed stats</p>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
