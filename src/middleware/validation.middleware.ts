import { NextFunction, Request, Response } from 'express';
import { ObjectSchema } from 'joi';
import { ApiError } from '../utils/ApiError';

export interface ValidationSchemas {
  body?: ObjectSchema;
  params?: ObjectSchema;
  query?: ObjectSchema;
}

/**
 * validate: runs the given Joi schemas against req.body/params/query,
 * collects ALL errors (abortEarly: false) and replaces each segment with
 * its validated+coerced value.
 */
export function validate(schemas: ValidationSchemas) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const errors: string[] = [];

    (['body', 'params', 'query'] as const).forEach((segment) => {
      const schema = schemas[segment];
      if (!schema) return;

      const { error, value } = schema.validate(req[segment], {
        abortEarly: false,
        stripUnknown: true,
      });

      if (error) {
        errors.push(...error.details.map((d) => d.message));
        return;
      }

      if (segment === 'query') {
        Object.keys(req.query).forEach((k) => delete (req.query as Record<string, unknown>)[k]);
        Object.assign(req.query, value);
      } else {
        (req as unknown as Record<string, unknown>)[segment] = value;
      }
    });

    if (errors.length > 0) {
      throw ApiError.badRequest('Validation failed', errors);
    }

    next();
  };
}
