import { Router, RequestHandler } from 'express';
import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { ZodTypeAny } from 'zod';
import { StatusMessage } from '../utils/errors/APIError';

type HttpMethod = 'get' | 'post' | 'put' | 'delete' | 'patch' | 'head' | 'options' | 'trace';

type RouteMeta = {
    summary: string;
    requestSchema?: ZodTypeAny;
    response?: StatusMessage[]
}