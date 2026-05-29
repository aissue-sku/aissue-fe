// CONTENT-COLLECTION-SERVICE (Gateway → :8083)
import { http } from './client';
import type { ApiResponse, TrendingKeyword, KeywordNewsPage, PopularKeyword } from '../types/api';

export const keywordService = {
  getTrending: (): Promise<TrendingKeyword[]> =>
    http
      .get<ApiResponse<TrendingKeyword[]>>('/api/contents/hot-topics')
      .then((res) => res.data),

  getKeywordNews: (keyword: string, cursor?: number, size = 10): Promise<KeywordNewsPage> =>
    http
      .get<ApiResponse<KeywordNewsPage>>(
        `/api/contents/keyword-news?keyword=${encodeURIComponent(keyword)}${cursor != null ? `&cursor=${cursor}` : ''}&size=${size}`,
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

  getPopularKeywords: (): Promise<PopularKeyword[]> =>
    http
      .get<ApiResponse<PopularKeyword[]>>('/api/notifications/popular-keywords')
      .then((res) => res.data),
};
