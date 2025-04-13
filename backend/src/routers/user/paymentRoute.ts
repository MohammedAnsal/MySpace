import express from "express";
import { paymentController } from "../../controllers/implements/user/payment.controller";

const paymentRoute = express.Router();

paymentRoute.post(
  "/payments/:hostelId",
  paymentController.createCheckoutSession.bind(paymentController)
);

export default paymentRoute;
