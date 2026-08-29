import { Schema, model, Document, Types } from 'mongoose';
import { commonFields, applySoftDeleteFilter } from '../schema/commonFields.schema';

export interface IEventOrganizerPaymentDetails extends Document {
  _id: Types.ObjectId;
  eventOrganizerId: Types.ObjectId;

  // UPI Payment Details
  payeeUpiId: string;
  payeeName: string;
  currency: string;
  merchantCategoryCode?: string;
  transactionDetailsUrl?: string;

  isActive: boolean;
  isDeleted: boolean;
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const eventOrganizerPaymentDetailsSchema =
  new Schema<IEventOrganizerPaymentDetails>(
    {
      eventOrganizerId: {
        type: Schema.Types.ObjectId,
        ref: 'EventOrganizer',
        required: true,
      },

      // UPI Payee Address / VPA
      payeeUpiId: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
      },

      // UPI Payee Name
      payeeName: {
        type: String,
        required: true,
        trim: true,
      },

      // Currency
      currency: {
        type: String,
        required: true,
        default: 'INR',
        uppercase: true,
        trim: true,
      },

      // Merchant Category Code
      merchantCategoryCode: {
        type: String,
        trim: true,
      },

      // Transaction / Details URL
      transactionDetailsUrl: {
        type: String,
        trim: true,
      },

      ...commonFields,
    },
    { timestamps: true },
  );

eventOrganizerPaymentDetailsSchema.index({
  eventOrganizerId: 1,
});

eventOrganizerPaymentDetailsSchema.index({
  eventOrganizerId: 1,
  isActive: 1,
});

eventOrganizerPaymentDetailsSchema.index({
  payeeUpiId: 1,
});

applySoftDeleteFilter(eventOrganizerPaymentDetailsSchema);

export const EventOrganizerPaymentDetailsModel =
  model<IEventOrganizerPaymentDetails>(
    'EventOrganizerPaymentDetails',
    eventOrganizerPaymentDetailsSchema,
  );
