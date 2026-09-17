"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";

export function AdminOnly({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace("/auth/login?callbackUrl=/dashboard/admin");
      return;
    }
    if (user.role !== "admin") router.replace("/dashboard");
  }, [user, loading, router]);

  if (loading || !user || user.role !== "admin") {
    return <p className="text-sm text-muted">Loading admin…</p>;
  }

  return <>{children}</>;
}
