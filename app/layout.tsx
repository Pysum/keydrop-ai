import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

export const metadata: Metadata = {
  title: "KeyDrop AI – Chat with your PDFs for free",
  description:
    "Stop paying $15/month to chat with your PDFs. Use your own OpenAI or Gemini API key — one-time $7 lifetime access.",
  keywords: ["PDF chat", "AI document", "ChatPDF alternative", "OpenAI", "Gemini"],
  openGraph: {
    title: "KeyDrop AI",
    description: "Stop paying $15/month to chat with your PDFs.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-surface-950 text-white antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
