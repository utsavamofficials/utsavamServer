import { CounterModel } from '../models/counter.model';

/**
 * Atomically increments a per-prefix, per-year counter and returns a
 * zero-padded business reference like UTS-2026-000001 or EXP-2026-000001.
 * Uses findOneAndUpdate with $inc + upsert, which is atomic at the MongoDB
 * level, so concurrent requests can never receive the same number.
 */
export async function generateReferenceNumber(prefix: string, padLength = 6): Promise<string> {
  const year = new Date().getFullYear();
  const key = `${prefix}-${year}`;

  const counter = await CounterModel.findOneAndUpdate(
    { _id: key },
    { $inc: { seq: 1 } },
    { new: true, upsert: true },
  ).exec();

  const seq = counter.seq.toString().padStart(padLength, '0');
  return `${prefix}-${year}-${seq}`;
}
