import { BaseRepository } from './base.repository';
import { IEvent, EventModel } from '../models/event.model';

class EventRepository extends BaseRepository<IEvent> {
  constructor() {
    super(EventModel);
  }

  async findByIdAndSeason(id: string, seasonId: string) {
    return EventModel.findOne({ _id: id, seasonId, isDeleted: false }).exec();
  }
}

export const eventRepository = new EventRepository();
