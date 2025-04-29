import { IWallet, IWalletTransaction } from "../../../models/wallet.model";

export interface IWalletService {
  // createWallet(walletData: IWallet): Promise<IWallet>;
  createUserWallet(userId: string): Promise<IWallet>;
  createProviderWallet(providerId: string): Promise<IWallet>;
  createAdminWallet(adminId: string): Promise<IWallet>;
  getUserWallet(userId: string): Promise<IWallet>;
  getProviderWallet(providerId: string): Promise<IWallet>;
  getAdminWallet(adminId: string): Promise<IWallet>;
  getTransactions(userId: string, role: string): Promise<IWalletTransaction[]>;
  distributeBookingAmount(bookingId: string, providerId: string, amount: number): Promise<boolean>;
  processRefund(bookingId: string): Promise<boolean>;
}
