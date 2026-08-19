import { BaseRepository } from './base.repository';
import { IDonor, DonorModel } from '../models/donor.model';

class DonorRepository extends BaseRepository<IDonor> {
  constructor() {
    super(DonorModel);
  }

  async findByContactAndEvent(contactNumber: string, eventId: string) {
    return DonorModel.findOne({ contactNumber, eventId, isDeleted: false }).exec();
  }
}

export const donorRepository = new DonorRepository();
