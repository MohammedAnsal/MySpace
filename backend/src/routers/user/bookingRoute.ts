import express from "express";
import { bookingContrller } from "../../controllers/implements/user/booking.controller";
import { upload } from "../../utils/multer";
import { authMiddleWare } from "../../middlewares/auth/auth.middleware";
import { autherization } from "../../middlewares/auth/autherization.middlware";
import { authorizeRoles } from "../../middlewares/auth/role.middleware";
import Roles from "../../enums/roles";

const bookingRoute = express.Router();

bookingRoute.post(
  "/create-booking",
  upload.single("proof"),
  authMiddleWare,
  autherization,
  authorizeRoles(Roles.USER),
  bookingContrller.createBooking.bind(bookingContrller)
);

bookingRoute.get(
  "/bookings",
  authMiddleWare,
  autherization,
  authorizeRoles(Roles.USER),
  bookingContrller.getUserBookings.bind(bookingContrller)
);

bookingRoute.get(
  "/bookings/:bookingId",
  authMiddleWare,
  bookingContrller.getBookingDetails.bind(bookingContrller)
);

bookingRoute.post(
  "/cancel/:bookingId",
  authMiddleWare,
  autherization,
  authorizeRoles(Roles.USER),
  bookingContrller.cancelBooking.bind(bookingContrller)
);

export default bookingRoute;
