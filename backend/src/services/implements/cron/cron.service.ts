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
        typeof booking.hostelId === "object" && booking.hostelId && "hostel_name" in booking.hostelId
          ? (booking.hostelId as PopulatedHostel).hostel_name
          : "your hostel";

      // notification for user
      const userNotification = await notificationService.createNotification({
        recipient: new mongoose.Types.ObjectId(booking.userId.toString()),
        sender: new mongoose.Types.ObjectId(booking.providerId.toString()),
        title: "Rent Payment Reminder",
        message: `Your next rent payment for ${hostelName} is due in one week.`,
        type: "rent_reminder",
      });

      socketService.emitNotification(
        booking.userId.toString(),
        { ...userNotification, recipient: userNotification.recipient.toString() }
      );

      // notification for provider
      const providerNotification = await notificationService.createNotification(
        {
          recipient: new mongoose.Types.ObjectId(booking.providerId.toString()),
          sender: new mongoose.Types.ObjectId(booking.userId.toString()),
          title: "Upcoming Rent Payment",
          message: `A rent payment for ${hostelName} is due in one week.`,
          type: "rent_reminder",
        }
      );

      socketService.emitNotification(
        booking.providerId.toString(),
        { ...providerNotification, recipient: providerNotification.recipient.toString() }
      );
    }
  }
}

export const cronService = new CronService();
