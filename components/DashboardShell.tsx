"use client";

import { useState } from "react";
import { DashboardNav } from "@/components/DashboardNav";
import { DashboardTopBar } from "@/components/DashboardTopBar";

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-void">
      <DashboardNav open={open} onClose={() => setOpen(false)} />
      <div className="lg:pl-[72px]">
        <DashboardTopBar onMenu={() => setOpen(true)} />
        <main className="px-4 py-5 lg:px-6 lg:py-6">{children}</main>
      </div>
    </div>
  );
}
