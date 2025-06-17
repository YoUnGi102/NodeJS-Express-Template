import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { registerRoute } from "@src/config/openapi/openapi.helper";
import {
	AUTH_OPENAPI_ROUTES,
	AUTH_OPENAPI_SCHEMAS,
} from "@src/logic/model/auth/auth.openapi";

const registry = new OpenAPIRegistry();

// Schemas defined in [feature].schema.ts
const schemas = {
	...AUTH_OPENAPI_SCHEMAS,
};

// Routes defined in [feature].routes.ts
const routes = {
	...AUTH_OPENAPI_ROUTES,
};

// ====================
// OpenAPI Registration
// ====================

Object.entries(schemas).forEach(([key, schema]) => {
	registry.register(key, schema.openapi(key));
});

Object.values(routes).forEach((route) => {
	registerRoute(registry, route);
});

export default registry;
