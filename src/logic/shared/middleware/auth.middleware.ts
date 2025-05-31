import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { ERRORS } from '../utils/errors';
import authTokenUtils from '@src/logic/model/auth/utils/authUtils';

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next(ERRORS.AUTH.ACCESS_TOKEN_INVALID());
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return next(ERRORS.AUTH.ACCESS_TOKEN_INVALID());
    }

    const payload = authTokenUtils.verifyAccessToken(token);
    req.auth = payload;
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      next(ERRORS.AUTH.ACCESS_TOKEN_EXPIRED());
    }

    next(ERRORS.AUTH.ACCESS_TOKEN_INVALID());
  }
};
