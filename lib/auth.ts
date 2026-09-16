import { createHmac, randomBytes, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { getDb, saveDb } from "@/lib/db";
import type { User } from "@/lib/types";
import { normalizeEmail, validateEmail } from "@/lib/email";

const COOKIE = "ricox_session";
const SECRET = process.env.AUTH_SECRET || "ricox-local-auth-secret";

function sign(userId: string) {
  const hmac = createHmac("sha256", SECRET).update(userId).digest("hex");
  return `${userId}.${hmac}`;
}

function verify(token: string) {
  const [userId, hmac] = token.split(".");
  if (!userId || !hmac) return null;
  const expected = createHmac("sha256", SECRET).update(userId).digest("hex");
  const a = Buffer.from(hmac);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  return userId;
}

export function publicUser(user: User) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    profileImage: user.profileImage,
    referralCode: user.referralCode,
    referredBy: user.referredBy,
    balance: user.balance,
    createdAt: user.createdAt,
  };
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

export async function checkPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export async function setSession(userId: string) {
  const store = await cookies();
  store.set(COOKIE, sign(userId), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}

export async function clearSession() {
  const store = await cookies();
  store.set(COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
    expires: new Date(0),
  });
}

export async function getSessionUser(): Promise<User | null> {
  const store = await cookies();
  const token = store.get(COOKIE)?.value;
  if (!token) return null;
  const userId = verify(token);
  if (!userId) return null;
  const db = await getDb();
  return db.users.find((u) => u.id === userId) ?? null;
}

export function newId() {
  return randomBytes(8).toString("hex");
}

export function makeReferralCode(name: string) {
  return `${name.replace(/[^a-z]/gi, "").slice(0, 6).toUpperCase()}${randomBytes(2).toString("hex").toUpperCase()}`;
}

export async function createUser(input: {
  name: string;
  email: string;
  password: string;
  referralCode?: string;
  referrerEmail?: string;
}) {
  const db = await getDb();
  const email = normalizeEmail(input.email);
  const emailError = validateEmail(email);
  if (emailError) throw new Error(emailError);
  if (db.users.some((u) => u.email === email)) {
    throw new Error("An account with this email already exists");
  }
  let referredBy: string | undefined;
  const referrerEmail = input.referrerEmail?.trim().toLowerCase();
  if (input.referralCode) {
    referredBy = db.users.find((u) => u.referralCode === input.referralCode)?.id;
  } else if (referrerEmail) {
    referredBy = db.users.find((u) => u.email === referrerEmail)?.id;
  }
  const user: User = {
    id: newId(),
    name: input.name.trim(),
    email,
    passwordHash: await hashPassword(input.password),
    role: "user",
    referralCode: makeReferralCode(input.name),
    referredBy,
    balance: 0,
    createdAt: new Date().toISOString(),
  };
  db.users.push(user);
  await saveDb(db);
  return user;
}

export async function findUserByEmail(email: string) {
  const db = await getDb();
  return db.users.find((u) => u.email === email.trim().toLowerCase()) ?? null;
}
