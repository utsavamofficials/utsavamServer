import { BaseRepository } from './base.repository';
import { IReceiptTemplate, ReceiptTemplateModel } from '../models/receiptTemplate.model';

class ReceiptTemplateRepository extends BaseRepository<IReceiptTemplate> {
  constructor() {
    super(ReceiptTemplateModel);
  }

  async findByEventId(eventId: string) {
    return ReceiptTemplateModel.findOne({ eventId, isDeleted: false }).exec();
  }
}

export const receiptTemplateRepository = new ReceiptTemplateRepository();
