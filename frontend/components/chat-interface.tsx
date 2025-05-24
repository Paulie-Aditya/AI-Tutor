"use client";

import type React from "react";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Chat, Message } from "@/types/chat";
import {
  Send,
  User,
  Bot,
  Copy,
  Check,
  Sparkles,
  BookOpen,
  Lightbulb,
} from "lucide-react";
import { chatApi } from "@/utils/api";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { TypingMessage } from "@/components/typing-message";

interface ChatInterfaceProps {
  chat: Chat;
  onAddMessage: (chatId: string, message: Message) => void;
  onUpdateTitle: (chatId: string, firstMessage: string) => void;
}

// Simple math renderer component
const MathRenderer = ({
  children,
  display = false,
}: {
  children: string;
  display?: boolean;
}) => {
  const [rendered, setRendered] = useState<string>("");

  useEffect(() => {
    const mathContent = String(children || "");
    const processedContent = mathContent
      .replace(/\^(\w+|\{[^}]+\})/g, (match, exp) => {
        const cleanExp = exp.replace(/[{}]/g, "");
        return `<sup>${cleanExp}</sup>`;
      })
      .replace(/_(\w+|\{[^}]+\})/g, (match, sub) => {
        const cleanSub = sub.replace(/[{}]/g, "");
        return `<sub>${cleanSub}</sub>`;
      })
      .replace(
        /\\frac\{([^}]+)\}\{([^}]+)\}/g,
        '<span class="fraction"><span class="numerator">$1</span><span class="denominator">$2</span></span>'
      )
      .replace(/\\sqrt\{([^}]+)\}/g, "√($1)")
      .replace(/\\int/g, "∫")
      .replace(/\\sum/g, "∑")
      .replace(/\\prod/g, "∏")
      .replace(/\\lim/g, "lim")
      .replace(/\\infty/g, "∞")
      .replace(/\\alpha/g, "α")
      .replace(/\\beta/g, "β")
      .replace(/\\gamma/g, "γ")
      .replace(/\\delta/g, "δ")
      .replace(/\\epsilon/g, "ε")
      .replace(/\\theta/g, "θ")
      .replace(/\\lambda/g, "λ")
      .replace(/\\mu/g, "μ")
      .replace(/\\pi/g, "π")
      .replace(/\\sigma/g, "σ")
      .replace(/\\phi/g, "φ")
      .replace(/\\omega/g, "ω")
      .replace(/\\leq/g, "≤")
      .replace(/\\geq/g, "≥")
      .replace(/\\neq/g, "≠")
      .replace(/\\approx/g, "≈")
      .replace(/\\pm/g, "±")
      .replace(/\\times/g, "×")
      .replace(/\\div/g, "÷")
      .replace(/\\cdot/g, "·");

    setRendered(processedContent);
  }, [children]);

  if (display) {
    return (
      <div className="my-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700 overflow-x-auto">
        <div
          className="text-center text-lg font-mono"
          dangerouslySetInnerHTML={{ __html: rendered }}
        />
      </div>
    );
  }

  return (
    <span
      className="font-mono mx-1 text-violet-600 dark:text-violet-400"
      dangerouslySetInnerHTML={{ __html: rendered }}
    />
  );
};

export function ChatInterface({
  chat,
  onAddMessage,
  onUpdateTitle,
}: ChatInterfaceProps) {
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const [typingMessage, setTypingMessage] = useState<{
    id: string;
    content: string;
  } | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Function to scroll to bottom
  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const scrollElement = scrollAreaRef.current.querySelector(
        "[data-radix-scroll-area-viewport]"
      );
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight;
      }
    }
  };

  // Auto-scroll to bottom when new messages are added or during typing
  useEffect(() => {
    scrollToBottom();
  }, [chat.messages, typingMessage]);

  // Continuous scroll during typing animation
  useEffect(() => {
    if (typingMessage) {
      const interval = setInterval(scrollToBottom, 100);
      return () => clearInterval(interval);
    }
  }, [typingMessage]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        120
      )}px`;
    }
  }, [input]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    };

    const currentInput = input.trim();
    setInput("");

    // Add user message immediately
    onAddMessage(chat.id, userMessage);

    // Update chat title if this is the first message
    if (chat.messages.length === 0) {
      onUpdateTitle(chat.id, currentInput);
    }

    setIsLoading(true);

    try {
      // Prepare chat history for API
      const chatHistory = [...chat.messages, userMessage].map((msg) => ({
        role: msg.role,
        content: msg.content,
      }));

      const response = await chatApi.sendMessage(chatHistory);
      const responseContent =
        response.message ||
        response.response ||
        "Sorry, I could not process your request.";

      // Start typing animation
      const assistantMessageId = `assistant-${Date.now()}`;
      setTypingMessage({
        id: assistantMessageId,
        content: responseContent,
      });
    } catch (error) {
      console.error("Error sending message:", error);
      const errorContent =
        "Sorry, there was an error processing your request. Please try again.";

      const assistantMessageId = `error-${Date.now()}`;
      setTypingMessage({
        id: assistantMessageId,
        content: errorContent,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTypingComplete = () => {
    if (typingMessage) {
      const assistantMessage: Message = {
        id: typingMessage.id,
        role: "assistant",
        content: typingMessage.content,
        timestamp: new Date(),
      };

      onAddMessage(chat.id, assistantMessage);
      setTypingMessage(null);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const copyToClipboard = async (content: string, messageId: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedMessageId(messageId);
      setTimeout(() => setCopiedMessageId(null), 2000);
    } catch (error) {
      console.error("Failed to copy text:", error);
    }
  };

  const formatTime = (date: Date | string) => {
    const dateObj = date instanceof Date ? date : new Date(date);

    if (isNaN(dateObj.getTime())) {
      return "Unknown";
    }

    return dateObj.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const suggestedPrompts = [
    "Why do objects fall at the same rate regardless of their mass?",
    "How do you calculate the derivative of a function like f(x) = x² + 3x?",
    "What happens when you mix an acid with a base?",
    "What were the main causes of World War I?",
  ];

  // Custom markdown components for better styling
  const markdownComponents = {
    h1: ({ children }: any) => (
      <h1 className="text-xl font-bold mb-3 text-slate-900 dark:text-slate-100">
        {children}
      </h1>
    ),
    h2: ({ children }: any) => (
      <h2 className="text-lg font-bold mb-2 text-slate-900 dark:text-slate-100">
        {children}
      </h2>
    ),
    h3: ({ children }: any) => (
      <h3 className="text-base font-bold mb-2 text-slate-900 dark:text-slate-100">
        {children}
      </h3>
    ),
    p: ({ children }: any) => (
      <p className="mb-3 last:mb-0 leading-relaxed">{children}</p>
    ),
    ul: ({ children }: any) => (
      <ul className="list-disc mb-3 space-y-1 pl-6 [&>li]:leading-relaxed">
        {children}
      </ul>
    ),
    ol: ({ children }: any) => (
      <ol className="list-decimal mb-3 space-y-1 pl-6 [&>li]:leading-relaxed">
        {children}
      </ol>
    ),
    li: ({ children }: any) => (
      <li className="leading-relaxed [&>p]:mb-1 [&>p]:inline">{children}</li>
    ),
    strong: ({ children }: any) => (
      <strong className="font-semibold text-slate-900 dark:text-slate-100">
        {children}
      </strong>
    ),
    em: ({ children }: any) => <em className="italic">{children}</em>,
    code: ({ children, className }: any) => {
      const isInline = !className;
      if (isInline) {
        return (
          <code className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-sm font-mono text-violet-600 dark:text-violet-400">
            {children}
          </code>
        );
      }
      return (
        <pre className="bg-slate-100 dark:bg-slate-800 p-3 rounded-lg overflow-x-auto mb-3">
          <code className="text-sm font-mono text-slate-800 dark:text-slate-200">
            {children}
          </code>
        </pre>
      );
    },
    blockquote: ({ children }: any) => (
      <blockquote className="border-l-4 border-violet-300 dark:border-violet-600 pl-4 py-2 mb-3 bg-violet-50 dark:bg-violet-950/20 rounded-r">
        {children}
      </blockquote>
    ),
    a: ({ children, href }: any) => (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 underline"
      >
        {children}
      </a>
    ),
    table: ({ children }: any) => (
      <div className="overflow-x-auto mb-3">
        <table className="min-w-full border-collapse border border-slate-300 dark:border-slate-600">
          {children}
        </table>
      </div>
    ),
    thead: ({ children }: any) => (
      <thead className="bg-slate-50 dark:bg-slate-800">{children}</thead>
    ),
    tbody: ({ children }: any) => <tbody>{children}</tbody>,
    tr: ({ children }: any) => (
      <tr className="border-b border-slate-200 dark:border-slate-700">
        {children}
      </tr>
    ),
    th: ({ children }: any) => (
      <th className="border border-slate-300 dark:border-slate-600 px-3 py-2 text-left font-semibold">
        {children}
      </th>
    ),
    td: ({ children }: any) => (
      <td className="border border-slate-300 dark:border-slate-600 px-3 py-2">
        {children}
      </td>
    ),
  };

  // Process message content to handle math
  const processMessageContent = (content: string) => {
    const textContent = String(content || "");
    const parts = textContent.split(/(\$\$[^$]+\$\$|\$[^$]+\$)/g);

    return parts.map((part, index) => {
      if (part.startsWith("$$") && part.endsWith("$$")) {
        return (
          <MathRenderer key={index} display>
            {part.slice(2, -2)}
          </MathRenderer>
        );
      } else if (part.startsWith("$") && part.endsWith("$")) {
        return <MathRenderer key={index}>{part.slice(1, -1)}</MathRenderer>;
      } else {
        return (
          <ReactMarkdown
            key={index}
            remarkPlugins={[remarkGfm]}
            components={markdownComponents}
          >
            {part}
          </ReactMarkdown>
        );
      }
    });
  };

  return (
    <div className="flex flex-col h-full">
      {/* Custom CSS for fractions */}
      <style jsx>{`
        .fraction {
          display: inline-flex;
          flex-direction: column;
          align-items: center;
          font-size: 0.9em;
          margin: 0 2px;
          vertical-align: middle;
        }
        .numerator {
          border-bottom: 1px solid currentColor;
          padding-bottom: 1px;
          line-height: 1;
        }
        .denominator {
          padding-top: 1px;
          line-height: 1;
        }
      `}</style>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="max-w-4xl mx-auto space-y-6">
          {chat.messages.length === 0 && !typingMessage ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-12"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="w-16 h-16 bg-gradient-to-r from-violet-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-6"
              >
                <Sparkles className="h-8 w-8 text-white" />
              </motion.div>
              <motion.h3
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2"
              >
                Ready to learn something new?
              </motion.h3>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-slate-600 dark:text-slate-400 mb-8 max-w-md mx-auto"
              >
                Ask me anything! I'm here to help you understand complex topics,
                solve problems, and guide your learning journey.
              </motion.p>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl mx-auto"
              >
                {suggestedPrompts.map((prompt, index) => (
                  <motion.button
                    key={prompt}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    onClick={() => setInput(prompt)}
                    className="p-4 text-left bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:border-violet-300 dark:hover:border-violet-600 hover:shadow-md transition-all duration-200 group"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-violet-100 to-purple-100 dark:from-violet-900 dark:to-purple-900 rounded-lg flex items-center justify-center group-hover:from-violet-200 group-hover:to-purple-200 dark:group-hover:from-violet-800 dark:group-hover:to-purple-800 transition-colors">
                        {index === 0 && (
                          <BookOpen className="h-4 w-4 text-violet-600 dark:text-violet-400" />
                        )}
                        {index === 1 && (
                          <Lightbulb className="h-4 w-4 text-violet-600 dark:text-violet-400" />
                        )}
                        {index === 2 && (
                          <Bot className="h-4 w-4 text-violet-600 dark:text-violet-400" />
                        )}
                        {index === 3 && (
                          <Sparkles className="h-4 w-4 text-violet-600 dark:text-violet-400" />
                        )}
                      </div>
                      <span className="text-sm text-slate-700 dark:text-slate-300 group-hover:text-violet-700 dark:group-hover:text-violet-300 transition-colors">
                        {prompt}
                      </span>
                    </div>
                  </motion.button>
                ))}
              </motion.div>
            </motion.div>
          ) : (
            <AnimatePresence>
              {chat.messages.map((message, index) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`flex gap-4 ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {message.role === "assistant" && (
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-gradient-to-r from-violet-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
                        <Sparkles className="h-5 w-5 text-white" />
                      </div>
                    </div>
                  )}

                  <div
                    className={`group max-w-[75%] ${
                      message.role === "user" ? "order-1" : ""
                    }`}
                  >
                    <motion.div
                      initial={{ scale: 0.95 }}
                      animate={{ scale: 1 }}
                      className={`p-4 rounded-2xl shadow-sm ${
                        message.role === "user"
                          ? "bg-gradient-to-r from-violet-500 to-purple-500 text-white"
                          : "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                      }`}
                    >
                      {message.role === "user" ? (
                        <div className="whitespace-pre-wrap break-words leading-relaxed">
                          {message.content}
                        </div>
                      ) : (
                        <div className="prose prose-sm max-w-none dark:prose-invert prose-violet [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
                          {processMessageContent(message.content)}
                        </div>
                      )}
                    </motion.div>

                    <div
                      className={`flex items-center gap-2 mt-2 text-xs text-slate-500 dark:text-slate-400 ${
                        message.role === "user"
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <span>{formatTime(message.timestamp)}</span>
                      {message.role === "assistant" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-slate-100 dark:hover:bg-slate-700"
                          onClick={() =>
                            copyToClipboard(message.content, message.id)
                          }
                        >
                          {copiedMessageId === message.id ? (
                            <Check className="h-3 w-3 text-green-500" />
                          ) : (
                            <Copy className="h-3 w-3" />
                          )}
                        </Button>
                      )}
                    </div>
                  </div>

                  {message.role === "user" && (
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-gradient-to-r from-slate-600 to-slate-700 rounded-xl flex items-center justify-center shadow-lg">
                        <User className="h-5 w-5 text-white" />
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}

              {/* Typing Message */}
              {typingMessage && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-4 justify-start"
                >
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-gradient-to-r from-violet-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
                      <Sparkles className="h-5 w-5 text-white" />
                    </div>
                  </div>
                  <div className="group max-w-[75%]">
                    <div className="p-4 rounded-2xl shadow-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                      <TypingMessage
                        content={typingMessage.content}
                        onComplete={handleTypingComplete}
                        speed={20}
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          )}

          <AnimatePresence>
            {isLoading && !typingMessage && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex gap-4 justify-start"
              >
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-gradient-to-r from-violet-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
                    <Sparkles className="h-5 w-5 text-white" />
                  </div>
                </div>
                <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 shadow-sm">
                  <div className="flex space-x-2">
                    <motion.div
                      className="w-2 h-2 bg-violet-500 rounded-full"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{
                        duration: 1,
                        repeat: Number.POSITIVE_INFINITY,
                        delay: 0,
                      }}
                    />
                    <motion.div
                      className="w-2 h-2 bg-violet-500 rounded-full"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{
                        duration: 1,
                        repeat: Number.POSITIVE_INFINITY,
                        delay: 0.2,
                      }}
                    />
                    <motion.div
                      className="w-2 h-2 bg-violet-500 rounded-full"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{
                        duration: 1,
                        repeat: Number.POSITIVE_INFINITY,
                        delay: 0.4,
                      }}
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </ScrollArea>

      {/* Input Form */}
      <div className="border-t border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-4">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
          <div className="relative">
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask me anything..."
              className="min-h-[56px] max-h-32 resize-none pr-12 border-slate-200 dark:border-slate-700 focus:border-violet-300 dark:focus:border-violet-600 focus:ring-violet-200 dark:focus:ring-violet-800 rounded-xl bg-white dark:bg-slate-800"
              disabled={isLoading}
            />
            <Button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="absolute right-2 bottom-2 h-10 w-10 p-0 bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 disabled:from-slate-300 disabled:to-slate-400 border-0 shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-2 text-center">
            Press{" "}
            <kbd className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-xs">
              Enter
            </kbd>{" "}
            to send,{" "}
            <kbd className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-xs">
              Shift + Enter
            </kbd>{" "}
            for new line
          </div>
        </form>
      </div>
    </div>
  );
}
