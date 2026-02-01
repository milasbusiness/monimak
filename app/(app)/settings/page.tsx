"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useAuth } from "@/lib/store";
import { getInitials } from "@/lib/utils";
import {
  Settings as SettingsIcon,
  User,
  Bell,
  Shield,
  CreditCard,
  LogOut,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const { user, logout, login } = useAuth();
  const router = useRouter();
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    newPosts: true,
    messages: true,
    promotions: false,
  });

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const toggleRole = () => {
    if (user) {
      const newRole = user.role === "admin" ? "user" : "admin";
      login(user.email, "password", newRole);
      router.push(newRole === "admin" ? "/admin" : "/home");
    }
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="sticky top-0 z-30 border-b border-gray-800 bg-gray-950/80 backdrop-blur-xl">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold gradient-text flex items-center gap-2">
            <SettingsIcon className="w-6 h-6" />
            Settings
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto p-4">
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="glass border-gray-800">
            <TabsTrigger value="profile">
              <User className="w-4 h-4 mr-2" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="notifications">
              <Bell className="w-4 h-4 mr-2" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="privacy">
              <Shield className="w-4 h-4 mr-2" />
              Privacy
            </TabsTrigger>
            <TabsTrigger value="billing">
              <CreditCard className="w-4 h-4 mr-2" />
              Billing
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card className="glass border-gray-800">
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                  Update your profile details and preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-4">
                  <Avatar className="h-20 w-20 ring-2 ring-purple-500/30">
                    <AvatarImage src={user?.avatar} />
                    <AvatarFallback className="text-xl">
                      {user ? getInitials(user.name) : "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <Button variant="outline" className="glass border-gray-700 mb-2">
                      Change Avatar
                    </Button>
                    <p className="text-xs text-gray-400">
                      JPG, PNG or GIF. Max 5MB.
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Name</label>
                    <Input
                      defaultValue={user?.name}
                      className="glass border-gray-800"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Email</label>
                    <Input
                      type="email"
                      defaultValue={user?.email}
                      className="glass border-gray-800"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Bio</label>
                    <textarea
                      className="w-full px-3 py-2 rounded-md border border-gray-800 bg-gray-900/50 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500"
                      rows={4}
                      placeholder="Tell us about yourself..."
                    />
                  </div>
                </div>

                <Button variant="gradient" className="glow-pink">
                  Save Changes
                </Button>
              </CardContent>
            </Card>

            {/* Dev Mode Toggle */}
            <Card className="glass border-blue-500/30 mt-6">
              <CardHeader>
                <CardTitle className="text-blue-400">Developer Mode</CardTitle>
                <CardDescription>
                  Toggle between User and Admin roles for testing
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Current Role</p>
                    <Badge
                      className={
                        user?.role === "admin"
                          ? "bg-purple-500/20 text-purple-400 border-purple-500/30"
                          : "bg-blue-500/20 text-blue-400 border-blue-500/30"
                      }
                    >
                      {user?.role?.toUpperCase()}
                    </Badge>
                  </div>
                  <Button
                    variant="outline"
                    className="glass border-blue-500/30"
                    onClick={toggleRole}
                  >
                    Switch to {user?.role === "admin" ? "User" : "Admin"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications">
            <Card className="glass border-gray-800">
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>
                  Manage how you receive notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {Object.entries({
                  email: "Email Notifications",
                  push: "Push Notifications",
                  newPosts: "New Posts from Subscriptions",
                  messages: "Direct Messages",
                  promotions: "Promotions and Updates",
                }).map(([key, label]) => (
                  <div
                    key={key}
                    className="flex items-center justify-between py-3 border-b border-gray-800 last:border-0"
                  >
                    <div>
                      <p className="font-medium">{label}</p>
                      <p className="text-sm text-gray-400">
                        Receive notifications via this channel
                      </p>
                    </div>
                    <button
                      onClick={() =>
                        setNotifications((prev) => ({
                          ...prev,
                          [key]: !prev[key as keyof typeof prev],
                        }))
                      }
                      className={`relative w-12 h-6 rounded-full transition-colors ${
                        notifications[key as keyof typeof notifications]
                          ? "bg-gradient-to-r from-pink-500 to-purple-500"
                          : "bg-gray-700"
                      }`}
                    >
                      <div
                        className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                          notifications[key as keyof typeof notifications]
                            ? "translate-x-6"
                            : ""
                        }`}
                      />
                    </button>
                  </div>
                ))}

                <Button variant="gradient" className="glow-pink">
                  Save Preferences
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Privacy Tab */}
          <TabsContent value="privacy">
            <Card className="glass border-gray-800">
              <CardHeader>
                <CardTitle>Privacy & Security</CardTitle>
                <CardDescription>
                  Manage your privacy and security settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-4">Account Privacy</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Private Account</p>
                        <p className="text-sm text-gray-400">
                          Only approved followers can see your posts
                        </p>
                      </div>
                      <button className="relative w-12 h-6 rounded-full bg-gray-700">
                        <div className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full" />
                      </button>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-4">Change Password</h3>
                  <div className="space-y-4">
                    <Input
                      type="password"
                      placeholder="Current password"
                      className="glass border-gray-800"
                    />
                    <Input
                      type="password"
                      placeholder="New password"
                      className="glass border-gray-800"
                    />
                    <Input
                      type="password"
                      placeholder="Confirm new password"
                      className="glass border-gray-800"
                    />
                    <Button variant="gradient" className="glow-pink">
                      Update Password
                    </Button>
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-800">
                  <h3 className="font-semibold mb-2 text-red-400">Danger Zone</h3>
                  <Button variant="destructive" className="w-full">
                    Delete Account
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Billing Tab */}
          <TabsContent value="billing">
            <Card className="glass border-gray-800">
              <CardHeader>
                <CardTitle>Billing & Subscriptions</CardTitle>
                <CardDescription>
                  Manage your payment methods and subscriptions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-4">Payment Methods</h3>
                  <div className="space-y-3">
                    <div className="glass rounded-lg p-4 border border-gray-800 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded flex items-center justify-center">
                          <CreditCard className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="font-medium">•••• •••• •••• 4242</p>
                          <p className="text-sm text-gray-400">Expires 12/25</p>
                        </div>
                      </div>
                      <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                        Default
                      </Badge>
                    </div>
                  </div>
                  <Button variant="outline" className="glass border-gray-700 mt-4">
                    Add Payment Method
                  </Button>
                </div>

                <div>
                  <h3 className="font-semibold mb-4">Active Subscriptions</h3>
                  <p className="text-gray-400 text-sm">
                    You have {user?.subscriptions.length || 0} active subscriptions
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold mb-4">Billing History</h3>
                  <Button variant="outline" className="glass border-gray-700">
                    View All Invoices
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Logout Button */}
        <Card className="glass border-gray-800 mt-6">
          <CardContent className="p-6">
            <Button
              variant="outline"
              className="w-full glass border-red-500/30 text-red-400 hover:bg-red-500/10"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
