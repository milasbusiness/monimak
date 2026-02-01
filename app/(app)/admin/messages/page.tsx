"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuickReplies } from "@/lib/store";
import { MessageCircle, Plus, Edit, Trash2, Save, X } from "lucide-react";

export default function AdminMessagesPage() {
  const { quickReplies, addQuickReply, deleteQuickReply } = useQuickReplies();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newTemplate, setNewTemplate] = useState({ name: "", content: "" });

  const handleAddTemplate = () => {
    if (newTemplate.name.trim() && newTemplate.content.trim()) {
      addQuickReply(newTemplate);
      setNewTemplate({ name: "", content: "" });
      setIsAdding(false);
    }
  };

  const handleDeleteTemplate = (id: string) => {
    if (confirm("Are you sure you want to delete this template?")) {
      deleteQuickReply(id);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="sticky top-0 z-30 border-b border-gray-800 bg-gray-950/80 backdrop-blur-xl">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold gradient-text flex items-center gap-2">
            <MessageCircle className="w-6 h-6" />
            Message Management
          </h1>
          <p className="text-gray-400 mt-1">Manage quick replies and auto-response templates</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Quick Replies */}
        <Card className="glass border-gray-800">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Quick Reply Templates</CardTitle>
                <CardDescription>
                  Create templates for quick responses to common messages
                </CardDescription>
              </div>
              <Button
                variant="gradient"
                className="glow-pink"
                onClick={() => setIsAdding(!isAdding)}
              >
                <Plus className="w-4 h-4 mr-2" />
                New Template
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Add New Template Form */}
            {isAdding && (
              <div className="p-4 rounded-lg border-2 border-pink-500/30 bg-pink-500/5 space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Template Name</label>
                  <Input
                    placeholder="e.g., Welcome Message"
                    value={newTemplate.name}
                    onChange={(e) =>
                      setNewTemplate({ ...newTemplate, name: e.target.value })
                    }
                    className="glass border-gray-800"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Message Content</label>
                  <Textarea
                    placeholder="Your message template..."
                    value={newTemplate.content}
                    onChange={(e) =>
                      setNewTemplate({ ...newTemplate, content: e.target.value })
                    }
                    className="glass border-gray-800 min-h-[100px]"
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="gradient"
                    onClick={handleAddTemplate}
                    disabled={!newTemplate.name.trim() || !newTemplate.content.trim()}
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save Template
                  </Button>
                  <Button
                    variant="outline"
                    className="glass border-gray-700"
                    onClick={() => {
                      setIsAdding(false);
                      setNewTemplate({ name: "", content: "" });
                    }}
                  >
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                </div>
              </div>
            )}

            {/* Template List */}
            <div className="space-y-3">
              {quickReplies.map((template) => (
                <div
                  key={template.id}
                  className="p-4 rounded-lg border border-gray-800 hover:border-gray-700 transition-all"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h3 className="font-semibold text-white mb-1">{template.name}</h3>
                      <p className="text-sm text-gray-300">{template.content}</p>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="hover:bg-blue-500/10 hover:text-blue-400"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="hover:bg-red-500/10 hover:text-red-400"
                        onClick={() => handleDeleteTemplate(template.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant="secondary" className="bg-gray-800 text-xs">
                      {template.content.length} characters
                    </Badge>
                    <button className="text-xs text-pink-400 hover:text-pink-300">
                      Use Template
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Auto-Reply Rules */}
        <Card className="glass border-gray-800">
          <CardHeader>
            <CardTitle>Auto-Reply Rules</CardTitle>
            <CardDescription>
              Set up automatic responses based on triggers (Coming Soon)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="py-12 text-center">
              <div className="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-8 h-8 text-gray-600" />
              </div>
              <p className="text-gray-400 mb-4">Auto-reply rules will be available soon</p>
              <Button variant="outline" className="glass border-gray-700" disabled>
                <Plus className="w-4 h-4 mr-2" />
                Create Rule
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Message Stats */}
        <Card className="glass border-gray-800">
          <CardHeader>
            <CardTitle>Message Statistics</CardTitle>
            <CardDescription>Your messaging activity overview</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-white mb-2">89</p>
                <p className="text-sm text-gray-400">Total Conversations</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-white mb-2">1.2h</p>
                <p className="text-sm text-gray-400">Avg Response Time</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-white mb-2">94%</p>
                <p className="text-sm text-gray-400">Response Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
