import { NextFunction, Request, Response } from "express";
import { RequestPart, SchemaMap } from "../types/validation.types";

const validate = (schemas: SchemaMap) => {
	return (req: Request, res: Response, next: NextFunction): void => {
		const result: Partial<Record<RequestPart, unknown>> = {};

		for (const part of Object.keys(schemas) as RequestPart[]) {
			const schema = schemas[part];
			if (!schema) continue;

			const parseResult = schema.strip().safeParse(req[part]);

			if (!parseResult.success) {
				const messages = parseResult.error.errors.map(
					(err) => `${err.path.join(".")} - ${err.message}`,
				);
				res.status(400).json({
					title: "BAD_REQUEST",
					message: messages,
				});
				return;
			}

			result[part] = parseResult.data;
		}

		if (result.query)
			Object.defineProperty(req, "query", { value: result.query });
		if (result.body) Object.defineProperty(req, "body", { value: result.body });
		if (result.params)
			Object.defineProperty(req, "params", { value: result.params });
		next();
	};
};

export default validate;
