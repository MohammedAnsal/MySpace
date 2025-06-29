import { IWallet } from "../../models/wallet.model";

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

export function mapToWalletDTO(wallet: IWallet): WalletResponseDTO {
  return {
    _id: wallet._id.toString(),
    userId: wallet.userId
      ? {
          _id: wallet.userId.toString(),
          fullName: "",
          email: "",
        }
      : undefined,
    adminId: wallet.adminId?.toString(),
    balance: wallet.balance,
    transactions: wallet.transactions.map((tx) => ({
      _id: tx._id.toString(),
      amount: tx.amount,
      type: tx.type,
      status: tx.status,
      description: tx.description,
      bookingId: tx.bookingId?.toString(),
      metadata: tx.metadata,
      created_at: tx.createdAt,
    })),
    created_at: wallet.createdAt,
    updated_at: wallet.updatedAt,
  };
}
