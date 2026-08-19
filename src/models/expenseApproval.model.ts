import { Schema, model, Document, Types } from 'mongoose';
import { commonFields, applySoftDeleteFilter } from '../schema/commonFields.schema';
import { ExpenseApprovalAction } from '../constants/enums';

export interface IExpenseApproval extends Document {
  _id: Types.ObjectId;
  expenseId: Types.ObjectId;
  approvedByUserId: Types.ObjectId;
  action: ExpenseApprovalAction;
  remarks?: string;
  actionTimestamp: Date;
  isActive: boolean;
  isDeleted: boolean;
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const expenseApprovalSchema = new Schema<IExpenseApproval>(
  {
    expenseId: { type: Schema.Types.ObjectId, ref: 'Expense', required: true },
    approvedByUserId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    action: { type: String, enum: Object.values(ExpenseApprovalAction), required: true },
    remarks: { type: String, trim: true },
    actionTimestamp: { type: Date, default: Date.now },
    ...commonFields,
  },
  { timestamps: true },
);

expenseApprovalSchema.index({ expenseId: 1 });

applySoftDeleteFilter(expenseApprovalSchema);

export const ExpenseApprovalModel = model<IExpenseApproval>('ExpenseApproval', expenseApprovalSchema);
