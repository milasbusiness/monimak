"use client";

import { useState, useTransition } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { EmptyState } from "@/components/empty-state";
import { sendMessage, markThreadRead } from "./actions";
import { formatDate, getInitials } from "@/lib/utils";
import { MessageCircle, Send, Search, MoreVertical } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Thread {
  id: string;
  participantId: string;
  participantName: string;
  participantAvatar?: string;
  lastMessage: string;
  lastMessageAt: string;
  unread: number;
}

interface Message {
  id: string;
  threadId: string;
  senderId: string;
  content: string;
  createdAt: string;
}

interface ChatClientProps {
  threads: Thread[];
  messages: Message[];
  currentUserId: string;
}

export function ChatClient({ threads, messages, currentUserId }: ChatClientProps) {
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(
    threads[0]?.id || null
  );
  const [messageInput, setMessageInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isPending, startTransition] = useTransition();

  const selectedThread = threads.find((t) => t.id === selectedThreadId);
  const threadMessages = messages.filter((m) => m.threadId === selectedThreadId);

  const handleSelectThread = (threadId: string) => {
    setSelectedThreadId(threadId);
    startTransition(() => {
      markThreadRead(threadId);
    });
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim() || !selectedThreadId) return;

    const content = messageInput;
    setMessageInput("");
    startTransition(() => {
      sendMessage(selectedThreadId, content);
    });
  };

  const filteredThreads = threads.filter((thread) =>
    thread.participantName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-[calc(100vh-4rem)] lg:h-screen flex">
      {/* Thread List */}
      <div
        className={`${
          selectedThreadId ? "hidden lg:flex" : "flex"
        } w-full lg:w-80 xl:w-96 border-r border-gray-800 bg-gray-950/50 flex-col`}
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-800">
          <h1 className="text-2xl font-bold mb-4 gradient-text flex items-center gap-2">
            <MessageCircle className="w-6 h-6" />
            Messages
          </h1>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 glass border-gray-800"
            />
          </div>
        </div>

        {/* Thread List */}
        <ScrollArea className="flex-1">
          <div className="p-2">
            {filteredThreads.length > 0 ? (
              filteredThreads.map((thread) => (
                <button
                  key={thread.id}
                  onClick={() => handleSelectThread(thread.id)}
                  className={`w-full p-3 rounded-lg mb-2 transition-all text-left ${
                    selectedThreadId === thread.id
                      ? "bg-gradient-to-r from-pink-500/20 to-purple-500/20"
                      : "hover:bg-gray-800/50"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <Avatar className="h-12 w-12 ring-2 ring-purple-500/20">
                      <AvatarImage src={thread.participantAvatar} />
                      <AvatarFallback>
                        {getInitials(thread.participantName)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold text-white truncate">
                          {thread.participantName}
                        </h3>
                        {thread.unread > 0 && (
                          <Badge className="bg-pink-500 text-white text-xs">
                            {thread.unread}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-400 truncate">
                        {thread.lastMessage}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {formatDate(new Date(thread.lastMessageAt))}
                      </p>
                    </div>
                  </div>
                </button>
              ))
            ) : (
              <div className="py-8">
                <EmptyState
                  icon={MessageCircle}
                  title="No conversations"
                  description="Start chatting with your favorite creators"
                />
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Chat Window */}
      {selectedThread ? (
        <div
          className={`${
            selectedThreadId ? "flex" : "hidden lg:flex"
          } flex-1 flex-col bg-black`}
        >
          {/* Chat Header */}
          <div className="p-4 border-b border-gray-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSelectedThreadId(null)}
                className="lg:hidden text-gray-400 hover:text-white mr-2"
              >
                &larr;
              </button>
              <Avatar className="h-10 w-10 ring-2 ring-purple-500/20">
                <AvatarImage src={selectedThread.participantAvatar} />
                <AvatarFallback>
                  {getInitials(selectedThread.participantName)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="font-semibold text-white">
                  {selectedThread.participantName}
                </h2>
              </div>
            </div>
            <Button variant="ghost" size="icon">
              <MoreVertical className="w-5 h-5" />
            </Button>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4 max-w-3xl mx-auto">
              {threadMessages.length > 0 ? (
                threadMessages.map((message) => {
                  const isOwn = message.senderId === currentUserId;
                  return (
                    <div
                      key={message.id}
                      className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[70%] ${
                          isOwn
                            ? "bg-gradient-to-r from-pink-500 to-purple-500"
                            : "bg-gray-800"
                        } rounded-2xl px-4 py-2`}
                      >
                        <p className="text-white text-sm">{message.content}</p>
                        <p className="text-xs text-gray-300 mt-1">
                          {formatDate(new Date(message.createdAt))}
                        </p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-center text-gray-500 py-8">No messages yet. Say hello!</p>
              )}
            </div>
          </ScrollArea>

          {/* Message Input */}
          <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-800">
            <div className="flex gap-2 max-w-3xl mx-auto">
              <Input
                placeholder="Type a message..."
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                className="flex-1 glass border-gray-800"
                maxLength={5000}
              />
              <Button
                type="submit"
                variant="gradient"
                size="icon"
                className="glow-pink"
                disabled={!messageInput.trim() || isPending}
              >
                <Send className="w-5 h-5" />
              </Button>
            </div>
          </form>
        </div>
      ) : (
        <div className="hidden lg:flex flex-1 items-center justify-center bg-black">
          <EmptyState
            icon={MessageCircle}
            title="Select a conversation"
            description="Choose a conversation from the list to start chatting"
          />
        </div>
      )}
    </div>
  );
}
