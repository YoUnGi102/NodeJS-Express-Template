import { OpenAPIRegistry, RouteConfig } from "@asteasolutions/zod-to-openapi";
import { SchemaMap } from "@src/logic/shared/types/validation.types";
import { ErrorMessage } from "@src/logic/shared/utils/errors/errorMessages";
import { ZodTypeAny } from "zod";

export interface OpenAPIRoute {
	method:
		| "get"
		| "post"
		| "put"
		| "delete"
		| "patch"
		| "head"
		| "options"
		| "trace";
	path: string;
	summary?: string;
	tags?: string[];
	request?: SchemaMap;
	successResponse?: { status: number; schema?: ZodTypeAny };
	errorResponses: ErrorMessage[];
}

export const registerRoute = (
	registry: OpenAPIRegistry,
	route: OpenAPIRoute,
): void => {
	const {
		method,
		path,
		summary,
		tags,
		request,
		errorResponses: errors,
		successResponse: success,
	} = route;

	const successMessage = success
		? {
				[success.status]: {
					description: success.schema ? "" : "No Content",
					content: success.schema
						? {
								"application/json": { schema: success.schema },
							}
						: undefined,
				},
			}
		: {};

	registry.registerPath({
		method: method,
		path: path,
		summary: summary,
		tags: tags,
		...getRequestConfig(request),
		responses: {
			...getErrorResponses(errors),
			...successMessage,
		},
	});
};

const getRequestConfig = (schemaMap?: SchemaMap) => {
	if (!schemaMap) return {};

	const request: RouteConfig["request"] = {};

	if (schemaMap.body) {
		request.body = {
			required: true,
			content: {
				"application/json": {
					schema: schemaMap.body,
				},
			},
		};
	}

	if (schemaMap.query) {
		request.query = schemaMap.query;
	}

	if (schemaMap.params) {
		request.params = schemaMap.params;
	}

	return { request };
};

const getErrorResponses = (
	errorResponses: ErrorMessage[],
): NonNullable<RouteConfig["responses"]> => {
	const resposnes = errorResponses.reduce(
		(acc, res) => {
			acc[res.status] = {
				description: res.message,
				content: {
					"application/json": {
						schema: {
							type: "object",
							properties: {
								title: {
									type: "string",
									example: res.title,
								},
								message: {
									type: "string",
									example: res.message,
								},
							},
							required: ["title", "message"],
						},
					},
				},
			};
			return acc;
		},
		{} as NonNullable<RouteConfig["responses"]>,
	);

	return resposnes;
};
