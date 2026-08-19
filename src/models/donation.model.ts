import { Schema, model, Document, Types } from 'mongoose';
import { commonFields, applySoftDeleteFilter } from '../schema/commonFields.schema';
import { DonationPaymentMode, DonationStatus } from '../constants/enums';

export interface IDonation extends Document {
  _id: Types.ObjectId;
  receiptNumber: string;
  donorId: Types.ObjectId;
  seasonId: Types.ObjectId;
  eventId: Types.ObjectId;
  collectionExecutiveId: Types.ObjectId;
  donationType?: string;
  donationAmount: Schema.Types.Decimal128;
  paymentMode: DonationPaymentMode;
  donationStatus: DonationStatus;
  donationDescription?: string;
  happyStatus?: boolean;
  paymentDetails?: Record<string, unknown>;
  isActive: boolean;
  isDeleted: boolean;
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const donationSchema = new Schema<IDonation>(
  {
    receiptNumber: { type: String, required: true, unique: true, trim: true },
    donorId: { type: Schema.Types.ObjectId, ref: 'Donor', required: true },
    seasonId: { type: Schema.Types.ObjectId, ref: 'Season', required: true },
    eventId: { type: Schema.Types.ObjectId, ref: 'Event', required: true },
    collectionExecutiveId: { type: Schema.Types.ObjectId, ref: 'CollectionExecutive', required: true },
    donationType: { type: String, trim: true },
    donationAmount: { type: Schema.Types.Decimal128, required: true },
    paymentMode: { type: String, enum: Object.values(DonationPaymentMode), required: true },
    donationStatus: {
      type: String,
      enum: Object.values(DonationStatus),
      default: DonationStatus.PENDING,
    },
    donationDescription: { type: String, trim: true },
    happyStatus: { type: Boolean },
    paymentDetails: { type: Schema.Types.Mixed },
    ...commonFields,
  },
  { timestamps: true },
);

donationSchema.index({ eventId: 1, collectionExecutiveId: 1 });
donationSchema.index({ donorId: 1 });

applySoftDeleteFilter(donationSchema);

export const DonationModel = model<IDonation>('Donation', donationSchema);
