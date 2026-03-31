"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { createPost } from "./actions";
import { uploadFile } from "@/lib/supabase/storage";
import { useUser } from "@/lib/contexts/user-context";
import { Upload, Image, Video, X, Sparkles, FileUp } from "lucide-react";
import { motion } from "framer-motion";

export function AdminUploadClient() {
  const router = useRouter();
  const { user } = useUser();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [postType, setPostType] = useState<"image" | "video">("image");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [caption, setCaption] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [visibility, setVisibility] = useState<"public" | "subscribers">("public");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setUploadError(null);

    // Create preview URL
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

    // Auto-detect type from file
    if (file.type.startsWith("video/")) {
      setPostType("video");
    } else {
      setPostType("image");
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim()) && tags.length < 10) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile || !user) return;

    setIsSubmitting(true);
    setUploadError(null);

    try {
      // Upload file to Supabase Storage
      const { url: mediaUrl } = await uploadFile('post-media', user.id, selectedFile);

      // Create post via server action
      const formData = new FormData();
      formData.append('type', postType);
      formData.append('mediaUrl', mediaUrl);
      formData.append('thumbnailUrl', postType === "video" ? mediaUrl : '');
      formData.append('caption', caption);
      formData.append('tags', JSON.stringify(tags));
      formData.append('visibility', visibility);

      await createPost(formData);
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : 'Upload failed');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="sticky top-0 z-30 border-b border-gray-800 bg-gray-950/80 backdrop-blur-xl">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold gradient-text flex items-center gap-2">
            <Upload className="w-6 h-6" />
            Create New Post
          </h1>
          <p className="text-gray-400 mt-1">Share content with your subscribers</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto p-4">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Post Type Selection */}
          <Card className="glass border-gray-800">
            <CardHeader>
              <CardTitle>Content Type</CardTitle>
              <CardDescription>Select the type of content you want to upload</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setPostType("image")}
                  className={`p-6 rounded-lg border-2 transition-all ${
                    postType === "image"
                      ? "border-pink-500 bg-pink-500/10"
                      : "border-gray-800 hover:border-gray-700"
                  }`}
                >
                  <Image
                    className={`w-8 h-8 mx-auto mb-2 ${
                      postType === "image" ? "text-pink-500" : "text-gray-400"
                    }`}
                  />
                  <p className="font-medium text-white">Image</p>
                </button>
                <button
                  type="button"
                  onClick={() => setPostType("video")}
                  className={`p-6 rounded-lg border-2 transition-all ${
                    postType === "video"
                      ? "border-purple-500 bg-purple-500/10"
                      : "border-gray-800 hover:border-gray-700"
                  }`}
                >
                  <Video
                    className={`w-8 h-8 mx-auto mb-2 ${
                      postType === "video" ? "text-purple-500" : "text-gray-400"
                    }`}
                  />
                  <p className="font-medium text-white">Video</p>
                </button>
              </div>
            </CardContent>
          </Card>

          {/* File Upload */}
          <Card className="glass border-gray-800">
            <CardHeader>
              <CardTitle>Upload Media</CardTitle>
              <CardDescription>
                Select a {postType} file to upload (max {postType === "video" ? "100MB" : "100MB"})
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <input
                ref={fileInputRef}
                type="file"
                accept={postType === "image" ? "image/jpeg,image/png,image/gif,image/webp" : "video/mp4,video/webm"}
                onChange={handleFileSelect}
                className="hidden"
              />

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full p-8 rounded-lg border-2 border-dashed border-gray-700 hover:border-pink-500/50 transition-all flex flex-col items-center gap-3 text-gray-400 hover:text-gray-300"
              >
                <FileUp className="w-10 h-10" />
                <div className="text-center">
                  <p className="font-medium">{selectedFile ? selectedFile.name : "Click to select a file"}</p>
                  <p className="text-sm mt-1">
                    {selectedFile
                      ? `${(selectedFile.size / (1024 * 1024)).toFixed(1)} MB`
                      : `Supports: ${postType === "image" ? "JPEG, PNG, GIF, WebP" : "MP4, WebM"}`}
                  </p>
                </div>
              </button>

              {uploadError && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30">
                  <p className="text-sm text-red-400">{uploadError}</p>
                </div>
              )}

              {previewUrl && postType === "image" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="rounded-lg overflow-hidden border border-gray-800"
                >
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-full max-h-96 object-cover"
                  />
                </motion.div>
              )}

              {previewUrl && postType === "video" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="rounded-lg overflow-hidden border border-gray-800"
                >
                  <video
                    src={previewUrl}
                    controls
                    className="w-full max-h-96"
                  />
                </motion.div>
              )}
            </CardContent>
          </Card>

          {/* Caption */}
          <Card className="glass border-gray-800">
            <CardHeader>
              <CardTitle>Caption</CardTitle>
              <CardDescription>Write a compelling caption for your post</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="What's on your mind?"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                className="glass border-gray-800 min-h-[120px]"
                maxLength={2000}
                required
              />
              <p className="text-xs text-gray-400 mt-2">{caption.length}/2000 characters</p>
            </CardContent>
          </Card>

          {/* Tags */}
          <Card className="glass border-gray-800">
            <CardHeader>
              <CardTitle>Tags</CardTitle>
              <CardDescription>Add up to 10 tags to help users discover your content</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Add a tag..."
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddTag();
                    }
                  }}
                  className="glass border-gray-800"
                  disabled={tags.length >= 10}
                />
                <Button
                  type="button"
                  variant="outline"
                  className="glass border-gray-700"
                  onClick={handleAddTag}
                  disabled={tags.length >= 10}
                >
                  Add
                </Button>
              </div>

              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <Badge
                      key={tag}
                      className="bg-gray-800 text-gray-300 border-gray-700 pl-3 pr-1 py-1"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-2 hover:text-red-400"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Visibility */}
          <Card className="glass border-gray-800">
            <CardHeader>
              <CardTitle>Visibility</CardTitle>
              <CardDescription>Choose who can see this post</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setVisibility("public")}
                  className={`p-4 rounded-lg border-2 transition-all text-left ${
                    visibility === "public"
                      ? "border-blue-500 bg-blue-500/10"
                      : "border-gray-800 hover:border-gray-700"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        visibility === "public"
                          ? "border-blue-500 bg-blue-500"
                          : "border-gray-600"
                      }`}
                    >
                      {visibility === "public" && (
                        <div className="w-2 h-2 rounded-full bg-white" />
                      )}
                    </div>
                    <p className="font-medium text-white">Public Preview</p>
                  </div>
                  <p className="text-sm text-gray-400">
                    Everyone can see this post (free preview)
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setVisibility("subscribers")}
                  className={`p-4 rounded-lg border-2 transition-all text-left ${
                    visibility === "subscribers"
                      ? "border-pink-500 bg-pink-500/10"
                      : "border-gray-800 hover:border-gray-700"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        visibility === "subscribers"
                          ? "border-pink-500 bg-pink-500"
                          : "border-gray-600"
                      }`}
                    >
                      {visibility === "subscribers" && (
                        <div className="w-2 h-2 rounded-full bg-white" />
                      )}
                    </div>
                    <p className="font-medium text-white">Subscribers Only</p>
                  </div>
                  <p className="text-sm text-gray-400">
                    Only subscribers can view this content
                  </p>
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Submit */}
          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              className="glass border-gray-700"
              onClick={() => router.push("/admin")}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="gradient"
              className="flex-1 glow-pink"
              disabled={!selectedFile || !caption || isSubmitting}
            >
              <Sparkles className="w-4 h-4 mr-2" />
              {isSubmitting ? 'Uploading & Publishing...' : 'Publish Post'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
