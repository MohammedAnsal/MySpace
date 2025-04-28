import mongoose, { Types, model, Schema } from "mongoose";

export type TransactionType = "credit" | "debit" | "re-fund";
export type TransactionStatus = "completed" | "pending" | "failed";

export interface IWalletTransaction {
  _id: Types.ObjectId;
  amount: number;
  type: TransactionType;
  status: TransactionStatus;
  description: string;
  bookingId?: Types.ObjectId;
  metadata?: Record<string, unknown>;
  createdAt: Date;
}

export interface IWallet {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  adminId: Types.ObjectId;
  balance: number;
  transactions: IWalletTransaction[];
  createdAt: Date;
  updatedAt: Date;
}

const WalletTransactionSchema = new Schema<IWalletTransaction>(
  {
    amount: { type: Number, required: true },
    type: {
      type: String,
      enum: ["credit", "debit", "re-fund"],
      required: true,
    },
    status: {
      type: String,
      enum: ["completed", "pending", "failed"],
      default: "completed",
    },
    description: { type: String, required: true },
    bookingId: { type: Schema.Types.ObjectId, ref: "Booking" },
    metadata: { type: Map, of: Schema.Types.Mixed },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    _id: true,
  }
);

const WalletSchema = new Schema<IWallet>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      sparse: true,
      unique: true,
    },
    adminId: {
      type: Schema.Types.ObjectId,
      ref: "Admin",
      sparse: true,
    },
    balance: {
      type: Number,
      default: 0,
    },
    transactions: [WalletTransactionSchema],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

WalletSchema.pre("save", function (next) {
  if ((this.userId && this.adminId) || (!this.userId && !this.adminId)) {
    return next(
      new Error("Wallet must belong to either userId or adminId, not both.")
    );
  }
  next();
});

WalletSchema.index({ "transactions.bookingId": 1 });

export const WalletModel = model<IWallet>("Wallet", WalletSchema);
