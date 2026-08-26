import Joi from 'joi';
import { gstinSchema, idParamSchema, objectId, paginationQuerySchema } from './common.validator';
import { ExpenseApprovalStatus, ExpensePaymentStatus } from '../constants/enums';// ExpensePaymentMode

export const createExpenseSchema = {
  body: Joi.object({
    seasonId: objectId.required(),
    categoryId: objectId.required(),
    eventOrganizerId: objectId.required(),
    vendorName: Joi.string().allow('').optional(),
    vendorGstin: gstinSchema.optional(),
    amount: Joi.number().positive().precision(2).required(),
    // paymentMode: Joi.string().valid(...Object.values(ExpensePaymentMode)).required(),
    receiptUrls: Joi.array().items(Joi.string().uri()).optional(),
    expenseDate: Joi.date().iso().optional(),
  }),
};

export const updateExpenseDraftSchema = {
  params: idParamSchema,
  body: Joi.object({
    vendorName: Joi.string().allow('').optional(),
    vendorGstin: gstinSchema.optional(),
    amount: Joi.number().positive().precision(2).optional(),
    // paymentMode: Joi.string().valid(...Object.values(ExpensePaymentMode)).optional(),
    receiptUrls: Joi.array().items(Joi.string().uri()).optional(),
    expenseDate: Joi.date().iso().optional(),
  }).min(1),
};

export const decideExpenseSchema = {
  params: idParamSchema,
  body: Joi.object({
    action: Joi.string().valid('APPROVED', 'REJECTED', 'NEEDS_REVISION').required(),
    remarks: Joi.string().allow('').optional(),
  }),
};

export const updateExpensePaymentStatusSchema = {
  params: idParamSchema,
  body: Joi.object({
    paymentStatus: Joi.string().valid(...Object.values(ExpensePaymentStatus)).required(),
  }),
};

export const listExpenseSchema = {
  query: Joi.object({
    ...paginationQuerySchema,
    seasonId: objectId.optional(),
    eventId: objectId.optional(),
    categoryId: objectId.optional(),
    approvalStatus: Joi.string().valid(...Object.values(ExpenseApprovalStatus)).optional(),
    paymentStatus: Joi.string().valid(...Object.values(ExpensePaymentStatus)).optional(),
  }),
};
export const expenseIdParamSchema = { params: idParamSchema };
