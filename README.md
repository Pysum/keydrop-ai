# KeyDrop AI

> **Stop paying $15/month to chat with your PDFs.**

KeyDrop AI lets users upload PDF, TXT, or DOCX files and have intelligent AI conversations about them — using **their own OpenAI or Gemini API key**. One-time $7 lifetime unlock, no subscriptions.

---

## Tech Stack

| Layer | Choice |
|---|---|
| Frontend | Next.js 14 (App Router) + Tailwind CSS |
| Auth | Supabase (free tier) |
| Payments | Stripe (one-time checkout) |
| AI | OpenAI API + Google Gemini API |
| PDF Parsing | pdfjs-dist (client-side) |
| DOCX Parsing | mammoth (client-side) |
| Hosting | Vercel (free tier) |

## Quick Start

```bash
# 1. Clone & install
npm install

# 2. Set up environment variables
cp .env.local.example .env.local
# Edit .env.local with your Supabase + Stripe credentials

# 3. Run dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon/public key |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key |
| `STRIPE_SECRET_KEY` | Stripe secret key |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret |
| `STRIPE_PRICE_ID` | Stripe one-time price ID ($7) |
| `NEXT_PUBLIC_APP_URL` | App URL (e.g. `https://your-app.vercel.app`) |

## Privacy Model

- User API keys → stored **only** in `localStorage`, never sent to our backend
- Documents → parsed **client-side**, never uploaded to our servers
- AI calls → go **browser → OpenAI/Gemini** directly

## Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

1. Push to GitHub
2. Import in Vercel
3. Add all environment variables
4. Deploy

## Pages

| Route | Description |
|---|---|
| `/` | Landing page |
| `/register` | Sign up |
| `/login` | Sign in |
| `/dashboard` | Upload documents, pick AI model |
| `/chat/[id]` | Chat with a document |
| `/settings` | Manage API keys (localStorage) |
| `/upgrade` | Stripe payment page |
| `/api/stripe/checkout` | Creates Stripe checkout session |
| `/api/stripe/webhook` | Handles Stripe events |
| `/api/auth/callback` | Supabase OAuth callback |

---

Built with [Next.js](https://nextjs.org) · [Supabase](https://supabase.com) · [Stripe](https://stripe.com)
