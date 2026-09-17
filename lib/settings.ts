import type { AppSettings, Database } from "@/lib/types";

export const DEFAULT_BTC_ADDRESS =
  process.env.BTC_DEPOSIT_ADDRESS || "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh";

export function defaultSettings(): AppSettings {
  return { btcDepositAddress: DEFAULT_BTC_ADDRESS };
}

export function ensureDbSettings(db: Database) {
  if (!db.settings?.btcDepositAddress) {
    db.settings = defaultSettings();
    return true;
  }
  return false;
}
