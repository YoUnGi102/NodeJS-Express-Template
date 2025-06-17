<<<<<<< HEAD
import 'reflect-metadata';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from '@src/config/swagger.config';
import dotenv from 'dotenv';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import express, { Express, Router } from 'express';
import cors from 'cors';
import { DataSource } from 'typeorm';
import { errorMiddleware } from '@src/logic/shared/middleware/error.middleware';
=======
import "reflect-metadata";
import { errorMiddleware } from "@src/logic/shared/middleware/error.middleware";
import cors from "cors";
import dotenv from "dotenv";
import express, { Express, Router } from "express";
import helmet from "helmet";
import swaggerUi from "swagger-ui-express";
import { DataSource } from "typeorm";
import { openApiDocument } from "./config/openapi";
>>>>>>> origin/main

dotenv.config();

// Configure CORS with specific allowed origins and allow credentials (cookies, headers)
const allowedOrigins = [process.env.FRONTEND_URL, "http://localhost:5000"];
const corsOptions: cors.CorsOptions = {
	origin: (origin, callback) => {
		if (
			!origin ||
			allowedOrigins.includes(origin) ||
			/^http:\/\/localhost(:\d+)?$/.test(origin)
		) {
			callback(null, true);
		} else {
			callback(new Error("Not allowed by CORS"));
		}
	},
	credentials: true,
};

// Registers all application routes and submodules
const registerRoutes = async (): Promise<Router> => {
	const router = Router();

	router.get("/health", (_, res): void => {
		res.send("OK");
	});

	// Lazy-load routes
	const auth = (await import("@model/auth/auth.routes")).default;
	router.use("/auth", auth);

	return router;
};

// Main app factory function that initializes the Express application
export const createApp = async (dataSource: DataSource): Promise<Express> => {
	const app = express();

<<<<<<< HEAD
  app.use(cookieParser());

  // Sets secure HTTP headers using Helmet
  app.use(helmet());
=======
	// Sets secure HTTP headers using Helmet
	app.use(helmet());
>>>>>>> origin/main

	// Enables CORS for frontend and local development
	app.use(cors(corsOptions));

	// Parses incoming JSON requests
	app.use(express.json());

	// Makes TypeORM DataSource available globally via app.locals
	app.locals.dataSource = dataSource;

	// Register all routes under the /api base path
	app.use("/", await registerRoutes());

<<<<<<< HEAD
  // Serve Swagger UI documentation at /api-docs
  app.use(
    '/api-docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, {
      swaggerOptions: {
        withCredentials: true,
        
      },
    }),
  );
=======
	// Serve Swagger UI documentation at /api-docs
	app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(openApiDocument));
>>>>>>> origin/main

	// Global error handling middleware
	app.use(errorMiddleware);

	return app;
};
