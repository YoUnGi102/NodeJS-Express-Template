// src/middleware/authMiddleware.factory.ts
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
    const token = req.headers.authorization?.split(' ')[1];
    const payload = authTokenUtils.verifyAccessToken(token);
    req.auth = payload;
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      next(ERRORS.AUTH.ACCESS_TOKEN_EXPIRED());
      return;
    }
    next(error);
  }
};
