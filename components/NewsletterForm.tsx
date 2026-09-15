"use client";

import { FormEvent, useState } from "react";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    await fetch("/api/newsletter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    setDone(true);
  }

  return (
    <form className="mt-8 sm:mx-auto sm:flex sm:max-w-md" onSubmit={onSubmit}>
      <div className="min-w-0 flex-1">
        <input
          type="email"
          required
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex h-10 w-full rounded-full border border-line bg-surface px-4 py-2 text-white placeholder:text-muted"
        />
      </div>
      <div className="mt-3 sm:ml-3 sm:mt-0">
        <button className="btn-glow h-10 w-full rounded-full px-5 text-sm font-semibold text-white" type="submit">
          {done ? "Subscribed" : "Subscribe"}
        </button>
      </div>
    </form>
  );
}
