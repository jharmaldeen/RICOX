const EMAIL_RE =
  /^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z]{2,})+$/i;

export function normalizeEmail(value: string) {
  return value.trim().toLowerCase();
}

export function validateEmail(value: string): string | null {
  const email = normalizeEmail(value);
  if (!email) return "Please enter your email address.";
  if (email.length > 254) return "Email address is too long.";
  if (!email.includes("@") || email.split("@").length !== 2) {
    return "Please enter a valid email address, like name@example.com.";
  }
  const [local, domain] = email.split("@");
  if (!local || local.length > 64 || local.startsWith(".") || local.endsWith(".") || local.includes("..")) {
    return "Please enter a valid email address, like name@example.com.";
  }
  if (!domain.includes(".") || domain.startsWith("-") || domain.endsWith("-") || domain.startsWith(".")) {
    return "Please enter a valid email address, like name@example.com.";
  }
  if (!EMAIL_RE.test(email)) return "Please enter a valid email address, like name@example.com.";
  return null;
}
