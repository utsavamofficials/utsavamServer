import { Schema, model, Document, Types } from 'mongoose';
import { commonFields, applySoftDeleteFilter } from '../schema/commonFields.schema';

export interface IEvent extends Document {
  _id: Types.ObjectId;
  seasonId: Types.ObjectId;
  eventOrganizerId: Types.ObjectId;
  eventName: string;
  organizingMandalName?: string;
  description?: string;
  donationUpiQrCode1?: string;
  donationUpiQrCode2?: string;
  startDate: Date;
  endDate: Date;
  referenceBy?: string;
  isActive: boolean;
  isDeleted: boolean;
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const eventSchema = new Schema<IEvent>(
  {
    seasonId: { type: Schema.Types.ObjectId, ref: 'Season', required: true },
    eventOrganizerId: { type: Schema.Types.ObjectId, ref: 'eventOrganizer', required: true },
    eventName: { type: String, required: true, trim: true },
    organizingMandalName: { type: String, trim: true },
    description: { type: String, trim: true },
    donationUpiQrCode1: { type: String },
    donationUpiQrCode2: { type: String },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    referenceBy: { type: String, ref: 'User' },
    ...commonFields,
  },
  { timestamps: true },
);

eventSchema.index({ seasonId: 1 });
eventSchema.index({ eventOrganizerId: 1 });

applySoftDeleteFilter(eventSchema);

export const EventModel = model<IEvent>('Event', eventSchema);
