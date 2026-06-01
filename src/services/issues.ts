// AI-SERVICE (Gateway → /api/issues/**)
import { http } from './client';
import type { ApiResponse } from '../types/api';
import type { Article } from '../types';

export type PeriodType = 'HOURLY' | 'DAILY';

export const issueService = {
  getCards: (periodType: PeriodType = 'HOURLY'): Promise<Article[]> =>
    http
      .get<ApiResponse<Article[]>>(`/api/issues/cards?periodType=${periodType}`)
      .then((res) => res.data),
};
