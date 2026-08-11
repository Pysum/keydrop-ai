"use client";

import { useState } from "react";
import { Zap } from "lucide-react";
import { Spinner } from "./Spinner";

interface UpgradeButtonProps {
  className?: string;
  label?: string;
}

export function UpgradeButton({ className, label = "Unlock Lifetime Access — $7" }: UpgradeButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpgrade = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/stripe/checkout", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to start checkout");
      if (data.url) window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <button
        onClick={handleUpgrade}
        disabled={loading}
        className={`btn-primary shadow-[0_0_25px_rgba(124,58,237,0.4)] ${className ?? "w-full justify-center py-3"}`}
      >
        {loading ? <Spinner size="sm" /> : <Zap className="h-4 w-4" />}
        {loading ? "Redirecting to checkout…" : label}
      </button>
      {error && <p className="text-center text-xs text-red-400">{error}</p>}
    </div>
  );
}
