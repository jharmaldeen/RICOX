"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ArrowDownToLine,
  ArrowLeftRight,
  ArrowUpFromLine,
  CreditCard,
  LayoutDashboard,
  LayoutGrid,
  LifeBuoy,
  LogOut,
  PieChart,
  Plus,
  Settings,
  Shield,
  Users,
  WalletCards,
  X,
} from "lucide-react";
import { useAuth } from "@/components/AuthProvider";

const userItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutGrid },
  { href: "/dashboard/portfolio", label: "Portfolio", icon: PieChart },
  { href: "/dashboard/transactions", label: "Transactions", icon: ArrowLeftRight },
  { href: "/dashboard/investments/new", label: "New Investment", icon: Plus },
  { href: "/dashboard/deposit", label: "Deposit", icon: ArrowDownToLine },
  { href: "/dashboard/withdrawals", label: "Withdrawals", icon: ArrowUpFromLine },
  { href: "/dashboard/funding", label: "Funding methods", icon: CreditCard },
];

const adminItems = [
  { href: "/dashboard/admin", label: "Admin home", icon: LayoutDashboard },
  { href: "/dashboard/admin/users", label: "Users", icon: Users },
  { href: "/dashboard/admin/deposits", label: "Deposits", icon: ArrowDownToLine },
  { href: "/dashboard/admin/withdrawals", label: "Withdrawals", icon: ArrowUpFromLine },
  { href: "/dashboard/admin/bank-accounts", label: "Bank accounts", icon: WalletCards },
  { href: "/dashboard/admin/cards", label: "Cards", icon: CreditCard },
  { href: "/dashboard/admin/settings", label: "BTC wallet", icon: Settings },
];

const MIN = 72;
const MAX = 280;

export function DashboardNav({
  open,
  width,
  onClose,
  onResize,
  onToggle,
}: {
  open: boolean;
  width: number;
  onClose: () => void;
  onResize: (width: number) => void;
  onToggle: () => void;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout, user } = useAuth();
  const isAdmin = user?.role === "admin";
  const navItems = isAdmin ? adminItems : userItems;
  const showLabels = width > 140;

  function startDrag(event: React.PointerEvent<HTMLButtonElement>) {
    event.preventDefault();
    const startX = event.clientX;
    const startWidth = width;
    const target = event.currentTarget;
    target.setPointerCapture(event.pointerId);

    function onMove(move: PointerEvent) {
      onResize(Math.min(MAX, Math.max(MIN, startWidth + (move.clientX - startX))));
    }
    function onUp() {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    }
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  }

  return (
    <>
      {open ? (
        <button
          type="button"
          aria-label="Close menu"
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onClose}
        />
      ) : null}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-60 flex-col border-r border-line bg-navy py-5 transition-transform max-lg:px-3 lg:w-[var(--sbw)] lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        } ${showLabels ? "items-stretch px-3" : "lg:items-center lg:px-2"}`}
      >
        <div className={`mb-6 flex items-center ${showLabels ? "justify-between px-1" : "justify-center max-lg:justify-between max-lg:px-1"}`}>
          <Link
            href={isAdmin ? "/dashboard/admin" : "/"}
            className="flex items-center gap-2"
            onClick={onClose}
          >
            <img alt="RICOX" src="/images/logo.png" className="h-8 w-8" />
            <span className={`text-sm font-bold text-gradient ${showLabels ? "inline" : "hidden"} max-lg:inline`}>RICOX</span>
          </Link>
          <button type="button" className="text-muted lg:hidden" onClick={onClose} aria-label="Close sidebar">
            <X className="h-4 w-4" />
          </button>
        </div>
        {isAdmin ? (
          <div
            className={`mb-3 flex items-center rounded-lg bg-accent/20 text-accent-2 ${
              showLabels ? "h-8 gap-2 px-2" : "h-8 w-8 justify-center max-lg:h-8 max-lg:w-auto max-lg:gap-2 max-lg:px-2"
            }`}
            title="Admin"
          >
            <Shield className="h-4 w-4 shrink-0" />
            <span className={`text-xs font-semibold ${showLabels ? "inline" : "hidden"} max-lg:inline`}>Admin</span>
          </div>
        ) : null}
        <nav className="flex flex-1 flex-col gap-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active =
              item.href === "/dashboard" || item.href === "/dashboard/admin"
                ? pathname === item.href
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                title={item.label}
                onClick={onClose}
                className={`flex h-10 items-center rounded-xl transition-colors max-lg:gap-3 max-lg:px-3 ${
                  showLabels ? "gap-3 px-3" : "lg:w-10 lg:justify-center"
                } ${active ? "bg-accent/20 text-accent-2" : "text-muted hover:bg-surface-2 hover:text-white"}`}
              >
                <Icon className="h-5 w-5 shrink-0" />
                <span className={`truncate text-sm font-medium ${showLabels ? "inline" : "hidden"} max-lg:inline`}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>
        <div className={`mt-3 flex flex-col gap-1 ${showLabels ? "" : "lg:items-center"}`}>
          <Link
            href="/contact"
            title="Support"
            onClick={onClose}
            className={`flex h-10 items-center rounded-xl text-muted hover:bg-surface-2 hover:text-white max-lg:gap-3 max-lg:px-3 ${
              showLabels ? "gap-3 px-3" : "lg:w-10 lg:justify-center"
            }`}
          >
            <LifeBuoy className="h-5 w-5 shrink-0" />
            <span className={`text-sm font-medium ${showLabels ? "inline" : "hidden"} max-lg:inline`}>Support</span>
          </Link>
          <button
            type="button"
            title="Sign out"
            onClick={async () => {
              onClose();
              await logout();
              router.push("/auth/login");
              router.refresh();
            }}
            className={`flex h-10 items-center rounded-xl text-muted hover:bg-surface-2 hover:text-white max-lg:gap-3 max-lg:px-3 ${
              showLabels ? "gap-3 px-3" : "lg:w-10 lg:justify-center"
            }`}
          >
            <LogOut className="h-5 w-5 shrink-0" />
            <span className={`text-sm font-medium ${showLabels ? "inline" : "hidden"} max-lg:inline`}>Sign out</span>
          </button>
        </div>
        <button
          type="button"
          aria-label="Resize sidebar"
          title="Drag to resize, double-click to collapse"
          className="absolute inset-y-0 right-0 z-10 hidden w-1.5 cursor-col-resize bg-transparent hover:bg-accent/50 lg:block"
          onPointerDown={startDrag}
          onDoubleClick={onToggle}
        />
      </aside>
    </>
  );
}
