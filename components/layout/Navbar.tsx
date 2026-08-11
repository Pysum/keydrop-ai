"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Zap, Settings, LayoutDashboard, LogOut, ChevronDown } from "lucide-react";
import { createClient, isSupabaseConfigured } from "@/lib/supabase";
import { cn } from "@/lib/cn";

interface NavbarProps {
  variant?: "landing" | "app";
}

export function Navbar({ variant = "app" }: NavbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<{ email?: string; id?: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking anywhere outside the dropdown container
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user ?? null);
      setLoading(false);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    if (!isSupabaseConfigured) return;
    const supabase = createClient();
    await supabase.auth.signOut();
    setUser(null);
    setMenuOpen(false);
    router.push("/");
    router.refresh();
  };

  const initials = user?.email ? user.email.slice(0, 2).toUpperCase() : "?";
  const isActivePath = (path: string) => pathname?.startsWith(path);

  return (
    <nav
      className={cn(
        "fixed top-0 z-50 w-full border-b border-surface-800 backdrop-blur-md",
        variant === "landing" ? "bg-surface-950/80" : "bg-surface-900/90"
      )}
    >
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <Link href={user ? "/dashboard" : "/"} className="flex items-center gap-2 group">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-600 shadow-[0_0_12px_rgba(124,58,237,0.5)] transition-all group-hover:shadow-[0_0_20px_rgba(124,58,237,0.7)]">
            <Zap className="h-4 w-4 text-white" />
          </div>
          <span className="font-bold tracking-tight">
            KeyDrop<span className="text-violet-400"> AI</span>
          </span>
        </Link>

        {/* Right side */}
        <div className="flex items-center gap-1">
          {loading ? (
            <div className="h-8 w-8 animate-pulse rounded-full bg-surface-700" />
          ) : user ? (
            <>
              {/* Nav links */}
              <Link
                href="/dashboard"
                className={cn(
                  "btn-ghost gap-1.5 text-xs hidden sm:inline-flex",
                  isActivePath("/dashboard") && "text-white bg-surface-800"
                )}
              >
                <LayoutDashboard className="h-3.5 w-3.5" />
                Dashboard
              </Link>
              <Link
                href="/settings"
                className={cn(
                  "btn-ghost gap-1.5 text-xs hidden sm:inline-flex",
                  isActivePath("/settings") && "text-white bg-surface-800"
                )}
              >
                <Settings className="h-3.5 w-3.5" />
                Settings
              </Link>

              {/* User avatar dropdown */}
              <div className="relative ml-1" ref={dropdownRef}>
                <button
                  onClick={() => setMenuOpen((prev) => !prev)}
                  className="flex items-center gap-2 rounded-lg border border-surface-600 bg-surface-800 px-2.5 py-1.5 transition-all hover:border-violet-500/50"
                >
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-violet-600 text-[10px] font-bold text-white">
                    {initials}
                  </div>
                  <span className="hidden max-w-[120px] truncate text-xs font-medium sm:block">
                    {user.email}
                  </span>
                  <ChevronDown className={cn("h-3 w-3 text-zinc-400 transition-transform duration-200", menuOpen && "rotate-180")} />
                </button>

                {menuOpen && (
                  <div className="absolute right-0 top-full z-50 mt-2 w-52 rounded-xl border border-surface-600 bg-surface-800 p-1 shadow-2xl">
                    {/* Email header */}
                    <div className="flex items-center gap-2 px-3 py-2 border-b border-surface-700 mb-1">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-violet-600 text-xs font-bold text-white">
                        {initials}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-xs font-medium text-zinc-200">{user.email}</p>
                        <p className="text-[10px] text-zinc-500">Signed in</p>
                      </div>
                    </div>

                    <Link href="/dashboard" onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2 w-full rounded-lg px-3 py-2 text-xs text-zinc-300 hover:bg-surface-700 transition-colors">
                      <LayoutDashboard className="h-3.5 w-3.5 text-zinc-400" />
                      Dashboard
                    </Link>
                    <Link href="/settings" onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2 w-full rounded-lg px-3 py-2 text-xs text-zinc-300 hover:bg-surface-700 transition-colors">
                      <Settings className="h-3.5 w-3.5 text-zinc-400" />
                      API Key Settings
                    </Link>
                    <Link href="/upgrade" onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2 w-full rounded-lg px-3 py-2 text-xs text-violet-300 hover:bg-surface-700 transition-colors">
                      <Zap className="h-3.5 w-3.5 text-violet-400" />
                      Upgrade — $7
                    </Link>

                    <div className="my-1 border-t border-surface-700" />

                    <button onClick={handleLogout}
                      className="flex items-center gap-2 w-full rounded-lg px-3 py-2 text-xs text-red-400 hover:bg-red-500/10 transition-colors">
                      <LogOut className="h-3.5 w-3.5" />
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link href="/login" className="btn-ghost text-xs">
                Sign in
              </Link>
              <Link href="/register" className="btn-primary text-xs px-4 py-2">
                Get Started Free
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
