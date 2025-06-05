import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { registerRoute } from '@src/config/openapi/helper';
import { ROUTES } from './routes';

const registry = new OpenAPIRegistry();

Object.values(ROUTES).forEach(group => {
    Object.values(group).forEach(route => {
        registerRoute(registry, route);
    });
});

export default registry;