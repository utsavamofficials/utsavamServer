import Joi from 'joi';

export const loginSchema = {
  body: Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
  }),
};

export const refreshSchema = {
  body: Joi.object({
    refreshToken: Joi.string().required(),
  }),
};
