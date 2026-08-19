import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiResponse } from '../utils/ApiResponse';
import { receiptTemplateService } from '../services/receiptTemplate.service';

export const receiptTemplateController = {
  create: asyncHandler(async (req: Request, res: Response) => {
    const template = await receiptTemplateService.create(req.body);
    ApiResponse.created(res, template);
  }),

  getByEventId: asyncHandler(async (req: Request, res: Response) => {
    const template = await receiptTemplateService.getByEventId(req.params.eventId as string);
    ApiResponse.success(res, template);
  }),

  update: asyncHandler(async (req: Request, res: Response) => {
    const template = await receiptTemplateService.update(req.params.id as string, req.body);
    ApiResponse.success(res, template, 'Receipt template updated successfully');
  }),

  setActive: asyncHandler(async (req: Request, res: Response) => {
    const template = await receiptTemplateService.setActive(req.params.id as string, req.body.isActive);
    ApiResponse.success(res, template, 'Receipt template status updated successfully');
  }),
};
