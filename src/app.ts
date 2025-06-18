import "reflect-metadata";
import { errorMiddleware } from "@src/logic/shared/middleware/error.middleware";
import cors from "cors";
import dotenv from "dotenv";
import express, { Express, Router, Response, Request } from "express";
import helmet from "helmet";
import swaggerUi from "swagger-ui-express";
import { DataSource } from "typeorm";
import { openApiDocument } from "./config/openapi";
import cookieParser from "cookie-parser";
import { authMiddleware } from "./logic/shared/middleware/auth.middleware";
import { loggingMiddleware } from "./logic/shared/middleware/logging.middleware";
import rateLimit from "express-rate-limit";

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

const rateLimiter = rateLimit({
	windowMs: 5 * 60 * 1000,
	max: 10,
	message: "Too many attempts, please try again later",
});

// Registers all application routes and submodules
const registerRoutes = async (): Promise<Router> => {
	const router = Router();

	router.get("/health", (_, res): void => {
		res.send("OK");
	});

	// Lazy-load routes
	const auth = (await import("@model/auth/auth.routes")).default;
	router.use("/auth", auth);

	router.get(
		"/test",
		authMiddleware,
		loggingMiddleware,
		(req: Request, res: Response) => {
			res.status(200).json({
				authenticated: true,
				uuid: req.auth?.uuid,
				username: req.auth?.username,
				email: req.auth?.email,
			});
		},
	);

	return router;
};

// Main app factory function that initializes the Express application
export const createApp = async (dataSource: DataSource): Promise<Express> => {
	const app = express();

	app.use(cookieParser());

	// Sets secure HTTP headers using Helmet
	app.use(helmet());

	// Enables CORS for frontend and local development
	app.use(cors(corsOptions));

	// Parses incoming JSON requests
	app.use(express.json());

	// rateLimiter
	if (process.env.NODE_ENV !== "test") {
		app.use(rateLimiter);
	}

	// Makes TypeORM DataSource available globally via app.locals
	app.locals.dataSource = dataSource;

	// Register all routes under the /api base path
	app.use("/", await registerRoutes());

	// Serve Swagger UI documentation at /api-docs
	app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(openApiDocument));

	// Global error handling middleware
	app.use(errorMiddleware);

	return app;
};
