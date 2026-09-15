import type { Metadata } from "next";

export const metadata: Metadata = { title: "Cookie Policy | RICOX" };

export default function CookiesPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-4xl font-bold text-white">Cookie Policy</h1>
      <p className="mt-6 text-muted">
        RICOX uses cookies to keep you signed in, remember preferences, and understand how the platform is used.
      </p>
    </div>
  );
}
