import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';

const SLOW_REQUEST_THRESHOLD_MS = parseInt(
  process.env.SLOW_REQUEST_THRESHOLD_MS || '1000',
  10,
);

export const loggingMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    const { method, originalUrl } = req;
    const { statusCode } = res;
    const msg = `${method} ${originalUrl} ${statusCode} - ${duration}ms`;

    if (duration > SLOW_REQUEST_THRESHOLD_MS) {
      logger.warn(`Slow request: ${msg}`);
    }

    if (statusCode >= 500) {
      logger.error(msg);
    } else if (statusCode >= 400) {
      logger.warn(msg);
    } else {
      logger.info(msg);
    }
  });

  next();
};
