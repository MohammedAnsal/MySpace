import express from "express";
import cookieParser from "cookie-parser";
import dbConnect from "./config/dbConfig";
import dotenv from "dotenv";

dotenv.config();
dbConnect();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const PORT = process.env.PORT || 7001;

app.listen(PORT, () => {
  `Server running on port ${PORT}`;
});
