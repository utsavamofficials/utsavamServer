import Joi from 'joi';
import { idParamSchema, objectId, paginationQuerySchema } from './common.validator';

export const createExpenseCategorySchema = {
  body: Joi.object({
    seasonId: objectId.required(),
    eventId: objectId.required(),
    categoryName: Joi.string().required(),
    allocatedBudget: Joi.number().positive().precision(2).optional(),
  }),
};

export const updateExpenseCategorySchema = {
  params: idParamSchema,
  body: Joi.object({
    categoryName: Joi.string().optional(),
    allocatedBudget: Joi.number().positive().precision(2).optional(),
  }).min(1),
};

export const listExpenseCategorySchema = {
  query: Joi.object({ ...paginationQuerySchema, seasonId: objectId.optional(), eventId: objectId.optional() }),
};
export const expenseCategoryIdParamSchema = { params: idParamSchema };
