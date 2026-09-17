import { promises as fs } from "fs";
import path from "path";
import { NextResponse } from "next/server";
import { json, requireUser } from "@/lib/api";
import { getDb } from "@/lib/db";
import { absoluteProofPath } from "@/lib/deposit";

const MIME: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
};

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  const auth = await requireUser();
  if (!auth.user) return auth.response;

  const { id } = await context.params;
  const db = await getDb();
  const tx = db.transactions.find((item) => item.id === id && item.type === "deposit");
  if (!tx?.proofPath) return json({ error: "No screenshot on file" }, 404);
  if (auth.user.role !== "admin" && tx.userId !== auth.user.id) {
    return json({ error: "Forbidden" }, 403);
  }

  const filePath = absoluteProofPath(tx.proofPath);
  try {
    const data = await fs.readFile(filePath);
    const ext = path.extname(filePath).toLowerCase();
    return new NextResponse(data, {
      headers: {
        "Content-Type": MIME[ext] || "application/octet-stream",
        "Content-Disposition": `inline; filename="${tx.proofName || path.basename(filePath)}"`,
        "Cache-Control": "private, no-store",
      },
    });
  } catch {
    return json({ error: "Screenshot file missing" }, 404);
  }
}
