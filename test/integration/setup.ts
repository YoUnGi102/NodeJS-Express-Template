import "reflect-metadata";
import "@config/container";
import { Express } from "express";
import { createApp } from "../../src/app";
import { DataSource } from "typeorm";
import { container } from "tsyringe";
import { createTestDataSource } from "../global-setup";

export const setupIntegration = async (): Promise<{
	app: Express;
	testDataSource: DataSource;
}> => {
	const testDataSource = createTestDataSource();
	await testDataSource.initialize();
	container.registerInstance(DataSource, testDataSource);
	const app = await createApp(container.resolve(DataSource));
	app.set("trust proxy", true);
	return { app, testDataSource };
};
