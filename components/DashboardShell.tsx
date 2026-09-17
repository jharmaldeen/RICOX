"use client";

import { useEffect, useState } from "react";
import { DashboardNav } from "@/components/DashboardNav";
import { DashboardTopBar } from "@/components/DashboardTopBar";
import { ToastProvider } from "@/components/ToastProvider";

const MIN = 72;
const MAX = 280;
const EXPANDED = 220;
const STORAGE_KEY = "ricox-sidebar-width";

function clamp(value: number) {
  return Math.min(MAX, Math.max(MIN, Math.round(value)));
}

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [width, setWidth] = useState(EXPANDED);

  useEffect(() => {
    const raw = Number(window.localStorage.getItem(STORAGE_KEY));
    const next = Number.isFinite(raw) && raw > 140 ? clamp(raw) : EXPANDED;
    setWidth(next);
    window.localStorage.setItem(STORAGE_KEY, String(next));
  }, []);

  function persist(next: number) {
    const clamped = clamp(next);
    setWidth(clamped);
    window.localStorage.setItem(STORAGE_KEY, String(clamped));
  }

  function toggle() {
    persist(width > 120 ? MIN : EXPANDED);
  }

  return (
    <ToastProvider>
      <div className="min-h-screen bg-void" style={{ ["--sbw" as string]: `${width}px` }}>
        <DashboardNav
          open={open}
          width={width}
          onClose={() => setOpen(false)}
          onResize={persist}
          onToggle={toggle}
        />
        <div className="pl-0 lg:pl-[var(--sbw)]">
          <DashboardTopBar onMenu={() => setOpen(true)} onToggleSidebar={toggle} collapsed={width <= 120} />
          <main className="px-4 py-4 lg:px-5 lg:py-4">{children}</main>
        </div>
      </div>
    </ToastProvider>
  );
}
