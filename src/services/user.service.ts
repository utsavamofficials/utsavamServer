import { userRepository } from '../repositories/user.repository';
import { ApiError } from '../utils/ApiError';
import { hashPassword } from '../utils/password';
import { excludeSoftDeleted, ParsedPagination } from '../utils/queryBuilder';
import { IUser } from '../models/user.model';
import { Role, Gender } from '../constants/roles';

export interface CreateUserInput {
  fullName: string;
  username: string;
  email: string;
  contactNumber: string;
  password: string;
  age?: number;
  gender?: Gender;
  role: Role;
}

export interface UpdateUserInput {
  fullName?: string;
  email?: string;
  contactNumber?: string;
  age?: number;
  gender?: Gender;
}

export const userService = {
  async create(input: CreateUserInput): Promise<IUser> {
    const existing = await userRepository.findByUsernameOrEmailOrPhone(input.username);
    if (existing) throw ApiError.conflict('Username, email or contact number already in use');

    const passwordHash = await hashPassword(input.password);
    return userRepository.create({
      fullName: input.fullName,
      username: input.username.toLowerCase(),
      email: input.email.toLowerCase(),
      contactNumber: input.contactNumber,
      passwordHash,
      age: input.age,
      gender: input.gender,
      role: input.role,
    });
  },

  async list(pagination: ParsedPagination, filters: { role?: Role; search?: string }) {
    const filter: Record<string, unknown> = { ...excludeSoftDeleted<IUser>() };
    if (filters.role) filter.role = filters.role;
    if (filters.search) {
      filter.$or = [
        { fullName: { $regex: filters.search, $options: 'i' } },
        { username: { $regex: filters.search, $options: 'i' } },
        { email: { $regex: filters.search, $options: 'i' } },
      ];
    }
    return userRepository.findMany(filter, pagination);
  },

  async getById(id: string): Promise<IUser> {
    const user = await userRepository.findById(id);
    if (!user) throw ApiError.notFound('User not found');
    return user;
  },

  async update(id: string, input: UpdateUserInput): Promise<IUser> {
    const user = await userRepository.updateById(id, input);
    if (!user) throw ApiError.notFound('User not found');
    return user;
  },

  async setActive(id: string, isActive: boolean): Promise<IUser> {
    const user = await userRepository.setActive(id, isActive);
    if (!user) throw ApiError.notFound('User not found');
    return user;
  },

  async softDelete(id: string): Promise<void> {
    const user = await userRepository.softDeleteById(id);
    if (!user) throw ApiError.notFound('User not found');
  },
};
