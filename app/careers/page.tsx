import type { Metadata } from "next";

export const metadata: Metadata = { title: "Careers | RICOX" };

export default function CareersPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-4xl font-bold text-white">Careers</h1>
      <p className="mt-6 text-muted">
        Join RICOX and help investors build a diversified portfolio of vetted cryptocurrency projects.
      </p>
    </div>
  );
}
