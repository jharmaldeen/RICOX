import { newId } from "@/lib/auth";
import { getDb, saveDb } from "@/lib/db";
import { json } from "@/lib/api";

export async function POST(request: Request) {
  const body = await request.json();
  const email = String(body.email || "").trim().toLowerCase();
  if (!email.includes("@")) return json({ error: "Please enter a valid email address" }, 400);
  const db = await getDb();
  db.passwordResets.push({
    id: newId(),
    email,
    createdAt: new Date().toISOString(),
  });
  await saveDb(db);
  return json({
    success: true,
    message: "If an account exists for that email, a reset link has been recorded.",
  });
}
