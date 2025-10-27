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
import { IAdminFacilityService } from "../../../services/interface/admin/facility.service.interface";
import { adminFacilityService } from "../../../services/implements/admin/facility.service";
import { StripeService } from "../../../services/implements/payment/stripe.service";
import { Types } from "mongoose";

@Service()
class BookingController implements IBookingController {
  private bookingService: IBookingService;
  private walletService: IWalletService;
  private adminFacilityService: IAdminFacilityService;

  constructor(private stripeService: StripeService) {
    this.bookingService = bookingService;
    this.walletService = walletService;
    this.adminFacilityService = adminFacilityService;
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

      const hostelName = booking.hostelId.hostel_name;

      const cancelledBooking = await this.bookingService.cancelBooking(
        bookingId,
        reason
      );

      if (cancelledBooking.paymentStatus === "cancelled") {
        try {
          await this.walletService.processRefund(bookingId, hostelName);
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

  async createFacilityPaymentSession(
    req: AuthRequset,
    res: Response
  ): Promise<Response> {
    try {
      const userId = req.user?.id;
      const { bookingId } = req.params;
      const { facilities } = req.body;

      if (!userId) {
        throw new AppError("User not authenticated", HttpStatus.UNAUTHORIZED);
      }
      if (
        !facilities ||
        !Array.isArray(facilities) ||
        facilities.length === 0
      ) {
        throw new AppError("No facilities provided", HttpStatus.BAD_REQUEST);
      }

      // Calculate total cost for selected facilities
      let totalAmount = 0;
      for (const f of facilities) {
        const facility = await this.adminFacilityService.findFacilityById(f.id);
        if (!facility || !facility.facilityData)
          throw new AppError("Facility not found", HttpStatus.NOT_FOUND);

        let facilityData = facility.facilityData;
        if (Array.isArray(facilityData)) {
          facilityData = facilityData[0];
        }
        if (!facilityData || typeof facilityData.price !== "number") {
          throw new AppError("Facility not found", HttpStatus.NOT_FOUND);
        }
        totalAmount += facilityData.price * f.duration;
      }

      const booking = await bookingService.getBookingById(bookingId);
      if (!booking)
        throw new AppError("Booking not found", HttpStatus.NOT_FOUND);

      const successUrl = `${process.env.CLIENT_URL}/user/bookings/${bookingId}?facilityPayment=success`;
      const cancelUrl = `${process.env.CLIENT_URL}/user/bookings/${bookingId}?facilityPayment=cancel`;

      const sessionUrl = await this.stripeService.createCheckoutSession({
        hostelId: new Types.ObjectId(booking.hostelId._id),
        userId: new Types.ObjectId(userId),
        providerId: new Types.ObjectId(booking.providerId._id),
        bookingId: new Types.ObjectId(bookingId),
        amount: totalAmount,
        currency: "USD",
        successUrl,
        cancelUrl,
        metadata: {
          type: "facility",
          facilities: JSON.stringify(facilities),
        },
      });

      return res.status(HttpStatus.OK).json({
        status: "success",
        checkoutUrl: sessionUrl,
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

  //  Monthly Pyamnet :-

  async processMonthlyPayment(
    req: AuthRequset,
    res: Response
  ): Promise<Response> {
    try {
      const userId = req.user?.id;
      const { bookingId } = req.params;
      const { month } = req.body;

      if (!userId) {
        throw new AppError("User not authenticated", HttpStatus.UNAUTHORIZED);
      }

      if (!month || month < 1) {
        throw new AppError(
          "Valid month number is required",
          HttpStatus.BAD_REQUEST
        );
      }

      const booking = await this.bookingService.getBookingById(bookingId);
      if (!booking) {
        throw new AppError("Booking not found", HttpStatus.NOT_FOUND);
      }

      if (booking.userId._id.toString() !== userId) {
        throw new AppError(
          "Unauthorized access to booking",
          HttpStatus.UNAUTHORIZED
        );
      }

      const successUrl = `${process.env.CLIENT_URL}/user/bookings/${bookingId}?monthlyPayment=success&month=${month}`;
      const cancelUrl = `${process.env.CLIENT_URL}/user/bookings/${bookingId}?monthlyPayment=cancel&month=${month}`;

      const checkoutUrl = await this.stripeService.createCheckoutSession({
        hostelId: new Types.ObjectId(booking.hostelId._id),
        userId: new Types.ObjectId(userId),
        providerId: new Types.ObjectId(booking.providerId._id),
        bookingId: new Types.ObjectId(bookingId),
        amount: booking.monthlyRent,
        currency: "USD",
        successUrl,
        cancelUrl,
        metadata: {
          type: "monthly_payment",
          month: month.toString(),
          bookingId: bookingId,
        },
      });

      return res.status(HttpStatus.OK).json({
        status: "success",
        data: {
          checkoutUrl,
          month,
          amount: booking.monthlyRent,
        },
      });
    } catch (error) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({
          status: "error",
          message: error.message,
        });
      }
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        status: "error",
        message: "Internal server error",
      });
    }
  }
}

export const bookingContrller = Container.get(BookingController);
