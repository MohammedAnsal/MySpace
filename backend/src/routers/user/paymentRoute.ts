import express from "express";
import { paymentController } from "../../controllers/implements/user/payment.controller";
// import { stripeWebhookController } from "../../controllers/implements/user/stripe-webhook.controller";

const paymentRoute = express.Router();

paymentRoute.post(
  "/booking",
  paymentController.createCheckoutSession.bind(paymentController)
);

paymentRoute.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  paymentController.handleWebhook.bind(paymentController)
);

export default paymentRoute;
