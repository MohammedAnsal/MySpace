import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();
app.use(cookieParser());

app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

const targets = {
  authService: process.env.AUTH_SERVICE_URL,
};

app.use(
  "/auth",
  createProxyMiddleware({
    target: targets.authService,
    changeOrigin: true,
    pathRewrite: { "^/auth": "/" },
  })
);

const PORT = process.env.PORT || 7000;

app.listen(PORT, () => {
  console.log(`API Gateway is running on port ${PORT}`);
});
