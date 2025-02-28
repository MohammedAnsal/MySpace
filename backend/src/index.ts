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
import userRoute from "./routers/user/userRoute";
import morgan from "morgan";
import { morganOptions } from "./utils/logger";

dotenv.config();
dbConnect();

const morganFormat = ":method :url :status :response-time ms";

const app = express();

const target = {
  origin: process.env.SERVER_URL,
  changeOrigin: true,
  credentials: true,
};

app.use(morgan(morganFormat, morganOptions));

app.use(cors(target));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/auth", authRoute, authProviderRoute, authAdminRoute);
app.use("/admin", adminUserRoute);
app.use("/user", userRoute);


const PORT = process.env.PORT || 7001;

app.listen(PORT, () => {
  `Server running on port ${PORT}`;
});
