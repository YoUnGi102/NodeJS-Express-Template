import Joi from "joi";

export type RequestPart = "body" | "query" | "params";

export type SchemaMap = Partial<Record<RequestPart, Joi.ObjectSchema>>;
