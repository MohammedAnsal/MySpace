import express from "express";
import { bookingContrller } from "../../controllers/implements/user/booking.controller";
import { upload } from "../../utils/multer";
import { authMiddleWare } from "../../middlewares/auth/auth.middleware";

const bookingRoute = express.Router();

bookingRoute.post(
  "/create-booking",
  upload.single("proof"),
  bookingContrller.createBooking.bind(bookingContrller)
);

bookingRoute.get(
  "/bookings",
  authMiddleWare,
  bookingContrller.getUserBookings.bind(bookingContrller)
);

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
bookingRoute.delete(
  "/:bookingId",
  bookingContrller.cancelBooking.bind(bookingContrller)
);

// // Process payment
bookingRoute.post(
  "/:bookingId/payment",
  bookingContrller.processPayment.bind(bookingContrller)
);

// // Check availability (public route)
// router.get(
//   "/check-availability",
//   bookingContrller.checkAvailability.bind(bookingContrller)
// );

export default bookingRoute;
