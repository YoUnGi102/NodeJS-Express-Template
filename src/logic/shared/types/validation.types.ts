import { ZodTypeAny, ZodObject } from "zod";

export type RequestPart = "body" | "query" | "params";

export type SchemaMap = Partial<
	Record<RequestPart, ZodObject<Record<string, ZodTypeAny>>>
>;
