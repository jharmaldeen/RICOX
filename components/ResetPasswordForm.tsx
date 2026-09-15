"use client";

import { FormEvent, useState } from "react";

export function ResetPasswordForm() {
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const form = new FormData(e.currentTarget);
    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: form.get("email") }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Please enter a valid email address");
      return;
    }
    setDone(true);
  }

  if (done) {
    return <p className="text-sm text-muted">If an account exists for that email, a reset link has been recorded.</p>;
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
          className="h-10 w-full rounded-xl border border-line bg-void px-3 text-white"
        />
      </div>
      <button type="submit" className="btn-glow h-10 w-full rounded-full text-sm font-semibold text-white">
        Send reset link
      </button>
    </form>
  );
}
