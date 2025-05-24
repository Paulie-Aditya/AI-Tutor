"use client";

import type React from "react";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import type { Chat } from "@/types/chat";
import {
  Plus,
  Trash2,
  MoreHorizontal,
  Sparkles,
  Clock,
  Edit2,
  Check,
  X,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeToggle } from "@/components/theme-toggle";

interface ChatSidebarProps {
  chats: Chat[];
  activeChat: string | null;
  onSelectChat: (chatId: string) => void;
  onDeleteChat: (chatId: string) => void;
  onRenameChat: (chatId: string, newTitle: string) => void;
  onNewChat: () => void;
  width: number;
  onWidthChange: (width: number) => void;
}

export function ChatSidebar({
  chats,
  activeChat,
  onSelectChat,
  onDeleteChat,
  onRenameChat,
  onNewChat,
  width,
  onWidthChange,
}: ChatSidebarProps) {
  const [hoveredChat, setHoveredChat] = useState<string | null>(null);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [editingChat, setEditingChat] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [isResizing, setIsResizing] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const editInputRef = useRef<HTMLInputElement>(null);

  // Handle resizing
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;

      const newWidth = Math.max(240, Math.min(480, e.clientX));
      onWidthChange(newWidth);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
  }, [isResizing, onWidthChange]);

  // Focus edit input when editing starts
  useEffect(() => {
    if (editingChat && editInputRef.current) {
      editInputRef.current.focus();
      editInputRef.current.select();
    }
  }, [editingChat]);

  const formatDate = (date: Date | string) => {
    const now = new Date();
    const dateObj = date instanceof Date ? date : new Date(date);

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
    if (openDropdown !== chatId && editingChat !== chatId) {
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

  const startEditing = (chat: Chat) => {
    setEditingChat(chat.id);
    setEditTitle(chat.title);
    setOpenDropdown(null);
  };

  const saveEdit = () => {
    if (editingChat && editTitle.trim()) {
      onRenameChat(editingChat, editTitle.trim());
    }
    setEditingChat(null);
    setEditTitle("");
    setHoveredChat(null);
  };

  const cancelEdit = () => {
    setEditingChat(null);
    setEditTitle("");
    setHoveredChat(null);
  };

  const handleEditKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      saveEdit();
    } else if (e.key === "Escape") {
      cancelEdit();
    }
  };

  return (
    <div
      ref={sidebarRef}
      className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl h-full flex border-r border-slate-200 dark:border-slate-800 relative"
      style={{ width }}
    >
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="p-3 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 bg-gradient-to-r from-violet-500 to-purple-500 rounded-md flex items-center justify-center">
              <Sparkles className="h-3 w-3 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="font-semibold text-sm text-slate-900 dark:text-slate-100 truncate">
                AI Tutor
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Learning companion
              </p>
            </div>
            <ThemeToggle />
          </div>
          <Button
            onClick={onNewChat}
            className="w-full h-8 bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 text-white border-0 shadow-md hover:shadow-lg transition-all duration-200 text-sm"
          >
            <Plus className="h-3 w-3 mr-1" />
            New Chat
          </Button>
        </div>

        {/* Chat List */}
        <ScrollArea className="flex-1">
          <div className="p-2">
            {Object.entries(chatGroups).map(([group, groupChats]) => (
              <div key={group} className="mb-4">
                <div className="flex items-center gap-1 px-2 py-1 mb-1">
                  <Clock className="h-2.5 w-2.5 text-slate-400" />
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
                      transition={{ delay: index * 0.02 }}
                      className={`group relative mb-1 rounded-lg cursor-pointer transition-all duration-200 ${
                        activeChat === chat.id
                          ? "bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-950/50 dark:to-purple-950/50 border border-violet-200 dark:border-violet-800"
                          : "hover:bg-slate-50 dark:hover:bg-slate-800/50"
                      }`}
                      onMouseEnter={() => handleChatMouseEnter(chat.id)}
                      onMouseLeave={() => handleChatMouseLeave(chat.id)}
                      onClick={() => !editingChat && onSelectChat(chat.id)}
                    >
                      <div className="flex items-center p-2 gap-2">
                        <div
                          className={`w-1.5 h-1.5 rounded-full flex-shrink-0 transition-colors ${
                            activeChat === chat.id
                              ? "bg-gradient-to-r from-violet-500 to-purple-500"
                              : "bg-slate-300 dark:bg-slate-600"
                          }`}
                        />

                        <div className="flex-1 min-w-0">
                          {editingChat === chat.id ? (
                            <div className="flex items-center gap-1">
                              <Input
                                ref={editInputRef}
                                value={editTitle}
                                onChange={(e) => setEditTitle(e.target.value)}
                                onKeyDown={handleEditKeyDown}
                                onBlur={saveEdit}
                                className="h-6 text-xs px-1 py-0 border-violet-300 dark:border-violet-600"
                                onClick={(e) => e.stopPropagation()}
                              />
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-5 w-5 p-0 text-green-600 hover:text-green-700"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  saveEdit();
                                }}
                              >
                                <Check className="h-3 w-3" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-5 w-5 p-0 text-red-600 hover:text-red-700"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  cancelEdit();
                                }}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          ) : (
                            <>
                              <div
                                className={`text-xs font-medium truncate transition-colors ${
                                  activeChat === chat.id
                                    ? "text-violet-700 dark:text-violet-300"
                                    : "text-slate-700 dark:text-slate-300"
                                }`}
                              >
                                {chat.title}
                              </div>
                              <div className="text-xs text-slate-500 dark:text-slate-400">
                                {formatDate(chat.updatedAt)}
                              </div>
                            </>
                          )}
                        </div>

                        <AnimatePresence>
                          {(hoveredChat === chat.id ||
                            activeChat === chat.id ||
                            openDropdown === chat.id) &&
                            !editingChat && (
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
                                      className="h-5 w-5 p-0 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      <MoreHorizontal className="h-3 w-3" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent
                                    align="end"
                                    className="w-32"
                                  >
                                    <DropdownMenuItem
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        startEditing(chat);
                                      }}
                                      className="text-slate-600 focus:text-slate-600 dark:text-slate-400 focus:bg-slate-50 dark:focus:bg-slate-800"
                                    >
                                      <Edit2 className="h-3 w-3 mr-2" />
                                      Rename
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        onDeleteChat(chat.id);
                                        setOpenDropdown(null);
                                        setHoveredChat(null);
                                      }}
                                      className="text-red-600 focus:text-red-600 dark:text-red-400 focus:bg-red-50 dark:focus:bg-red-950/20"
                                    >
                                      <Trash2 className="h-3 w-3 mr-2" />
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
        <div className="p-3 border-t border-slate-200 dark:border-slate-800">
          <div className="text-xs text-slate-500 dark:text-slate-400 text-center">
            AI Tutor v1.0
          </div>
        </div>
      </div>

      {/* Resize Handle */}
      <div
        className="w-1 bg-transparent hover:bg-violet-300 dark:hover:bg-violet-600 cursor-col-resize transition-colors flex items-center justify-center group"
        onMouseDown={() => setIsResizing(true)}
      >
        <div className="w-0.5 h-8 bg-slate-300 dark:bg-slate-600 group-hover:bg-violet-400 dark:group-hover:bg-violet-500 transition-colors rounded-full opacity-0 group-hover:opacity-100" />
      </div>
    </div>
  );
}
