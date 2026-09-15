import { checkPassword, findUserByEmail, setSession, publicUser } from "@/lib/auth";
import { json } from "@/lib/api";

export async function POST(request: Request) {
  const body = await request.json();
  const email = String(body.email || "");
  const password = String(body.password || "");
  const user = await findUserByEmail(email);
  if (!user || !(await checkPassword(password, user.passwordHash))) {
    return json({ error: "Invalid email or password" }, 401);
  }
  await setSession(user.id);
  return json({ ok: true, user: publicUser(user) });
}
