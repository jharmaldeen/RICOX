import type { Metadata } from "next";
import Link from "next/link";
import { ResetPasswordForm } from "@/components/ResetPasswordForm";

export const metadata: Metadata = { title: "Reset password | RICOX" };

export default function ResetPasswordPage() {
  return (
    <div className="relative overflow-hidden">
      <div className="hero-glow starfield pointer-events-none absolute inset-0" />
      <div className="relative mx-auto flex min-h-[70vh] max-w-lg flex-col justify-center px-4 py-16">
        <h1 className="text-center text-4xl font-bold text-white">Reset password</h1>
        <p className="mt-4 text-center text-muted">Enter your email to receive a password reset link</p>
        <div className="glass mt-8 rounded-2xl p-6">
          <ResetPasswordForm />
        </div>
        <p className="mt-6 text-center text-sm text-muted">
          Remember your password?{" "}
          <Link href="/auth/login" className="text-accent-2">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
