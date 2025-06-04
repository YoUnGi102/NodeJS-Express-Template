import { Request, Response, NextFunction } from "express";
import logger from "../utils/logger";

const SLOW_REQUEST_THRESHOLD_MS = Number.parseInt(
	process.env.SLOW_REQUEST_THRESHOLD_MS || "1000",
	10,
);

const HIDE_API_LOGS = process.env.HIDE_API_LOGS;

export const loggingMiddleware = (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const start = Date.now();

	res.on("finish", () => {
		const duration = Date.now() - start;
		const { method, originalUrl } = req;
		const { statusCode } = res;
		const msg = `${method} ${originalUrl} ${statusCode} - ${duration}ms`;

		if (duration > SLOW_REQUEST_THRESHOLD_MS) {
			logger.warn(`Slow request: ${msg}`);
		}

		if (HIDE_API_LOGS !== "true") {
			if (statusCode >= 500) {
				logger.error(msg);
			} else if (statusCode >= 400) {
				logger.warn(msg);
			} else {
				logger.info(msg);
			}
		}
	});

	next();
};
