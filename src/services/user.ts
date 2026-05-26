// USER-SERVICE (Gateway → :8082)
import { http } from './client';
import type { ApiResponse, UserProfile } from '../types/api';

export const userService = {
  getProfile: (): Promise<UserProfile> =>
    http.get<ApiResponse<UserProfile>>('/api/users').then((res) => res.data),

  deleteAccount: (): Promise<void> =>
    http.delete('/api/users'),
};
