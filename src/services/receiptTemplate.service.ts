import { receiptTemplateRepository } from '../repositories/receiptTemplate.repository';
import { ApiError } from '../utils/ApiError';
import { IReceiptTemplate } from '../models/receiptTemplate.model';

export interface UpsertReceiptTemplateInput {
  seasonId: string;
  eventId: string;
  headerImageUrl?: string;
  greetingText?: string;
  useCustomBackground?: boolean;
  customBackgroundUrl?: string;
  showDonorName?: boolean;
  showMandalName?: boolean;
  mandalTagLine?: string;
  showDonationAmount?: boolean;
  showDonationDateTime?: boolean;
  showReceiptNumber?: boolean;
  showEventName?: boolean;
  qrCodeUrl?: string;
  showQrCode?: boolean;
}

export const receiptTemplateService = {
  async create(input: UpsertReceiptTemplateInput): Promise<IReceiptTemplate> {
    const existing = await receiptTemplateRepository.findByEventId(input.eventId);
    if (existing) throw ApiError.conflict('A receipt template already exists for this event');
    return receiptTemplateRepository.create(input as unknown as Record<string, unknown>);
  },

  async getByEventId(eventId: string): Promise<IReceiptTemplate> {
    const template = await receiptTemplateRepository.findByEventId(eventId);
    if (!template) throw ApiError.notFound('Receipt template not found for this event');
    return template;
  },

  async update(id: string, input: Partial<UpsertReceiptTemplateInput>): Promise<IReceiptTemplate> {
    const updated = await receiptTemplateRepository.updateById(id, input);
    if (!updated) throw ApiError.notFound('Receipt template not found');
    return updated;
  },

  async setActive(id: string, isActive: boolean): Promise<IReceiptTemplate> {
    const template = await receiptTemplateRepository.setActive(id, isActive);
    if (!template) throw ApiError.notFound('Receipt template not found');
    return template;
  },
};
