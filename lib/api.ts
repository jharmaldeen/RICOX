import { NextResponse } from "next/server";
import { getSessionUser, publicUser } from "@/lib/auth";
import type { User } from "@/lib/types";

export function json(data: unknown, status = 200) {
  return NextResponse.json(data, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}

export async function requireUser(): Promise<{ user: User } | { user: null; response: NextResponse }> {
  const user = await getSessionUser();
  if (!user) return { user: null, response: json({ error: "Unauthorized" }, 401) };
  return { user };
}

export async function requireAdmin(): Promise<{ user: User } | { user: null; response: NextResponse }> {
  const auth = await requireUser();
  if (!auth.user) return auth;
  if (auth.user.role !== "admin") {
    return { user: null, response: json({ error: "Admin access required" }, 403) };
  }
  return auth;
}

export function safeUser(user: User) {
  return publicUser(user);
}
