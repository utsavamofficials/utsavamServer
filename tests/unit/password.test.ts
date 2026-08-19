import { comparePassword, hashPassword } from '../../src/utils/password';

describe('password utils', () => {
  it('hashes a password and verifies it correctly', async () => {
    const hash = await hashPassword('MySecret123');
    expect(hash).not.toEqual('MySecret123');
    await expect(comparePassword('MySecret123', hash)).resolves.toBe(true);
  });

  it('rejects an incorrect password', async () => {
    const hash = await hashPassword('MySecret123');
    await expect(comparePassword('WrongPassword', hash)).resolves.toBe(false);
  });
});
