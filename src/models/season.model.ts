import { Schema, model, Document, Types } from 'mongoose';
import { commonFields, applySoftDeleteFilter } from '../schema/commonFields.schema';

export interface ISeason extends Document {
  _id: Types.ObjectId;
  seasonName: string;
  seasonCode: string;
  seasonDescription?: string;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  isDeleted: boolean;
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const seasonSchema = new Schema<ISeason>(
  {
    seasonName: { type: String, required: true, trim: true },
    seasonCode: { type: String, required: true, unique: true, trim: true, uppercase: true },
    seasonDescription: { type: String, trim: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    ...commonFields,
  },
  { timestamps: true },
);

applySoftDeleteFilter(seasonSchema);

export const SeasonModel = model<ISeason>('Season', seasonSchema);
