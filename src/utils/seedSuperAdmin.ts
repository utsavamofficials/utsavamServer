import { UserModel } from '../models/user.model';
import { Role } from '../constants/roles';
import { hashPassword } from './password';
import { env } from '../config/env';
import { logger } from './logger';

export async function seedSuperAdmin(): Promise<void> {
  const exists = await UserModel.findOne({ role: Role.SUPER_ADMIN });
  if (exists) return;

  const { fullName, username, email, contactNumber, password } = env.superadmin;
  if (!username || !email || !contactNumber || !password) {
    logger.warn('Superadmin env vars missing, skipping auto-create.');
    return;
  }

  const passwordHash = await hashPassword(password);
  await UserModel.create({
    fullName,
    username,
    email,
    contactNumber,
    passwordHash,
    role: Role.SUPER_ADMIN,
    isActive: true,
  });

  logger.info(`Superadmin user created: ${username}`);
}