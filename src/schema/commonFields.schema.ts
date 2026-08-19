import { Schema } from 'mongoose';

/**
 * Global metadata fields required on every applicable collection per the
 * enterprise schema spec. `createdAt`/`updatedAt` are added separately via
 * `{ timestamps: true }` on each model — do not duplicate them here.
 *
 * Usage:
 *   const mySchema = new Schema({ ...myFields, ...commonFields }, { timestamps: true });
 */
export const commonFields = {
  isActive: {
    type: Boolean,
    default: true,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
  deletedAt: {
    type: Date,
    default: null,
  },
};

/**
 * Attaches a pre-find hook to a schema so all standard read queries
 * (find, findOne, findOneAndUpdate, countDocuments) exclude soft-deleted
 * records by default, unless the caller explicitly overrides `isDeleted`
 * in their filter.
 */
export function applySoftDeleteFilter(schema: Schema): void {
  const queryMiddlewareTypes = [
    'find',
    'findOne',
    'findOneAndUpdate',
    'countDocuments',
    'findOneAndDelete',
  ] as const;

  queryMiddlewareTypes.forEach((method) => {
    schema.pre(method, function (this: import('mongoose').Query<unknown, unknown>) {
      const filter = this.getFilter();
      if (filter.isDeleted === undefined) {
        this.where({ isDeleted: false });
      }
    });
  });
}
