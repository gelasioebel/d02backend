// src/validationMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import { AnySchema } from 'yup';

export const validateBody = (schema: AnySchema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = await schema.validate(req.body, { abortEarly: false, stripUnknown: true });
      next();
    } catch (error: any) {
      res.status(400).json({ errors: error.errors });
    }
  };
};
