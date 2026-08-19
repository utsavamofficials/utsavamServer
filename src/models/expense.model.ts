import { Schema, model, Document, Types } from 'mongoose';
import { commonFields, applySoftDeleteFilter } from '../schema/commonFields.schema';
import { ExpenseApprovalStatus, ExpensePaymentMode, ExpensePaymentStatus } from '../constants/enums';

export interface IExpense extends Document {
  _id: Types.ObjectId;
  expenseVoucherNumber: string;
  seasonId: Types.ObjectId;
  eventId: Types.ObjectId;
  categoryId: Types.ObjectId;
  eventOrganizerId: Types.ObjectId;
  vendorName?: string;
  vendorGstin?: string;
  amount: Schema.Types.Decimal128;
  paymentMode: ExpensePaymentMode;
  paymentStatus: ExpensePaymentStatus;
  approvalStatus: ExpenseApprovalStatus;
  receiptUrls?: string[];
  expenseDate: Date;
  isActive: boolean;
  isDeleted: boolean;
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const expenseSchema = new Schema<IExpense>(
  {
    expenseVoucherNumber: { type: String, required: true, unique: true, trim: true },
    seasonId: { type: Schema.Types.ObjectId, ref: 'Season', required: true },
    eventId: { type: Schema.Types.ObjectId, ref: 'Event', required: true },
    categoryId: { type: Schema.Types.ObjectId, ref: 'ExpenseCategory', required: true },
    eventOrganizerId: { type: Schema.Types.ObjectId, ref: 'EventOrganizer', required: true },
    vendorName: { type: String, trim: true },
    vendorGstin: { type: String, trim: true, uppercase: true },
    amount: { type: Schema.Types.Decimal128, required: true },
    paymentMode: { type: String, enum: Object.values(ExpensePaymentMode), required: true },
    paymentStatus: {
      type: String,
      enum: Object.values(ExpensePaymentStatus),
      default: ExpensePaymentStatus.UNPAID,
    },
    approvalStatus: {
      type: String,
      enum: Object.values(ExpenseApprovalStatus),
      default: ExpenseApprovalStatus.DRAFT,
    },
    receiptUrls: { type: [String], default: [] },
    expenseDate: { type: Date, required: true },
    ...commonFields,
  },
  { timestamps: true },
);

expenseSchema.index({ eventId: 1, approvalStatus: 1 });
expenseSchema.index({ categoryId: 1 });

applySoftDeleteFilter(expenseSchema);

export const ExpenseModel = model<IExpense>('Expense', expenseSchema);
