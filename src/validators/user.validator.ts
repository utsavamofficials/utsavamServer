import Joi from 'joi';
import { genderSchema, idParamSchema, paginationQuerySchema, phoneSchema } from './common.validator';
import { Role } from '../constants/roles';

export const createUserSchema = {
  body: Joi.object({
    fullName: Joi.string().required(),
    username: Joi.string().alphanum().min(3).max(30).required(),
    email: Joi.string().email().required(),
    contactNumber: phoneSchema.required(),
    password: Joi.string().min(8).required(),
    age: Joi.number().integer().min(1).max(120).optional(),
    gender: genderSchema.optional(),
    role: Joi.string().valid(...Object.values(Role)).required(),
  }),
};

export const updateUserSchema = {
  params: idParamSchema,
  body: Joi.object({
    fullName: Joi.string().optional(),
    email: Joi.string().email().optional(),
    contactNumber: phoneSchema.optional(),
    age: Joi.number().integer().min(1).max(120).optional(),
    gender: genderSchema.optional(),
  }).min(1),
};

export const listUserSchema = {
  query: Joi.object({
    ...paginationQuerySchema,
    role: Joi.string().valid(...Object.values(Role)).optional(),
  }),
};

export const setActiveSchema = {
  params: idParamSchema,
  body: Joi.object({
    isActive: Joi.boolean().required(),
  }),
};

export const idParamOnlySchema = { params: idParamSchema };
