"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CreatorCard } from "@/components/creator-card";
import { mockCreators } from "@/lib/mock/data";
import {
  Sparkles,
  Lock,
  MessageCircle,
  TrendingUp,
  Shield,
  Zap,
  Star,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-pink-900/20 to-black" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-pink-500/30 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/30 rounded-full blur-[120px] animate-pulse delay-700" />

        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 py-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full mb-8">
              <Sparkles className="w-4 h-4 text-pink-400" />
              <span className="text-sm text-gray-300">
                Join thousands of creators & fans
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Connect with your
              <br />
              <span className="gradient-text">favorite creators</span>
            </h1>

            <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
              Unlock exclusive content, connect directly with creators, and support
              the people you love.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button
                  variant="gradient"
                  size="lg"
                  className="glow-pink text-lg px-8 py-6"
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  Get Started Free
                </Button>
              </Link>
              <Link href="/login">
                <Button
                  variant="outline"
                  size="lg"
                  className="glass text-lg px-8 py-6 border-white/20"
                >
                  Sign In
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Floating cards preview */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-20"
          >
            <div className="glass rounded-2xl p-2 max-w-4xl mx-auto">
              <div className="grid grid-cols-3 gap-4 p-4">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="aspect-square bg-gradient-to-br from-pink-500/20 to-purple-500/20 rounded-xl"
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 relative">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              Everything you need to <span className="gradient-text">succeed</span>
            </h2>
            <p className="text-gray-400 text-lg">
              Powerful features for creators and fans
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Lock,
                title: "Exclusive Content",
                description:
                  "Share photos, videos, and stories with your biggest fans",
                color: "from-pink-500 to-rose-500",
              },
              {
                icon: MessageCircle,
                title: "Direct Messaging",
                description:
                  "Connect directly with creators through private messages",
                color: "from-purple-500 to-indigo-500",
              },
              {
                icon: TrendingUp,
                title: "Grow Your Income",
                description:
                  "Turn your passion into profit with subscription revenue",
                color: "from-blue-500 to-cyan-500",
              },
              {
                icon: Shield,
                title: "Secure & Private",
                description: "Your content and data are protected with top security",
                color: "from-green-500 to-emerald-500",
              },
              {
                icon: Zap,
                title: "Instant Payouts",
                description: "Get paid quickly with our fast payment processing",
                color: "from-yellow-500 to-orange-500",
              },
              {
                icon: Star,
                title: "Premium Experience",
                description:
                  "Beautiful, modern interface designed for creators",
                color: "from-pink-500 to-purple-500",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="glass border-white/10 h-full hover:border-white/20 transition-all">
                  <CardContent className="p-6">
                    <div
                      className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4`}
                    >
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-400">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Creators */}
      <section className="py-20 px-4 bg-gradient-to-b from-transparent via-purple-900/10 to-transparent">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              Meet our <span className="gradient-text">top creators</span>
            </h2>
            <p className="text-gray-400 text-lg">
              Discover amazing content from talented creators
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {mockCreators.map((creator, index) => (
              <motion.div
                key={creator.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <CreatorCard creator={creator} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Teaser */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <Card className="glass border-pink-500/30 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 via-purple-500/10 to-indigo-500/10" />
            <CardContent className="p-12 relative z-10">
              <div className="text-center">
                <h2 className="text-4xl font-bold mb-4">
                  Simple, transparent pricing
                </h2>
                <p className="text-gray-400 text-lg mb-8">
                  Creators set their own subscription prices
                </p>

                <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
                  <div className="text-left space-y-4">
                    <h3 className="text-xl font-semibold mb-4">For Fans</h3>
                    {[
                      "Browse creators for free",
                      "Subscribe to unlimited creators",
                      "Direct message access",
                      "Cancel anytime",
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <span className="text-gray-300">{item}</span>
                      </div>
                    ))}
                  </div>

                  <div className="text-left space-y-4">
                    <h3 className="text-xl font-semibold mb-4">For Creators</h3>
                    {[
                      "Free to join",
                      "Set your own prices",
                      "Keep 80% of earnings",
                      "Analytics & insights",
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <span className="text-gray-300">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-10">
                  <Link href="/register">
                    <Button
                      variant="gradient"
                      size="lg"
                      className="glow-pink"
                    >
                      Start Your Journey
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-12 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-bold text-xl mb-4 gradient-text">Monimak</h3>
              <p className="text-gray-400 text-sm">
                The premier platform for creators and their fans.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    FAQ
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Careers
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Cookie Policy
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-gray-800 text-center text-gray-400 text-sm">
            <p>&copy; 2024 Monimak. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
