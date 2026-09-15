import type { Metadata } from "next";
import { Suspense } from "react";
import { RegisterForm } from "@/components/RegisterForm";

export const metadata: Metadata = {
  title: "Join RICOX | RICOX Investment Platform",
};

export default function RegisterPage() {
  return (
    <div className="relative overflow-hidden">
      <div className="hero-glow starfield pointer-events-none absolute inset-0" />
      <div className="relative mx-auto flex min-h-[70vh] max-w-lg flex-col justify-center px-4 py-16">
        <h1 className="text-center text-4xl font-bold text-white">Create an Account</h1>
        <p className="mt-4 text-center text-muted">Enter your details below to create your account</p>
        <div className="glass mt-8 rounded-2xl p-6">
          <Suspense>
            <RegisterForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
