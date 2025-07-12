import Container, { Service } from "typedi";
import { IWalletRepository } from "../../interfaces/wallet/wallet.Irepository";
import {
  IWallet,
  IWalletTransaction,
  WalletModel,
} from "../../../models/wallet.model";
import mongoose from "mongoose";

@Service()
export class WalletRepository implements IWalletRepository {
  //  For create wallet :-

  async createWallet(walletData: IWallet): Promise<IWallet> {
    try {
      const wallet = new WalletModel(walletData);
      return await wallet.save();
    } catch (error) {
      throw error;
    }
  }

  //  For find user wallet :-

  async findWalletByUserId(userId: string): Promise<IWallet | null> {
    try {
      return await WalletModel.findOne({
        userId: new mongoose.Types.ObjectId(userId),
      });
    } catch (error) {
      throw error;
    }
  }

  //  For find admin wallet :-

  async findWalletByAdminId(adminId: string): Promise<IWallet | null> {
    try {
      return await WalletModel.findOne({ adminId });
    } catch (error) {
      throw error;
    }
  }

  //  For find wallet balance :-

  async updateBalance(
    walletId: string,
    amount: number
  ): Promise<IWallet | null> {
    try {
      return await WalletModel.findByIdAndUpdate(
        walletId,
        { $inc: { balance: amount } },
        { new: true }
      );
    } catch (error) {
      throw error;
    }
  }

  //  For add wallet transaction :-

  async addTransaction(
    walletId: string,
    transaction: Partial<IWalletTransaction>
  ): Promise<IWallet | null> {
    try {
      return await WalletModel.findByIdAndUpdate(
        walletId,
        {
          $push: { transactions: transaction },
          $inc: {
            balance:
              transaction.type === "credit" || transaction.type === "re-fund"
                ? transaction.amount || 0
                : -(transaction.amount || 0),
          },
        },
        { new: true }
      );
    } catch (error) {
      throw error;
    }
  }

  //  For distribute booking money :-

  async distributeBookingAmount(
    bookingId: string,
    providerId: string,
    adminId: string,
    amount: number
  ): Promise<boolean> {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const providerAmount = amount * 0.9;
      const adminAmount = amount * 0.1;

      const providerWallet = await this.findWalletByUserId(providerId);
      if (!providerWallet) {
        throw new Error(
          `Provider wallet not found for provider ID: ${providerId}`
        );
      }

      const adminWallet = await this.findWalletByAdminId(adminId);
      if (!adminWallet) {
        throw new Error(`Admin wallet not found for admin ID: ${adminId}`);
      }

      await this.addTransaction(providerWallet._id.toString(), {
        amount: providerAmount,
        type: "credit",
        status: "completed",
        description: `Received 90% payment for booking #${bookingId}`,
        bookingId: new mongoose.Types.ObjectId(bookingId),
        createdAt: new Date(),
      });

      await this.addTransaction(adminWallet._id.toString(), {
        amount: adminAmount,
        type: "credit",
        status: "completed",
        description: `Received 10% commission for booking #${bookingId}`,
        bookingId: new mongoose.Types.ObjectId(bookingId),
        createdAt: new Date(),
      });

      await session.commitTransaction();
      session.endSession();
      return true;
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      console.error("Error distributing booking amount:", error);
      throw error;
    }
  }

  //  For wallet re-fund :- (user)

  async processRefund(
    bookingId: string,
    userId: string,
    providerId: string,
    adminId: string,
    amount: number,
    hostelName: string
  ): Promise<boolean> {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const userWallet = await this.findWalletByUserId(userId);
      if (!userWallet) {
        throw new Error(`User wallet not found for user ID: ${userId}`);
      }

      const providerWallet = await this.findWalletByUserId(providerId);
      if (!providerWallet) {
        throw new Error(
          `Provider wallet not found for provider ID: ${providerId}`
        );
      }

      const providerTransaction = providerWallet.transactions.find(
        (tx) =>
          tx.bookingId &&
          tx.bookingId.toString() === bookingId &&
          tx.description.includes("90%")
      );

      if (!providerTransaction) {
        throw new Error("Provider transaction for booking not found.");
      }
      const providerAmount = providerTransaction.amount;

      const adminWallet = await this.findWalletByAdminId(adminId);
      if (!adminWallet) {
        throw new Error(`Admin wallet not found for admin ID: ${adminId}`);
      }

      const adminTransaction = adminWallet.transactions.find(
        (tx) =>
          tx.bookingId &&
          tx.bookingId.toString() === bookingId &&
          tx.description.includes("10%")
      );

      if (!adminTransaction) {
        throw new Error("Admin transaction for booking not found.");
      }
      const adminAmount = adminTransaction.amount;

      await this.addTransaction(providerWallet._id.toString(), {
        amount: providerAmount,
        type: "debit",
        status: "completed",
        description: `Refund payment for cancelled booking #${hostelName}`,
        bookingId: new mongoose.Types.ObjectId(bookingId),
        createdAt: new Date(),
      });

      await this.addTransaction(adminWallet._id.toString(), {
        amount: adminAmount,
        type: "debit",
        status: "completed",
        description: `Refund commission for cancelled booking #${hostelName}`,
        bookingId: new mongoose.Types.ObjectId(bookingId),
        createdAt: new Date(),
      });

      await this.addTransaction(userWallet._id.toString(), {
        amount: amount,
        type: "re-fund",
        status: "completed",
        description: `Refund received for cancelled booking #${hostelName}`,
        bookingId: new mongoose.Types.ObjectId(bookingId),
        createdAt: new Date(),
      });

      await session.commitTransaction();
      session.endSession();
      return true;
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      console.error("Error processing refund:", error);
      throw error;
    }
  }
}

export const walletRepository = Container.get(WalletRepository);
