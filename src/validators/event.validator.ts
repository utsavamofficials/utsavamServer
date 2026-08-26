import Joi from 'joi';
import { idParamSchema, objectId, paginationQuerySchema } from './common.validator';

export const createEventSchema = {
  body: Joi.object({
    seasonId: objectId.required(),
    eventOrganizerId: objectId.required(),
    eventName: Joi.string().required(),
    organizingMandalName: Joi.string().allow('').optional(),
    description: Joi.string().allow('').optional(),
    donationUpiQrCode1: Joi.string().uri().allow('').optional(),
    donationUpiQrCode2: Joi.string().uri().allow('').optional(),
    startDate: Joi.date().iso().required(),
    endDate: Joi.date().iso().required(),
    referenceBy: Joi.string().optional(),
  }),
};

export const updateEventSchema = {
  params: idParamSchema,
  body: Joi.object({
    eventName: Joi.string().optional(),
    organizingMandalName: Joi.string().allow('').optional(),
    description: Joi.string().allow('').optional(),
    donationUpiQrCode1: Joi.string().uri().allow('').optional(),
    donationUpiQrCode2: Joi.string().uri().allow('').optional(),
    startDate: Joi.date().iso().optional(),
    endDate: Joi.date().iso().optional(),
    referenceBy: Joi.string().optional(),
  }).min(1),
};

export const listEventSchema = {
  query: Joi.object({ ...paginationQuerySchema, seasonId: objectId.optional() }),
};
export const eventIdParamSchema = { params: idParamSchema };
export const setEventStatusSchema = {
  params: idParamSchema,
  body: Joi.object({ isActive: Joi.boolean().required() }),
};
