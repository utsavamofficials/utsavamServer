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
}

export const collectionExecutiveRepository = new CollectionExecutiveRepository();
