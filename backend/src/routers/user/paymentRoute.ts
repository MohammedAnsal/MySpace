import express from "express";
import { paymentController } from "../../controllers/implements/user/payment.controller";
import { authMiddleWare } from "../../middlewares/auth/auth.middleware";
import { autherization } from "../../middlewares/auth/autherization.middlware";
import { authorizeRoles } from "../../middlewares/auth/role.middleware";
import Roles from "../../enums/roles";
import { asyncHandler } from "../../utils/asyncHandler";

const paymentRoute = express.Router();

paymentRoute.post(
  "/booking",
  authMiddleWare,
  autherization,
  authorizeRoles(Roles.USER),
  asyncHandler(paymentController.createCheckoutSession.bind(paymentController))
);

paymentRoute.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  asyncHandler(paymentController.handleWebhook.bind(paymentController))
);

paymentRoute.post(
  "/reprocess-payment/:bookingId",
  authMiddleWare,
  autherization,
  authorizeRoles(Roles.USER),
  asyncHandler(paymentController.reprocessPayment.bind(paymentController))
);

export default paymentRoute;
