import Joi from 'joi';
import { idParamSchema, objectId, paginationQuerySchema, phoneSchema } from './common.validator';

export const createCollectionExecutiveSchema = {
  body: Joi.object({
    seasonId: objectId.required(),
    eventId: objectId.optional(),
    eventOrganizerId: objectId.required(),
    fullName: Joi.string().required(),
    username: Joi.string().alphanum().min(3).max(30).required(),
    password: Joi.string().min(8).required(),
    email: Joi.string().email().optional(),
    contactNumber: phoneSchema.required(),
    alternateContactNumber: phoneSchema.optional(),
    age: Joi.number().integer().min(18).max(100).optional(),
  }),
};

export const updateCollectionExecutiveSchema = {
  params: idParamSchema,
  body: Joi.object({
    fullName: Joi.string().optional(),
    email: Joi.string().email().optional(),
    contactNumber: phoneSchema.optional(),
    alternateContactNumber: phoneSchema.optional(),
    age: Joi.number().integer().min(18).max(100).optional(),
  }).min(1),
};

export const listCollectionExecutiveSchema = {
  query: Joi.object({
    ...paginationQuerySchema,
    seasonId: objectId.optional(),
    eventId: objectId.optional(),
    eventOrganizerId: objectId.optional(),
  }),
};
export const collectionExecutiveIdParamSchema = { params: idParamSchema };
export const setCollectionExecutiveStatusSchema = {
  params: idParamSchema,
  body: Joi.object({ isActive: Joi.boolean().required() }),
};
