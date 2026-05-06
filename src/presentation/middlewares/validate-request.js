import { ZodError } from "zod";
import { AppError } from "../../shared/errors.js";

export function validateRequest(schema) {
  return (req, _res, next) => {
    try {
      const parsed = schema.parse({
        body: req.body,
        params: req.params,
        query: req.query,
      });

      req.body = parsed.body;
      req.params = parsed.params;
      Object.keys(req.query).forEach((key) => {
        delete req.query[key];
      });
      Object.assign(req.query, parsed.query);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        next(new AppError("Validation error", 400, error.flatten()));
        return;
      }

      next(error);
    }
  };
}
