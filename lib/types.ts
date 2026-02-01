export type UserRole = "user" | "admin";

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: UserRole;
  subscriptions: string[]; // creator IDs
  savedPosts: string[]; // post IDs
}

export interface Creator {
  id: string;
  name: string;
  username: string;
  avatar: string;
  banner?: string;
  bio: string;
  subscriberCount: number;
  postCount: number;
  subscriptionPrice: number;
  isVerified: boolean;
  tags: string[];
}

export type PostType = "image" | "video";
export type PostVisibility = "public" | "subscribers";

export interface Post {
  id: string;
  creatorId: string;
  type: PostType;
  mediaUrl: string;
  thumbnailUrl?: string;
  caption: string;
  tags: string[];
  visibility: PostVisibility;
  isLocked: boolean;
  likes: number;
  comments: number;
  createdAt: Date;
}

export interface MessageThread {
  id: string;
  participantId: string; // other user ID
  participantName: string;
  participantAvatar?: string;
  lastMessage: string;
  lastMessageAt: Date;
  unread: number;
}

export interface Message {
  id: string;
  threadId: string;
  senderId: string;
  content: string;
  createdAt: Date;
  isRead: boolean;
}

export interface QuickReplyTemplate {
  id: string;
  name: string;
  content: string;
}

export interface AdminStats {
  totalRevenue: number;
  subscribers: number;
  posts: number;
  messages: number;
}
