"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Chat } from "@/types/chat";
import { Plus, Trash2, MoreHorizontal, Sparkles, Clock } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { motion, AnimatePresence } from "framer-motion";

interface ChatSidebarProps {
  chats: Chat[];
  activeChat: string | null;
  onSelectChat: (chatId: string) => void;
  onDeleteChat: (chatId: string) => void;
  onNewChat: () => void;
}

export function ChatSidebar({
  chats,
  activeChat,
  onSelectChat,
  onDeleteChat,
  onNewChat,
}: ChatSidebarProps) {
  const [hoveredChat, setHoveredChat] = useState<string | null>(null);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const formatDate = (date: Date | string) => {
    const now = new Date();
    const dateObj = date instanceof Date ? date : new Date(date);

    // Check if the date is valid
    if (isNaN(dateObj.getTime())) {
      return "Unknown";
    }

    const diffInHours = (now.getTime() - dateObj.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      return "Just now";
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else if (diffInHours < 48) {
      return "Yesterday";
    } else if (diffInHours < 168) {
      return `${Math.floor(diffInHours / 24)}d ago`;
    } else {
      return dateObj.toLocaleDateString();
    }
  };

  const groupChatsByDate = (chats: Chat[]) => {
    const groups: { [key: string]: Chat[] } = {};

    chats.forEach((chat) => {
      const now = new Date();
      const dateObj =
        chat.updatedAt instanceof Date
          ? chat.updatedAt
          : new Date(chat.updatedAt);

      // Check if the date is valid
      if (isNaN(dateObj.getTime())) {
        if (!groups["Unknown"]) groups["Unknown"] = [];
        groups["Unknown"].push(chat);
        return;
      }

      const diffInHours =
        (now.getTime() - dateObj.getTime()) / (1000 * 60 * 60);

      let group = "";
      if (diffInHours < 24) {
        group = "Today";
      } else if (diffInHours < 48) {
        group = "Yesterday";
      } else if (diffInHours < 168) {
        group = "This Week";
      } else {
        group = "Older";
      }

      if (!groups[group]) groups[group] = [];
      groups[group].push(chat);
    });

    return groups;
  };

  const chatGroups = groupChatsByDate(chats);

  const handleChatMouseEnter = (chatId: string) => {
    setHoveredChat(chatId);
  };

  const handleChatMouseLeave = (chatId: string) => {
    // Only hide if dropdown is not open for this chat
    if (openDropdown !== chatId) {
      setHoveredChat(null);
    }
  };

  const handleDropdownOpenChange = (open: boolean, chatId: string) => {
    if (open) {
      setOpenDropdown(chatId);
      setHoveredChat(chatId);
    } else {
      setOpenDropdown(null);
      setHoveredChat(null);
    }
  };

  return (
    <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl h-full flex flex-col border-r border-slate-200 dark:border-slate-800">
      {/* Header */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-gradient-to-r from-violet-500 to-purple-500 rounded-lg flex items-center justify-center">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <div>
            <h2 className="font-semibold text-slate-900 dark:text-slate-100">
              AI Tutor
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Learning companion
            </p>
          </div>
        </div>
        <Button
          onClick={onNewChat}
          className="w-full bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 text-white border-0 shadow-md hover:shadow-lg transition-all duration-200"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Conversation
        </Button>
      </div>

      {/* Chat List */}
      <ScrollArea className="flex-1">
        <div className="p-3">
          {Object.entries(chatGroups).map(([group, groupChats]) => (
            <div key={group} className="mb-6">
              <div className="flex items-center gap-2 px-3 py-2 mb-2">
                <Clock className="h-3 w-3 text-slate-400" />
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  {group}
                </span>
              </div>
              <AnimatePresence>
                {groupChats.map((chat, index) => (
                  <motion.div
                    key={chat.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ delay: index * 0.05 }}
                    className={`group relative mb-1 rounded-xl cursor-pointer transition-all duration-200 ${
                      activeChat === chat.id
                        ? "bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-950/50 dark:to-purple-950/50 border border-violet-200 dark:border-violet-800"
                        : "hover:bg-slate-50 dark:hover:bg-slate-800/50"
                    }`}
                    onMouseEnter={() => handleChatMouseEnter(chat.id)}
                    onMouseLeave={() => handleChatMouseLeave(chat.id)}
                    onClick={() => onSelectChat(chat.id)}
                  >
                    <div className="flex items-center p-3">
                      <div
                        className={`w-2 h-2 rounded-full mr-3 transition-colors ${
                          activeChat === chat.id
                            ? "bg-gradient-to-r from-violet-500 to-purple-500"
                            : "bg-slate-300 dark:bg-slate-600"
                        }`}
                      />
                      <div className="flex-1 min-w-0">
                        <div
                          className={`text-sm font-medium truncate transition-colors ${
                            activeChat === chat.id
                              ? "text-violet-700 dark:text-violet-300"
                              : "text-slate-700 dark:text-slate-300"
                          }`}
                        >
                          {chat.title}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                          {formatDate(chat.updatedAt)}
                        </div>
                      </div>

                      <AnimatePresence>
                        {(hoveredChat === chat.id ||
                          activeChat === chat.id ||
                          openDropdown === chat.id) && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{ duration: 0.15 }}
                          >
                            <DropdownMenu
                              onOpenChange={(open) =>
                                handleDropdownOpenChange(open, chat.id)
                              }
                              open={openDropdown === chat.id}
                            >
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 p-0 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-32">
                                <DropdownMenuItem
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onDeleteChat(chat.id);
                                    setOpenDropdown(null);
                                    setHoveredChat(null);
                                  }}
                                  className="text-red-600 focus:text-red-600 dark:text-red-400 focus:bg-red-50 dark:focus:bg-red-950/20"
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-800">
        <div className="text-xs text-slate-500 dark:text-slate-400 text-center">
          AI Tutor v1.0 • Powered by AI
        </div>
      </div>
    </div>
  );
}
