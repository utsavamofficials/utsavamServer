import request from 'supertest';
import { app } from '../../src/app';
import { UserModel } from '../../src/models/user.model';
import { hashPassword } from '../../src/utils/password';
import { Role } from '../../src/constants/roles';

async function seedSuperAdmin() {
  const passwordHash = await hashPassword('AdminPass123');
  return UserModel.create({
    fullName: 'Test Admin',
    username: 'testadmin',
    email: 'admin@test.com',
    contactNumber: '9999999999',
    passwordHash,
    role: Role.SUPER_ADMIN,
  });
}

describe('POST /api/v1/auth/login', () => {
  it('logs in successfully with correct credentials', async () => {
    await seedSuperAdmin();
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ username: 'testadmin', password: 'AdminPass123' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.accessToken).toBeDefined();
    expect(res.body.data.refreshToken).toBeDefined();
    expect(res.body.data.actor.role).toBe(Role.SUPER_ADMIN);
  });

  it('rejects invalid credentials', async () => {
    await seedSuperAdmin();
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ username: 'testadmin', password: 'WrongPassword' });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('rejects a request missing credentials', async () => {
    const res = await request(app).post('/api/v1/auth/login').send({ username: 'testadmin' });
    expect(res.status).toBe(400);
  });

  it('rejects protected routes without a token', async () => {
    const res = await request(app).get('/api/v1/seasons');
    expect(res.status).toBe(401);
  });
});
