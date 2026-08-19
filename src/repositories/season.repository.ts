import { BaseRepository } from './base.repository';
import { ISeason, SeasonModel } from '../models/season.model';

class SeasonRepository extends BaseRepository<ISeason> {
  constructor() {
    super(SeasonModel);
  }

  async findBySeasonCode(seasonCode: string) {
    return SeasonModel.findOne({ seasonCode: seasonCode.toUpperCase(), isDeleted: false }).exec();
  }
}

export const seasonRepository = new SeasonRepository();
