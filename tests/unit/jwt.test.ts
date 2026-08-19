import { signAccessToken, signRefreshToken, verifyAccessToken, verifyRefreshToken } from '../../src/utils/jwt';
import { ActorType, Role } from '../../src/constants/roles';

describe('jwt utils', () => {
  const payload = { id: '507f1f77bcf86cd799439011', actorType: ActorType.USER, role: Role.SUPER_ADMIN };

  it('signs and verifies an access token round-trip', () => {
    const token = signAccessToken(payload);
    const decoded = verifyAccessToken(token);
    expect(decoded.id).toBe(payload.id);
    expect(decoded.actorType).toBe(ActorType.USER);
    expect(decoded.role).toBe(Role.SUPER_ADMIN);
  });

  it('signs and verifies a refresh token round-trip', () => {
    const token = signRefreshToken(payload);
    const decoded = verifyRefreshToken(token);
    expect(decoded.id).toBe(payload.id);
  });

  it('throws on a tampered token', () => {
    const token = signAccessToken(payload);
    expect(() => verifyAccessToken(token + 'tampered')).toThrow();
  });
});
