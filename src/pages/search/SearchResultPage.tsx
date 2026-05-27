import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { keywordService } from "../../services/keywords";
import type { KeywordNewsItem } from "../../types/api";

const PAGE_SIZE = 10;

const SearchResultPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const keyword = searchParams.get("q") || "";

  const [news, setNews] = useState<KeywordNewsItem[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  const cursorRef = useRef<number | undefined>(undefined);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const loadingRef = useRef(false);

  const loadNext = useCallback(async (reset = false) => {
    if (loadingRef.current) return;
    loadingRef.current = true;
    setLoading(true);
    try {
      const cursor = reset ? undefined : cursorRef.current;
      const res = await keywordService.getKeywordNews(keyword, cursor, PAGE_SIZE);
      const content = res?.content ?? [];
      setNews((prev) => (reset ? content : [...prev, ...content]));
      cursorRef.current = res?.lastCursor ?? undefined;
      setHasMore(res?.hasNext ?? false);
    } catch {
      setHasMore(false);
    } finally {
      setLoading(false);
      loadingRef.current = false;
    }
  }, [keyword]);

  useEffect(() => {
    cursorRef.current = undefined;
    setNews([]);
    setHasMore(true);
    loadNext(true);
  }, [keyword, loadNext]);

  useEffect(() => {
    if (!hasMore) return;
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loadingRef.current) loadNext();
      },
      { threshold: 0.1 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasMore, loadNext]);

  const handleBack = () => {
    setIsExiting(true);
    setTimeout(() => navigate(-1), 280);
  };

  const handleNewsClick = (item: KeywordNewsItem) => {
    navigate("/search/article", { state: { article: item, keyword } });
  };

  return (
    <div
      className={`min-h-full bg-white ${isExiting ? "animate-slide-out" : "animate-slide-in"}`}
    >
      {/* 헤더 */}
      <div className="h-14 flex items-center px-5 bg-white relative pt-5">
        <button
          onClick={handleBack}
          className="size-6 flex-shrink-0 flex items-center justify-center z-10"
        >
          <ChevronLeft size={24} className="text-[#1a1a1a]" />
        </button>
        <p className="absolute inset-x-0 text-center text-[18px] font-semibold text-[#1a1a1a] tracking-[-0.45px] pointer-events-none">
          {keyword}
        </p>
      </div>

      {/* 컨텐츠 영역 */}
      <div className="flex flex-col gap-3 px-5 pt-5 pb-6">
        {/* 섹션 헤더 */}
        <div className="flex items-center justify-between mb-2">
          <p className="text-[20px] font-semibold text-[#1a1a1a] leading-[1.6]">
            실시간 주요 뉴스
          </p>
        </div>

        {/* 초기 로딩 */}
        {loading && news.length === 0 && (
          <div className="flex flex-col gap-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="bg-white border border-[#f0f2f5] rounded-2xl px-4 py-4 animate-pulse flex flex-col gap-2">
                <div className="h-3 bg-gray-100 rounded w-1/5" />
                <div className="h-4 bg-gray-100 rounded w-full" />
                <div className="h-4 bg-gray-100 rounded w-4/5" />
              </div>
            ))}
          </div>
        )}

        {/* 뉴스 카드 목록 */}
        {news.map((item, idx) => (
          <div
            key={item.id}
            onClick={() => handleNewsClick(item)}
            className="bg-white border border-[#C8E4FF] rounded-2xl px-4 py-5 cursor-pointer active:bg-gray-50 transition-colors flex items-start gap-3 shadow-[0_2px_8px_rgba(91,156,246,0.1)]"
          >
            <span className="text-[#3B91F4] text-[18px] font-bold flex-shrink-0 leading-none mt-[3px]">
              {String(idx + 1).padStart(2, "0")}
            </span>
            <div className="flex flex-col gap-[6px] flex-1 min-w-0">
              <p className="text-[17px] font-semibold text-[#1a1a1a] leading-[1.6]">
                {item.title}
              </p>
              <p className="text-[12px] text-[#a8a8a8]">{item.timeAgo}</p>
            </div>
            <ChevronRight size={16} className="text-[#c8d6e8] flex-shrink-0 mt-[3px]" />
          </div>
        ))}

        {/* 무한스크롤 센티넬 */}
        {hasMore && <div ref={sentinelRef} className="h-1" />}

        {/* 추가 로딩 인디케이터 */}
        {loading && news.length > 0 && (
          <div className="flex justify-center py-4">
            <div className="w-5 h-5 border-2 border-[#5b9cf6] border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* 결과 없음 */}
        {!loading && news.length === 0 && (
          <p className="text-center text-[15px] text-[#a8a8a8] py-10">
            '{keyword}' 관련 뉴스가 없습니다
          </p>
        )}
      </div>
    </div>
  );
};

export default SearchResultPage;
