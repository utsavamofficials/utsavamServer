import { BaseRepository } from './base.repository';
import { ICollectionExecutive, CollectionExecutiveModel } from '../models/collectionExecutive.model';

class CollectionExecutiveRepository extends BaseRepository<ICollectionExecutive> {
  constructor() {
    super(CollectionExecutiveModel);
  }

  async findByUsernameWithPassword(username: string) {
    return CollectionExecutiveModel.findOne({ username: username.toLowerCase(), isDeleted: false })
      .select('+passwordHash')
      .exec();
  }

  async findByIdWithinHierarchy(id: string, eventOrganizerId: string, eventId: string) {
    return CollectionExecutiveModel.findOne({
      _id: id,
      eventOrganizerId,
      eventId,
      isDeleted: false,
    }).exec();
  }

  async countByOrganizer(eventOrganizerId: string) {
    return CollectionExecutiveModel.countDocuments({ eventOrganizerId, isDeleted: false }).exec();
  }

  async getBySeasonAndOrganizerId(EventOrganizerId: string, SeasonId: string){
    return CollectionExecutiveModel.findMany({
      eventOrganizerId,
      SeasonId,
      isDeleted: false,
    }).exec();
  }
}

export const collectionExecutiveRepository = new CollectionExecutiveRepository();
