import Joi from 'joi';
import { idParamSchema, objectId } from './common.validator';

export const createReceiptTemplateSchema = {
  body: Joi.object({
    seasonId: objectId.required(),
    eventId: objectId.required(),
    headerImageUrl: Joi.string().uri().optional(),
    greetingText: Joi.string().allow('').optional(),
    useCustomBackground: Joi.boolean().optional(),
    customBackgroundUrl: Joi.string().uri().optional(),
    showDonorName: Joi.boolean().optional(),
    showMandalName: Joi.boolean().optional(),
    mandalTagLine: Joi.string().allow('').optional(),
    showDonationAmount: Joi.boolean().optional(),
    showDonationDateTime: Joi.boolean().optional(),
    showReceiptNumber: Joi.boolean().optional(),
    showEventName: Joi.boolean().optional(),
    qrCodeUrl: Joi.string().uri().optional(),
    showQrCode: Joi.boolean().optional(),
  }),
};

export const updateReceiptTemplateSchema = {
  params: idParamSchema,
  body: Joi.object({
    headerImageUrl: Joi.string().uri().optional(),
    greetingText: Joi.string().allow('').optional(),
    useCustomBackground: Joi.boolean().optional(),
    customBackgroundUrl: Joi.string().uri().optional(),
    showDonorName: Joi.boolean().optional(),
    showMandalName: Joi.boolean().optional(),
    mandalTagLine: Joi.string().allow('').optional(),
    showDonationAmount: Joi.boolean().optional(),
    showDonationDateTime: Joi.boolean().optional(),
    showReceiptNumber: Joi.boolean().optional(),
    showEventName: Joi.boolean().optional(),
    qrCodeUrl: Joi.string().uri().optional(),
    showQrCode: Joi.boolean().optional(),
  }).min(1),
};

export const receiptTemplateIdParamSchema = { params: idParamSchema };
export const receiptTemplateEventIdParamSchema = {
  params: Joi.object({ eventId: objectId.required() }),
};
export const setReceiptTemplateStatusSchema = {
  params: idParamSchema,
  body: Joi.object({ isActive: Joi.boolean().required() }),
};
