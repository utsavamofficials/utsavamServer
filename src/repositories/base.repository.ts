import { Document, FilterQuery, Model, Types, UpdateQuery } from 'mongoose';
import { buildPaginationMeta, ParsedPagination } from '../utils/queryBuilder';
import { PaginationMeta } from '../utils/ApiResponse';

export interface ListResult<T> {
  records: T[];
  meta: PaginationMeta;
}

export class BaseRepository<T extends Document> {
  protected readonly model: Model<T>;

  constructor(model: Model<T>) {
    this.model = model;
  }

  /**
   * Accepts a plain input object (string IDs, etc.) rather than Partial<T>,
   * since callers build create payloads from service-layer DTOs where
   * ObjectId refs are still strings — Mongoose casts them at write time.
   */
  async create(data: Record<string, unknown>): Promise<T> {
    const doc = new this.model(data);
    return doc.save();
  }

  async findById(id: string): Promise<T | null> {
    if (!Types.ObjectId.isValid(id)) return null;
    return this.model.findById(id).exec();
  }

  async findOne(filter: FilterQuery<T>): Promise<T | null> {
    return this.model.findOne(filter).exec();
  }

  async findMany(filter: FilterQuery<T>, pagination: ParsedPagination): Promise<ListResult<T>> {
    const [records, totalRecords] = await Promise.all([
      this.model.find(filter).sort(pagination.sort).skip(pagination.skip).limit(pagination.limit).exec(),
      this.model.countDocuments(filter).exec(),
    ]);

    return {
      records,
      meta: buildPaginationMeta(pagination.page, pagination.limit, totalRecords),
    };
  }

  async updateById(id: string, update: UpdateQuery<T>): Promise<T | null> {
    return this.model.findByIdAndUpdate(id, update, { new: true, runValidators: true }).exec();
  }

  async softDeleteById(id: string): Promise<T | null> {
    return this.model
      .findByIdAndUpdate(id, { isDeleted: true, isActive: false, deletedAt: new Date() }, { new: true })
      .exec();
  }

  async setActive(id: string, isActive: boolean): Promise<T | null> {
    return this.model.findByIdAndUpdate(id, { isActive }, { new: true }).exec();
  }

  async count(filter: FilterQuery<T>): Promise<number> {
    return this.model.countDocuments(filter).exec();
  }

  async exists(filter: FilterQuery<T>): Promise<boolean> {
    const doc = await this.model.exists(filter);
    return doc !== null;
  }
}
