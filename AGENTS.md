# KeyDrop AI — Dev Notes

## Commands
- `npm run dev`   — Start local dev server (port 3000)
- `npm run build` — Production build (must pass before deploying)
- `npm run lint`  — ESLint check

## Environment Variables
Copy `.env.local.example` → `.env.local` and fill in:
- `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` — from your Supabase project settings
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` / `STRIPE_SECRET_KEY` / `STRIPE_WEBHOOK_SECRET` — from Stripe dashboard
- `STRIPE_PRICE_ID` — create a one-time price in Stripe for $7
- `NEXT_PUBLIC_APP_URL` — `https://usekeydrop.com` (production domain)

## Architecture Decisions
- **API keys**: Stored ONLY in browser `localStorage` — never transmitted to server
- **Document parsing**: PDF (pdfjs-dist v6), DOCX (mammoth), TXT (FileReader) — all client-side
- **AI calls**: Go browser → OpenAI / Google Gemini directly using the user's key
- **Auth**: Supabase SSR cookies-based session
- **Payment**: Stripe one-time checkout → webhook marks `user_metadata.is_paid = true` in Supabase

## Supabase Setup
1. Create project at supabase.com
2. Enable Email auth in Authentication → Providers
3. Grab URL + anon key from Settings → API

## Stripe Setup
1. Create product: "KeyDrop AI Lifetime Access", price $7, one-time
2. Copy Price ID → `STRIPE_PRICE_ID`
3. Set webhook endpoint to `https://<your-domain>/api/stripe/webhook`
4. Events to listen for: `checkout.session.completed`

## PDF Worker
`public/pdf.worker.min.js` is copied from `node_modules/pdfjs-dist/build/pdf.worker.min.mjs`.
Re-run the copy command if pdfjs-dist is updated:
```
Copy-Item node_modules/pdfjs-dist/build/pdf.worker.min.mjs public/pdf.worker.min.js
```

## Deployment (Vercel)
1. Push to GitHub
2. Import repo in Vercel
3. Add all env vars in Vercel project settings
4. Deploy — it will auto-detect Next.js
