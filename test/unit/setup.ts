import "reflect-metadata";
import "@config/container";
import { createApp } from "@src/app";
import { Express } from "express";
import { container } from "tsyringe";
import { DataSource } from "typeorm";
import { createTestDataSource } from "../global-setup";

export const setupApp = async (): Promise<Express> => {
	const testDataSource = createTestDataSource();
	await testDataSource.initialize();
	container.registerInstance(DataSource, testDataSource);
	const app = await createApp(container.resolve(DataSource));
	app.set("trust proxy", true);
	return app;
};
