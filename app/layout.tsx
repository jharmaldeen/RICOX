import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/AuthProvider";
import { SiteShell } from "@/components/SiteShell";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "RICOX Investment Platform",
  description: "A secure platform for crypto investments",
  icons: {
    icon: [{ url: "/images/logo.png" }],
    apple: "/images/logo.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#4d7cff",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} antialiased`}>
        <AuthProvider>
          <SiteShell>{children}</SiteShell>
        </AuthProvider>
      </body>
    </html>
  );
}
