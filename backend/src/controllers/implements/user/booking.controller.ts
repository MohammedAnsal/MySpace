import { Response } from "express";
import { AuthRequset } from "../../../types/api";
import { IBookingController } from "../../interface/user/booking.controller.interface";
import { IBookingService } from "../../../services/interface/user/booking.service.interface";
import { AppError } from "../../../utils/error";
import Container, { Service } from "typedi";
import { bookingService } from "../../../services/implements/user/booking.service";
import { walletService } from "../../../services/implements/wallet/wallet.service";
import { IWalletService } from "../../../services/interface/wallet/wallet.service.interface";
import { HttpStatus } from "../../../enums/http.status";

@Service()
class BookingController implements IBookingController {
  private bookingService: IBookingService;
  private walletService: IWalletService;

  constructor() {
    this.bookingService = bookingService;
    this.walletService = walletService;
  }

  //  Create booking :-

  async createBooking(req: AuthRequset, res: Response): Promise<Response> {
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
        throw new AppError("User not authenticated", HttpStatus.UNAUTHORIZED);
      }

      let parsedFacilities = [];
      try {
        parsedFacilities = JSON.parse(selectedFacilities);
        if (!Array.isArray(parsedFacilities)) {
          throw new Error("Invalid facilities format");
        }
      } catch (error) {
        throw new AppError(
          "Invalid facilities data format",
          HttpStatus.BAD_REQUEST
        );
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

      return res.status(HttpStatus.OK).json({
        status: "success",
        data: booking,
      });
    } catch (error) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({
          status: "error",
          message: error.message,
        });
      } else {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          status: "error",
          message: "Internal server error",
        });
      }
    }
  }

  //  Get single booking details :-

  async getBookingDetails(req: AuthRequset, res: Response): Promise<Response> {
    try {
      const { bookingId } = req.params;
      const booking = await this.bookingService.getBookingById(bookingId);

      return res.status(HttpStatus.OK).json({
        status: "success",
        data: booking,
      });
    } catch (error) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({
          status: "error",
          message: error.message,
        });
      } else {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          status: "error",
          message: "Internal server error",
        });
      }
    }
  }

  //  Get provider bookig's :-

  async getProviderBookings(
    req: AuthRequset,
    res: Response
  ): Promise<Response> {
    try {
      const providerId = req.user?.id;
      if (!providerId) {
        throw new AppError(
          "Provider not authenticated",
          HttpStatus.UNAUTHORIZED
        );
      }

      const bookings = await this.bookingService.getProviderBookings(
        providerId
      );

      return res.status(HttpStatus.OK).json({
        status: "success",
        data: bookings,
      });
    } catch (error) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({
          status: "error",
          message: error.message,
        });
      } else {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          status: "error",
          message: "Internal server error",
        });
      }
    }
  }

  //  Get user bookig's :-

  async getUserBookings(req: AuthRequset, res: Response): Promise<Response> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new AppError("User not authenticated", HttpStatus.UNAUTHORIZED);
      }

      const bookings = await this.bookingService.getUserBookings(userId);

      return res.status(HttpStatus.OK).json({
        status: "success",
        data: bookings,
      });
    } catch (error) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({
          status: "error",
          message: error.message,
        });
      } else {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          status: "error",
          message: "Internal server error",
        });
      }
    }
  }

  //  Get all bookig's :-

  async getAllBookings(req: AuthRequset, res: Response): Promise<Response> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new AppError("User not authenticated", HttpStatus.UNAUTHORIZED);
      }

      const bookings = await this.bookingService.getAllBookings();

      return res.status(HttpStatus.OK).json({
        status: "success",
        data: bookings,
      });
    } catch (error) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({
          status: "error",
          message: error.message,
        });
      } else {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          status: "error",
          message: "Internal server error",
        });
      }
    }
  }

  //  Cancel booking :-

  async cancelBooking(req: AuthRequset, res: Response): Promise<Response> {
    try {
      const userId = req.user?.id;

      if (!userId) {
        throw new AppError("User not authenticated", HttpStatus.UNAUTHORIZED);
      }
      const { bookingId } = req.params;
      const { reason } = req.body;

      if (!reason) {
        throw new AppError(
          "Cancellation reason is required",
          HttpStatus.BAD_REQUEST
        );
      }

      // Get the booking to check the check-in date
      const booking = await this.bookingService.getBookingById(bookingId);

      // Check if today is before the check-in date
      const today = new Date();
      const checkInDate = new Date(booking.checkIn);

      if (today >= checkInDate) {
        throw new AppError(
          "Cancellation is only allowed before the check-in date",
          HttpStatus.BAD_REQUEST
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

      return res.status(HttpStatus.OK).json({
        status: "success",
        message: "Booking cancelled successfully",
        data: cancelledBooking,
      });
    } catch (error) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({
          status: "error",
          message: error.message,
        });
      } else {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          status: "error",
          message: "Internal server error",
        });
      }
    }
  }

  async addFacilitiesToBooking(req: AuthRequset, res: Response): Promise<Response> {
    try {
      const userId = req.user?.id;
      const { bookingId } = req.params;
      const { facilities } = req.body; 

      if (!userId) {
        throw new AppError("User not authenticated", HttpStatus.UNAUTHORIZED);
      }
      if (!facilities || !Array.isArray(facilities) || facilities.length === 0) {
        throw new AppError("No facilities provided", HttpStatus.BAD_REQUEST);
      }

      const updatedBooking = await this.bookingService.addFacilitiesToBooking(
        bookingId,
        userId,
        facilities
      );

      return res.status(HttpStatus.OK).json({
        status: "success",
        data: updatedBooking,
      });
    } catch (error) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({
          status: "error",
          message: error.message,
        });
      } else {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          status: "error",
          message: "Internal server error",
        });
      }
    }
  }
}

export const bookingContrller = Container.get(BookingController);
