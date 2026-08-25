import { BaseRepository } from './base.repository';
import { IEventOrganizer, EventOrganizerModel } from '../models/eventOrganizer.model';

class EventOrganizerRepository extends BaseRepository<IEventOrganizer> {
  constructor() {
    super(EventOrganizerModel);
  }

  async findByUsernameWithPassword(username: string) {
    return EventOrganizerModel.findOne({ username: username.toLowerCase(), isDeleted: false })
      .select('+passwordHash')
      .exec();
  }

  async findByIdWithinEvent(id: string, seasonId: string) {
    return EventOrganizerModel.findOne({ _id: id, seasonId, isDeleted: false }).exec();
  }
}

export const eventOrganizerRepository = new EventOrganizerRepository();
