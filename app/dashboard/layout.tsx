import { Suspense } from "react";
import { Spinner } from "@/components/ui/Spinner";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-surface-950">
          <Spinner size="lg" className="text-violet-400" />
        </div>
      }
    >
      {children}
    </Suspense>
  );
}
