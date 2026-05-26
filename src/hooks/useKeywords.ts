import { useState, useEffect } from 'react';
import { keywordService } from '../services';
import type { TrendingKeyword } from '../types/api';

export const useKeywords = () => {
  const [keywords, setKeywords] = useState<TrendingKeyword[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    keywordService
      .getTrending()
      .then((res) => setKeywords(res))
      .catch((e) => setError(e instanceof Error ? e.message : '키워드를 불러오지 못했습니다.'))
      .finally(() => setLoading(false));
  }, []);

  const toggleSubscribe = async (keyword: string, subscribed: boolean) => {
    if (subscribed) {
      await keywordService.unsubscribe(keyword);
    } else {
      await keywordService.subscribe(keyword);
    }
    setKeywords((prev) =>
      prev.map((k) =>
        k.keyword === keyword ? { ...k, subscribed: !subscribed } : k,
      ),
    );
  };

  return { keywords, loading, error, toggleSubscribe };
};
