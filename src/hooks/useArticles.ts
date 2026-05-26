import { useState, useEffect, useCallback } from 'react';
import { articleService } from '../services';
import type { Article } from '../types';
import type { ArticleListParams } from '../types/api';

export const useArticles = (params: ArticleListParams = {}) => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);

  const fetchArticles = useCallback(async (pageNum: number) => {
    setLoading(true);
    setError(null);
    try {
      const res = await articleService.getList({ ...params, page: pageNum });
      setArticles((prev) =>
        pageNum === 0 ? res.content : [...prev, ...res.content],
      );
      setHasMore(res.hasNext);
    } catch (e) {
      setError(e instanceof Error ? e.message : '기사를 불러오지 못했습니다.');
    } finally {
      setLoading(false);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    fetchArticles(0);
  }, [fetchArticles]);

  const loadMore = () => {
    if (loading || !hasMore) return;
    const next = page + 1;
    setPage(next);
    fetchArticles(next);
  };

  return { articles, loading, error, hasMore, loadMore };
};
