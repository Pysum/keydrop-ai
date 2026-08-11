"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FileText, Settings, MessageSquare, ChevronRight, AlertCircle, Zap, CheckCircle2, X } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { DropZone } from "@/components/upload/DropZone";
import { Badge } from "@/components/ui/Badge";
import { UpgradeButton } from "@/components/ui/UpgradeButton";
import { useDocument } from "@/hooks/useDocument";
import { useApiKeys } from "@/hooks/useApiKeys";
import type { AiProvider, AiModel } from "@/types";
import { OPENAI_MODELS, GEMINI_MODELS } from "@/lib/ai";
import Link from "next/link";

export default function DashboardPage() {
  const { document, isParsing, error, loadFile, clearDocument } = useDocument();
  const { hasKey, keys } = useApiKeys();
  const [provider, setProvider] = useState<AiProvider>("openai");
  const [model, setModel] = useState<AiModel>("gpt-4o-mini");
  const [showSuccessBanner, setShowSuccessBanner] = useState(false);
  const [showCancelBanner, setShowCancelBanner] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const payment = searchParams.get("payment");
    if (payment === "success") {
      setShowSuccessBanner(true);
      router.replace("/dashboard");
    } else if (payment === "cancelled") {
      setShowCancelBanner(true);
      router.replace("/dashboard");
    }
  }, [searchParams, router]);

  const hasAnyKey = hasKey("openai") || hasKey("gemini");
  const models = provider === "openai" ? OPENAI_MODELS : GEMINI_MODELS;

  const handleProviderChange = (p: AiProvider) => {
    setProvider(p);
    setModel((p === "openai" ? OPENAI_MODELS[0] : GEMINI_MODELS[0]).value as AiModel);
  };

  const handleStartChat = () => {
    if (!document || !hasKey(provider)) return;
    // Store document in sessionStorage for the chat page
    sessionStorage.setItem("keydrop_doc", JSON.stringify(document));
    sessionStorage.setItem("keydrop_provider", provider);
    sessionStorage.setItem("keydrop_model", model);
    router.push(`/chat/${document.id}`);
  };

  return (
    <div className="min-h-screen bg-surface-950">
      <Navbar variant="app" />

      <div className="mx-auto max-w-4xl px-4 pt-20 pb-16 sm:px-6">
        {/* Header */}
        <div className="mt-8 mb-10">
          <h1 className="text-2xl font-bold sm:text-3xl">
            Document <span className="gradient-text">Workspace</span>
          </h1>
          <p className="mt-2 text-sm text-zinc-400">
            Upload a document, configure your AI, and start chatting.
          </p>
        </div>

        {/* Payment success banner */}
        {showSuccessBanner && (
          <div className="mb-4 flex items-center gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4">
            <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
            <p className="flex-1 text-sm font-medium text-emerald-300">
              Payment successful! Lifetime access is now active. 🎉
            </p>
            <button onClick={() => setShowSuccessBanner(false)} className="text-zinc-500 hover:text-zinc-300">
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Payment cancelled banner */}
        {showCancelBanner && (
          <div className="mb-4 flex items-center gap-3 rounded-xl border border-zinc-700 bg-surface-800 p-4">
            <AlertCircle className="h-5 w-5 text-zinc-400 shrink-0" />
            <p className="flex-1 text-sm text-zinc-400">Payment cancelled. No charge was made.</p>
            <button onClick={() => setShowCancelBanner(false)} className="text-zinc-500 hover:text-zinc-300">
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* No API key warning */}
        {!hasAnyKey && (
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4">
            <AlertCircle className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-amber-300">No API key configured</p>
              <p className="text-xs text-amber-400/70 mt-0.5">
                Add your OpenAI or Gemini API key in settings to start chatting.
              </p>
            </div>
            <Link href="/settings" className="btn-secondary text-xs px-3 py-1.5 shrink-0">
              <Settings className="h-3.5 w-3.5" />
              Settings
            </Link>
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Upload panel */}
          <div className="lg:col-span-2 space-y-6">
            {/* Step 1: Upload */}
            <div className="card">
              <div className="mb-4 flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-violet-600 text-xs font-bold">1</span>
                <h2 className="font-semibold">Upload Document</h2>
                <Badge variant="violet">PDF · TXT · DOCX</Badge>
              </div>
              <DropZone
                onFileAccepted={loadFile}
                isParsing={isParsing}
                document={document}
                error={error}
                onClear={clearDocument}
              />
            </div>

            {/* Step 2: AI config */}
            <div className="card">
              <div className="mb-4 flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-violet-600 text-xs font-bold">2</span>
                <h2 className="font-semibold">Choose AI Model</h2>
              </div>

              {/* Provider tabs */}
              <div className="mb-4 flex gap-2">
                {(["openai", "gemini"] as AiProvider[]).map((p) => (
                  <button
                    key={p}
                    onClick={() => handleProviderChange(p)}
                    className={`flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition-all ${
                      provider === p
                        ? "border-violet-500 bg-violet-500/20 text-violet-300"
                        : "border-surface-600 bg-surface-800 text-zinc-400 hover:border-violet-500/40 hover:text-zinc-200"
                    }`}
                  >
                    {p === "openai" ? "🤖" : "✨"}
                    {p === "openai" ? "OpenAI" : "Google Gemini"}
                    {hasKey(p) ? (
                      <Badge variant="success">Key set</Badge>
                    ) : (
                      <Badge variant="warning">No key</Badge>
                    )}
                  </button>
                ))}
              </div>

              {/* Model select */}
              <select
                value={model}
                onChange={(e) => setModel(e.target.value as AiModel)}
                className="input"
              >
                {models.map((m) => (
                  <option key={m.value} value={m.value}>
                    {m.label}
                  </option>
                ))}
              </select>

              {!hasKey(provider) && (
                <p className="mt-2 text-xs text-amber-400">
                  ⚠ No {provider === "openai" ? "OpenAI" : "Gemini"} key set.{" "}
                  <Link href="/settings" className="underline hover:text-amber-300">Add it in Settings.</Link>
                </p>
              )}
            </div>

            {/* Step 3: Start */}
            <button
              onClick={handleStartChat}
              disabled={!document || !hasKey(provider)}
              className="btn-primary w-full justify-center py-3.5 text-base disabled:opacity-40"
            >
              <MessageSquare className="h-5 w-5" />
              Start Chatting
              <ChevronRight className="h-4 w-4 ml-auto" />
            </button>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Quick stats */}
            <div className="card space-y-3">
              <h3 className="text-sm font-semibold text-zinc-300">Status</h3>
              <div className="space-y-2">
                <StatusRow label="Document" value={document ? document.name : "None"} active={!!document} />
                <StatusRow label="OpenAI key" value={hasKey("openai") ? "Configured ✓" : "Not set"} active={hasKey("openai")} />
                <StatusRow label="Gemini key" value={hasKey("gemini") ? "Configured ✓" : "Not set"} active={hasKey("gemini")} />
                <StatusRow label="Provider" value={`${provider === "openai" ? "OpenAI" : "Gemini"} · ${model}`} active />
              </div>
            </div>

            {/* Tips */}
            <div className="card space-y-3">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-violet-400" />
                <h3 className="text-sm font-semibold text-zinc-300">Tips</h3>
              </div>
              <ul className="space-y-2 text-xs text-zinc-500">
                <li>• Use <strong className="text-zinc-400">GPT-4o Mini</strong> or <strong className="text-zinc-400">Gemini Flash</strong> for the best cost/quality ratio</li>
                <li>• Documents are parsed client-side — they never leave your device</li>
                <li>• Your API keys are stored only in your browser</li>
              </ul>
            </div>

            <Link href="/settings" className="btn-secondary w-full justify-center text-sm">
              <Settings className="h-4 w-4" />
              Manage API Keys
            </Link>

            {/* Upgrade card */}
            <div className="card glow-border bg-surface-800 space-y-3">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-violet-400" />
                <span className="text-sm font-semibold">Upgrade</span>
                <span className="ml-auto text-xs font-bold text-violet-300">$7</span>
              </div>
              <p className="text-xs text-zinc-400">Unlock unlimited messages & all AI models forever.</p>
              <Link href="/upgrade" className="btn-primary w-full justify-center text-xs py-2">
                <Zap className="h-3.5 w-3.5" />
                Unlock Lifetime Access
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatusRow({ label, value, active }: { label: string; value: string; active: boolean }) {
  return (
    <div className="flex items-start justify-between gap-2">
      <span className="text-xs text-zinc-500 shrink-0">{label}</span>
      <span className={`text-right text-xs font-medium truncate max-w-[140px] ${active ? "text-zinc-300" : "text-zinc-600"}`}>
        {value}
      </span>
    </div>
  );
}
