"use client";

import { useState, useTransition, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useUser } from "@/lib/contexts/user-context";
import { createClient } from "@/lib/supabase/client";
import { uploadFile } from "@/lib/supabase/storage";
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
  const { user, profile, signOut } = useUser();
  const router = useRouter();
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const [isPending, startTransition] = useTransition();
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    newPosts: true,
    messages: true,
    promotions: false,
  });
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleLogout = async () => {
    await signOut();
    router.push("/");
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    startTransition(async () => {
      try {
        const { url } = await uploadFile('avatars', user.id, file);
        const supabase = createClient();
        await supabase
          .from('profiles')
          .update({ avatar_url: url })
          .eq('id', user.id);
        setSuccessMsg('Avatar updated! Refresh to see changes.');
      } catch (err) {
        console.error('Avatar upload failed:', err);
      }
    });
  };

  const handlePasswordChange = async (formData: FormData) => {
    const newPassword = formData.get('newPassword') as string;
    const confirmPassword = formData.get('confirmPassword') as string;

    if (newPassword !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    if (newPassword.length < 8) {
      alert('Password must be at least 8 characters');
      return;
    }

    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password: newPassword });

    if (error) {
      alert(error.message);
    } else {
      setSuccessMsg('Password updated successfully');
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
        {successMsg && (
          <div className="mb-4 p-3 rounded-lg bg-green-500/10 border border-green-500/30">
            <p className="text-sm text-green-400">{successMsg}</p>
          </div>
        )}

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
                    <AvatarImage src={profile?.avatar_url || undefined} />
                    <AvatarFallback className="text-xl">
                      {profile ? getInitials(profile.name) : "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <input
                      ref={avatarInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/gif,image/webp"
                      className="hidden"
                      onChange={handleAvatarUpload}
                    />
                    <Button
                      variant="outline"
                      className="glass border-gray-700 mb-2"
                      onClick={() => avatarInputRef.current?.click()}
                      disabled={isPending}
                    >
                      {isPending ? 'Uploading...' : 'Change Avatar'}
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
                      defaultValue={profile?.name}
                      className="glass border-gray-800"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Email</label>
                    <Input
                      type="email"
                      defaultValue={profile?.email || user?.email}
                      className="glass border-gray-800"
                      disabled
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Role</label>
                    <Badge
                      className={
                        profile?.role === "creator"
                          ? "bg-purple-500/20 text-purple-400 border-purple-500/30"
                          : profile?.role === "admin"
                          ? "bg-red-500/20 text-red-400 border-red-500/30"
                          : "bg-blue-500/20 text-blue-400 border-blue-500/30"
                      }
                    >
                      {profile?.role?.toUpperCase() || 'USER'}
                    </Badge>
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
                  <h3 className="font-semibold mb-4">Change Password</h3>
                  <form action={handlePasswordChange} className="space-y-4">
                    <Input
                      type="password"
                      name="newPassword"
                      placeholder="New password"
                      className="glass border-gray-800"
                      minLength={8}
                      required
                    />
                    <Input
                      type="password"
                      name="confirmPassword"
                      placeholder="Confirm new password"
                      className="glass border-gray-800"
                      minLength={8}
                      required
                    />
                    <Button type="submit" variant="gradient" className="glow-pink">
                      Update Password
                    </Button>
                  </form>
                </div>

                <div className="pt-6 border-t border-gray-800">
                  <h3 className="font-semibold mb-2 text-red-400">Danger Zone</h3>
                  <Button variant="destructive" className="w-full" disabled>
                    Delete Account
                  </Button>
                  <p className="text-xs text-gray-500 mt-2">Account deletion coming soon</p>
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
                  <p className="text-gray-400 text-sm">Payment integration coming soon</p>
                  <Button variant="outline" className="glass border-gray-700 mt-4" disabled>
                    Add Payment Method
                  </Button>
                </div>

                <div>
                  <h3 className="font-semibold mb-4">Active Subscriptions</h3>
                  <p className="text-gray-400 text-sm">
                    View your subscriptions in the Library tab
                  </p>
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
