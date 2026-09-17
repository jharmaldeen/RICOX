import { promises as fs } from "fs";
import path from "path";
import { getDb, saveDb } from "@/lib/db";
import { DEFAULT_BTC_ADDRESS, defaultSettings } from "@/lib/settings";

export { DEFAULT_BTC_ADDRESS };

export const DEPOSIT_UPLOAD_DIR = path.join(process.cwd(), "data", "uploads", "deposits");

const ALLOWED_TYPES: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/jpg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
};

export async function getBtcDepositAddress() {
  const db = await getDb();
  return db.settings?.btcDepositAddress?.trim() || DEFAULT_BTC_ADDRESS;
}

export async function updateBtcDepositAddress(address: string) {
  const db = await getDb();
  if (!db.settings) db.settings = defaultSettings();
  db.settings.btcDepositAddress = address.trim();
  await saveDb(db);
  return db.settings;
}

export function proofExtension(mime: string) {
  return ALLOWED_TYPES[mime] || null;
}

export async function saveDepositProof(txId: string, file: File) {
  const ext = proofExtension(file.type);
  if (!ext) throw new Error("Screenshot must be a JPG, PNG, or WebP image");
  if (file.size > 5 * 1024 * 1024) throw new Error("Screenshot must be 5MB or smaller");

  await fs.mkdir(DEPOSIT_UPLOAD_DIR, { recursive: true });
  const filename = `${txId}${ext}`;
  const absolute = path.join(DEPOSIT_UPLOAD_DIR, filename);
  const buffer = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(absolute, buffer);
  return {
    proofPath: filename,
    proofName: file.name || `deposit-proof${ext}`,
  };
}

export function absoluteProofPath(proofPath: string) {
  const safe = path.basename(proofPath);
  return path.join(DEPOSIT_UPLOAD_DIR, safe);
}
