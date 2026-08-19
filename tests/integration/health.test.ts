import request from 'supertest';
import { app } from '../../src/app';

describe('GET /health', () => {
  it('returns a healthy status', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.database).toBe('connected');
  });
});
