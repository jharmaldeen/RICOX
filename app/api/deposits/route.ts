import { json, requireUser } from "@/lib/api";
import { getDb, saveDb } from "@/lib/db";
import { newId } from "@/lib/auth";
import { getBtcDepositAddress, saveDepositProof } from "@/lib/deposit";

export async function GET() {
  const auth = await requireUser();
  if (!auth.user) return auth.response;
  return json({
    method: "BTC",
    address: await getBtcDepositAddress(),
    network: "Bitcoin",
    minimum: 50,
  });
}

export async function POST(request: Request) {
  const auth = await requireUser();
  if (!auth.user) return auth.response;

  const form = await request.formData();
  const amount = Number(form.get("amount"));
  const reference = String(form.get("reference") || "").trim();
  const proof = form.get("proof");

  if (!Number.isFinite(amount) || amount < 50) {
    return json({ error: "Minimum deposit is $50" }, 400);
  }
  if (!(proof instanceof File) || proof.size === 0) {
    return json({ error: "Upload a screenshot of your BTC deposit before submitting" }, 400);
  }

  const db = await getDb();
  const id = newId();

  let proofPath: string;
  let proofName: string;
  try {
    const saved = await saveDepositProof(id, proof);
    proofPath = saved.proofPath;
    proofName = saved.proofName;
  } catch (err) {
    return json({ error: err instanceof Error ? err.message : "Could not save screenshot" }, 400);
  }

  const tx = {
    id,
    userId: auth.user.id,
    type: "deposit" as const,
    amount,
    status: "pending" as const,
    method: "BTC",
    reference: reference || `BTC-${id.slice(0, 6).toUpperCase()}`,
    proofPath,
    proofName,
    createdAt: new Date().toISOString(),
  };
  db.transactions.push(tx);
  await saveDb(db);
  return json({
    success: true,
    transaction: tx,
    message: "Deposit submitted. An admin will review your screenshot and credit your balance when approved.",
  });
}
