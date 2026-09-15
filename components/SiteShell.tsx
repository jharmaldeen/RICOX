"use client";

import { usePathname } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const dashboard = pathname.startsWith("/dashboard");

  return (
    <>
      {dashboard ? null : <Header />}
      {children}
      {dashboard ? null : <Footer />}
    </>
  );
}
