import Joi from 'joi';
import { idParamSchema, paginationQuerySchema } from './common.validator';

export const createSeasonSchema = {
  body: Joi.object({
    seasonName: Joi.string().required(),
    seasonCode: Joi.string().alphanum().min(2).max(20).required(),
    seasonDescription: Joi.string().allow('').optional(),
    startDate: Joi.date().iso().required(),
    endDate: Joi.date().iso().required(),
  }),
};

export const updateSeasonSchema = {
  params: idParamSchema,
  body: Joi.object({
    seasonName: Joi.string().optional(),
    seasonCode: Joi.string().alphanum().min(2).max(20).optional(),
    seasonDescription: Joi.string().allow('').optional(),
    startDate: Joi.date().iso().optional(),
    endDate: Joi.date().iso().optional(),
  }).min(1),
};

export const listSeasonSchema = { query: Joi.object(paginationQuerySchema) };
export const seasonIdParamSchema = { params: idParamSchema };
export const setSeasonStatusSchema = {
  params: idParamSchema,
  body: Joi.object({ isActive: Joi.boolean().required() }),
};
