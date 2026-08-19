import { BaseRepository } from './base.repository';
import { IDonation, DonationModel } from '../models/donation.model';

class DonationRepository extends BaseRepository<IDonation> {
  constructor() {
    super(DonationModel);
  }

  async findByReceiptNumber(receiptNumber: string) {
    return DonationModel.findOne({ receiptNumber, isDeleted: false }).exec();
  }

  async getEventSummary(eventId: string) {
    return DonationModel.aggregate([
      { $match: { eventId: new (await import('mongoose')).Types.ObjectId(eventId), isDeleted: false } },
      {
        $group: {
          _id: '$donationStatus',
          totalAmount: { $sum: { $toDouble: '$donationAmount' } },
          count: { $sum: 1 },
        },
      },
    ]).exec();
  }
}

export const donationRepository = new DonationRepository();
