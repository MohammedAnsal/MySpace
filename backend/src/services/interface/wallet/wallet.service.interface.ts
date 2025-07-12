import {
  WalletResponseDTO,
  TransactionDTO,
} from "../../../dtos/wallet/wallet.dto";

export interface IWalletService {
  createUserWallet(userId: string): Promise<WalletResponseDTO>;
  createProviderWallet(providerId: string): Promise<WalletResponseDTO>;
  createAdminWallet(adminId: string): Promise<WalletResponseDTO>;
  getUserWallet(userId: string): Promise<WalletResponseDTO>;
  getProviderWallet(providerId: string): Promise<WalletResponseDTO>;
  getAdminWallet(adminId: string): Promise<WalletResponseDTO>;
  getTransactions(userId: string, role: string): Promise<TransactionDTO[]>;
  distributeBookingAmount(
    bookingId: string,
    providerId: string,
    amount: number
  ): Promise<boolean>;
  processRefund(bookingId: string , hostelName:string): Promise<boolean>;
}
