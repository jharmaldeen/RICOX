import { hashPassword, makeReferralCode, newId, publicUser } from "@/lib/auth";
import { json, requireAdmin } from "@/lib/api";
import { getDb, saveDb } from "@/lib/db";
import type { User } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET() {
  const auth = await requireAdmin();
  if (!auth.user) return auth.response;
  const db = await getDb();
  return json({
    users: db.users.map((u) => publicUser(u)),
  });
}

export async function POST(request: Request) {
  const auth = await requireAdmin();
  if (!auth.user) return auth.response;
  const body = await request.json();
  const name = String(body.name || "").trim();
  const email = String(body.email || "").trim().toLowerCase();
  const password = String(body.password || "").trim();
  const role = body.role === "admin" ? "admin" : "user";
  const balance = Number(body.balance ?? 0);

  if (!name || !email || password.length < 6) {
    return json({ error: "Name, email, and password (6+ chars) are required" }, 400);
  }

  const db = await getDb();
  if (db.users.some((u) => u.email === email)) {
    return json({ error: "Email already in use" }, 400);
  }

  const user: User = {
    id: newId(),
    name,
    email,
    passwordHash: await hashPassword(password),
    role,
    referralCode: makeReferralCode(name),
    balance: Number.isFinite(balance) ? balance : 0,
    createdAt: new Date().toISOString(),
  };
  db.users.push(user);
  await saveDb(db);
  return json({ success: true, user: publicUser(user) });
}
