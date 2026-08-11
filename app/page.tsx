import Link from "next/link";
import { ArrowRight, Zap, Shield, MessageSquare, Upload, CheckCircle2, Star } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-surface-950">
      <Navbar variant="landing" />

      {/* Hero */}
      <section className="relative isolate overflow-hidden pt-24 pb-20 sm:pt-36 sm:pb-28">
        {/* Background glow */}
        <div className="absolute inset-0 -z-10 bg-hero-glow" />
        <div className="absolute -top-40 left-1/2 -z-10 -translate-x-1/2 h-[600px] w-[600px] rounded-full bg-violet-600/10 blur-[120px]" />

        <div className="mx-auto max-w-4xl px-6 text-center">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-1.5 text-xs font-medium text-violet-300">
            <Zap className="h-3 w-3" />
            Use your own API key · Zero markup
          </div>

          {/* Headline */}
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl">
            Stop paying{" "}
            <span className="relative">
              <span className="gradient-text">$15/month</span>
            </span>{" "}
            <br className="hidden sm:block" />
            to chat with your PDFs.
          </h1>

          <p className="mt-6 text-lg leading-8 text-zinc-400 sm:text-xl">
            KeyDrop AI lets you upload any PDF, TXT, or DOCX and have an intelligent conversation with it — using <strong className="text-white">your own OpenAI or Gemini API key</strong>. Pay once, own it forever.
          </p>

          {/* CTA buttons */}
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/register"
              className="btn-primary text-base px-8 py-3.5 shadow-[0_0_30px_rgba(124,58,237,0.4)]"
            >
              Get Started Free
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="#how-it-works" className="btn-secondary text-base px-6 py-3.5">
              See how it works
            </Link>
          </div>

          {/* Social proof */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-xs text-zinc-500">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
              No subscription
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
              Your keys stay private
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
              PDF · TXT · DOCX support
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
              One-time $7 unlock
            </span>
          </div>
        </div>

        {/* Hero UI Preview */}
        <div className="mx-auto mt-16 max-w-3xl px-6">
          <div className="rounded-2xl border border-surface-700 bg-surface-900 shadow-[0_0_60px_rgba(124,58,237,0.15)] overflow-hidden">
            {/* Window bar */}
            <div className="flex items-center gap-2 border-b border-surface-700 bg-surface-900 px-4 py-3">
              <div className="h-3 w-3 rounded-full bg-red-500/60" />
              <div className="h-3 w-3 rounded-full bg-amber-500/60" />
              <div className="h-3 w-3 rounded-full bg-emerald-500/60" />
              <span className="ml-3 text-xs text-zinc-500">research_paper.pdf — KeyDrop AI</span>
            </div>
            {/* Chat preview */}
            <div className="p-6 space-y-4">
              <div className="chat-bubble-user">What are the key findings of this paper?</div>
              <div className="chat-bubble-ai">
                The paper identifies three key findings:
                <br /><br />
                1. <strong className="text-white">Performance gains</strong> of 34% over baseline models when using the proposed architecture...
                <br />
                2. <strong className="text-white">Cost reduction</strong> of 60% through optimized token usage...
                <br />
                3. The methodology is <strong className="text-white">reproducible</strong> across 5 independent datasets.
              </div>
              <div className="flex items-center gap-2 rounded-lg border border-surface-600 bg-surface-800 px-4 py-3">
                <span className="flex-1 text-sm text-zinc-500">Ask another question…</span>
                <div className="h-7 w-7 rounded-md bg-violet-600 flex items-center justify-center">
                  <ArrowRight className="h-3.5 w-3.5 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="how-it-works" className="py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold sm:text-4xl">Everything you need. Nothing you don&apos;t.</h2>
            <p className="mt-4 text-zinc-400">We stripped away the bloat. Just pure document intelligence.</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <FeatureCard key={f.title} {...f} />
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 sm:py-28 border-t border-surface-800">
        <div className="mx-auto max-w-4xl px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold sm:text-4xl">Simple, honest pricing</h2>
            <p className="mt-4 text-zinc-400">One price. Lifetime access. No tricks.</p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            {/* Free plan */}
            <div className="card flex flex-col gap-4">
              <div>
                <p className="text-sm font-medium text-zinc-400">Free</p>
                <p className="mt-1 text-4xl font-extrabold">$0</p>
              </div>
              <ul className="space-y-2 flex-1">
                {["Create an account", "Manage your API keys (stored locally)", "Upload & parse documents", "5 chat messages per session"].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-zinc-400">
                    <CheckCircle2 className="h-4 w-4 text-zinc-600 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/register" className="btn-secondary w-full justify-center">
                Get started
              </Link>
            </div>

            {/* Lifetime plan */}
            <div className="relative card glow-border flex flex-col gap-4 bg-surface-800">
              <div className="absolute -top-3 right-6">
                <span className="rounded-full bg-violet-600 px-3 py-1 text-xs font-semibold text-white shadow-[0_0_15px_rgba(124,58,237,0.5)]">
                  Most Popular
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-violet-400">Lifetime Access</p>
                <div className="mt-1 flex items-baseline gap-2">
                  <p className="text-4xl font-extrabold">$7</p>
                  <p className="text-sm text-zinc-500 line-through">$15/mo</p>
                </div>
                <p className="text-xs text-zinc-500 mt-1">One-time payment · Pay once, use forever</p>
              </div>
              <ul className="space-y-2 flex-1">
                {[
                  "Everything in Free",
                  "Unlimited chat messages",
                  "OpenAI GPT-4o + GPT-4o Mini",
                  "Google Gemini 1.5 Pro + Flash",
                  "Chat history",
                  "Priority support",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-zinc-300">
                    <CheckCircle2 className="h-4 w-4 text-violet-400 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/register" className="btn-primary w-full justify-center shadow-[0_0_20px_rgba(124,58,237,0.4)]">
                Unlock Lifetime Access
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 sm:py-24 border-t border-surface-800">
        <div className="mx-auto max-w-5xl px-6">
          <h2 className="text-center text-2xl font-bold mb-10">What early users are saying</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {testimonials.map((t) => (
              <div key={t.name} className="card flex flex-col gap-3">
                <div className="flex">
                  {Array(5).fill(0).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-zinc-400">&quot;{t.quote}&quot;</p>
                <div className="flex items-center gap-2 mt-auto">
                  <div className="h-7 w-7 rounded-full bg-violet-600/30 flex items-center justify-center text-xs font-bold text-violet-300">
                    {t.name[0]}
                  </div>
                  <div>
                    <p className="text-xs font-medium">{t.name}</p>
                    <p className="text-[10px] text-zinc-500">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 sm:py-28 border-t border-surface-800">
        <div className="mx-auto max-w-2xl px-6 text-center">
          <h2 className="text-3xl font-extrabold sm:text-4xl">
            Ready to stop overpaying?
          </h2>
          <p className="mt-4 text-zinc-400">Join thousands who ditched the subscriptions.</p>
          <Link
            href="/register"
            className="btn-primary mt-8 inline-flex text-base px-10 py-4 shadow-[0_0_40px_rgba(124,58,237,0.5)]"
          >
            Start for Free
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-surface-800 py-8">
        <div className="mx-auto max-w-6xl px-6 flex flex-col items-center gap-2 sm:flex-row sm:justify-between">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <Zap className="h-4 w-4 text-violet-400" />
            KeyDrop AI
          </div>
          <p className="text-xs text-zinc-600">
            © {new Date().getFullYear()} KeyDrop AI. Your API keys never leave your browser.
          </p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, description }: { icon: React.ElementType; title: string; description: string }) {
  return (
    <div className="card flex flex-col gap-4 transition-all duration-200 hover:border-violet-500/30 hover:bg-surface-800">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-600/20">
        <Icon className="h-5 w-5 text-violet-400" />
      </div>
      <div>
        <h3 className="font-semibold">{title}</h3>
        <p className="mt-1 text-sm text-zinc-400">{description}</p>
      </div>
    </div>
  );
}

const features = [
  {
    icon: Upload,
    title: "Drag & Drop Upload",
    description: "Upload PDF, TXT, or DOCX files. Parsed entirely in your browser — no file ever touches our servers.",
  },
  {
    icon: Shield,
    title: "Your Keys, Your Privacy",
    description: "API keys are stored only in your browser's localStorage. We never see them, never store them.",
  },
  {
    icon: MessageSquare,
    title: "Intelligent Conversations",
    description: "Ask questions, get summaries, extract insights — powered directly by OpenAI or Google Gemini.",
  },
  {
    icon: Zap,
    title: "Multiple AI Models",
    description: "Choose GPT-4o, GPT-4o Mini, Gemini 1.5 Pro, Gemini Flash, and more. Switch anytime.",
  },
  {
    icon: CheckCircle2,
    title: "Zero Monthly Fees",
    description: "You only pay your AI provider's tiny per-token cost. No platform markup, no hidden charges.",
  },
  {
    icon: Star,
    title: "Lifetime Access for $7",
    description: "One small payment unlocks unlimited messages, all AI models, and every future feature we ship.",
  },
];

const testimonials = [
  {
    name: "Alex R.",
    role: "PhD Researcher",
    quote: "I was paying $20/month for ChatPDF. KeyDrop gave me the same thing for a one-time $7. It's a no-brainer.",
  },
  {
    name: "Sarah K.",
    role: "Startup Founder",
    quote: "The privacy angle sold me. My API key never leaves my browser. Exactly how it should work.",
  },
  {
    name: "Marcus T.",
    role: "Legal Associate",
    quote: "I analyze contracts all day. Having GPT-4o on my own key through KeyDrop has been a game-changer.",
  },
];
