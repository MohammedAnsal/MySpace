import "reflect-metadata";
import express from "express";
import cookieParser from "cookie-parser";
import dbConnect from "./config/dbConfig";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import { createServer } from "http";

import authRoute from "./routers/user/authRoute";
import authProviderRoute from "./routers/provider/auth.p.routes";
import authAdminRoute from "./routers/admin/auth.admin.routes";
import adminUserRoute from "./routers/admin/user.admin.routes";
import userRoute from "./routers/user/userRoute";
import providerRoute from "./routers/provider/provider.routes";
import hostelRoute from "./routers/user/hostelRoute";
import bookingRoute from "./routers/user/bookingRoute";
import paymentRoute from "./routers/user/paymentRoute";
import ratingRoute from "./routers/user/ratingRoutes";
import walletRoute from "./routers/wallet/walletRoutes";
import menuItemRoute from "./routers/facility/food/foodMenu.routes";
import foodMenuRoute from "./routers/facility/food/menuItem.routes";
import washingRoute from "./routers/facility/washing/washing.routes";
import cleaningRoute from "./routers/facility/cleaning/cleaning.routes";
import chatRoute from "./routers/chat/chat.routes";
import notificationRouter from "./routers/notification/notification.routes";

import { morganOptions } from "./utils/logger";
import { userTokenBlackList } from "./middlewares/user/auth.blacklist.middleware";
// import { providerTokenBlackList } from "./middlewares/provider/auth.blacklist.middleware";

import socketService from "./services/implements/socket/socket.service";
import { cronService } from "./services/implements/cron/cron.service";

dotenv.config();

const app = express();
const httpServer = createServer(app);

const corsOptions = {
  origin: process.env.CLIENT_URL,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));

app.use("/user/payments/webhook", express.raw({ type: "application/json" }));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cookieParser());

const morganFormat = ":method :url :status :response-time ms";
app.use(morgan(morganFormat, morganOptions));

// Routes
app.use("/auth", authRoute, authProviderRoute, authAdminRoute);
app.use("/admin", adminUserRoute);
app.use("/user/payments", paymentRoute);
app.use(
  "/user",
  userTokenBlackList,
  userRoute,
  hostelRoute,
  bookingRoute,
  ratingRoute,
  walletRoute
);
app.use("/provider", providerRoute);
app.use("/wallet", walletRoute);
app.use("/facility", menuItemRoute, foodMenuRoute, washingRoute, cleaningRoute);
app.use("/chat", chatRoute);
app.use("/notification", notificationRouter);

dbConnect()
  .then(() => {
    console.log("✅ Database connected successfully");

    socketService.initialize(httpServer);

    cronService.startJobs();

    const PORT = process.env.PORT || 7001;
    httpServer.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("❌ Database connection failed:", error);
    process.exit(1);
  });
