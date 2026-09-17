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

export function DashboardNav({ open, onClose }: { open: boolean; onClose: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout, user } = useAuth();
  const isAdmin = user?.role === "admin";
  const navItems = isAdmin ? adminItems : userItems;

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
        className={`fixed inset-y-0 left-0 z-50 flex w-[72px] flex-col items-center border-r border-line bg-navy py-5 transition-transform lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Link href={isAdmin ? "/dashboard/admin" : "/"} className="mb-8 flex h-10 w-10 items-center justify-center" onClick={onClose}>
          <img alt="RICOX" src="/images/logo.png" className="h-8 w-8" />
        </Link>
        <button type="button" className="absolute right-2 top-4 text-muted lg:hidden" onClick={onClose}>
          <X className="h-4 w-4" />
        </button>
        {isAdmin ? (
          <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-lg bg-accent/20 text-accent-2" title="Admin">
            <Shield className="h-4 w-4" />
          </div>
        ) : null}
        <nav className="flex flex-1 flex-col items-center gap-2 overflow-y-auto">
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
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors ${
                  active ? "bg-accent/20 text-accent-2" : "text-muted hover:bg-surface-2 hover:text-white"
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="sr-only">{item.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="flex flex-col items-center gap-2">
          <Link
            href="/contact"
            title="Support"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-xl text-muted hover:bg-surface-2 hover:text-white"
          >
            <LifeBuoy className="h-5 w-5" />
            <span className="sr-only">Support</span>
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
            className="flex h-10 w-10 items-center justify-center rounded-xl text-muted hover:bg-surface-2 hover:text-white"
          >
            <LogOut className="h-5 w-5" />
            <span className="sr-only">Sign out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
