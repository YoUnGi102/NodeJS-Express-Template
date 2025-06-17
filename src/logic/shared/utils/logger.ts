import winston from "winston";
import "winston-daily-rotate-file";

const NODE_ENV = process.env.NODE_ENV;

const logger = winston.createLogger({
	level: "debug",
	format: winston.format.combine(
		winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
		winston.format.printf(({ timestamp, level, message }) => {
			return `${timestamp} [${level}]: ${message}`;
		}),
	),
	transports: [
		new winston.transports.Console({
			level: NODE_ENV === "production" ? "info" : "debug",
		}),
		new winston.transports.DailyRotateFile({
			filename: "logs/%DATE%.log",
			datePattern: "YYYY-MM-DD",
			level: NODE_ENV === "production" ? "info" : "debug",
			maxFiles: "14d",
			zippedArchive: true,
		}),
	],
});

export default logger;
