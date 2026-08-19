import { ApiError } from '../../src/utils/ApiError';
import { HttpStatus } from '../../src/constants/httpStatus';

describe('ApiError', () => {
  it('builds a notFound error with the correct status code', () => {
    const err = ApiError.notFound('Season not found');
    expect(err.statusCode).toBe(HttpStatus.NOT_FOUND);
    expect(err.message).toBe('Season not found');
    expect(err.isOperational).toBe(true);
  });

  it('builds an unauthorized error', () => {
    const err = ApiError.unauthorized();
    expect(err.statusCode).toBe(HttpStatus.UNAUTHORIZED);
  });

  it('marks internal errors as non-operational', () => {
    const err = ApiError.internal();
    expect(err.isOperational).toBe(false);
    expect(err.statusCode).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
  });
});
