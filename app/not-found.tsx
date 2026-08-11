import Link from "next/link";
import { Zap } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-surface-950 px-4 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-600/20">
        <Zap className="h-8 w-8 text-violet-400" />
      </div>
      <div>
        <h1 className="text-6xl font-extrabold gradient-text">404</h1>
        <p className="mt-3 text-zinc-400">This page doesn&apos;t exist.</p>
      </div>
      <Link href="/" className="btn-primary">
        Back to home
      </Link>
    </div>
  );
}
