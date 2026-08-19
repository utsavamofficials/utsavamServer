import Joi from 'joi';

export const objectId = Joi.string().hex().length(24).message('must be a valid MongoDB ObjectId');

export const paginationQuerySchema = {
  page: Joi.number().integer().min(1).optional(),
  limit: Joi.number().integer().min(1).max(100).optional(),
  sortBy: Joi.string().optional(),
  sortOrder: Joi.string().valid('asc', 'desc').optional(),
  search: Joi.string().allow('').optional(),
};

export const idParamSchema = Joi.object({
  id: objectId.required(),
});

export const genderSchema = Joi.string().valid('MALE', 'FEMALE', 'OTHER');

// PAN: 5 letters, 4 digits, 1 letter (Indian tax ID format)
export const panSchema = Joi.string()
  .pattern(/^[A-Z]{5}[0-9]{4}[A-Z]$/)
  .message('must be a valid PAN (e.g. ABCDE1234F)');

// GSTIN: 15-char Indian GST identification number
export const gstinSchema = Joi.string()
  .pattern(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/)
  .message('must be a valid GSTIN');

export const phoneSchema = Joi.string()
  .pattern(/^[0-9]{10}$/)
  .message('must be a valid 10-digit contact number');
