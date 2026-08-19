import { Schema, model, Document, Types } from 'mongoose';
import { commonFields, applySoftDeleteFilter } from '../schema/commonFields.schema';
import { Role, Gender } from '../constants/roles';

export interface IUser extends Document {
  _id: Types.ObjectId;
  fullName: string;
  username: string;
  email: string;
  contactNumber: string;
  passwordHash: string;
  age?: number;
  gender?: Gender;
  role: Role;
  isActive: boolean;
  isDeleted: boolean;
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    fullName: { type: String, required: true, trim: true },
    username: { type: String, required: true, unique: true, trim: true, lowercase: true },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    contactNumber: { type: String, required: true, unique: true, trim: true },
    passwordHash: { type: String, required: true, select: false },
    age: { type: Number },
    gender: { type: String, enum: Object.values(Gender) },
    role: { type: String, enum: Object.values(Role), required: true },
    ...commonFields,
  },
  { timestamps: true },
);

userSchema.set('toJSON', {
  transform: (_doc, ret) => {
    const obj = ret as unknown as Record<string, unknown>;
    delete obj.passwordHash;
    delete obj.__v;
    return ret;
  },
});

applySoftDeleteFilter(userSchema);

export const UserModel = model<IUser>('User', userSchema);
