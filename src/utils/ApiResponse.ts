import { Response } from 'express';
import { HttpStatus } from '../constants/httpStatus';

export interface PaginationMeta {
  page: number;
  limit: number;
  totalRecords: number;
  totalPages: number;
}

export class ApiResponse {
  static success<T>(
    res: Response,
    data: T,
    message = 'Operation successful',
    statusCode: number = HttpStatus.OK,
  ): Response {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
    });
  }

  static created<T>(res: Response, data: T, message = 'Resource created successfully'): Response {
    return ApiResponse.success(res, data, message, HttpStatus.CREATED);
  }

  static paginated<T>(
    res: Response,
    data: T[],
    meta: PaginationMeta,
    message = 'Records fetched successfully',
  ): Response {
    return res.status(HttpStatus.OK).json({
      success: true,
      message,
      data,
      meta,
    });
  }

  static noContent(res: Response): Response {
    return res.status(HttpStatus.NO_CONTENT).send();
  }
}
