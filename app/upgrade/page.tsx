"use client";

import { useState } from "react";
import Link from "next/link";
import { Zap, Bell, CheckCircle2, ArrowLeft, Star, Shield, MessageSquare, AlertTriangle, Loader2 } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { createClient, isSupabaseConfigured } from "@/lib/supabase";

export default function UpgradePage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (!isSupabaseConfigured) {
        throw new Error("Service not configured. Please try again later.");
      }

      const supabase = createClient();
      const { error: dbError } = await supabase
        .from("waitlist")
        .insert({ email: email.trim().toLowerCase() });

      if (dbError) {
        // Duplicate email — treat as success so we don't leak info
        if (dbError.code === "23505") {
          setSubmitted(true);
          return;
        }
        throw new Error(dbError.message);
      }

      setSubmitted(true);
    } catch (err: unknown) {
      console.error("Waitlist error:", err);
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface-950">
      <Navbar />

      <main className="flex min-h-screen flex-col items-center justify-center px-4 pt-14">
        <div className="w-full max-w-lg text-center">

          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-1.5 text-xs font-medium text-violet-300">
            <Zap className="h-3 w-3" />
            Coming Soon
          </div>

          {/* Headline */}
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Lifetime Access,{" "}
            <span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
              One-Time Price
            </span>
          </h1>
          <p className="mt-4 text-zinc-400 text-base">
            Pay once, use forever. No subscriptions, no recurring fees.
            We&apos;re finalising the pricing — join the waitlist to get notified
            first and lock in the <strong className="text-white">lowest early-bird price</strong>.
          </p>

          {/* What's included */}
          <div className="mt-8 grid grid-cols-1 gap-3 text-left sm:grid-cols-3">
            {[
              { icon: MessageSquare, label: "Unlimited chats", desc: "No message limits ever" },
              { icon: Shield, label: "Your keys, your data", desc: "Nothing stored on our servers" },
              { icon: Star, label: "All future features", desc: "Every update, included free" },
            ].map(({ icon: Icon, label, desc }) => (
              <div key={label} className="rounded-xl border border-surface-700 bg-surface-800/50 p-4">
                <Icon className="mb-2 h-5 w-5 text-violet-400" />
                <p className="text-sm font-semibold text-white">{label}</p>
                <p className="mt-0.5 text-xs text-zinc-500">{desc}</p>
              </div>
            ))}
          </div>

          {/* Waitlist form */}
          <div className="mt-8 rounded-2xl border border-surface-700 bg-surface-900 p-6">
            {submitted ? (
              <div className="flex flex-col items-center gap-3 py-4">
                <CheckCircle2 className="h-12 w-12 text-emerald-400" />
                <h2 className="text-lg font-semibold">You&apos;re on the list!</h2>
                <p className="text-sm text-zinc-400">
                  We&apos;ll email{" "}
                  <strong className="text-white">{email}</strong>{" "}
                  the moment lifetime access goes live — with a special early-bird discount.
                </p>
                <Link href="/dashboard" className="btn-primary mt-2">
                  Back to Dashboard
                </Link>
              </div>
            ) : (
              <>
                <div className="mb-4 flex items-center gap-2 text-sm font-medium">
                  <Bell className="h-4 w-4 text-violet-400" />
                  <span>Get notified when it launches</span>
                </div>

                {error && (
                  <div className="mb-3 flex items-start gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                    <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    disabled={loading}
                    className="input flex-1"
                  />
                  <button type="submit" disabled={loading} className="btn-primary shrink-0 gap-2">
                    {loading ? (
                      <><Loader2 className="h-4 w-4 animate-spin" /> Saving…</>
                    ) : (
                      "Notify me"
                    )}
                  </button>
                </form>
                <p className="mt-3 text-xs text-zinc-600">
                  No spam. One email when we launch. Unsubscribe any time.
                </p>
              </>
            )}
          </div>

          <Link href="/dashboard" className="mt-6 inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-300 transition-colors">
            <ArrowLeft className="h-3 w-3" />
            Back to Dashboard
          </Link>
        </div>
      </main>
    </div>
  );
}
