import { createUser, setSession, publicUser } from "@/lib/auth";
import { json } from "@/lib/api";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const name = String(body.name || "").trim();
    const email = String(body.email || "").trim();
    const password = String(body.password || "");
    if (name.length < 2) return json({ error: "Name must be at least 2 characters." }, 400);
    if (!email.includes("@")) return json({ error: "Please enter a valid email address." }, 400);
    if (password.length < 8) return json({ error: "Password must be at least 8 characters." }, 400);
    const user = await createUser({
      name,
      email,
      password,
      referralCode: body.referralCode,
      referrerEmail: body.referrerEmail,
    });
    await setSession(user.id);
    return json({ success: true, user: publicUser(user) });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to register";
    return json({ error: message }, 400);
  }
}
