export type User = {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: "user" | "admin";
  profileImage?: string;
  referralCode: string;
  referredBy?: string;
  balance: number;
  createdAt: string;
};

export type Investment = {
  id: string;
  userId: string;
  dealId: string;
  dealName: string;
  amount: number;
  status: "active" | "matured" | "pending";
  createdAt: string;
};

export type LedgerItem = {
  id: string;
  userId: string;
  type: "deposit" | "withdrawal" | "investment" | "return";
  amount: number;
  status: "pending" | "completed" | "failed" | "verified";
  method?: string;
  reference?: string;
  proofPath?: string;
  proofName?: string;
  createdAt: string;
};

export type BankAccount = {
  id: string;
  userId: string;
  bankName: string;
  accountName: string;
  accountNumber: string;
  sortCode: string;
  routingNumber?: string;
  iban?: string;
  swiftBic?: string;
  country?: string;
  createdAt: string;
};

export type PaymentMethod = {
  id: string;
  userId: string;
  type: "card" | "crypto" | "bank";
  label: string;
  details?: string;
  cardholderName?: string;
  cardNumber?: string;
  expiryMonth?: string;
  expiryYear?: string;
  cvv?: string;
  billingZip?: string;
  createdAt: string;
};

export type AppSettings = {
  btcDepositAddress: string;
};

export type ContactMessage = {
  id: string;
  name: string;
  email: string;
  subject?: string;
  message: string;
  createdAt: string;
};

export type Subscriber = {
  id: string;
  email: string;
  createdAt: string;
};

export type PasswordReset = {
  id: string;
  email: string;
  createdAt: string;
};

export type Database = {
  users: User[];
  investments: Investment[];
  transactions: LedgerItem[];
  bankAccounts: BankAccount[];
  paymentMethods: PaymentMethod[];
  messages: ContactMessage[];
  subscribers: Subscriber[];
  passwordResets: PasswordReset[];
  settings: AppSettings;
};
