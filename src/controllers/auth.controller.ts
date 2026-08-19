import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiResponse } from '../utils/ApiResponse';
import { authService } from '../services/auth.service';

export const authController = {
  login: asyncHandler(async (req: Request, res: Response) => {
    const { username, password } = req.body as { username: string; password: string };
    const result = await authService.login(username, password);
    ApiResponse.success(res, result, 'Login successful');
  }),

  refresh: asyncHandler(async (req: Request, res: Response) => {
    const { refreshToken } = req.body as { refreshToken: string };
    const result = await authService.refresh(refreshToken);
    ApiResponse.success(res, result, 'Token refreshed successfully');
  }),
};
