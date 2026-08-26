import Joi from 'joi';
import { idParamSchema, objectId, paginationQuerySchema } from './common.validator';

export const createExpenseCategorySchema = {
  body: Joi.object({
    seasonId: objectId.required(),
    eventOrganizerId: objectId.required(),
    categoryName: Joi.string().required(),
    description: Joi.string().required(),
  }),
};

export const updateExpenseCategorySchema = {
  params: idParamSchema,
  body: Joi.object({
    categoryName: Joi.string().optional(),
    description: Joi.string().optional(),
  }).min(1),
};

export const listExpenseCategorySchema = {
  query: Joi.object({ ...paginationQuerySchema, seasonId: objectId.optional() }),
};
export const expenseCategoryIdParamSchema = { params: idParamSchema };
