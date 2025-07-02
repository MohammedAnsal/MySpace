import Container, { Service } from "typedi";
import { IWalletService } from "../../interface/wallet/wallet.service.interface";
import { bookingRepository } from "../../../repositories/implementations/user/booking.repository";
import { IWallet } from "../../../models/wallet.model";
import { walletRepository } from "../../../repositories/implementations/wallet/wallet.repository";
import { AppError } from "../../../utils/error";
import { HttpStatus } from "../../../enums/http.status";
import { IWalletRepository } from "../../../repositories/interfaces/wallet/wallet.Irepository";
import { Types } from "mongoose";
import {
  WalletResponseDTO,
  TransactionDTO,
  mapToWalletDTO,
} from "../../../dtos/wallet/wallet.dto";

interface PopulatedId {
  _id: Types.ObjectId;
}

@Service()
export class WalletService implements IWalletService {
  private walletRepo: IWalletRepository;
  private adminId: string;

  constructor() {
    this.walletRepo = walletRepository;
    this.adminId = process.env.ADMIN_ID || "";
    if (!this.adminId) {
      console.warn("ADMIN_ID is not defined in environment variables");
    }
  }

  //  Create user wallet :-

  async createUserWallet(userId: string): Promise<WalletResponseDTO> {
    try {
      const walletData: Partial<IWallet> = {
        userId: new Types.ObjectId(userId),
        balance: 0,
        transactions: [],
      };

      const wallet = await this.walletRepo.createWallet(walletData as IWallet);
      return mapToWalletDTO(wallet);
    } catch (error) {
      throw new AppError(
        "Failed to create user wallet",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  //  Create provider wallet :-

  async createProviderWallet(providerId: string): Promise<WalletResponseDTO> {
    try {
      const walletData: Partial<IWallet> = {
        userId: new Types.ObjectId(providerId),
        balance: 0,
        transactions: [],
      };

      const wallet = await this.walletRepo.createWallet(walletData as IWallet);
      return mapToWalletDTO(wallet);
    } catch (error) {
      throw new AppError(
        "Failed to create provider wallet",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  //  Create admin wallet :-

  async createAdminWallet(adminId: string): Promise<WalletResponseDTO> {
    try {
      const walletData: Partial<IWallet> = {
        adminId: new Types.ObjectId(adminId),
        balance: 0,
        transactions: [],
      };

      const wallet = await this.walletRepo.createWallet(walletData as IWallet);
      return mapToWalletDTO(wallet);
    } catch (error) {
      throw new AppError(
        "Failed to create admin wallet",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  //  Get user wallet :-

  async getUserWallet(userId: string): Promise<WalletResponseDTO> {
    try {
      const wallet = await this.walletRepo.findWalletByUserId(userId);
      if (!wallet) {
        throw new AppError("Wallet not found", HttpStatus.NOT_FOUND);
      }
      return mapToWalletDTO(wallet);
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(
        "Failed to fetch user wallet",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  //  Get provider wallet :-

  async getProviderWallet(providerId: string): Promise<WalletResponseDTO> {
    try {
      const wallet = await this.walletRepo.findWalletByUserId(providerId);

      if (!wallet) {
        throw new AppError("Wallet not found", HttpStatus.NOT_FOUND);
      }

      return mapToWalletDTO(wallet);
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(
        "Failed to fetch provider wallet",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  //  Get admin wallet :-

  async getAdminWallet(adminId: string): Promise<WalletResponseDTO> {
    try {
      const wallet = await this.walletRepo.findWalletByAdminId(adminId);

      if (!wallet) {
        throw new AppError("Wallet not found", HttpStatus.NOT_FOUND);
      }

      return mapToWalletDTO(wallet);
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(
        "Failed to fetch admin wallet",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  //  Get wallet transaction :-

  async getTransactions(
    userId: string,
    role: string
  ): Promise<TransactionDTO[]> {
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

      return wallet.transactions.map((tx) => ({
        _id: tx._id.toString(),
        amount: tx.amount,
        type: tx.type,
        status: tx.status,
        description: tx.description,
        bookingId: tx.bookingId?.toString(),
        metadata: tx.metadata,
        created_at: tx.createdAt,
      }));
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(
        "Failed to fetch transactions",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  //  For distribute booking money :-

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

      const providerWallet = await this.walletRepo.findWalletByUserId(
        providerId
      );
      if (!providerWallet) {
        await this.createProviderWallet(providerId);
      }

      const adminWallet = await this.walletRepo.findWalletByAdminId(
        this.adminId
      );
      if (!adminWallet) {
        await this.createAdminWallet(this.adminId);
      }

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

  //  Re-fund handling :- (User)

  async processRefund(bookingId: string): Promise<boolean> {
    try {
      if (!this.adminId) {
        throw new AppError(
          "Admin ID is not configured",
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      }

      const booking = await bookingRepository.getBookingById(bookingId);
      if (!booking) {
        throw new AppError("Booking not found", HttpStatus.NOT_FOUND);
      }

      if (booking.paymentStatus !== "cancelled") {
        throw new AppError(
          "Refund can only be processed for cancelled bookings",
          HttpStatus.BAD_REQUEST
        );
      }

      const amount = booking.firstMonthRent;
      const userId = (booking.userId as unknown as PopulatedId)._id;
      const providerId = (booking.providerId as unknown as PopulatedId)._id;

      const userWallet = await this.walletRepo.findWalletByUserId(
        userId.toString()
      );
      if (!userWallet) {
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
