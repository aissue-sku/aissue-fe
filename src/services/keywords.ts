// CONTENT-COLLECTION-SERVICE (Gateway → :8083)
import { http } from './client';
import type { ApiResponse, TrendingKeyword, KeywordNewsItem } from '../types/api';

export const keywordService = {
  getTrending: (): Promise<TrendingKeyword[]> =>
    http
      .get<ApiResponse<TrendingKeyword[]>>('/api/contents/hot-topics')
      .then((res) => res.data),

  getKeywordNews: (keyword: string, page = 0, size = 10): Promise<KeywordNewsItem[]> =>
    http
      .get<ApiResponse<KeywordNewsItem[]>>(
        `/api/contents/keyword-news?keyword=${encodeURIComponent(keyword)}&page=${page}&size=${size}`,
      )
      .then((res) => res.data),

  getSubscriptions: (): Promise<string[]> =>
    http
      .get<ApiResponse<string[]>>('/api/notifications/subscriptions')
      .then((res) => res.data),

  subscribe: (keyword: string): Promise<void> =>
    http
      .post<ApiResponse<{ keyword: string; subscribedAt: string }>>('/api/notifications/subscriptions', { keyword })
      .then(() => undefined),

  unsubscribe: (keyword: string): Promise<void> =>
    http.delete(`/api/notifications/subscriptions/${encodeURIComponent(keyword)}`),
};
