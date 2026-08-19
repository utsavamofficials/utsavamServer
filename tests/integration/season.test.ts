import request from 'supertest';
import { app } from '../../src/app';
import { UserModel } from '../../src/models/user.model';
import { hashPassword } from '../../src/utils/password';
import { Role } from '../../src/constants/roles';

async function getAdminToken() {
  const passwordHash = await hashPassword('AdminPass123');
  await UserModel.create({
    fullName: 'Test Admin',
    username: 'testadmin',
    email: 'admin@test.com',
    contactNumber: '9999999999',
    passwordHash,
    role: Role.SUPER_ADMIN,
  });
  const res = await request(app)
    .post('/api/v1/auth/login')
    .send({ username: 'testadmin', password: 'AdminPass123' });
  return res.body.data.accessToken as string;
}

describe('Season CRUD', () => {
  it('creates, lists, updates, and soft-deletes a season', async () => {
    const token = await getAdminToken();
    const auth = { Authorization: `Bearer ${token}` };

    const createRes = await request(app)
      .post('/api/v1/seasons')
      .set(auth)
      .send({
        seasonName: 'Utsav 2026',
        seasonCode: 'UTS-2026',
        startDate: '2026-08-01',
        endDate: '2026-09-01',
      });
    expect(createRes.status).toBe(201);
    const seasonId = createRes.body.data._id;

    const listRes = await request(app).get('/api/v1/seasons').set(auth);
    expect(listRes.status).toBe(200);
    expect(listRes.body.data.length).toBe(1);
    expect(listRes.body.meta.totalRecords).toBe(1);

    const updateRes = await request(app)
      .patch(`/api/v1/seasons/${seasonId}`)
      .set(auth)
      .send({ seasonDescription: 'Updated description' });
    expect(updateRes.status).toBe(200);
    expect(updateRes.body.data.seasonDescription).toBe('Updated description');

    const deleteRes = await request(app).delete(`/api/v1/seasons/${seasonId}`).set(auth);
    expect(deleteRes.status).toBe(200);

    const afterDeleteList = await request(app).get('/api/v1/seasons').set(auth);
    expect(afterDeleteList.body.data.length).toBe(0);
  });

  it('rejects a duplicate seasonCode', async () => {
    const token = await getAdminToken();
    const auth = { Authorization: `Bearer ${token}` };
    const payload = {
      seasonName: 'Utsav 2026',
      seasonCode: 'UTS-2026',
      startDate: '2026-08-01',
      endDate: '2026-09-01',
    };
    await request(app).post('/api/v1/seasons').set(auth).send(payload);
    const dupRes = await request(app).post('/api/v1/seasons').set(auth).send(payload);
    expect(dupRes.status).toBe(409);
  });

  it('rejects an invalid date range', async () => {
    const token = await getAdminToken();
    const auth = { Authorization: `Bearer ${token}` };
    const res = await request(app)
      .post('/api/v1/seasons')
      .set(auth)
      .send({
        seasonName: 'Bad Season',
        seasonCode: 'BAD-2026',
        startDate: '2026-09-01',
        endDate: '2026-08-01',
      });
    expect(res.status).toBe(400);
  });
});
