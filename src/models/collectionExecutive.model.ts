import { Schema, model, Document, Types } from 'mongoose';
import { commonFields, applySoftDeleteFilter } from '../schema/commonFields.schema';

export interface ICollectionExecutive extends Document {
  _id: Types.ObjectId;
  seasonId: Types.ObjectId;
  eventId: Types.ObjectId;
  eventOrganizerId: Types.ObjectId;
  fullName: string;
  username: string;
  passwordHash: string;
  email?: string;
  contactNumber: string;
  alternateContactNumber?: string;
  age?: number;
  isActive: boolean;
  isDeleted: boolean;
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const collectionExecutiveSchema = new Schema<ICollectionExecutive>(
  {
    seasonId: { type: Schema.Types.ObjectId, ref: 'Season', required: true },
    eventId: { type: Schema.Types.ObjectId, ref: 'Event' },
    eventOrganizerId: { type: Schema.Types.ObjectId, ref: 'EventOrganizer', required: true },
    fullName: { type: String, required: true, trim: true },
    username: { type: String, required: true, unique: true, trim: true, lowercase: true },
    passwordHash: { type: String, required: true, select: false },
    email: { type: String, trim: true, lowercase: true },
    contactNumber: { type: String, required: true, trim: true },
    alternateContactNumber: { type: String, trim: true },
    age: { type: Number },
    ...commonFields,
  },
  { timestamps: true },
);

collectionExecutiveSchema.index({ eventOrganizerId: 1, eventId: 1 });

collectionExecutiveSchema.set('toJSON', {
  transform: (_doc, ret) => {
    const obj = ret as unknown as Record<string, unknown>;
    delete obj.passwordHash;
    delete obj.__v;
    return ret;
  },
});

applySoftDeleteFilter(collectionExecutiveSchema);

export const CollectionExecutiveModel = model<ICollectionExecutive>(
  'CollectionExecutive',
  collectionExecutiveSchema,
);
