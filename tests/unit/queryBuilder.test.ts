import { buildPaginationMeta, parsePagination } from '../../src/utils/queryBuilder';

describe('queryBuilder', () => {
  it('applies default page/limit when none given', () => {
    const result = parsePagination({});
    expect(result.page).toBe(1);
    expect(result.limit).toBe(20);
    expect(result.skip).toBe(0);
  });

  it('caps limit at 100 to prevent excessively large page sizes', () => {
    const result = parsePagination({ limit: '5000' });
    expect(result.limit).toBe(100);
  });

  it('computes skip correctly for page > 1', () => {
    const result = parsePagination({ page: '3', limit: '10' });
    expect(result.skip).toBe(20);
  });

  it('builds correct pagination meta', () => {
    const meta = buildPaginationMeta(2, 10, 25);
    expect(meta).toEqual({ page: 2, limit: 10, totalRecords: 25, totalPages: 3 });
  });
});
