import { IWallet, IWalletTransaction } from "../../../models/wallet.model";

export interface IWalletRepository {

    createWallet(walletData: IWallet): Promise<IWallet>;
    findWalletByUserId(userId: string): Promise<IWallet | null>;
    findWalletByAdminId(adminId: string): Promise<IWallet | null>;
    updateBalance(walletId: string, amount: number): Promise<IWallet | null>;
    addTransaction(walletId: string, transaction: Partial<IWalletTransaction>): Promise<IWallet | null>;
    distributeBookingAmount(bookingId: string, providerId: string, adminId: string, amount: number): Promise<boolean>;
    processRefund(
        bookingId: string, 
        userId: string, 
        providerId: string, 
        adminId: string, 
        amount: number
    ): Promise<boolean>;

}