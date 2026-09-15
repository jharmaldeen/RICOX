import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { LoginForm } from "@/components/LoginForm";

export const metadata: Metadata = { title: "Welcome Back | RICOX" };

export default function LoginPage() {
  return (
    <div className="relative overflow-hidden">
      <div className="hero-glow starfield pointer-events-none absolute inset-0" />
      <div className="relative mx-auto flex min-h-[70vh] max-w-lg flex-col justify-center px-4 py-16">
        <h1 className="text-center text-4xl font-bold text-white">Welcome Back</h1>
        <p className="mt-4 text-center text-muted">
          Sign in to access your portfolio, investments, and trading tools.
        </p>
        <div className="glass mt-8 rounded-2xl p-6">
          <Suspense>
            <LoginForm />
          </Suspense>
        </div>
        <p className="mt-6 text-center text-sm text-muted">
          Need an account?{" "}
          <Link href="/auth/register" className="text-accent-2">
            Create an Account
          </Link>
        </p>
      </div>
    </div>
  );
}
