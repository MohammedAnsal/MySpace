import { Request, Response } from "express";
import { IBookingController } from "../../interface/user/booking.controller.interface";
import { IBookingService } from "../../../services/interface/user/booking.service.interface";
import { AppError } from "../../../utils/error";
import { AuthRequset } from "../../../types/api";
import Container, { Service } from "typedi";
import { bookingService } from "../../../services/implements/user/booking.service";
// import { validateBookingData, validateUpdateData } from "../../../utils/validators/bookingValidator";
@Service()
class BookingController implements IBookingController {
  private bookingService: IBookingService;

  constructor() {
    this.bookingService = bookingService;
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

      const userId = req.user;
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
      const providerId = req.user;
      if (!providerId) {
        throw new AppError("User not authenticated", 401);
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
      const userId = req.user;
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

  async getAllBookings(req: Request, res: Response): Promise<void> {
    try {
      // const userId = req.user;
      // if (!userId) {
      //   throw new AppError("Admin not authenticated", 401);
      // }

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

  async cancelBooking(req: Request, res: Response): Promise<void> {
    try {
      const { bookingId } = req.params;
      const cancelledBooking = await this.bookingService.cancelBooking(
        bookingId
      );

      res.status(200).json({
        status: "success",
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

  async processPayment(req: Request, res: Response): Promise<void> {
    try {
      const { bookingId } = req.params;
      const paymentDetails = req.body;

      const updatedBooking = await this.bookingService.processPayment(
        bookingId,
        paymentDetails
      );

      res.status(200).json({
        status: "success",
        data: updatedBooking,
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

  async checkAvailability(req: Request, res: Response): Promise<void> {
    try {
      const { hostelId, checkIn, checkOut, selectedSpace } = req.query;

      if (!hostelId || !checkIn || !checkOut || !selectedSpace) {
        throw new AppError("Missing required query parameters", 400);
      }

      const isAvailable = await this.bookingService.checkAvailability(
        hostelId as string,
        new Date(checkIn as string),
        new Date(checkOut as string),
        selectedSpace as string
      );

      res.status(200).json({
        status: "success",
        data: {
          isAvailable,
        },
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
