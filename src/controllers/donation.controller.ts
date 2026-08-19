import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiResponse } from '../utils/ApiResponse';
import { parsePagination } from '../utils/queryBuilder';
import { donationService } from '../services/donation.service';

export const donationController = {
  create: asyncHandler(async (req: Request, res: Response) => {
    const donation = await donationService.create(req.body);
    ApiResponse.created(res, donation);
  }),

  list: asyncHandler(async (req: Request, res: Response) => {
    const pagination = parsePagination(req.query);
    const { records, meta } = await donationService.list(pagination, {
      seasonId: req.query.seasonId as string | undefined,
      eventId: req.query.eventId as string | undefined,
      collectionExecutiveId: req.query.collectionExecutiveId as string | undefined,
      paymentMode: req.query.paymentMode as never,
      donationStatus: req.query.donationStatus as never,
      startDate: req.query.startDate as string | undefined,
      endDate: req.query.endDate as string | undefined,
    });
    ApiResponse.paginated(res, records, meta);
  }),

  getById: asyncHandler(async (req: Request, res: Response) => {
    const donation = await donationService.getById(req.params.id as string);
    ApiResponse.success(res, donation);
  }),

  getByReceiptNumber: asyncHandler(async (req: Request, res: Response) => {
    const donation = await donationService.getByReceiptNumber(req.params.receiptNumber as string);
    ApiResponse.success(res, donation);
  }),

  update: asyncHandler(async (req: Request, res: Response) => {
    const donation = await donationService.update(req.params.id as string, req.body);
    ApiResponse.success(res, donation, 'Donation updated successfully');
  }),

  updateStatus: asyncHandler(async (req: Request, res: Response) => {
    const donation = await donationService.updateStatus(req.params.id as string, req.body.donationStatus);
    ApiResponse.success(res, donation, 'Donation status updated successfully');
  }),

  eventSummary: asyncHandler(async (req: Request, res: Response) => {
    const summary = await donationService.getEventSummary(req.params.eventId as string);
    ApiResponse.success(res, summary);
  }),
};
