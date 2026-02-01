import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User, Post, MessageThread, Message, QuickReplyTemplate } from "./types";
import { mockCreators, mockPosts, mockThreads, mockMessages, mockQuickReplies } from "./mock/data";

interface AppState {
  // Auth
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, role?: "user" | "admin") => void;
  logout: () => void;
  
  // Posts
  posts: Post[];
  addPost: (post: Omit<Post, "id" | "createdAt">) => void;
  toggleLike: (postId: string) => void;
  toggleSave: (postId: string) => void;
  
  // Subscriptions
  toggleSubscription: (creatorId: string) => void;
  isSubscribed: (creatorId: string) => boolean;
  
  // Messages
  threads: MessageThread[];
  messages: Message[];
  sendMessage: (threadId: string, content: string) => void;
  markThreadRead: (threadId: string) => void;
  
  // Quick Replies (Admin)
  quickReplies: QuickReplyTemplate[];
  addQuickReply: (template: Omit<QuickReplyTemplate, "id">) => void;
  deleteQuickReply: (id: string) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      isAuthenticated: false,
      posts: mockPosts,
      threads: mockThreads,
      messages: mockMessages,
      quickReplies: mockQuickReplies,

      // Auth actions
      login: (email, password, role = "user") => {
        const user: User = {
          id: "user-1",
          email,
          name: email.split("@")[0],
          role,
          subscriptions: role === "admin" ? [] : ["c1"], // If user, start with one subscription
          savedPosts: [],
        };
        set({ user, isAuthenticated: true });
      },

      logout: () => {
        set({ user: null, isAuthenticated: false });
      },

      // Post actions
      addPost: (postData) => {
        const newPost: Post = {
          ...postData,
          id: `p${Date.now()}`,
          createdAt: new Date(),
          likes: 0,
          comments: 0,
        };
        set((state) => ({ posts: [newPost, ...state.posts] }));
      },

      toggleLike: (postId) => {
        set((state) => ({
          posts: state.posts.map((post) =>
            post.id === postId
              ? { ...post, likes: post.likes + 1 }
              : post
          ),
        }));
      },

      toggleSave: (postId) => {
        set((state) => {
          const user = state.user;
          if (!user) return state;
          
          const isSaved = user.savedPosts.includes(postId);
          return {
            user: {
              ...user,
              savedPosts: isSaved
                ? user.savedPosts.filter((id) => id !== postId)
                : [...user.savedPosts, postId],
            },
          };
        });
      },

      // Subscription actions
      toggleSubscription: (creatorId) => {
        set((state) => {
          const user = state.user;
          if (!user) return state;
          
          const isSubbed = user.subscriptions.includes(creatorId);
          return {
            user: {
              ...user,
              subscriptions: isSubbed
                ? user.subscriptions.filter((id) => id !== creatorId)
                : [...user.subscriptions, creatorId],
            },
          };
        });
      },

      isSubscribed: (creatorId) => {
        const user = get().user;
        return user?.subscriptions.includes(creatorId) ?? false;
      },

      // Message actions
      sendMessage: (threadId, content) => {
        const newMessage: Message = {
          id: `m${Date.now()}`,
          threadId,
          senderId: "user",
          content,
          createdAt: new Date(),
          isRead: true,
        };
        
        set((state) => ({
          messages: [...state.messages, newMessage],
          threads: state.threads.map((thread) =>
            thread.id === threadId
              ? {
                  ...thread,
                  lastMessage: content,
                  lastMessageAt: new Date(),
                }
              : thread
          ),
        }));
      },

      markThreadRead: (threadId) => {
        set((state) => ({
          threads: state.threads.map((thread) =>
            thread.id === threadId ? { ...thread, unread: 0 } : thread
          ),
          messages: state.messages.map((msg) =>
            msg.threadId === threadId ? { ...msg, isRead: true } : msg
          ),
        }));
      },

      // Quick Reply actions
      addQuickReply: (template) => {
        const newTemplate: QuickReplyTemplate = {
          ...template,
          id: `qr${Date.now()}`,
        };
        set((state) => ({
          quickReplies: [...state.quickReplies, newTemplate],
        }));
      },

      deleteQuickReply: (id) => {
        set((state) => ({
          quickReplies: state.quickReplies.filter((qr) => qr.id !== id),
        }));
      },
    }),
    {
      name: "monimak-storage",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

// Selector hooks for convenience
export const useAuth = () => useStore((state) => ({
  user: state.user,
  isAuthenticated: state.isAuthenticated,
  login: state.login,
  logout: state.logout,
}));

export const usePosts = () => useStore((state) => ({
  posts: state.posts,
  addPost: state.addPost,
  toggleLike: state.toggleLike,
  toggleSave: state.toggleSave,
}));

export const useSubscriptions = () => useStore((state) => ({
  toggleSubscription: state.toggleSubscription,
  isSubscribed: state.isSubscribed,
  subscriptions: state.user?.subscriptions ?? [],
}));

export const useMessages = () => useStore((state) => ({
  threads: state.threads,
  messages: state.messages,
  sendMessage: state.sendMessage,
  markThreadRead: state.markThreadRead,
}));

export const useQuickReplies = () => useStore((state) => ({
  quickReplies: state.quickReplies,
  addQuickReply: state.addQuickReply,
  deleteQuickReply: state.deleteQuickReply,
}));
