"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { signup } from "./actions";
import { Sparkles, Mail, Lock, User, Chrome, Github } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function RegisterPage() {

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden py-12">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-pink-900/20 to-black" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-pink-500/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-[120px]" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-8">
          <Link href="/">
            <h1 className="text-3xl font-bold gradient-text mb-2">Monimak</h1>
          </Link>
          <p className="text-gray-400">Create your account and start exploring</p>
        </div>

        <Card className="glass border-white/10">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Create Account</CardTitle>
            <CardDescription className="text-center">
              Join thousands of creators and fans
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Social Login Buttons */}
            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" className="glass border-white/10">
                <Chrome className="w-4 h-4 mr-2" />
                Google
              </Button>
              <Button variant="outline" className="glass border-white/10">
                <Github className="w-4 h-4 mr-2" />
                GitHub
              </Button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-700" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-gray-900 px-2 text-gray-400">
                  Or continue with email
                </span>
              </div>
            </div>

            <form action={signup} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="John Doe"
                    className="pl-10 glass border-white/10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    className="pl-10 glass border-white/10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    className="pl-10 glass border-white/10"
                    required
                  />
                </div>
                <p className="text-xs text-gray-400">
                  Must be at least 8 characters
                </p>
              </div>

              <div className="text-xs text-gray-400">
                By creating an account, you agree to our{" "}
                <a href="#" className="text-pink-400 hover:text-pink-300">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="text-pink-400 hover:text-pink-300">
                  Privacy Policy
                </a>
              </div>

              <Button
                type="submit"
                variant="gradient"
                className="w-full glow-pink"
                size="lg"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Create Account
              </Button>
            </form>

            <div className="text-center text-sm text-gray-400">
              Already have an account?{" "}
              <Link href="/login" className="text-pink-400 hover:text-pink-300 font-medium">
                Sign in
              </Link>
            </div>
          </CardContent>
        </Card>

      </motion.div>
    </div>
  );
}
