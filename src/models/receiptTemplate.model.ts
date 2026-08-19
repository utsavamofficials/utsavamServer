import { Schema, model, Document, Types } from 'mongoose';
import { commonFields, applySoftDeleteFilter } from '../schema/commonFields.schema';

export interface IReceiptTemplate extends Document {
  _id: Types.ObjectId;
  seasonId: Types.ObjectId;
  eventId: Types.ObjectId;
  headerImageUrl?: string;
  greetingText?: string;
  useCustomBackground?: boolean;
  customBackgroundUrl?: string;
  showDonorName?: boolean;
  showMandalName?: boolean;
  mandalTagLine?: string;
  showDonationAmount?: boolean;
  showDonationDateTime?: boolean;
  showReceiptNumber?: boolean;
  showEventName?: boolean;
  qrCodeUrl?: string;
  showQrCode?: boolean;
  isActive: boolean;
  isDeleted: boolean;
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const receiptTemplateSchema = new Schema<IReceiptTemplate>(
  {
    seasonId: { type: Schema.Types.ObjectId, ref: 'Season', required: true },
    eventId: { type: Schema.Types.ObjectId, ref: 'Event', required: true, unique: true },
    headerImageUrl: { type: String },
    greetingText: { type: String, trim: true },
    useCustomBackground: { type: Boolean, default: false },
    customBackgroundUrl: { type: String },
    showDonorName: { type: Boolean, default: true },
    showMandalName: { type: Boolean, default: true },
    mandalTagLine: { type: String, trim: true },
    showDonationAmount: { type: Boolean, default: true },
    showDonationDateTime: { type: Boolean, default: true },
    showReceiptNumber: { type: Boolean, default: true },
    showEventName: { type: Boolean, default: true },
    qrCodeUrl: { type: String },
    showQrCode: { type: Boolean, default: false },
    ...commonFields,
  },
  { timestamps: true },
);

applySoftDeleteFilter(receiptTemplateSchema);

export const ReceiptTemplateModel = model<IReceiptTemplate>('ReceiptTemplate', receiptTemplateSchema);
