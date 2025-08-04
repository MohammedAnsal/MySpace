import { Service } from "typedi";
import cron from "node-cron";
import Booking from "../../../models/booking.model";
import { notificationService } from "../notification/notification.service";
import socketService from "../socket/socket.service";
import mongoose from "mongoose";
import { Hostel } from "../../../models/provider/hostel.model";
import { HostelPaymentModel } from "../../../models/payment.model";
import {
  sendRentReminderEmail,
  sendStayDurationEmail,
} from "../../../utils/email.utils";
import { User } from "../../../models/user.model";

@Service()
export class CronService {
  constructor() {
    this.initializeCronJobs();
  }

  private initializeCronJobs() {
    cron.schedule("* * * * *", async () => {
      try {
        await this.checkStayDurationReminders();
        await this.checkMonthlyRentReminders();
      } catch (error) {
        console.error("Error in reminder cron job:", error);
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

  private async checkStayDurationReminders() {
    const today = new Date();
    const oneWeekFromNow = new Date(today);
    oneWeekFromNow.setDate(today.getDate() + 7);

    // Only include bookings where stay duration reminder hasn't been sent in the last 24 hours
    const oneDayAgo = new Date(today.getTime() - 24 * 60 * 60 * 1000);

    const bookings = await Booking.find({
      paymentStatus: "completed",
      checkOut: {
        $gt: today,
        $lte: oneWeekFromNow,
      },
      $or: [
        { stayDurationReminderSent: { $exists: false } },
        { stayDurationReminderSent: null },
        { stayDurationReminderSent: { $lt: oneDayAgo } },
      ],
    }).populate({
      path: "userId providerId hostelId",
      select: "_id hostel_name",
    });

    console.log(
      `Found ${bookings.length} bookings that need stay duration reminders`
    );

    for (const booking of bookings) {
      await this.sendStayDurationReminder(booking);
    }
  }

  private async checkMonthlyRentReminders() {
    const today = new Date();
    const twoDaysFromNow = new Date(today);
    twoDaysFromNow.setDate(today.getDate() + 2);

    // Only include bookings where monthly rent reminder hasn't been sent in the last 24 hours
    const oneDayAgo = new Date(today.getTime() - 24 * 60 * 60 * 1000);

    const bookings = await Booking.find({
      paymentStatus: "completed",
      checkOut: { $gt: today },
      $and: [
        {
          $or: [
            {
              "selectedFacilities.startDate": {
                $lte: twoDaysFromNow,
                $gt: today,
              },
            },
            {
              checkIn: {
                $lte: twoDaysFromNow,
                $gt: today,
              },
            },
          ],
        },
        {
          $or: [
            { monthlyRentReminderSent: { $exists: false } },
            { monthlyRentReminderSent: null },
            { monthlyRentReminderSent: { $lt: oneDayAgo } },
          ],
        },
      ],
    }).populate({
      path: "userId providerId hostelId",
      select: "_id hostel_name",
    });

    console.log(
      `Found ${bookings.length} bookings that need monthly rent reminders`
    );

    for (const booking of bookings) {
      await this.sendMonthlyRentReminder(booking);
    }
  }

  private async sendStayDurationReminder(booking: any) {
    type PopulatedHostel = { hostel_name: string };

    const hostelName =
      typeof booking.hostelId === "object" &&
      booking.hostelId &&
      "hostel_name" in booking.hostelId
        ? (booking.hostelId as PopulatedHostel).hostel_name
        : "your hostel";

    const userId =
      typeof booking.userId === "object" &&
      booking.userId !== null &&
      "_id" in booking.userId
        ? (booking.userId as any)._id.toString()
        : booking.userId?.toString();

    const providerId =
      typeof booking.providerId === "object" &&
      booking.providerId !== null &&
      "_id" in booking.providerId
        ? (booking.providerId as any)._id.toString()
        : booking.providerId?.toString();

    const user = await User.findById(userId);
    const provider = await User.findById(providerId);

    try {
      // Send notification to user
      const userNotification = await notificationService.createNotification({
        recipient: new mongoose.Types.ObjectId(userId),
        sender: new mongoose.Types.ObjectId(providerId),
        title: "Stay Duration Ending Soon",
        message: `Your stay at ${hostelName} is ending in one week. Please plan to renew if needed.`,
        type: "rent_reminder",
      });

      socketService.emitNotification(userId.toString(), {
        ...userNotification,
        recipient: userNotification.recipient.toString(),
      });

      if (user && user.email) {
        await sendStayDurationEmail(
          user.email,
          user.fullName,
          hostelName,
          true
        );
      }

      // Send notification to provider
      const providerNotification = await notificationService.createNotification(
        {
          recipient: new mongoose.Types.ObjectId(providerId),
          sender: new mongoose.Types.ObjectId(userId),
          title: "Tenant Stay Ending Soon",
          message: `A tenant's stay at ${hostelName} is ending in one week.`,
          type: "rent_reminder",
        }
      );

      socketService.emitNotification(providerId.toString(), {
        ...providerNotification,
        recipient: providerNotification.recipient.toString(),
      });

      if (provider && provider.email) {
        await sendStayDurationEmail(
          provider.email,
          provider.fullName,
          hostelName,
          false
        );
      }

      await Booking.updateOne(
        { _id: booking._id },
        { $set: { stayDurationReminderSent: new Date() } }
      );

      console.log(`Stay duration reminder sent for booking: ${booking._id}`);
    } catch (error) {
      console.error(
        `Error sending stay duration reminder for booking ${booking._id}:`,
        error
      );
    }
  }

  private async sendMonthlyRentReminder(booking: any) {
    type PopulatedHostel = { hostel_name: string };

    const hostelName =
      typeof booking.hostelId === "object" &&
      booking.hostelId &&
      "hostel_name" in booking.hostelId
        ? (booking.hostelId as PopulatedHostel).hostel_name
        : "your hostel";

    const userId =
      typeof booking.userId === "object" &&
      booking.userId !== null &&
      "_id" in booking.userId
        ? (booking.userId as any)._id.toString()
        : booking.userId?.toString();

    const providerId =
      typeof booking.providerId === "object" &&
      booking.providerId !== null &&
      "_id" in booking.providerId
        ? (booking.providerId as any)._id.toString()
        : booking.providerId?.toString();

    const user = await User.findById(userId);
    const provider = await User.findById(providerId);

    try {
      const userNotification = await notificationService.createNotification({
        recipient: new mongoose.Types.ObjectId(userId),
        sender: new mongoose.Types.ObjectId(providerId),
        title: "Monthly Rent Payment Reminder",
        message: `Your monthly rent payment for ${hostelName} is due in 2 days.`,
        type: "rent_reminder",
      });

      socketService.emitNotification(userId.toString(), {
        ...userNotification,
        recipient: userNotification.recipient.toString(),
      });

      if (user && user.email) {
        await sendRentReminderEmail(
          user.email,
          user.fullName,
          hostelName,
          true
        );
      }

      const providerNotification = await notificationService.createNotification(
        {
          recipient: new mongoose.Types.ObjectId(providerId),
          sender: new mongoose.Types.ObjectId(userId),
          title: "Monthly Rent Payment Due",
          message: `Monthly rent payment for ${hostelName} is due in 2 days.`,
          type: "rent_reminder",
        }
      );

      socketService.emitNotification(providerId.toString(), {
        ...providerNotification,
        recipient: providerNotification.recipient.toString(),
      });

      if (provider && provider.email) {
        await sendRentReminderEmail(
          provider.email,
          provider.fullName,
          hostelName,
          false
        );
      }

      await Booking.updateOne(
        { _id: booking._id },
        { $set: { monthlyRentReminderSent: new Date() } }
      );

      console.log(`Monthly rent reminder sent for booking: ${booking._id}`);
    } catch (error) {
      console.error(
        `Error sending monthly rent reminder for booking ${booking._id}:`,
        error
      );
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
