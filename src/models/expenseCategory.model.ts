import { Schema, model, Document, Types } from 'mongoose';
import { commonFields, applySoftDeleteFilter } from '../schema/commonFields.schema';

export interface IExpenseCategory extends Document {
  _id: Types.ObjectId;
  seasonId: Types.ObjectId;
  eventId: Types.ObjectId;
  categoryName: string;
  allocatedBudget?: Schema.Types.Decimal128;
  isActive: boolean;
  isDeleted: boolean;
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const expenseCategorySchema = new Schema<IExpenseCategory>(
  {
    seasonId: { type: Schema.Types.ObjectId, ref: 'Season', required: true },
    eventId: { type: Schema.Types.ObjectId, ref: 'Event', required: true },
    categoryName: { type: String, required: true, trim: true },
    allocatedBudget: { type: Schema.Types.Decimal128 },
    ...commonFields,
  },
  { timestamps: true },
);

expenseCategorySchema.index({ eventId: 1 });

applySoftDeleteFilter(expenseCategorySchema);

export const ExpenseCategoryModel = model<IExpenseCategory>('ExpenseCategory', expenseCategorySchema);
