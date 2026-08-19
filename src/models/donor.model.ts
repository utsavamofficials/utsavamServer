import { Schema, model, Document, Types } from 'mongoose';
import { commonFields, applySoftDeleteFilter } from '../schema/commonFields.schema';

export interface IDonor extends Document {
  _id: Types.ObjectId;
  seasonId: Types.ObjectId;
  eventId: Types.ObjectId;
  collectionExecutiveId: Types.ObjectId;
  donorName: string;
  contactNumber: string;
  email?: string;
  panNumber?: string;
  age?: number;
  address?: string;
  isActive: boolean;
  isDeleted: boolean;
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const donorSchema = new Schema<IDonor>(
  {
    seasonId: { type: Schema.Types.ObjectId, ref: 'Season', required: true },
    eventId: { type: Schema.Types.ObjectId, ref: 'Event', required: true },
    collectionExecutiveId: { type: Schema.Types.ObjectId, ref: 'CollectionExecutive', required: true },
    donorName: { type: String, required: true, trim: true },
    contactNumber: { type: String, required: true, trim: true },
    email: { type: String, trim: true, lowercase: true },
    panNumber: { type: String, trim: true, uppercase: true },
    age: { type: Number },
    address: { type: String, trim: true },
    ...commonFields,
  },
  { timestamps: true },
);

donorSchema.index({ contactNumber: 1, eventId: 1 });

applySoftDeleteFilter(donorSchema);

export const DonorModel = model<IDonor>('Donor', donorSchema);
