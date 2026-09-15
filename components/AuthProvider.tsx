"use client";

import { createContext, useContext, useEffect, useState } from "react";

export type SessionUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  profileImage?: string;
  referralCode: string;
  balance: number;
};

type AuthContextValue = {
  user: SessionUser | null;
  loading: boolean;
  refresh: () => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue>({
  user: null,
  loading: true,
  refresh: async () => {},
  logout: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [loading, setLoading] = useState(true);

  async function refresh() {
    const res = await fetch("/api/auth/me");
    const data = await res.json();
    setUser(data.user ?? null);
    setLoading(false);
  }

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
  }

  useEffect(() => {
    refresh();
  }, []);

  return <AuthContext.Provider value={{ user, loading, refresh, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
