"use client";

import { FormEvent, useState } from "react";

export function ContactForm() {
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const form = new FormData(e.currentTarget);
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.get("name"),
        email: form.get("email"),
        subject: form.get("subject"),
        message: form.get("message"),
      }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error || "Could not send message");
      return;
    }
    setSent(true);
  }

  if (sent) {
    return (
      <p className="text-muted">
        Thanks for reaching out. Our team will get back to you at the email you provided.
      </p>
    );
  }

  return (
    <form className="space-y-4" onSubmit={onSubmit}>
      {error ? <p className="text-sm text-red">{error}</p> : null}
      <div>
        <label className="mb-1 block text-sm text-muted" htmlFor="name">
          Name
        </label>
        <input id="name" name="name" required className="h-10 w-full rounded-xl border border-line bg-void px-3 text-white" />
      </div>
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
      <div>
        <label className="mb-1 block text-sm text-muted" htmlFor="subject">
          Subject
        </label>
        <select id="subject" name="subject" className="h-10 w-full rounded-xl border border-line bg-void px-3 text-white">
          <option>General inquiry</option>
          <option>Investment</option>
          <option>Trading</option>
          <option>Support</option>
        </select>
      </div>
      <div>
        <label className="mb-1 block text-sm text-muted" htmlFor="message">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          className="w-full rounded-xl border border-line bg-void px-3 py-2 text-white"
        />
      </div>
      <button type="submit" disabled={loading} className="btn-glow h-10 rounded-full px-5 text-sm font-semibold text-white">
        {loading ? "Sending..." : "Send Message"}
      </button>
    </form>
  );
}
