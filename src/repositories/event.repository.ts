import { BaseRepository } from './base.repository';
import { IEvent, EventModel } from '../models/event.model';

class EventRepository extends BaseRepository<IEvent> {
  constructor() {
    super(EventModel);
  }

  async findByIdAndSeason(id: string, seasonId: string) {
    return EventModel.findOne({ _id: id, seasonId, isDeleted: false }).exec();
  }

  async findBySeasonId(seasonId: string) {
    return EventModel.findOne({ seasonId, isDeleted: false }).exec();
  }

  async findByEventOrganizerId(eventOrganizerId: string) {
    return EventModel.findOne({ eventOrganizerId, isDeleted: false }).exec();
  }

  async countByOrganizer(eventOrganizerId: string) {
    return EventModel.countDocuments({ eventOrganizerId, isDeleted: false }).exec();
  }
}

export const eventRepository = new EventRepository();
