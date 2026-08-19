import Joi from 'joi';
import { idParamSchema, objectId, panSchema, paginationQuerySchema, phoneSchema } from './common.validator';

export const createDonorSchema = {
  body: Joi.object({
    seasonId: objectId.required(),
    eventId: objectId.required(),
    collectionExecutiveId: objectId.required(),
    donorName: Joi.string().required(),
    contactNumber: phoneSchema.required(),
    email: Joi.string().email().optional(),
    panNumber: panSchema.optional(),
    age: Joi.number().integer().min(1).max(120).optional(),
    address: Joi.string().allow('').optional(),
  }),
};

export const updateDonorSchema = {
  params: idParamSchema,
  body: Joi.object({
    donorName: Joi.string().optional(),
    contactNumber: phoneSchema.optional(),
    email: Joi.string().email().optional(),
    panNumber: panSchema.optional(),
    age: Joi.number().integer().min(1).max(120).optional(),
    address: Joi.string().allow('').optional(),
  }).min(1),
};

export const listDonorSchema = {
  query: Joi.object({
    ...paginationQuerySchema,
    seasonId: objectId.optional(),
    eventId: objectId.optional(),
    collectionExecutiveId: objectId.optional(),
    contactNumber: phoneSchema.optional(),
  }),
};
export const donorIdParamSchema = { params: idParamSchema };
