
export interface WalletResponseDTO {
  _id: string;
  userId?: {
    _id: string;
    fullName: string;
    email: string;
  };
  adminId?: string;
  balance: number;
  transactions: WalletTransactionDTO[];
  created_at: Date;
  updated_at: Date;
}

export interface WalletTransactionDTO {
  _id: string;
  amount: number;
  type: "credit" | "debit" | "re-fund";
  status: "completed" | "pending" | "failed";
  description: string;
  bookingId?: string;
  metadata?: Record<string, unknown>;
  created_at: Date;
}

export interface CreateWalletDTO {
  userId?: string;
  adminId?: string;
  balance?: number;
}

export interface TransactionDTO {
  amount: number;
  type: "credit" | "debit" | "re-fund";
  status?: "completed" | "pending" | "failed";
  description: string;
  bookingId?: string;
  metadata?: Record<string, unknown>;
}
