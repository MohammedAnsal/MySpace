import { createLogger, format, transports, Logger } from "winston";
import "winston-daily-rotate-file";
import { TransformableInfo } from "logform";
import fs from "fs";
import path from "path";
const { combine, timestamp, json, colorize, printf } = format;

const consoleLogFormat = printf((info: TransformableInfo) => {
  const { level, message, timestamp } = info as {
    level: string;
    message: string;
    timestamp?: string;
  };
  return `${timestamp ? `[${timestamp}] ` : ""}${level}: ${message}`;
});

const fileRotateTransport = new transports.DailyRotateFile({
  filename: "logs/app-%DATE%.log",
  datePattern: "YYYY-MM-DD",
  maxFiles: "14d",
  maxSize: "20m",
  zippedArchive: true,
  auditFile: "logs/audit.json",
  level: "info",
});

const logger: Logger = createLogger({
  level: "info",
  format: combine(timestamp(), json()),
  transports: [
    new transports.Console({
      format: combine(colorize(), consoleLogFormat),
    }),
    fileRotateTransport,
  ],
});

fileRotateTransport.on("rotate", function (oldFilename, newFilename) {
  console.log("Log file rotated:", oldFilename, newFilename);
});

fileRotateTransport.on("error", function (error) {
  console.error("Error in log rotation:", error);
});

const logsDir = path.join(process.cwd(), "logs");
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}

export default logger;

export const morganOptions = {
  stream: {
    write: (message: string) => {
      const [method, url, status, responseTime] = message.split(" ");

      const logObject = {
        Method: method,
        URL: url,
        Status: status,
        "Response Time (ms)": responseTime,
      };

      logger.info(JSON.stringify(logObject, null, 2));
    },
  },
};
