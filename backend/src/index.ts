import "reflect-metadata";
import express from "express";
import cookieParser from "cookie-parser";
import dbConnect from "./config/dbConfig";
import dotenv from "dotenv";
import cors from "cors";
import authRoute from "./routers/user/authRoute";

dotenv.config();
dbConnect();

const app = express();

const target = {
  origin: process.env.PORT,
  changeOrigin: true,
  credentials: true,
};

app.use(cors(target));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/auth", authRoute);

const PORT = process.env.PORT || 7001;

app.listen(PORT, () => {
  `Server running on port ${PORT}`;
});
