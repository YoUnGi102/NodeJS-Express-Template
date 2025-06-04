import { Request, Response, NextFunction } from "express";
import { RequestPart, SchemaMap } from "../types/validation.types";

const validate = (schemas: SchemaMap) => {
	return (req: Request, res: Response, next: NextFunction): void => {
		const result: Partial<Record<RequestPart, unknown>> = {};

		for (const part of Object.keys(schemas) as RequestPart[]) {
			const schema = schemas[part];
			if (!schema) continue;

			const { error, value } = schema.validate(req[part], {
				abortEarly: false,
				stripUnknown: true,
				convert: true,
			});

			if (error) {
				res.status(400).json({
					title: "BAD_REQUEST",
					message: error.details.map((d) => d.message),
				});
				return;
			}

			result[part] = value;
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
