import Joi from 'joi';
import { idParamSchema, objectId } from './common.validator';

export const expenseApprovalIdParamSchema = { params: idParamSchema };
export const listByExpenseSchema = {
  params: Joi.object({ expenseId: objectId.required() }),
};
