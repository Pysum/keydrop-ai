"use client";

import { Navbar } from "@/components/layout/Navbar";
import { UpgradeButton } from "@/components/ui/UpgradeButton";
import { CheckCircle2, Zap, Shield, MessageSquare, Star } from "lucide-react";
import Link from "next/link";

export default function UpgradePage() {
  return (
    <div className="min-h-screen bg-surface-950">
      <Navbar variant="app" />

      <div className="mx-auto max-w-2xl px-4 pt-24 pb-16 sm:px-6">
        {/* Header */}
        <div className="mb-10 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-1.5 text-sm font-medium text-violet-300">
            <Zap className="h-4 w-4" />
            One-time payment · Lifetime access
          </div>
          <h1 className="text-3xl font-extrabold sm:text-4xl">
            Unlock <span className="gradient-text">Lifetime Access</span>
          </h1>
          <p className="mt-3 text-zinc-400">
            Pay once. Use forever. No subscriptions. No renewals.
          </p>
        </div>

        {/* Pricing card */}
        <div className="card glow-border bg-surface-800 space-y-6">
          <div className="flex items-baseline gap-3">
            <span className="text-5xl font-extrabold">$7</span>
            <div>
              <span className="text-lg text-zinc-500 line-through">$15/mo</span>
              <p className="text-xs text-zinc-500">One-time · Never pay again</p>
            </div>
          </div>

          <ul className="space-y-3">
            {perks.map((perk) => (
              <li key={perk} className="flex items-center gap-3 text-sm text-zinc-300">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-violet-400" />
                {perk}
              </li>
            ))}
          </ul>

          <UpgradeButton />

          <p className="text-center text-xs text-zinc-600">
            Powered by Stripe · Secured checkout · Instant activation
          </p>
        </div>

        {/* FAQ */}
        <div className="mt-8 space-y-4">
          <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">FAQ</h2>
          {faqs.map((f) => (
            <div key={f.q} className="card space-y-1">
              <p className="text-sm font-medium">{f.q}</p>
              <p className="text-xs text-zinc-400">{f.a}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link href="/dashboard" className="btn-ghost text-sm text-zinc-500">
            ← Back to dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}

const perks = [
  "Unlimited chat messages across all documents",
  "OpenAI GPT-4o & GPT-4o Mini",
  "Google Gemini 1.5 Pro & 2.0 Flash",
  "Upload unlimited PDFs, TXTs, and DOCX files",
  "Your API keys stay in your browser — always",
  "All future models and features included",
  "Priority email support",
];

const faqs = [
  {
    q: "Do I need to add a credit card every month?",
    a: "No. You pay $7 once and that's it. No recurring charges, no subscriptions.",
  },
  {
    q: "Why do I still need an API key?",
    a: "Your API key is used to call OpenAI or Google directly. This means you pay only the tiny per-token cost (usually cents per session) with zero markup from us.",
  },
  {
    q: "Is my payment secure?",
    a: "Yes. Payments are processed by Stripe — we never see your card details.",
  },
  {
    q: "What's the refund policy?",
    a: "If you're not satisfied within 7 days, email us for a full refund, no questions asked.",
  },
];
