// src/middleware/authMiddleware.factory.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import logger from '../utils/logger';
import { ERRORS } from '../utils/errors';
import { JWTPayload } from '../types/auth.types';

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  logger.info(JSON.stringify(req.headers, null, 2));
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(' ')[1];

  try {
    if (!token) {
      throw ERRORS.AUTH.ACCESS_TOKEN_NOT_PROVIDED();
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string,
    ) as JWTPayload;

    if (
      typeof decoded !== 'object' ||
      !('username' in decoded) ||
      !('email' in decoded) ||
      !('uuid' in decoded)
    ) {
      throw ERRORS.AUTH.ACCESS_TOKEN_INVALID();
    }

    req.auth = decoded;
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      next(ERRORS.AUTH.ACCESS_TOKEN_EXPIRED());
    }
    next(error);
  }
};
