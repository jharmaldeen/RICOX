import type { Metadata } from "next";

export const metadata: Metadata = { title: "Compliance | RICOX" };

export default function CompliancePage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-4xl font-bold text-white">Compliance</h1>
      <p className="mt-6 text-muted">
        Complete KYC verification on RICOX to comply with regulations and help ensure a secure investing environment.
      </p>
    </div>
  );
}
