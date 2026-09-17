import { promises as fs } from "fs";
import path from "path";
import bcrypt from "bcryptjs";
import type { Database } from "@/lib/types";
import { defaultSettings, ensureDbSettings } from "@/lib/settings";

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
  settings: defaultSettings(),
});

async function ensureAdmin(db: Database): Promise<boolean> {
  if (db.users.some((user) => user.role === "admin" || user.email === "admin@ricox.com")) return false;
  db.users.push({
    id: "admin-user",
    name: "RICOX Admin",
    email: "admin@ricox.com",
    passwordHash: await bcrypt.hash("RicoxAdmin1", 10),
    role: "admin",
    referralCode: "ADMIN001",
    balance: 0,
    createdAt: "2026-01-12T10:00:00.000Z",
  });
  return true;
}

function normalizeRecords(db: Database): boolean {
  let changed = ensureDbSettings(db);
  for (const account of db.bankAccounts) {
    if (account.sortCode === undefined) {
      account.sortCode = "";
      changed = true;
    }
  }
  return changed;
}

async function seed(db: Database): Promise<Database> {
  if (!db.settings) db.settings = defaultSettings();
  if (db.users.length) {
    normalizeRecords(db);
    return db;
  }
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
      method: "BTC",
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
    accountNumber: "12345678",
    sortCode: "04-00-04",
    routingNumber: "021000021",
    country: "US",
    createdAt: "2026-01-15T10:00:00.000Z",
  });
  db.paymentMethods.push({
    id: "pm-card-1",
    userId: demoId,
    type: "card",
    label: "Visa ending 4242",
    cardholderName: "Demo Investor",
    cardNumber: "4242424242424242",
    expiryMonth: "12",
    expiryYear: "2028",
    cvv: "123",
    billingZip: "10001",
    createdAt: "2026-01-15T10:00:00.000Z",
  });
  return db;
}

export async function getDb(): Promise<Database> {
  if (!memory) {
    try {
      const raw = await fs.readFile(DB_PATH, "utf8");
      memory = await seed(JSON.parse(raw) as Database);
    } catch {
      memory = await seed(emptyDb());
    }
  }
  let dirty = await ensureAdmin(memory);
  if (normalizeRecords(memory)) dirty = true;
  if (dirty) await saveDb(memory);
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
