import { Schema, model, Document, Types } from 'mongoose';
import { commonFields, applySoftDeleteFilter } from '../schema/commonFields.schema';
import { Gender } from '../constants/roles';

export interface IEventOrganizer extends Document {
  _id: Types.ObjectId;
  seasonId: Types.ObjectId;
  eventId: Types.ObjectId;
  fullName: string;
  username: string;
  passwordHash: string;
  email?: string;
  contactNumber: string;
  alternateContactNumber?: string;
  age?: number;
  gender?: Gender;
  permanentAddress?: string;
  currentAddress?: string;
  isActive: boolean;
  isDeleted: boolean;
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const eventOrganizerSchema = new Schema<IEventOrganizer>(
  {
    seasonId: { type: Schema.Types.ObjectId, ref: 'Season', required: true },
    eventId: { type: Schema.Types.ObjectId, ref: 'Event', required: true },
    fullName: { type: String, required: true, trim: true },
    username: { type: String, required: true, unique: true, trim: true, lowercase: true },
    passwordHash: { type: String, required: true, select: false },
    email: { type: String, trim: true, lowercase: true },
    contactNumber: { type: String, required: true, trim: true },
    alternateContactNumber: { type: String, trim: true },
    age: { type: Number },
    gender: { type: String, enum: Object.values(Gender) },
    permanentAddress: { type: String, trim: true },
    currentAddress: { type: String, trim: true },
    ...commonFields,
  },
  { timestamps: true },
);

eventOrganizerSchema.index({ seasonId: 1, eventId: 1 });

eventOrganizerSchema.set('toJSON', {
  transform: (_doc, ret) => {
    const obj = ret as unknown as Record<string, unknown>;
    delete obj.passwordHash;
    delete obj.__v;
    return ret;
  },
});

applySoftDeleteFilter(eventOrganizerSchema);

export const EventOrganizerModel = model<IEventOrganizer>('EventOrganizer', eventOrganizerSchema);
