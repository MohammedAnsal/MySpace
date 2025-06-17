import { Response } from "express";
import { AuthRequset } from "../../../types/api";
import { IBookingController } from "../../interface/user/booking.controller.interface";
import { IBookingService } from "../../../services/interface/user/booking.service.interface";
import { AppError } from "../../../utils/error";
import Container, { Service } from "typedi";
import { bookingService } from "../../../services/implements/user/booking.service";
import { walletService } from "../../../services/implements/wallet/wallet.service";
import { IWalletService } from "../../../services/interface/wallet/wallet.service.interface";

@Service()
class BookingController implements IBookingController {
  private bookingService: IBookingService;
  private walletService: IWalletService;

  constructor() {
    this.bookingService = bookingService;
    this.walletService = walletService;
  }

  //  Create booking :-

  async createBooking(req: AuthRequset, res: Response): Promise<void> {
    try {
      const {
        hostelId,
        checkIn,
        checkOut,
        stayDurationInMonths,
        selectedFacilities,
      } = req.body;

      const proof = req.file;

      const userId = req.user?.id;
      if (!userId) {
        throw new AppError("User not authenticated", 401);
      }

      let parsedFacilities = [];
      try {
        parsedFacilities = JSON.parse(selectedFacilities);
        if (!Array.isArray(parsedFacilities)) {
          throw new Error("Invalid facilities format");
        }
      } catch (error) {
        throw new AppError("Invalid facilities data format", 400);
      }

      const bookingData = {
        userId,
        hostelId,
        providerId: req.body.providerId,
        checkIn: new Date(checkIn),
        checkOut: new Date(checkOut),
        stayDurationInMonths,
        selectedFacilities: parsedFacilities,
      };

      const booking = await this.bookingService.createBooking(
        {
          ...bookingData,
          proof: proof || null,
        },
        parsedFacilities
      );

      res.status(201).json({
        status: "success",
        data: booking,
      });
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({
          status: "error",
          message: error.message,
        });
      } else {
        res.status(500).json({
          status: "error",
          message: "Internal server error",
        });
      }
    }
  }

  //  Get single booking details :-

  async getBookingDetails(req: AuthRequset, res: Response): Promise<void> {
    try {
      const { bookingId } = req.params;
      const booking = await this.bookingService.getBookingById(bookingId);

      res.status(200).json({
        status: "success",
        data: booking,
      });
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({
          status: "error",
          message: error.message,
        });
      } else {
        res.status(500).json({
          status: "error",
          message: "Internal server error",
        });
      }
    }
  }

  //  Get provider bookig's :-

  async getProviderBookings(req: AuthRequset, res: Response): Promise<void> {
    try {
      const providerId = req.user?.id;
      if (!providerId) {
        throw new AppError("Provider not authenticated", 401);
      }

      const bookings = await this.bookingService.getProviderBookings(
        providerId
      );

      res.status(200).json({
        status: "success",
        data: bookings,
      });
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({
          status: "error",
          message: error.message,
        });
      } else {
        res.status(500).json({
          status: "error",
          message: "Internal server error",
        });
      }
    }
  }

  //  Get user bookig's :-

  async getUserBookings(req: AuthRequset, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new AppError("User not authenticated", 401);
      }

      const bookings = await this.bookingService.getUserBookings(userId);

      res.status(200).json({
        status: "success",
        data: bookings,
      });
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({
          status: "error",
          message: error.message,
        });
      } else {
        res.status(500).json({
          status: "error",
          message: "Internal server error",
        });
      }
    }
  }

  //  Get all bookig's :-

  async getAllBookings(req: AuthRequset, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new AppError("User not authenticated", 401);
      }

      const bookings = await this.bookingService.getAllBookings();

      res.status(200).json({
        status: "success",
        data: bookings,
      });
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({
          status: "error",
          message: error.message,
        });
      } else {
        res.status(500).json({
          status: "error",
          message: "Internal server error",
        });
      }
    }
  }

  //  Cancel booking :-

  async cancelBooking(req: AuthRequset, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;

      if (!userId) {
        throw new AppError("User not authenticated", 401);
      }
      const { bookingId } = req.params;
      const { reason } = req.body;

      if (!reason) {
        throw new AppError("Cancellation reason is required", 400);
      }

      // Get the booking to check the check-in date
      const booking = await this.bookingService.getBookingById(bookingId);

      // Check if today is before the check-in date
      const today = new Date();
      const checkInDate = new Date(booking.checkIn);

      if (today >= checkInDate) {
        throw new AppError(
          "Cancellation is only allowed before the check-in date",
          400
        );
      }

      const cancelledBooking = await this.bookingService.cancelBooking(
        bookingId,
        reason
      );

      if (cancelledBooking.paymentStatus === "cancelled") {
        try {
          await this.walletService.processRefund(bookingId);
        } catch (refundError) {
          console.error("Refund processing error:", refundError);
        }
      }

      res.status(200).json({
        status: "success",
        message: "Booking cancelled successfully",
        data: cancelledBooking,
      });
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({
          status: "error",
          message: error.message,
        });
      } else {
        res.status(500).json({
          status: "error",
          message: "Internal server error",
        });
      }
    }
  }
}

export const bookingContrller = Container.get(BookingController);
