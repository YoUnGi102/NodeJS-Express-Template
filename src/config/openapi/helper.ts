import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { OpenAPIRoute } from "./routes";

export const registerRoute = (registry: OpenAPIRegistry, route: OpenAPIRoute): void => {
    const requestConfig = route.requestSchema
        ? {
            request: {
                body: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: route.requestSchema,
                        },
                    },
                },
            },
        }
        : {};

    registry.registerPath({
        method: route.method,
        path: route.path,
        summary: route.summary,
        tags: route.tags,
        ...requestConfig,
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