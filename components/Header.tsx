"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "@/components/AuthProvider";

const links = [
  { href: "/", label: "Home" },
  { href: "/investment", label: "Investment" },
  { href: "/trade", label: "Trade" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, logout } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  async function signOut() {
    setOpen(false);
    await logout();
    router.push("/auth/login");
    router.refresh();
  }

  return (
    <header
      className={`sticky top-0 z-50 transition-colors duration-300 ${
        scrolled || open
          ? "border-b border-line bg-void/90 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <nav className="container mx-auto flex items-center p-4 lg:px-8" aria-label="Global">
        <div className="flex flex-1 items-center justify-start">
          <Link href="/" className="-m-1.5 p-1.5" onClick={() => setOpen(false)}>
            <span className="flex items-center">
              <span className="flex h-10 w-10 items-center justify-center">
                <img alt="RICOX Logo" width={40} height={40} className="h-10 w-10" src="/images/logo.png" />
              </span>
              <span className="ml-2 text-xl font-bold text-gradient">RICOX</span>
            </span>
          </Link>
        </div>

        <div className="hidden lg:flex lg:items-center lg:gap-x-8">
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-semibold leading-6 transition-colors ${
                  active ? "text-accent-2" : "text-muted hover:text-accent-2"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        <div className="flex flex-1 items-center justify-end gap-x-4">
          <div className="hidden lg:flex lg:items-center lg:gap-x-4">
            {user ? (
              <>
                <Link href="/dashboard" className="text-sm font-semibold text-muted hover:text-accent-2">
                  Dashboard
                </Link>
                <button
                  type="button"
                  onClick={signOut}
                  className="text-sm font-semibold text-muted hover:text-accent-2"
                >
                  Sign out
                </button>
                <Link href="/dashboard" className="h-8 w-8 overflow-hidden rounded-full border border-line">
                  {user.profileImage ? (
                    <img src={user.profileImage} alt={user.name} className="h-full w-full object-cover" />
                  ) : (
                    <span className="flex h-full w-full items-center justify-center bg-surface-2 text-xs font-semibold">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                  )}
                </Link>
              </>
            ) : (
              <>
                <Link href="/auth/login" className="text-sm font-semibold text-muted hover:text-accent-2">
                  Sign in
                </Link>
                <Link
                  href="/auth/register"
                  className="btn-glow inline-flex h-9 items-center rounded-full px-4 text-sm font-semibold text-white"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-muted lg:hidden"
            onClick={() => setOpen((v) => !v)}
          >
            <span className="sr-only">Open main menu</span>
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </nav>

      {open ? (
        <div className="border-t border-line bg-navy px-4 py-4 lg:hidden">
          <div className="flex flex-col gap-3">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-2 py-2 text-sm font-semibold text-text hover:bg-surface-2"
              >
                {link.label}
              </Link>
            ))}
            {user ? (
              <>
                <Link href="/dashboard" onClick={() => setOpen(false)} className="px-2 py-2 text-sm font-semibold">
                  Dashboard
                </Link>
                <button
                  type="button"
                  onClick={signOut}
                  className="px-2 py-2 text-left text-sm font-semibold"
                >
                  Sign out
                </button>
              </>
            ) : (
              <Link
                href="/auth/register"
                onClick={() => setOpen(false)}
                className="btn-glow mt-2 inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-semibold text-white"
              >
                Get Started
              </Link>
            )}
          </div>
        </div>
      ) : null}
    </header>
  );
}
