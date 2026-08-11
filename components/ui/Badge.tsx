import { cn } from "@/lib/cn";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "error" | "violet";
  className?: string;
}

export function Badge({ children, variant = "default", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        {
          "bg-surface-700 text-zinc-300": variant === "default",
          "bg-emerald-500/20 text-emerald-400": variant === "success",
          "bg-amber-500/20 text-amber-400": variant === "warning",
          "bg-red-500/20 text-red-400": variant === "error",
          "bg-violet-500/20 text-violet-300": variant === "violet",
        },
        className
      )}
    >
      {children}
    </span>
  );
}
