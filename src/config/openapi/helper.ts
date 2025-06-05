import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { OpenAPIRoute } from "./routes";
import { SchemaMap } from "@src/logic/shared/types/validation.types";

export const registerRoute = (registry: OpenAPIRegistry, route: OpenAPIRoute): void => {
    registry.registerPath({
        method: route.method,
        path: route.path,
        summary: route.summary,
        tags: route.tags,
        ...getRequestConfig(route.requestSchema),
        responses: {
            ...route.responses.reduce((acc, res) => {
                acc[res.status] = {
                    description: res.message,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    status: { type: 'integer', example: res.status },
                                    title: {
                                        type: 'string',
                                        example: res.title
                                    },
                                    message: {
                                        type: 'string',
                                        example: res.message
                                    },
                                },
                                required: ['status', 'title', 'message']
                            }
                        }
                    }
                }
                return acc;
            }, {} as Record<string, any>),
        }
    });
}

const getRequestConfig = (schemaMap?: SchemaMap) => {
    if (!schemaMap) return {};

    const request: any = {};

    if (schemaMap.body) {
        request.body = {
            required: true,
            content: {
                'application/json': {
                    schema: schemaMap.body,
                },
            },
        };
    }

    if (schemaMap.query) {
        request.query = {
            schema: schemaMap.query,
        };
    }

    if (schemaMap.params) {
        request.params = {
            schema: schemaMap.params,
        };
    }

    return { request };
};