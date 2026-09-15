"use client";

import { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/components/AuthProvider";

export function RegisterForm() {
  const router = useRouter();
  const params = useSearchParams();
  const { refresh } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const form = new FormData(e.currentTarget);
    const name = String(form.get("name") || "");
    const email = String(form.get("email") || "");
    const password = String(form.get("password") || "");
    if (name.length < 2) return setError("Name must be at least 2 characters.");
    if (!email.includes("@")) return setError("Please enter a valid email address.");
    if (password.length < 8) return setError("Password must be at least 8 characters.");
    setLoading(true);
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        email,
        password,
        referralCode: params.get("ref") || undefined,
        referrerEmail: params.get("referrerEmail") || undefined,
      }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error || "Failed to register");
      return;
    }
    await refresh();
    router.push("/dashboard");
  }

  return (
    <form className="space-y-4" onSubmit={onSubmit}>
      {error ? <p className="text-sm text-red">{error}</p> : null}
      <div>
        <label className="mb-1 block text-sm text-muted" htmlFor="full-name">
          Full Name
        </label>
        <input
          id="full-name"
          name="name"
          required
          placeholder="John Doe"
          className="h-10 w-full rounded-xl border border-line bg-void px-3 text-white"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm text-muted" htmlFor="reg-email">
          Email
        </label>
        <input
          id="reg-email"
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
          minLength={8}
          className="h-10 w-full rounded-xl border border-line bg-void px-3 text-white"
        />
      </div>
      <button type="submit" disabled={loading} className="btn-glow h-10 w-full rounded-full text-sm font-semibold text-white">
        {loading ? "Creating account..." : "Create Account"}
      </button>
      <p className="text-center text-sm text-muted">
        Already have an account?{" "}
        <Link href="/auth/login" className="text-accent-2">
          Sign in
        </Link>
      </p>
    </form>
  );
}
