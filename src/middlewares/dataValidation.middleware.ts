import { Request, Response, NextFunction } from "express";
import { ZodType } from "zod";

const validateRequest = (schema: ZodType) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const errorMessages = result.error.issues.map((err) => ({
        field: err.path.join("."),
        message: err.message,
      }));

      return res.status(400).json({ errorMessages });
    }
    req.body = result.data;
    next();
  };
};

export { validateRequest };
