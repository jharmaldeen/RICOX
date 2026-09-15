import { promises as fs } from "fs";
import path from "path";
import bcrypt from "bcryptjs";
import type { Database } from "@/lib/types";

const DB_PATH = path.join(process.cwd(), "data", "db.json");

let memory: Database | null = null;
let writeQueue: Promise<void> = Promise.resolve();

const emptyDb = (): Database => ({
  users: [],
  investments: [],
  transactions: [],
  bankAccounts: [],
  paymentMethods: [],
  messages: [],
  subscribers: [],
  passwordResets: [],
});

async function seed(db: Database): Promise<Database> {
  if (db.users.length) return db;
  const passwordHash = await bcrypt.hash("RicoxDemo1", 10);
  const demoId = "demo-user";
  db.users.push({
    id: demoId,
    name: "Demo Investor",
    email: "demo@ricox.com",
    passwordHash,
    role: "user",
    profileImage: "/images/people/investor-1.jpeg",
    referralCode: "DEMO4F2A",
    balance: 12500,
    createdAt: "2026-01-12T10:00:00.000Z",
  });
  db.investments.push(
    {
      id: "inv-1",
      userId: demoId,
      dealId: "1",
      dealName: "Quantum Chain",
      amount: 5000,
      status: "active",
      createdAt: "2026-02-03T12:00:00.000Z",
    },
    {
      id: "inv-2",
      userId: demoId,
      dealId: "2",
      dealName: "BlockVault",
      amount: 2500,
      status: "active",
      createdAt: "2026-03-18T12:00:00.000Z",
    },
  );
  db.transactions.push(
    {
      id: "tx-1",
      userId: demoId,
      type: "deposit",
      amount: 20000,
      status: "verified",
      method: "Bank transfer",
      reference: "0xRICOXDEPOSIT001",
      createdAt: "2026-01-20T09:00:00.000Z",
    },
    {
      id: "tx-2",
      userId: demoId,
      type: "investment",
      amount: 5000,
      status: "completed",
      method: "Balance",
      reference: "Quantum Chain",
      createdAt: "2026-02-03T12:00:00.000Z",
    },
    {
      id: "tx-3",
      userId: demoId,
      type: "investment",
      amount: 2500,
      status: "completed",
      method: "Balance",
      reference: "BlockVault",
      createdAt: "2026-03-18T12:00:00.000Z",
    },
    {
      id: "tx-4",
      userId: demoId,
      type: "return",
      amount: 680,
      status: "completed",
      method: "Yield",
      reference: "Quantum Chain",
      createdAt: "2026-06-01T12:00:00.000Z",
    },
  );
  db.bankAccounts.push({
    id: "bank-1",
    userId: demoId,
    bankName: "Chase",
    accountName: "Demo Investor",
    accountNumber: "****4218",
    createdAt: "2026-01-15T10:00:00.000Z",
  });
  db.paymentMethods.push(
    {
      id: "pm-1",
      userId: demoId,
      type: "bank",
      label: "Chase checking",
      details: "****4218",
      createdAt: "2026-01-15T10:00:00.000Z",
    },
    {
      id: "pm-2",
      userId: demoId,
      type: "crypto",
      label: "USDT (TRC20)",
      details: "TRicoxDemoWallet9x",
      createdAt: "2026-01-16T10:00:00.000Z",
    },
  );
  return db;
}

export async function getDb(): Promise<Database> {
  if (memory) return memory;
  try {
    const raw = await fs.readFile(DB_PATH, "utf8");
    memory = await seed(JSON.parse(raw) as Database);
  } catch {
    memory = await seed(emptyDb());
    await saveDb(memory);
  }
  return memory;
}

export async function saveDb(next: Database) {
  memory = next;
  writeQueue = writeQueue.then(async () => {
    try {
      await fs.mkdir(path.dirname(DB_PATH), { recursive: true });
      await fs.writeFile(DB_PATH, JSON.stringify(next, null, 2));
    } catch {
      // Vercel and similar hosts are read-only; keep the in-memory copy.
    }
  });
  await writeQueue;
}
