import { FilterQuery, SortOrder } from 'mongoose';

export interface PaginationQuery {
  page?: string | number;
  limit?: string | number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface ParsedPagination {
  page: number;
  limit: number;
  skip: number;
  sort: Record<string, SortOrder>;
}

const MAX_LIMIT = 100;
const DEFAULT_LIMIT = 20;

export function parsePagination(query: PaginationQuery, defaultSortField = 'createdAt'): ParsedPagination {
  const page = Math.max(1, Number(query.page) || 1);
  const requestedLimit = Number(query.limit) || DEFAULT_LIMIT;
  const limit = Math.min(Math.max(1, requestedLimit), MAX_LIMIT);
  const skip = (page - 1) * limit;

  const sortField = query.sortBy || defaultSortField;
  const sortDirection: SortOrder = query.sortOrder === 'asc' ? 1 : -1;

  return {
    page,
    limit,
    skip,
    sort: { [sortField]: sortDirection },
  };
}

export function buildPaginationMeta(page: number, limit: number, totalRecords: number) {
  return {
    page,
    limit,
    totalRecords,
    totalPages: Math.max(1, Math.ceil(totalRecords / limit)),
  };
}

/**
 * Base filter applied to every non-deleted-record query. Repositories should
 * spread this into their FilterQuery so soft-deleted documents never surface
 * through default list/get operations.
 */
export function excludeSoftDeleted<T>(): FilterQuery<T> {
  return { isDeleted: false } as FilterQuery<T>;
}
