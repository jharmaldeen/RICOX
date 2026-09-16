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

export function safeUser(user: User) {
  return publicUser(user);
}
