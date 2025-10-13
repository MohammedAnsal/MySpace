import express from "express";
import { bookingContrller } from "../../controllers/implements/user/booking.controller";
import { upload } from "../../utils/multer";
import { authMiddleWare } from "../../middlewares/auth/auth.middleware";
import { autherization } from "../../middlewares/auth/autherization.middlware";
import { authorizeRoles } from "../../middlewares/auth/role.middleware";
import Roles from "../../enums/roles";
import { asyncHandler } from "../../utils/asyncHandler";

const bookingRoute = express.Router();

bookingRoute.post(
  "/create-booking",
  upload.single("proof"),
  authMiddleWare,
  autherization,
  authorizeRoles(Roles.USER),
  asyncHandler(bookingContrller.createBooking.bind(bookingContrller))
);

bookingRoute.get(
  "/bookings",
  authMiddleWare,
  autherization,
  authorizeRoles(Roles.USER),
  asyncHandler(bookingContrller.getUserBookings.bind(bookingContrller))
);

bookingRoute.get(
  "/bookings/:bookingId",
  authMiddleWare,
  asyncHandler(bookingContrller.getBookingDetails.bind(bookingContrller))
);

bookingRoute.post(
  "/cancel/:bookingId",
  authMiddleWare,
  autherization,
  authorizeRoles(Roles.USER),
  asyncHandler(bookingContrller.cancelBooking.bind(bookingContrller))
);

// bookingRoute.post(
//   "/bookings/:bookingId/add-facilities",
//   authMiddleWare,
//   autherization,
//   authorizeRoles(Roles.USER),
//   asyncHandler(bookingContrller.addFacilitiesToBooking.bind(bookingContrller))
// );

bookingRoute.post(
  "/bookings/:bookingId/facility-payment",
  authMiddleWare,
  autherization,
  authorizeRoles(Roles.USER),
  asyncHandler(
    bookingContrller.createFacilityPaymentSession.bind(bookingContrller)
  )
);

bookingRoute.post(
  "/bookings/:bookingId/monthly-payment",
  authMiddleWare,
  autherization,
  authorizeRoles(Roles.USER),
  asyncHandler(bookingContrller.processMonthlyPayment.bind(bookingContrller))
);
export default bookingRoute;
