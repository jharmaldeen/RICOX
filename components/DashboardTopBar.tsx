"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, ChevronDown, Home, Menu } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";

const titles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/dashboard/portfolio": "Portfolio",
  "/dashboard/transactions": "Transactions",
  "/dashboard/investments/new": "New Investment",
  "/dashboard/deposit": "Deposit",
  "/dashboard/withdrawals": "Withdrawals",
  "/dashboard/funding": "Funding methods",
  "/dashboard/bank-accounts": "Funding methods",
  "/dashboard/payment-methods": "Funding methods",
  "/dashboard/admin": "Admin",
  "/dashboard/admin/users": "Users",
  "/dashboard/admin/deposits": "Deposits",
  "/dashboard/admin/withdrawals": "Withdrawals",
  "/dashboard/admin/bank-accounts": "Bank accounts",
  "/dashboard/admin/cards": "Cards",
  "/dashboard/admin/settings": "BTC wallet",
};

export function DashboardTopBar({ onMenu }: { onMenu: () => void }) {
  const pathname = usePathname();
  const { user } = useAuth();
  const page = titles[pathname] || "Dashboard";
  const homeHref = user?.role === "admin" ? "/dashboard/admin" : "/dashboard";

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-line bg-navy/90 px-4 py-3 backdrop-blur-xl lg:px-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="rounded-lg p-2 text-muted hover:bg-surface-2 hover:text-white lg:hidden"
          onClick={onMenu}
        >
          <Menu className="h-5 w-5" />
        </button>
        <Link href={homeHref} className="hidden rounded-lg p-2 text-muted hover:text-white sm:inline-flex">
          <Home className="h-4 w-4" />
        </Link>
        <div className="flex items-center gap-2 text-sm">
          <span className="text-muted">{user?.role === "admin" ? "Admin" : "Overview"}</span>
          <span className="text-muted">/</span>
          <span className="font-medium text-white">{page}</span>
        </div>
      </div>
      <div className="flex items-center gap-3">
        {user?.role !== "admin" ? (
          <Link
            href="/dashboard/transactions"
            className="rounded-lg p-2 text-muted hover:bg-surface-2 hover:text-white"
            title="Activity"
          >
            <Bell className="h-4 w-4" />
          </Link>
        ) : null}
        <Link href={homeHref} className="flex items-center gap-2 rounded-full py-1 pl-1 pr-2 hover:bg-surface-2">
          <span className="h-8 w-8 overflow-hidden rounded-full border border-line">
            {user?.profileImage ? (
              <img src={user.profileImage} alt={user.name} className="h-full w-full object-cover" />
            ) : (
              <span className="flex h-full w-full items-center justify-center bg-surface-2 text-xs font-semibold">
                {user?.name?.charAt(0).toUpperCase()}
              </span>
            )}
          </span>
          <span className="hidden text-left sm:block">
            <span className="block text-xs font-medium text-white">{user?.name?.split(" ")[0]}</span>
            <span className="block text-[10px] capitalize text-muted">{user?.role}</span>
          </span>
          <ChevronDown className="hidden h-3.5 w-3.5 text-muted sm:block" />
        </Link>
      </div>
    </header>
  );
}
