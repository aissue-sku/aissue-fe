// CONTENT-COLLECTION-SERVICE (Gateway → :8083)
import { http } from './client';
import type {
  ArticleListParams,
  ArticleListResponse,
  ArticleSearchParams,
  ArticleSearchResponse,
} from '../types/api';
import type { Article } from '../types';

export const articleService = {
  getList: (params: ArticleListParams = {}): Promise<ArticleListResponse> => {
    const query = new URLSearchParams({
      page: String(params.page ?? 0),
      size: String(params.size ?? 10),
      ...(params.category ? { category: params.category } : {}),
    });
    return http.get(`/content/articles?${query}`);
  },

  getById: (id: string): Promise<Article> =>
    http.get(`/content/articles/${id}`),

  search: (params: ArticleSearchParams): Promise<ArticleSearchResponse> => {
    const query = new URLSearchParams({
      q: params.q,
      page: String(params.page ?? 0),
      size: String(params.size ?? 10),
    });
    return http.get(`/content/articles/search?${query}`);
  },
};
