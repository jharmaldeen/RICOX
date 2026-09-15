"use client";

import { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/components/AuthProvider";

export function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const { refresh } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const form = new FormData(e.currentTarget);
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: form.get("email"),
        password: form.get("password"),
      }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error || "Invalid email or password");
      return;
    }
    await refresh();
    router.push(params.get("callbackUrl") || "/dashboard");
  }

  return (
    <form className="space-y-4" onSubmit={onSubmit}>
      {error ? <p className="text-sm text-red">{error}</p> : null}
      <div>
        <label className="mb-1 block text-sm text-muted" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          placeholder="john@example.com"
          className="h-10 w-full rounded-xl border border-line bg-void px-3 text-white"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm text-muted" htmlFor="password">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          className="h-10 w-full rounded-xl border border-line bg-void px-3 text-white"
        />
      </div>
      <div className="text-right text-sm">
        <Link href="/auth/reset-password" className="text-accent-2 hover:text-accent">
          Forgot password?
        </Link>
      </div>
      <button type="submit" disabled={loading} className="btn-glow h-10 w-full rounded-full text-sm font-semibold text-white">
        {loading ? "Signing in..." : "Sign in"}
      </button>
      <p className="text-center text-sm text-muted">
        Demo: demo@ricox.com / RicoxDemo1
      </p>
    </form>
  );
}
