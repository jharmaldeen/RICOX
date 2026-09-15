import type { Metadata } from "next";

export const metadata: Metadata = { title: "About Us | RICOX" };

export default function AboutPage() {
  return (
    <div className="relative mx-auto max-w-3xl px-4 py-16">
      <div className="hero-glow pointer-events-none absolute inset-0" />
      <h1 className="relative text-4xl font-bold text-white">About Us</h1>
      <p className="relative mt-6 text-muted">
        RICOX is a leading cryptocurrency investment platform that allows you to invest in vetted crypto projects,
        trade digital assets, and build a diversified portfolio with ease.
      </p>
    </div>
  );
}
