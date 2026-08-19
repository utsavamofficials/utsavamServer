import Joi from 'joi';
import { idParamSchema, objectId, paginationQuerySchema } from './common.validator';
import { DonationPaymentMode, DonationStatus } from '../constants/enums';

export const createDonationSchema = {
  body: Joi.object({
    donorId: objectId.required(),
    seasonId: objectId.required(),
    eventId: objectId.required(),
    collectionExecutiveId: objectId.required(),
    donationType: Joi.string().allow('').optional(),
    donationAmount: Joi.number().positive().precision(2).required(),
    paymentMode: Joi.string().valid(...Object.values(DonationPaymentMode)).required(),
    donationDescription: Joi.string().allow('').optional(),
    happyStatus: Joi.boolean().optional(),
    paymentDetails: Joi.object().unknown(true).optional(),
  }),
};

export const updateDonationSchema = {
  params: idParamSchema,
  body: Joi.object({
    donationType: Joi.string().allow('').optional(),
    donationDescription: Joi.string().allow('').optional(),
    happyStatus: Joi.boolean().optional(),
    paymentDetails: Joi.object().unknown(true).optional(),
  }).min(1),
};

export const updateDonationStatusSchema = {
  params: idParamSchema,
  body: Joi.object({
    donationStatus: Joi.string().valid(...Object.values(DonationStatus)).required(),
  }),
};

export const listDonationSchema = {
  query: Joi.object({
    ...paginationQuerySchema,
    seasonId: objectId.optional(),
    eventId: objectId.optional(),
    collectionExecutiveId: objectId.optional(),
    paymentMode: Joi.string().valid(...Object.values(DonationPaymentMode)).optional(),
    donationStatus: Joi.string().valid(...Object.values(DonationStatus)).optional(),
    startDate: Joi.date().iso().optional(),
    endDate: Joi.date().iso().optional(),
  }),
};

export const donationIdParamSchema = { params: idParamSchema };
export const receiptNumberParamSchema = {
  params: Joi.object({ receiptNumber: Joi.string().required() }),
};
export const donationEventIdParamSchema = {
  params: Joi.object({ eventId: objectId.required() }),
};
