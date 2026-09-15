import type { Metadata } from "next";

export const metadata: Metadata = { title: "Privacy Policy | RICOX" };

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-4xl font-bold text-white">Privacy Policy</h1>
      <p className="mt-6 text-muted">
        RICOX collects account and usage information to operate the investment and trading platform. We do not sell
        personal data. Contact support@RICOX.com for privacy requests.
      </p>
    </div>
  );
}
