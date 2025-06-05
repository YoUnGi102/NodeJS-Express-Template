import { OpenApiGeneratorV3 } from "@asteasolutions/zod-to-openapi";
import registry from "./registry";
import { SWAGGER_CONFIG } from "..";

const generator = new OpenApiGeneratorV3(registry.definitions);

export const openApiDocument = generator.generateDocument({
	openapi: "3.0.0",
	info: {
		title: SWAGGER_CONFIG.APP_TITLE,
		description: SWAGGER_CONFIG.APP_DESCRIPTION,
		version: "1.0.0",
	},
});
