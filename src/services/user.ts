// USER-SERVICE (Gateway → :8082)
import { http } from './client';
import type { ApiResponse, UserProfile, CharacterDataResponse } from '../types/api';

export const userService = {
  getProfile: (): Promise<UserProfile> =>
    http.get<ApiResponse<UserProfile>>('/api/users').then((res) => res.data),

  getCharacter: (): Promise<CharacterDataResponse> =>
    http.get<ApiResponse<CharacterDataResponse>>('/api/users/character').then((res) => res.data),

  purchaseItem: (item: string): Promise<void> =>
    http.post('/api/users/character/purchase', { item }),

  equipItem: (item: string): Promise<void> =>
    http.put('/api/users/character/equip', { item }),

  unequipItem: (itemType: 'HAT' | 'CLOTHES'): Promise<void> =>
    http.delete(`/api/users/character/${itemType}`),

  deleteAccount: (): Promise<void> =>
    http.delete('/api/users'),
};
