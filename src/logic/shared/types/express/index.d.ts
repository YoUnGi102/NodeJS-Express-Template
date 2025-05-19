import { JWTPayload } from '../auth.types';

declare global {
  namespace Express {
    interface Request {
      auth?: JWTPayload;
    }
  }
}
