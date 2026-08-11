"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, FileText, ChevronDown, Settings } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { ChatWindow } from "@/components/chat/ChatWindow";
import { useApiKeys } from "@/hooks/useApiKeys";
import { Badge } from "@/components/ui/Badge";
import { Spinner } from "@/components/ui/Spinner";
import type { ParsedDocument, AiProvider, AiModel } from "@/types";
import { OPENAI_MODELS, GEMINI_MODELS } from "@/lib/ai";
import Link from "next/link";

export default function ChatPage() {
  const params = useParams();
  const router = useRouter();
  const { getKey, hasKey } = useApiKeys();

  const [document, setDocument] = useState<ParsedDocument | null>(null);
  const [provider, setProvider] = useState<AiProvider>("openai");
  const [model, setModel] = useState<AiModel>("gpt-4o-mini");
  const [isLoaded, setIsLoaded] = useState(false);
  const [showModelPicker, setShowModelPicker] = useState(false);

  useEffect(() => {
    try {
      const docJson = sessionStorage.getItem("keydrop_doc");
      const prov = sessionStorage.getItem("keydrop_provider") as AiProvider | null;
      const mod = sessionStorage.getItem("keydrop_model") as AiModel | null;

      if (!docJson) {
        router.replace("/dashboard");
        return;
      }

      const doc = JSON.parse(docJson) as ParsedDocument;
      // Validate the ID matches
      if (doc.id !== params.id) {
        router.replace("/dashboard");
        return;
      }

      setDocument(doc);
      if (prov) setProvider(prov);
      if (mod) setModel(mod);
    } catch {
      router.replace("/dashboard");
    } finally {
      setIsLoaded(true);
    }
  }, [params.id, router]);

  if (!isLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface-950">
        <Spinner size="lg" className="text-violet-400" />
      </div>
    );
  }

  if (!document) return null;

  const apiKey = getKey(provider);
  const models = provider === "openai" ? OPENAI_MODELS : GEMINI_MODELS;
  const modelLabel = models.find((m) => m.value === model)?.label ?? model;

  return (
    <div className="flex h-screen flex-col bg-surface-950">
      {/* Top bar */}
      <header className="flex shrink-0 items-center gap-3 border-b border-surface-800 bg-surface-900/90 px-4 py-3 backdrop-blur-md">
        <Link href="/dashboard" className="btn-ghost p-2 rounded-lg">
          <ArrowLeft className="h-4 w-4" />
        </Link>

        {/* Document info */}
        <div className="flex items-center gap-2 min-w-0">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-violet-600/20">
            <FileText className="h-4 w-4 text-violet-400" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium leading-tight">{document.name}</p>
            <p className="text-[10px] text-zinc-500">
              {document.content.length.toLocaleString()} characters
            </p>
          </div>
        </div>

        <div className="ml-auto flex items-center gap-2">
          {/* Model selector */}
          <div className="relative">
            <button
              onClick={() => setShowModelPicker(!showModelPicker)}
              className="btn-ghost gap-1 text-xs"
            >
              <span className="hidden sm:inline">{provider === "openai" ? "🤖" : "✨"}</span>
              {modelLabel}
              <ChevronDown className="h-3 w-3" />
            </button>

            {showModelPicker && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowModelPicker(false)} />
                <div className="absolute right-0 top-full z-20 mt-2 w-64 rounded-xl border border-surface-600 bg-surface-800 p-2 shadow-2xl">
                  <p className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">OpenAI</p>
                  {OPENAI_MODELS.map((m) => (
                    <button
                      key={m.value}
                      onClick={() => { setProvider("openai"); setModel(m.value as AiModel); setShowModelPicker(false); }}
                      className={`w-full rounded-lg px-3 py-2 text-left text-xs transition-colors flex items-center justify-between ${
                        provider === "openai" && model === m.value
                          ? "bg-violet-600/20 text-violet-300"
                          : "text-zinc-300 hover:bg-surface-700"
                      }`}
                    >
                      {m.label}
                      {!hasKey("openai") && <Badge variant="warning">No key</Badge>}
                    </button>
                  ))}
                  <p className="mt-2 px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">Google Gemini</p>
                  {GEMINI_MODELS.map((m) => (
                    <button
                      key={m.value}
                      onClick={() => { setProvider("gemini"); setModel(m.value as AiModel); setShowModelPicker(false); }}
                      className={`w-full rounded-lg px-3 py-2 text-left text-xs transition-colors flex items-center justify-between ${
                        provider === "gemini" && model === m.value
                          ? "bg-violet-600/20 text-violet-300"
                          : "text-zinc-300 hover:bg-surface-700"
                      }`}
                    >
                      {m.label}
                      {!hasKey("gemini") && <Badge variant="warning">No key</Badge>}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {!apiKey && (
            <Link href="/settings" className="btn-secondary text-xs gap-1 px-3 py-1.5">
              <Settings className="h-3 w-3" />
              Add Key
            </Link>
          )}
        </div>
      </header>

      {/* Chat area */}
      <div className="flex-1 overflow-hidden">
        {apiKey ? (
          <ChatWindow
            document={document}
            provider={provider}
            model={model}
            apiKey={apiKey}
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-4 p-8 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-amber-500/30 bg-amber-500/10">
              <Settings className="h-8 w-8 text-amber-400" />
            </div>
            <div>
              <p className="font-semibold text-zinc-200">
                No {provider === "openai" ? "OpenAI" : "Gemini"} API key found
              </p>
              <p className="mt-2 text-sm text-zinc-500 max-w-xs">
                Add your API key in settings to start chatting. Keys are stored only in your browser.
              </p>
            </div>
            <Link href="/settings" className="btn-primary">
              <Settings className="h-4 w-4" />
              Open Settings
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
