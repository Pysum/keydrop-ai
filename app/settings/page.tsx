"use client";

import { useState } from "react";
import { Eye, EyeOff, Save, Trash2, Key, Shield, CheckCircle2, ExternalLink, Zap, Lock } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { useApiKeys } from "@/hooks/useApiKeys";
import { Badge } from "@/components/ui/Badge";
import { Spinner } from "@/components/ui/Spinner";
import type { AiProvider } from "@/types";
import Link from "next/link";

export default function SettingsPage() {
  const { keys, saveKey, removeKey, hasKey, isLoaded } = useApiKeys();

  const [openaiDraft, setOpenaiDraft] = useState("");
  const [geminiDraft, setGeminiDraft] = useState("");
  const [showOpenai, setShowOpenai] = useState(false);
  const [showGemini, setShowGemini] = useState(false);
  const [saved, setSaved] = useState<Record<AiProvider, boolean>>({ openai: false, gemini: false });
  const [saving, setSaving] = useState<Record<AiProvider, boolean>>({ openai: false, gemini: false });

  const handleSave = async (provider: AiProvider) => {
    const draft = provider === "openai" ? openaiDraft : geminiDraft;
    if (!draft.trim()) return;
    setSaving((s) => ({ ...s, [provider]: true }));
    await new Promise((r) => setTimeout(r, 400)); // tiny delay for UX
    saveKey(provider, draft.trim());
    if (provider === "openai") setOpenaiDraft("");
    else setGeminiDraft("");
    setSaving((s) => ({ ...s, [provider]: false }));
    setSaved((s) => ({ ...s, [provider]: true }));
    setTimeout(() => setSaved((s) => ({ ...s, [provider]: false })), 2500);
  };

  const handleRemove = (provider: AiProvider) => {
    removeKey(provider);
    if (provider === "openai") setOpenaiDraft("");
    else setGeminiDraft("");
  };

  const maskKey = (key: string) =>
    key.length > 8 ? `${key.slice(0, 6)}${"•".repeat(Math.min(24, key.length - 8))}${key.slice(-4)}` : "••••••••";

  if (!isLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface-950">
        <Spinner size="lg" className="text-violet-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-950">
      <Navbar variant="app" />

      <div className="mx-auto max-w-2xl px-4 pt-20 pb-16 sm:px-6">
        <div className="mt-8 mb-10">
          <h1 className="text-2xl font-bold sm:text-3xl">
            API Key <span className="gradient-text">Settings</span>
          </h1>
          <p className="mt-2 text-sm text-zinc-400">
            Your keys are stored <strong className="text-white">only in your browser</strong> and never sent to our servers.
          </p>
        </div>

        {/* Privacy notice */}
        <div className="mb-6 rounded-xl border border-violet-500/20 bg-violet-500/10 overflow-hidden">
          <div className="flex items-start gap-3 p-4">
            <Shield className="h-5 w-5 text-violet-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-violet-300">End-to-end privacy guarantee</p>
              <p className="text-xs text-violet-400/70 mt-1">
                API keys are saved to <code className="rounded bg-surface-800 px-1 text-violet-300">localStorage</code> exclusively.
                They are used only to make direct API calls from your browser to OpenAI or Google — we never intercept or log them.
              </p>
            </div>
          </div>
          {/* Privacy Proof code block */}
          <div className="mx-4 mb-4 rounded-lg border border-zinc-700/50 bg-zinc-950 overflow-hidden">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-zinc-900 border-b border-zinc-700/50">
              <Lock className="h-3 w-3 text-emerald-400 shrink-0" />
              <span className="text-[10px] font-semibold text-zinc-400 tracking-wide uppercase">Privacy Proof</span>
              <div className="ml-auto flex gap-1">
                <span className="h-2 w-2 rounded-full bg-zinc-700" />
                <span className="h-2 w-2 rounded-full bg-zinc-700" />
                <span className="h-2 w-2 rounded-full bg-zinc-700" />
              </div>
            </div>
            <pre className="px-3 py-2.5 text-[11px] leading-5 font-mono overflow-x-auto">
              <div className="text-emerald-300">{"localStorage.setItem('kd_openai_key', userKey);"}</div>
              <div className="text-zinc-500 italic">{"// Handled 100% in your browser."}</div>
              <div className="text-zinc-500 italic">{"// Zero backend server storage. Zero interception."}</div>
              <div className="text-emerald-300">{"// Your browser → OpenAI/Gemini directly. ✓"}</div>
            </pre>
          </div>
        </div>

        <div className="space-y-6">
          {/* OpenAI */}
          <ApiKeyCard
            provider="openai"
            title="OpenAI API Key"
            description="Powers GPT-4o, GPT-4o Mini, and GPT-3.5 Turbo models."
            placeholder="sk-proj-..."
            docsUrl="https://platform.openai.com/api-keys"
            draft={openaiDraft}
            setDraft={setOpenaiDraft}
            showKey={showOpenai}
            setShowKey={setShowOpenai}
            currentKey={keys.openai}
            hasKey={hasKey("openai")}
            saving={saving.openai}
            saved={saved.openai}
            maskKey={maskKey}
            onSave={() => handleSave("openai")}
            onRemove={() => handleRemove("openai")}
          />

          {/* Gemini */}
          <ApiKeyCard
            provider="gemini"
            title="Google Gemini API Key"
            description="Powers Gemini 1.5 Pro, Gemini Flash, and Gemini 2.0 models."
            placeholder="AIza..."
            docsUrl="https://aistudio.google.com/app/apikey"
            draft={geminiDraft}
            setDraft={setGeminiDraft}
            showKey={showGemini}
            setShowKey={setShowGemini}
            currentKey={keys.gemini}
            hasKey={hasKey("gemini")}
            saving={saving.gemini}
            saved={saved.gemini}
            maskKey={maskKey}
            onSave={() => handleSave("gemini")}
            onRemove={() => handleRemove("gemini")}
          />
        </div>

        {/* Cost info */}
        <div className="mt-8 card border-surface-700 space-y-3">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-violet-400" />
            <h3 className="text-sm font-semibold">Understanding API costs</h3>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 text-xs text-zinc-400">
            {costRows.map((r) => (
              <div key={r.model} className="flex justify-between rounded-lg bg-surface-800 px-3 py-2">
                <span className="font-medium text-zinc-300">{r.model}</span>
                <span>{r.cost}</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-zinc-600">
            For a typical 10-page PDF with 10 questions, you&apos;ll spend roughly $0.01–$0.05.
          </p>
        </div>

        <div className="mt-6 text-center">
          <Link href="/dashboard" className="btn-secondary text-sm">
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}

interface ApiKeyCardProps {
  provider: AiProvider;
  title: string;
  description: string;
  placeholder: string;
  docsUrl: string;
  draft: string;
  setDraft: (v: string) => void;
  showKey: boolean;
  setShowKey: (v: boolean) => void;
  currentKey?: string;
  hasKey: boolean;
  saving: boolean;
  saved: boolean;
  maskKey: (k: string) => string;
  onSave: () => void;
  onRemove: () => void;
}

const apiKeyGuide: Record<string, { accountUrl: string; dashUrl: string; dashLabel: string; keyPrefix: string }> = {
  openai: {
    accountUrl: "https://platform.openai.com/signup",
    dashUrl: "https://platform.openai.com/api-keys",
    dashLabel: "platform.openai.com/api-keys",
    keyPrefix: "sk-proj-...",
  },
  gemini: {
    accountUrl: "https://accounts.google.com/signup",
    dashUrl: "https://aistudio.google.com/app/apikey",
    dashLabel: "aistudio.google.com/app/apikey",
    keyPrefix: "AIza...",
  },
};

function ApiKeyCard({
  provider, title, description, placeholder, docsUrl,
  draft, setDraft, showKey, setShowKey,
  currentKey, hasKey, saving, saved,
  maskKey, onSave, onRemove,
}: ApiKeyCardProps) {
  const [guideOpen, setGuideOpen] = useState(false);
  const guide = apiKeyGuide[provider];

  return (
    <div className="card space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <Key className="h-4 w-4 text-violet-400 shrink-0" />
          <div>
            <h2 className="font-semibold">{title}</h2>
            <p className="text-xs text-zinc-500 mt-0.5">{description}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {hasKey ? <Badge variant="success">Active</Badge> : <Badge variant="warning">Not set</Badge>}
          <a
            href={docsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-600 hover:text-violet-400 transition-colors"
          >
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>

      {/* Current key display */}
      {hasKey && currentKey && (
        <div className="flex items-center justify-between rounded-lg border border-surface-600 bg-surface-800 px-4 py-2.5">
          <code className="text-xs font-mono text-zinc-300 truncate">
            {showKey ? currentKey : maskKey(currentKey)}
          </code>
          <div className="flex items-center gap-2 ml-3 shrink-0">
            <button
              onClick={() => setShowKey(!showKey)}
              className="text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
            <button
              onClick={onRemove}
              className="text-zinc-500 hover:text-red-400 transition-colors"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Input to set/update key */}
      <div className="flex gap-2">
        <input
          type={showKey ? "text" : "password"}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder={hasKey ? "Paste new key to replace…" : placeholder}
          className="input flex-1"
          onKeyDown={(e) => e.key === "Enter" && draft.trim() && onSave()}
        />
        <button
          onClick={onSave}
          disabled={!draft.trim() || saving}
          className="btn-primary shrink-0"
        >
          {saving ? (
            <Spinner size="sm" />
          ) : saved ? (
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          {saved ? "Saved!" : "Save"}
        </button>
      </div>

      {/* Beginner accordion */}
      <div className="rounded-xl border border-surface-600 overflow-hidden">
        <button
          onClick={() => setGuideOpen((o) => !o)}
          className="w-full flex items-center justify-between gap-2 px-4 py-3 text-left text-sm font-medium text-zinc-300 hover:text-white hover:bg-surface-800/60 transition-colors"
        >
          <span>🔑 New to API keys? Get yours in 60 seconds</span>
          <span
            className="text-zinc-500 transition-transform duration-300 shrink-0"
            style={{ transform: guideOpen ? "rotate(180deg)" : "rotate(0deg)" }}
          >
            ▾
          </span>
        </button>

        <div
          className="transition-all duration-300 ease-in-out overflow-hidden"
          style={{ maxHeight: guideOpen ? "420px" : "0px" }}
        >
          <div className="px-4 pb-4 pt-1 space-y-4 border-t border-surface-700">
            {/* Step 1 */}
            <div className="flex gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-violet-600 text-xs font-bold text-white">1</span>
              <div>
                <p className="text-sm font-medium text-zinc-200">Create a free account</p>
                <p className="text-xs text-zinc-500 mt-0.5">
                  Sign up at{" "}
                  <a
                    href={guide.accountUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-violet-400 hover:text-violet-300 underline underline-offset-2 transition-colors"
                  >
                    {provider === "openai" ? "platform.openai.com" : "accounts.google.com"}
                  </a>
                  {" "}— it&apos;s free and takes under a minute.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-violet-600 text-xs font-bold text-white">2</span>
              <div>
                <p className="text-sm font-medium text-zinc-200">
                  Generate a key{provider === "openai" ? " & add $2–$5 balance" : ""}
                </p>
                <p className="text-xs text-zinc-500 mt-0.5">
                  Go to your{" "}
                  <a
                    href={guide.dashUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-violet-400 hover:text-violet-300 underline underline-offset-2 transition-colors"
                  >
                    API dashboard →
                  </a>
                  {provider === "openai"
                    ? ' click "Create new secret key", then add $2–$5 of credit. That lasts most people months.'
                    : ' and click "Create API key". Gemini has a free tier — no billing needed to start.'}
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-violet-600 text-xs font-bold text-white">3</span>
              <div>
                <p className="text-sm font-medium text-zinc-200">Paste it above — you&apos;re done</p>
                <p className="text-xs text-zinc-500 mt-0.5">
                  Copy your key (starts with <code className="rounded bg-surface-800 px-1 text-violet-300">{guide.keyPrefix}</code>), paste it in the box above, and hit Save.
                  Your key never leaves your browser.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const costRows = [
  { model: "GPT-4o Mini", cost: "~$0.15 / 1M tokens" },
  { model: "GPT-4o", cost: "~$2.50 / 1M tokens" },
  { model: "Gemini 1.5 Flash", cost: "~$0.075 / 1M tokens" },
  { model: "Gemini 1.5 Pro", cost: "~$1.25 / 1M tokens" },
];
