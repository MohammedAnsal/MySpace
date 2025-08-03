import { Service } from "typedi";
import cron from "node-cron";
import Booking from "../../../models/booking.model";
import { notificationService } from "../notification/notification.service";
import socketService from "../socket/socket.service";
import mongoose from "mongoose";
import { Hostel } from "../../../models/provider/hostel.model";
import { HostelPaymentModel } from "../../../models/payment.model";

@Service()
export class CronService {
  constructor() {
    this.initializeCronJobs();
  }

  private initializeCronJobs() {
    // Run every day at midnight
    cron.schedule("0 0 * * *", async () => {
      try {
        await this.checkRentReminders();
      } catch (error) {
        console.error("Error in rent reminder cron job:", error);
      }
    });

    cron.schedule("* * * * *", async () => {
      try {
        await this.cleanUpExpiredBookings();
        await this.deleteExpiredBookings();
      } catch (error) {
        console.error("Error in expired booking cleanup cron job:", error);
      }
    });
  }

  private async checkRentReminders() {
    const today = new Date();
    const oneWeekFromNow = new Date(today);
    oneWeekFromNow.setDate(today.getDate() + 7);

    const bookings = await Booking.find({
      paymentStatus: "completed",
      checkOut: { $gt: today },
      $or: [
        {
          "selectedFacilities.startDate": {
            $lte: oneWeekFromNow,
            $gt: today,
          },
        },
        {
          checkIn: {
            $lte: oneWeekFromNow,
            $gt: today,
          },
        },
      ],
    }).populate({
      path: "userId providerId hostelId",
      select: "_id hostel_name",
    });

    for (const booking of bookings) {
      type PopulatedHostel = { hostel_name: string };

      const hostelName =
        typeof booking.hostelId === "object" &&
        booking.hostelId &&
        "hostel_name" in booking.hostelId
          ? (booking.hostelId as PopulatedHostel).hostel_name
          : "your hostel";

      const userNotification = await notificationService.createNotification({
        recipient: new mongoose.Types.ObjectId(booking.userId.toString()),
        sender: new mongoose.Types.ObjectId(booking.providerId.toString()),
        title: "Rent Payment Reminder",
        message: `Your next rent payment for ${hostelName} is due in one week.`,
        type: "rent_reminder",
      });

      socketService.emitNotification(booking.userId.toString(), {
        ...userNotification,
        recipient: userNotification.recipient.toString(),
      });

      const providerNotification = await notificationService.createNotification(
        {
          recipient: new mongoose.Types.ObjectId(booking.providerId.toString()),
          sender: new mongoose.Types.ObjectId(booking.userId.toString()),
          title: "Upcoming Rent Payment",
          message: `A rent payment for ${hostelName} is due in one week.`,
          type: "rent_reminder",
        }
      );

      socketService.emitNotification(booking.providerId.toString(), {
        ...providerNotification,
        recipient: providerNotification.recipient.toString(),
      });
    }
  }

  private async cleanUpExpiredBookings() {
    const now = new Date();

    const expiredBookings = await Booking.find({
      paymentStatus: "pending",
      paymentExpiry: { $lt: now },
    });

    for (const booking of expiredBookings) {
      await Booking.updateOne(
        { _id: booking._id },
        { $set: { paymentStatus: "expired" } }
      );

      await HostelPaymentModel.updateOne(
        { bookingId: booking._id },
        { $set: { status: "expired" } }
      );

      await Hostel.updateOne(
        { _id: booking.hostelId },
        { $inc: { available_space: 1 } }
      );
    }
  }

  private async deleteExpiredBookings() {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

    const expiredBookingsToDelete = await Booking.find({
      paymentStatus: "expired",
      paymentExpiry: { $lt: oneHourAgo },
    });

    if (expiredBookingsToDelete.length > 0) {
      for (const booking of expiredBookingsToDelete) {
        try {
          // Delete the booking
          await Booking.findByIdAndDelete(booking._id);

          // Also delete related payment records
          await HostelPaymentModel.deleteOne({ bookingId: booking._id });

          console.log(`Deleted expired booking: ${booking._id}`);
        } catch (error) {
          console.error(`Error deleting booking ${booking._id}:`, error);
        }
      }
    }

    console.log(
      `Successfully deleted ${expiredBookingsToDelete.length} expired bookings`
    );
  }
}

export const cronService = new CronService();
