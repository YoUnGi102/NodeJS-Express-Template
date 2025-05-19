import logger from '@src/logic/shared/utils/logger';
import { NextFunction, Request, Response } from 'express';
import { APIError } from '../utils/errors/APIError';

export const errorMiddleware = (
  err: APIError,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const isAPIError = err instanceof APIError;

  logger.error(
    `[ERROR]: ${req.method} - ${req.originalUrl} | [${err.status || 500}] - ${err.name} - ${err.message}\n${err.stack}`,
  );
  res.status(!isAPIError ? 500 : err.status).json({
    success: false,
    title: !isAPIError ? 'INTERNAL_SERVER_ERROR' : err.title,
    message: !isAPIError ? 'Internal Server Error' : err.message,
  });
  next();
};
