import type { Metadata } from "next";

export const metadata: Metadata = { title: "Terms of Service | RICOX" };

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-4xl font-bold text-white">Terms of Service</h1>
      <p className="mt-6 text-muted">
        By using RICOX you agree to the platform rules for investing in vetted crypto projects and trading digital
        assets. Cryptocurrency investments carry risk and past performance is not a guarantee of future results.
      </p>
    </div>
  );
}
