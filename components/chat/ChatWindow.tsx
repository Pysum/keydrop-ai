"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Send, Bot, User, Loader2, AlertTriangle, Zap, Lock } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/cn";
import { streamChatCompletion } from "@/lib/ai";
import type { ChatMessage, AiProvider, AiModel, ParsedDocument } from "@/types";

const FREE_MESSAGE_LIMIT = 5;

interface ChatWindowProps {
  document: ParsedDocument;
  provider: AiProvider;
  model: AiModel;
  apiKey: string;
}

export function ChatWindow({ document, provider, model, apiKey }: ChatWindowProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamError, setStreamError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Count only user messages sent
  const userMessageCount = messages.filter((m) => m.role === "user").length;
  const isLimitReached = userMessageCount >= FREE_MESSAGE_LIMIT;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = useCallback(async () => {
    const trimmed = input.trim();
    if (!trimmed || isStreaming || isLimitReached) return;

    const userMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      role: "user",
      content: trimmed,
      timestamp: new Date(),
    };

    const aiMsg: ChatMessage = {
      id: `msg_${Date.now() + 1}`,
      role: "assistant",
      content: "",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg, aiMsg]);
    setInput("");
    setIsStreaming(true);
    setStreamError(null);

    await streamChatCompletion({
      provider,
      model,
      apiKey,
      documentContent: document.content,
      messages: [...messages, userMsg],
      onChunk: (chunk) => {
        setMessages((prev) =>
          prev.map((m) => (m.id === aiMsg.id ? { ...m, content: m.content + chunk } : m))
        );
      },
      onDone: () => setIsStreaming(false),
      onError: (err) => {
        setStreamError(err.message);
        setIsStreaming(false);
        setMessages((prev) => prev.filter((m) => m.id !== aiMsg.id));
      },
    });
  }, [input, isStreaming, isLimitReached, messages, provider, model, apiKey, document.content]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const messagesLeft = Math.max(0, FREE_MESSAGE_LIMIT - userMessageCount);

  return (
    <div className="flex h-full flex-col">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center gap-3 py-12">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-600/20 border border-violet-500/30">
              <Bot className="h-8 w-8 text-violet-400" />
            </div>
            <div>
              <p className="font-medium text-zinc-200">Ready to answer questions</p>
              <p className="text-sm text-zinc-500 mt-1">
                Ask anything about{" "}
                <span className="text-violet-400">{document.name}</span>
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-2 mt-2">
              {["Summarize this document", "What are the key points?", "What is the main topic?"].map((q) => (
                <button
                  key={q}
                  onClick={() => setInput(q)}
                  className="rounded-full border border-surface-600 bg-surface-800 px-4 py-2.5 text-xs text-zinc-400 transition-all hover:border-violet-500/50 hover:text-violet-300 touch-manipulation min-h-[44px]"
                >
                  {q}
                </button>
              ))}
            </div>
            {/* Free limit notice */}
            <p className="text-[11px] text-zinc-600 mt-1">
              Free plan · {FREE_MESSAGE_LIMIT} messages per session
            </p>
          </div>
        )}

        {messages.map((msg) => (
          <MessageBubble
            key={msg.id}
            message={msg}
            isStreaming={
              isStreaming &&
              msg.role === "assistant" &&
              msg === messages[messages.length - 1]
            }
          />
        ))}

        {streamError && (
          <div className="flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            {streamError}
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Upgrade wall — shown when limit is reached */}
      {isLimitReached ? (
        <div className="border-t border-surface-700 p-4">
          <div className="rounded-xl border border-violet-500/30 bg-violet-500/10 p-4 text-center space-y-3">
            <div className="flex justify-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-600/20 border border-violet-500/30">
                <Lock className="h-5 w-5 text-violet-400" />
              </div>
            </div>
            <div>
              <p className="font-semibold text-white">You&apos;ve used your 5 free messages</p>
              <p className="text-sm text-zinc-400 mt-1">
                Unlimited access is coming soon. Join the waitlist to get notified
                first and lock in the lowest price.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 justify-center">
              <Link href="/upgrade" className="btn-primary justify-center gap-2">
                <Zap className="h-4 w-4" />
                Join the Waitlist
              </Link>
              <Link href="/dashboard" className="btn-secondary justify-center">
                Upload new document
              </Link>
            </div>
            <p className="text-[10px] text-zinc-600">
              Each new document upload resets your 5 free messages.
            </p>
          </div>
        </div>
      ) : (
        /* Normal input */
        <div className="border-t border-surface-700 p-4">
          {/* Message counter — shows when getting close */}
          {userMessageCount >= 3 && (
            <div className="mb-2 flex items-center justify-between rounded-lg border border-amber-500/20 bg-amber-500/5 px-3 py-1.5">
              <p className="text-xs text-amber-400">
                {messagesLeft} free message{messagesLeft !== 1 ? "s" : ""} left
              </p>
              <Link href="/upgrade" className="text-xs text-violet-400 hover:text-violet-300 transition-colors">
                Join waitlist →
              </Link>
            </div>
          )}

          <div className="flex gap-2 items-end">
            <div className="flex-1 relative">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask a question about your document…"
                rows={1}
                disabled={isStreaming}
                className={cn(
                  "input resize-none py-3 pr-12 leading-relaxed",
                  "min-h-[48px] max-h-32 overflow-y-auto"
                )}
                style={{ height: "auto" }}
                onInput={(e) => {
                  const t = e.target as HTMLTextAreaElement;
                  t.style.height = "auto";
                  t.style.height = `${Math.min(t.scrollHeight, 128)}px`;
                }}
              />
            </div>
            <button
              onClick={sendMessage}
              disabled={!input.trim() || isStreaming}
              className="btn-primary h-12 w-12 rounded-xl p-0 shrink-0"
            >
              {isStreaming ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </button>
          </div>
          <p className="mt-2 text-center text-[10px] text-zinc-600">
            Using your {provider === "openai" ? "OpenAI" : "Gemini"} key ·{" "}
            <span className="text-zinc-500">{model}</span> · Shift+Enter for new line
          </p>
        </div>
      )}
    </div>
  );
}

function MessageBubble({ message, isStreaming }: { message: ChatMessage; isStreaming: boolean }) {
  const isUser = message.role === "user";
  return (
    <div className={cn("flex gap-3", isUser && "flex-row-reverse")}>
      <div
        className={cn(
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
          isUser ? "bg-violet-600" : "border border-surface-600 bg-surface-800"
        )}
      >
        {isUser ? (
          <User className="h-4 w-4 text-white" />
        ) : (
          <Bot className="h-4 w-4 text-violet-400" />
        )}
      </div>
      <div className={cn(isUser ? "chat-bubble-user" : "chat-bubble-ai")}>
        {message.content ||
          (isStreaming && (
            <span className="inline-flex gap-1">
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-zinc-400 [animation-delay:-0.3s]" />
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-zinc-400 [animation-delay:-0.15s]" />
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-zinc-400" />
            </span>
          ))}
      </div>
    </div>
  );
}
