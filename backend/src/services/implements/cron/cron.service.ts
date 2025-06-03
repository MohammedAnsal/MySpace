import { Service } from "typedi";
import cron from "node-cron";
import Booking from "../../../models/booking.model";
import { notificationService } from "../notification/notification.service";
import socketService from "../socket/socket.service";
import mongoose from "mongoose";

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
  }

  private async checkRentReminders() {
    const today = new Date();
    const oneWeekFromNow = new Date(today);
    oneWeekFromNow.setDate(today.getDate() + 7);

    // Find all active bookings where next payment is due in a week
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
      select: "_id hostel_name", // Explicitly select the fields we need
    });

    for (const booking of bookings) {
      const hostelName =
        (booking.hostelId as any)?.hostel_name || "your hostel";

      // Create notification for user
      const userNotification = await notificationService.createNotification({
        recipient: new mongoose.Types.ObjectId(booking.userId.toString()),
        sender: new mongoose.Types.ObjectId(booking.providerId.toString()),
        title: "Rent Payment Reminder",
        message: `Your next rent payment for ${hostelName} is due in one week.`,
        type: "rent_reminder",
        // relatedId: booking._id
      });

      // Emit real-time notification to user
      socketService.emitNotification(
        booking.userId.toString(),
        userNotification
      );

      // Create notification for provider
      const providerNotification = await notificationService.createNotification(
        {
          recipient: new mongoose.Types.ObjectId(booking.providerId.toString()),
          sender: new mongoose.Types.ObjectId(booking.userId.toString()),
          title: "Upcoming Rent Payment",
          message: `A rent payment for ${hostelName} is due in one week.`,
          type: "rent_reminder",
          // relatedId: booking._id
        }
      );

      // Emit real-time notification to provider
      socketService.emitNotification(
        booking.providerId.toString(),
        providerNotification
      );
    }
  }
}

export const cronService = new CronService();
