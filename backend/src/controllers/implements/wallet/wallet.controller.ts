import { Response } from "express";
import Container, { Service } from "typedi";
import { HttpStatus } from "../../../enums/http.status";
import { AppError } from "../../../utils/error";
import { AuthRequset } from "../../../types/api";
import { IWalletService } from "../../../services/interface/wallet/wallet.service.interface";
import { walletService } from "../../../services/implements/wallet/wallet.service";

@Service()
export class WalletController {
  private walletService: IWalletService;
  constructor() {
    this.walletService = walletService;
  }

  //  Get user wallet :-

  async getUserWallet(req: AuthRequset, res: Response): Promise<Response> {
    try {
      if (!req.user) {
        return res.status(HttpStatus.UNAUTHORIZED).json({
          success: false,
          message: "User not authenticated",
        });
      }

      const userId = req.user.id;

      const wallet = await this.walletService.getUserWallet(userId);

      return res.status(HttpStatus.OK).json({
        success: true,
        data: wallet,
      });
    } catch (error) {
      if (error instanceof AppError) {
        return res
          .status(error.statusCode)
          .json({ message: error.message, success: false });
      }
      console.error("Error fetching user wallet:", error);
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ success: false, message: "Internal server error" });
    }
  }

  //  Get provider wallet :-

  async getProviderWallet(req: AuthRequset, res: Response): Promise<Response> {
    try {
      if (!req.user?.id) {
        return res.status(HttpStatus.UNAUTHORIZED).json({
          success: false,
          message: "Provider not authenticated",
        });
      }

      const providerId = req.user.id;

      const wallet = await this.walletService.getProviderWallet(providerId);

      return res.status(HttpStatus.OK).json({
        success: true,
        data: wallet,
      });
    } catch (error) {
      if (error instanceof AppError) {
        return res
          .status(error.statusCode)
          .json({ message: error.message, success: false });
      }
      console.error("Error fetching provider wallet:", error);
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ success: false, message: "Internal server error" });
    }
  }

  //  Get admin wallet :-

  async getAdminWallet(req: AuthRequset, res: Response): Promise<Response> {
    try {
      const adminId = req.user?.id;

      if (!adminId) {
        return res.status(HttpStatus.UNAUTHORIZED).json({
          success: false,
          message: "Provider not authenticated",
        });
      }

      const wallet = await this.walletService.getAdminWallet(adminId);

      return res.status(HttpStatus.OK).json({
        success: true,
        data: wallet,
      });
    } catch (error) {
      if (error instanceof AppError) {
        return res
          .status(error.statusCode)
          .json({ message: error.message, success: false });
      }
      console.error("Error fetching admin wallet:", error);
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ success: false, message: "Internal server error" });
    }
  }

  //  Get wallet transaction :-

  async getTransactions(req: AuthRequset, res: Response): Promise<Response> {
    try {
      if (!req.user?.id) {
        return res.status(HttpStatus.UNAUTHORIZED).json({
          success: false,
          message: "User not authenticated",
        });
      }

      const userId = req.user.id;
      const role = req.user.role as string;

      const transactions = await this.walletService.getTransactions(
        userId,
        role
      );

      return res.status(HttpStatus.OK).json({
        success: true,
        data: transactions,
      });
    } catch (error) {
      if (error instanceof AppError) {
        return res
          .status(error.statusCode)
          .json({ message: error.message, success: false });
      }
      console.error("Error fetching transactions:", error);
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ success: false, message: "Internal server error" });
    }
  }

  //  Re-fund handling :- (User)

  async processRefund(req: AuthRequset, res: Response): Promise<Response> {
    try {
      if (!req.user?.id) {
        return res.status(HttpStatus.UNAUTHORIZED).json({
          success: false,
          message: "User not authenticated",
        });
      }

      const { bookingId } = req.params;
      if (!bookingId) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: "Booking ID is required",
        });
      }

      const result = await this.walletService.processRefund(bookingId , "");

      return res.status(HttpStatus.OK).json({
        success: true,
        message: "Refund processed successfully",
        data: result,
      });
    } catch (error) {
      if (error instanceof AppError) {
        return res
          .status(error.statusCode)
          .json({ message: error.message, success: false });
      }
      console.error("Error processing refund:", error);
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ success: false, message: "Internal server error" });
    }
  }
}

export const walletController = Container.get(WalletController);
