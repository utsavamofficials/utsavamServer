import Joi from 'joi';
import { genderSchema, idParamSchema, objectId, paginationQuerySchema, phoneSchema } from './common.validator';

export const createEventOrganizerSchema = {
  body: Joi.object({
    seasonId: objectId.required(),
    eventId: objectId.required(),
    fullName: Joi.string().required(),
    username: Joi.string().alphanum().min(3).max(30).required(),
    password: Joi.string().min(8).required(),
    email: Joi.string().email().optional(),
    contactNumber: phoneSchema.required(),
    alternateContactNumber: phoneSchema.optional(),
    age: Joi.number().integer().min(18).max(100).optional(),
    gender: genderSchema.optional(),
    permanentAddress: Joi.string().allow('').optional(),
    currentAddress: Joi.string().allow('').optional(),
  }),
};

export const updateEventOrganizerSchema = {
  params: idParamSchema,
  body: Joi.object({
    fullName: Joi.string().optional(),
    email: Joi.string().email().optional(),
    contactNumber: phoneSchema.optional(),
    alternateContactNumber: phoneSchema.optional(),
    age: Joi.number().integer().min(18).max(100).optional(),
    gender: genderSchema.optional(),
    permanentAddress: Joi.string().allow('').optional(),
    currentAddress: Joi.string().allow('').optional(),
  }).min(1),
};

export const listEventOrganizerSchema = {
  query: Joi.object({
    ...paginationQuerySchema,
    seasonId: objectId.optional(),
    eventId: objectId.optional(),
  }),
};
export const eventOrganizerIdParamSchema = { params: idParamSchema };
export const setEventOrganizerStatusSchema = {
  params: idParamSchema,
  body: Joi.object({ isActive: Joi.boolean().required() }),
};
