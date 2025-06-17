import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { registerRoute } from "@src/config/openapi/helper";
import { ROUTES } from "./routes";
import {
	AuthResponseSchema,
	AuthUserResponseSchema,
	AuthRegisterRequestSchema,
	AuthLoginRequestSchema,
	AuthRefreshRequestSchema,
} from "@src/logic/model/auth/auth.schema";

const registry = new OpenAPIRegistry();

// ====================
// OpenAPI Registration
// ====================

registry.register("AuthResponse", AuthResponseSchema());
registry.register("AuthUserResponse", AuthUserResponseSchema());

registry.register("AuthRegisterRequest", AuthRegisterRequestSchema());
registry.register("AuthLoginRequestSchema", AuthLoginRequestSchema());
registry.register("AuthRefreshRequest", AuthRefreshRequestSchema());

Object.values(ROUTES).forEach((group) => {
	Object.values(group).forEach((route) => {
		registerRoute(registry, route);
	});
});

export default registry;
