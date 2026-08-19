import { BaseRepository } from './base.repository';
import { IUser, UserModel } from '../models/user.model';

class UserRepository extends BaseRepository<IUser> {
  constructor() {
    super(UserModel);
  }

  async findByUsernameWithPassword(username: string): Promise<IUser | null> {
    return UserModel.findOne({ username: username.toLowerCase(), isDeleted: false })
      .select('+passwordHash')
      .exec();
  }

  async findByUsernameOrEmailOrPhone(value: string) {
    return UserModel.findOne({
      isDeleted: false,
      $or: [{ username: value.toLowerCase() }, { email: value.toLowerCase() }, { contactNumber: value }],
    }).exec();
  }
}

export const userRepository = new UserRepository();
