import 'reflect-metadata';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from '@src/config/swagger.config';
import dotenv from 'dotenv';
import express, { Express, Router } from 'express';
import cors from 'cors';
import { DataSource } from 'typeorm';
import { errorMiddleware } from '@src/logic/shared/middleware/error.middleware';

dotenv.config();

const allowedOrigins = [process.env.FRONTEND_URL, 'http://localhost:5000'];
const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    if (
      !origin ||
      allowedOrigins.includes(origin) ||
      /^http:\/\/localhost(:\d+)?$/.test(origin)
    ) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
};

const registerRoutes = async (): Promise<Router> => {
  const router = Router();

  const auth = (await import('@model/auth/auth.routes')).default;

  router.use('/auth', auth);

  return router;
}

export const createApp = async (dataSource: DataSource): Promise<Express> => {
  const app = express();

  app.use(cors(corsOptions));
  app.use(express.json());

  app.locals.dataSource = dataSource;

  app.use('/api/', await registerRoutes());
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {swaggerOptions: {
      withCredentials: true,
    }}));
  app.use(errorMiddleware);

  return app;
};
