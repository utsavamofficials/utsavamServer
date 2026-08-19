import request from 'supertest';
import { app } from '../../src/app';
import { UserModel } from '../../src/models/user.model';
import { SeasonModel } from '../../src/models/season.model';
import { EventModel } from '../../src/models/event.model';
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

describe('Business hierarchy enforcement', () => {
  it('rejects creating an event organizer for an event that does not belong to the given season', async () => {
    const token = await getAdminToken();
    const auth = { Authorization: `Bearer ${token}` };

    const seasonA = await SeasonModel.create({
      seasonName: 'Season A',
      seasonCode: 'SA-2026',
      startDate: new Date('2026-01-01'),
      endDate: new Date('2026-02-01'),
    });
    const seasonB = await SeasonModel.create({
      seasonName: 'Season B',
      seasonCode: 'SB-2026',
      startDate: new Date('2026-03-01'),
      endDate: new Date('2026-04-01'),
    });
    // Event genuinely belongs to Season A.
    const event = await EventModel.create({
      seasonId: seasonA._id,
      eventName: 'Ganesh Utsav',
      startDate: new Date('2026-01-05'),
      endDate: new Date('2026-01-15'),
    });

    // Attempt to create an organizer claiming this event belongs to Season B instead.
    const res = await request(app)
      .post('/api/v1/event-organizers')
      .set(auth)
      .send({
        seasonId: seasonB._id.toString(),
        eventId: event._id.toString(),
        fullName: 'Fake Organizer',
        username: 'fakeorg',
        password: 'Password123',
        contactNumber: '8888888888',
      });

    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/does not belong/i);
  });

  it('rejects an event referencing a non-existent season', async () => {
    const token = await getAdminToken();
    const auth = { Authorization: `Bearer ${token}` };
    const fakeSeasonId = '507f1f77bcf86cd799439011';

    const res = await request(app)
      .post('/api/v1/events')
      .set(auth)
      .send({
        seasonId: fakeSeasonId,
        eventName: 'Ghost Event',
        startDate: '2026-01-01',
        endDate: '2026-01-10',
      });

    expect(res.status).toBe(400);
  });
});
