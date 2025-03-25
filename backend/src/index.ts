import "reflect-metadata";
import express from "express";
import cookieParser from "cookie-parser";
import dbConnect from "./config/dbConfig";
import dotenv from "dotenv";
import cors from "cors";
import authRoute from "./routers/user/authRoute";
import authProviderRoute from "./routers/provider/auth.p.routes";
import authAdminRoute from "./routers/admin/auth.admin.routes";
import adminUserRoute from "./routers/admin/user.admin.routes";
import morgan from "morgan";
import { morganOptions } from "./utils/logger";
import authLimiter from "./middlewares/user/rate-limiting";
import userRoute from "./routers/user/userRoute";
import { autherization } from "./middlewares/auth/autherization.middlware";
import { authMiddleWare } from "./middlewares/auth/auth.middleware";
import { userTokenBlackList } from "./middlewares/user/auth.blacklist.middleware";
import { providerTokenBlackList } from "./middlewares/provider/auth.blacklist.middleware";
import providerRoute from "./routers/provider/provider.routes";
import hostelRoute from "./routers/user/hostelRoute";

dotenv.config();
dbConnect();

const morganFormat = ":method :url :status :response-time ms";

const app = express();

const corsOptions = {
  origin: process.env.CLIENT_URL,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(morgan(morganFormat, morganOptions));

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/auth", authRoute, authProviderRoute, authAdminRoute);
app.use("/admin", adminUserRoute);
app.use(
  "/user",
  userTokenBlackList,
  authMiddleWare,
  autherization,
  userRoute,
  hostelRoute
);
app.use(
  "/provider",
  providerTokenBlackList,
  authMiddleWare,
  autherization,
  providerRoute
);

const PORT = process.env.PORT || 7001;

app.listen(PORT, () => {
  `Server running on port ${PORT}`;
});
