import { NextFunction, Request, Response } from "express";
import { RequestPart, SchemaMap } from "../types/validation.types";

// TODO ADD COOKIE VALIDATION
const validate = (schemas: SchemaMap) => {
	return (req: Request, res: Response, next: NextFunction): void => {
		const result: Partial<Record<RequestPart, unknown>> = {};

		for (const part of Object.keys(schemas) as RequestPart[]) {
			const schema = schemas[part];
			if (!schema) continue;

			const target = req[part as keyof Request];
			const parseResult = schema.strip().safeParse(target);

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

		if (result.query) {
			Object.defineProperty(req, "query", { value: result.query });
		}
		if (result.body) {
			Object.defineProperty(req, "body", { value: result.body });
		}
		if (result.params) {
			Object.defineProperty(req, "params", { value: result.params });
		}
		if (result.cookies) {
			Object.defineProperty(req, "cookies", { value: result.cookies });
		}
		next();
	};
};

export default validate;
