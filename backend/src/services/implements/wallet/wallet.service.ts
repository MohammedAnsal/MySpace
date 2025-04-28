import Container, { Service } from "typedi";
import { IWalletService } from "../../interface/wallet/wallet.service.interface";
import { IBookingRepository } from "../../../repositories/interfaces/user/booking.Irepository";
import { UserRepository } from "../../../repositories/implementations/user/user.repository";
import { bookingRepository } from "../../../repositories/implementations/user/booking.repository";
import { IWallet, IWalletTransaction } from "../../../models/wallet.model";
import { walletRepository } from "../../../repositories/implementations/wallet/wallet.repository";
import { AppError } from "../../../utils/error";
import { HttpStatus } from "../../../enums/http.status";
import dotenv from "dotenv";
import { IWalletRepository } from "../../../repositories/interfaces/wallet/wallet.Irepository";
import { Types } from "mongoose";

dotenv.config();

interface PopulatedId {
  _id: Types.ObjectId;
}

@Service()
export class WalletService implements IWalletService {
  private walletRepo: IWalletRepository;
  private adminId: string;

  constructor(private userRepo: UserRepository) {
    this.walletRepo = walletRepository;
    // Get adminId from environment variables
    this.adminId = process.env.ADMIN_ID || "";
    if (!this.adminId) {
      console.warn("ADMIN_ID is not defined in environment variables");
    }
  }

  async createWallet(bookingId: string, walletData: IWallet): Promise<IWallet> {
    try {
      return await this.walletRepo.createWallet(walletData);
    } catch (error) {
      throw new AppError(
        "Failed to create wallet",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async createUserWallet(userId: string): Promise<IWallet> {
    try {
      const walletData: Partial<IWallet> = {
        userId: userId as any,
        balance: 0,
        transactions: [] as any,
      };

      return await this.walletRepo.createWallet(walletData as IWallet);
    } catch (error) {
      throw new AppError(
        "Failed to create user wallet",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async createProviderWallet(providerId: string): Promise<IWallet> {
    try {
      const walletData: Partial<IWallet> = {
        userId: providerId as any,
        balance: 0,
        transactions: [] as any,
      };

      return await this.walletRepo.createWallet(walletData as IWallet);
    } catch (error) {
      throw new AppError(
        "Failed to create provider wallet",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async createAdminWallet(adminId: string): Promise<IWallet> {
    try {
      const walletData: Partial<IWallet> = {
        adminId: adminId as any,
        balance: 0,
        transactions: [] as any,
      };

      return await this.walletRepo.createWallet(walletData as IWallet);
    } catch (error) {
      throw new AppError(
        "Failed to create admin wallet",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getUserWallet(userId: string): Promise<IWallet> {
    try {
      const wallet = await this.walletRepo.findWalletByUserId(userId);

      if (!wallet) {
        throw new AppError("Wallet not found", HttpStatus.NOT_FOUND);
      }

      return wallet;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(
        "Failed to fetch user wallet",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getProviderWallet(providerId: string): Promise<IWallet> {
    try {
      const wallet = await this.walletRepo.findWalletByUserId(providerId);

      if (!wallet) {
        throw new AppError("Wallet not found", HttpStatus.NOT_FOUND);
      }

      return wallet;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(
        "Failed to fetch provider wallet",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getAdminWallet(adminId: string): Promise<IWallet> {
    try {
      const wallet = await this.walletRepo.findWalletByAdminId(adminId);

      if (!wallet) {
        throw new AppError("Wallet not found", HttpStatus.NOT_FOUND);
      }

      return wallet;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(
        "Failed to fetch admin wallet",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getTransactions(
    userId: string,
    role: string
  ): Promise<IWalletTransaction[]> {
    try {
      let wallet;

      if (role === "admin") {
        wallet = await this.walletRepo.findWalletByAdminId(userId);
      } else {
        wallet = await this.walletRepo.findWalletByUserId(userId);
      }

      if (!wallet) {
        throw new AppError("Wallet not found", HttpStatus.NOT_FOUND);
      }

      return wallet.transactions;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(
        "Failed to fetch transactions",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async distributeBookingAmount(
    bookingId: string,
    providerId: string,
    amount: number
  ): Promise<boolean> {
    try {
      if (!this.adminId) {
        throw new AppError(
          "Admin ID is not configured",
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      }

      console.log(bookingId, "bbbb");
      console.log(providerId, "pppp");
      console.log(amount, "amamam");

      // Check if provider wallet exists, if not create one
      const providerWallet = await this.walletRepo.findWalletByUserId(
        providerId
      );
      if (!providerWallet) {
        await this.createProviderWallet(providerId);
      }

      // Check if admin wallet exists, if not create one
      const adminWallet = await this.walletRepo.findWalletByAdminId(
        this.adminId
      );
      if (!adminWallet) {
        await this.createAdminWallet(this.adminId);
      }

      // Distribute the booking amount
      await this.walletRepo.distributeBookingAmount(
        bookingId,
        providerId,
        this.adminId,
        amount
      );
      return true;
    } catch (error) {
      console.error("Error distributing booking amount:", error);
      if (error instanceof AppError) throw error;
      throw new AppError(
        "Failed to distribute booking amount",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async processRefund(bookingId: string): Promise<boolean> {
    try {
      if (!this.adminId) {
        throw new AppError(
          "Admin ID is not configured",
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      }

      // 1. Get the booking details to find userId, providerId and amount
      const booking = await bookingRepository.getBookingById(bookingId);
      if (!booking) {
        throw new AppError("Booking not found", HttpStatus.NOT_FOUND);
      }

      // Check if booking is already cancelled
      if (booking.paymentStatus !== "cancelled") {
        throw new AppError(
          "Refund can only be processed for cancelled bookings",
          HttpStatus.BAD_REQUEST
        );
      }

      const amount = booking.firstMonthRent;
      const userId = (booking.userId as unknown as PopulatedId)._id;
      const providerId = (booking.providerId as unknown as PopulatedId)._id;

      // 2. Check if all wallets exist
      const userWallet = await this.walletRepo.findWalletByUserId(
        userId.toString()
      );
      if (!userWallet) {
        // Create user wallet if it doesn't exist
        await this.createUserWallet(userId.toString());
      }

      const providerWallet = await this.walletRepo.findWalletByUserId(
        providerId.toString()
      );
      if (!providerWallet) {
        throw new AppError("Provider wallet not found", HttpStatus.NOT_FOUND);
      }

      const adminWallet = await this.walletRepo.findWalletByAdminId(
        this.adminId
      );
      if (!adminWallet) {
        throw new AppError("Admin wallet not found", HttpStatus.NOT_FOUND);
      }

      // 3. Process the refund by reverting the distribution (70% from provider, 30% from admin)
      await this.walletRepo.processRefund(
        bookingId,
        userId.toString(),
        providerId.toString(),
        this.adminId,
        amount
      );

      return true;
    } catch (error) {
      console.error("Error processing refund:", error);
      if (error instanceof AppError) throw error;
      throw new AppError(
        "Failed to process refund",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}

export const walletService = Container.get(WalletService);
