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

  // async getBookingDetails(req: Request, res: Response): Promise<void> {
  //   try {
  //     const { bookingId } = req.params;
  //     const booking = await this.bookingService.getBookingDetails(bookingId);

  //     res.status(200).json({
  //       status: "success",
  //       data: booking,
  //     });
  //   } catch (error) {
  //     if (error instanceof AppError) {
  //       res.status(error.statusCode).json({
  //         status: "error",
  //         message: error.message,
  //       });
  //     } else {
  //       res.status(500).json({
  //         status: "error",
  //         message: "Internal server error",
  //       });
  //     }
  //   }
  // }

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

  // async getHostelBookings(req: Request, res: Response): Promise<void> {
  //   try {
  //     const { hostelId } = req.params;
  //     const bookings = await this.bookingService.getHostelBookings(hostelId);

  //     res.status(200).json({
  //       status: "success",
  //       data: bookings,
  //     });
  //   } catch (error) {
  //     if (error instanceof AppError) {
  //       res.status(error.statusCode).json({
  //         status: "error",
  //         message: error.message,
  //       });
  //     } else {
  //       res.status(500).json({
  //         status: "error",
  //         message: "Internal server error",
  //       });
  //     }
  //   }
  // }

  // async updateBooking(req: Request, res: Response): Promise<void> {
  //   try {
  //     const { bookingId } = req.params;
  //     const updateData = req.body;

  //     // Validate update data
  //     //   const validationError = validateUpdateData(updateData);
  //     //   if (validationError) {
  //     //     throw new AppError(validationError, 400);
  //     //   }

  //     const updatedBooking = await this.bookingService.updateBooking(
  //       bookingId,
  //       updateData
  //     );

  //     res.status(200).json({
  //       status: "success",
  //       data: updatedBooking,
  //     });
  //   } catch (error) {
  //     if (error instanceof AppError) {
  //       res.status(error.statusCode).json({
  //         status: "error",
  //         message: error.message,
  //       });
  //     } else {
  //       res.status(500).json({
  //         status: "error",
  //         message: "Internal server error",
  //       });
  //     }
  //   }
  // }

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

      // Check if the booking belongs to the user
      // if (booking.userId.toString() !== userId) {
      //   throw new AppError(
      //     "You are not authorized to cancel this booking",
      //     403
      //   );
      // }

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

  // async processPayment(req: AuthRequset, res: Response): Promise<void> {
  //   try {
  //     const userId = req.user?.id;
  //     if (!userId) {
  //       throw new AppError("User not authenticated", 401);
  //     }
  //     const { bookingId } = req.params;
  //     const paymentDetails = req.body;

  //     const updatedBooking = await this.bookingService.processPayment(
  //       bookingId,
  //       paymentDetails
  //     );

  //     res.status(200).json({
  //       status: "success",
  //       data: updatedBooking,
  //     });
  //   } catch (error) {
  //     if (error instanceof AppError) {
  //       res.status(error.statusCode).json({
  //         status: "error",
  //         message: error.message,
  //       });
  //     } else {
  //       res.status(500).json({
  //         status: "error",
  //         message: "Internal server error",
  //       });
  //     }
  //   }
  // }

  // async checkAvailability(req: AuthRequset, res: Response): Promise<void> {
  //   try {
  //     const userId = req.user?.id;
  //     if (!userId) {
  //       throw new AppError("User not authenticated", 401);
  //     }
  //     const { hostelId, checkIn, checkOut, selectedSpace } = req.query;

  //     if (!hostelId || !checkIn || !checkOut || !selectedSpace) {
  //       throw new AppError("Missing required query parameters", 400);
  //     }

  //     const isAvailable = await this.bookingService.checkAvailability(
  //       hostelId as string,
  //       new Date(checkIn as string),
  //       new Date(checkOut as string),
  //       selectedSpace as string
  //     );

  //     res.status(200).json({
  //       status: "success",
  //       data: {
  //         isAvailable,
  //       },
  //     });
  //   } catch (error) {
  //     if (error instanceof AppError) {
  //       res.status(error.statusCode).json({
  //         status: "error",
  //         message: error.message,
  //       });
  //     } else {
  //       res.status(500).json({
  //         status: "error",
  //         message: "Internal server error",
  //       });
  //     }
  //   }
  // }
}

export const bookingContrller = Container.get(BookingController);
