import express from "express";
import { bookingContrller } from "../../controllers/implements/user/booking.controller";
import { authMiddleWare } from "../../middlewares/auth/auth.middleware";
import { upload } from "../../utils/multer";

const bookingRoute = express.Router();

bookingRoute.post(
  "/create-booking",
  upload.single("proof"),
  bookingContrller.createBooking.bind(bookingContrller)
);

// // Get user's bookings
// router.get(
//   "/user-bookings",
//   authMiddleWare,
//   bookingContrller.getUserBookings.bind(bookingContrller)
// );

// // Get specific booking details
// router.get(
//   "/:bookingId",
//   authMiddleWare,
//   bookingContrller.getBookingDetails.bind(bookingContrller)
// );

// // Get hostel bookings
// router.get(
//   "/hostel/:hostelId",
//   authMiddleWare,
//   bookingContrller.getHostelBookings.bind(bookingContrller)
// );

// // Update booking
// router.patch(
//   "/:bookingId",
//   authMiddleWare,
//   upload.array("proof", 5), // Allow up to 5 proof documents for updates
//   bookingContrller.updateBooking.bind(bookingContrller)
// );

// // Cancel booking
// router.delete(
//   "/:bookingId",
//   authMiddleWare,
//   bookingContrller.cancelBooking.bind(bookingContrller)
// );

// // Process payment
// router.post(
//   "/:bookingId/payment",
//   authMiddleWare,
//   bookingContrller.processPayment.bind(bookingContrller)
// );

// // Check availability (public route)
// router.get(
//   "/check-availability",
//   bookingContrller.checkAvailability.bind(bookingContrller)
// );

export default bookingRoute;
