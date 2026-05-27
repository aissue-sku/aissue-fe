import { useState, useEffect } from 'react';
import { keywordService } from '../services';
import type { TrendingKeyword } from '../types/api';

const FREE_KEYWORD_LIMIT = 3;

export const useKeywords = () => {
  const [keywords, setKeywords] = useState<TrendingKeyword[]>([]);
  const [subscribedCount, setSubscribedCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    Promise.all([keywordService.getTrending(), keywordService.getSubscriptions()])
      .then(([trending, subs]) => {
        const subscribedSet = new Set((subs as unknown as { keyword: string }[]).map((s) => s.keyword));
        setKeywords(trending.map((k) => ({ ...k, subscribed: subscribedSet.has(k.keyword) })));
        setSubscribedCount(subscribedSet.size);
      })
      .catch((e) => setError(e instanceof Error ? e.message : '키워드를 불러오지 못했습니다.'))
      .finally(() => setLoading(false));
  }, []);

  const toggleSubscribe = async (keyword: string, subscribed: boolean): Promise<boolean> => {
    if (!subscribed && subscribedCount >= FREE_KEYWORD_LIMIT) return false;
    if (subscribed) {
      await keywordService.unsubscribe(keyword);
      setSubscribedCount((prev) => prev - 1);
    } else {
      await keywordService.subscribe(keyword);
      setSubscribedCount((prev) => prev + 1);
    }
    setKeywords((prev) =>
      prev.map((k) =>
        k.keyword === keyword ? { ...k, subscribed: !subscribed } : k,
      ),
    );
    return true;
  };

  return { keywords, loading, error, toggleSubscribe };
};
