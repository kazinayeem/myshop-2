import { createLogger, format, transports } from "winston";

// Custom log format
const logFormat = format.combine(
  format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  format.printf(
    ({ level, message, timestamp }) =>
      `${timestamp} [${level.toUpperCase()}]: ${message}`
  )
);

// Logger instance
const logger = createLogger({
  level: "info", // Log only info and above levels
  format: logFormat,
  transports: [
    new transports.Console(), // Log to console
    new transports.File({ filename: "logs/error.log", level: "error" }), // Log errors to a file
    new transports.File({ filename: "logs/combined.log" }), // Log all events
  ],
});

export default logger;
