import { useNavigate } from "react-router-dom";
import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import mascot from "../../assets/mascot.png";
import bellIcon from "../../assets/bell.svg";
import bellBlueIcon from "../../assets/bell-blue.svg";
import mascotHand from "../../assets/mascot-hand.png";
import mascotGlass from "../../assets/mascot-glass.png";
import star from "../../assets/star.svg";
import NewsCard from "../../components/common/NewsCard";
import type { Article } from "../../types";
import type { KeywordNewsItem } from "../../types/api";
import {
  issueService,
  notificationService,
  keywordService,
} from "../../services";

// ── 키워드 뉴스 섹션 ────────────────────────────────────────────────────────
const KeywordSection = ({
  onArticleClick,
}: {
  onArticleClick: (url: string) => void;
}) => {
  const navigate = useNavigate();
  const [keywords, setKeywords] = useState<string[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [news, setNews] = useState<KeywordNewsItem[]>([]);
  const [loadingKeywords, setLoadingKeywords] = useState(true);
  const [loadingNews, setLoadingNews] = useState(false);

  useEffect(() => {
    keywordService
      .getSubscriptions()
      .then((subs) => {
        const list = (subs as unknown as { keyword: string }[]).map((s) =>
          typeof s === "string" ? s : s.keyword,
        );
        setKeywords(list);
        if (list.length > 0) setSelected(list[0]);
      })
      .catch(() => {})
      .finally(() => setLoadingKeywords(false));
  }, []);

  useEffect(() => {
    if (!selected) return;
    let cancelled = false;
    Promise.resolve()
      .then(() => { if (!cancelled) setLoadingNews(true); })
      .then(() => keywordService.getKeywordNews(selected, 0, 3))
      .then((data) => { if (!cancelled) { setNews(data); setLoadingNews(false); } })
      .catch(() => { if (!cancelled) { setNews([]); setLoadingNews(false); } });
    return () => { cancelled = true; };
  }, [selected]);

  if (loadingKeywords)
    return (
      <div className="flex flex-col gap-2 px-5 pb-3">
        {/* 칩 스켈레톤 */}
        <div className="flex gap-2 overflow-hidden">
          {[56, 72, 48, 64].map((w) => (
            <div
              key={w}
              className="h-8 rounded-full bg-gray-200 animate-pulse flex-shrink-0"
              style={{ width: w }}
            />
          ))}
        </div>
        {/* 뉴스 스켈레톤 */}
        <div className="bg-white rounded-2xl border border-[#F0F0F0] overflow-hidden">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={`flex items-center gap-3 px-4 py-3 ${i < 2 ? "border-b border-[#F0F0F0]" : ""}`}
            >
              <div className="w-10 h-10 rounded-lg bg-gray-200 animate-pulse flex-shrink-0" />
              <div className="flex flex-col gap-1.5 flex-1">
                <div className="h-3 bg-gray-200 animate-pulse rounded-full w-4/5" />
                <div className="h-2.5 bg-gray-200 animate-pulse rounded-full w-16" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );

  if (keywords.length === 0)
    return (
      <div className="px-5 pb-3">
        <button
          onClick={() => navigate("/profile/keywords")}
          className="w-full bg-white border border-[#c8dff8] rounded-2xl px-4 py-4 flex items-center gap-3 active:bg-[#F7F9FF] transition-colors"
        >
          <div className="w-9 h-9 rounded-full bg-[#EEF8FF] flex items-center justify-center flex-shrink-0">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path
                d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"
                stroke="#51A2FF"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M13.73 21a2 2 0 0 1-3.46 0"
                stroke="#51A2FF"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div className="flex flex-col items-start gap-0.5">
            <p className="text-[14px] font-semibold text-[#1A1A1A]">
              키워드 뉴스 받아보기
            </p>
            <p className="text-[12px] text-[#A8A8A8]">
              관심 키워드를 구독하면 관련 뉴스를 바로 확인할 수 있어요
            </p>
          </div>
          <svg
            width="16"
            height="16"
            viewBox="0 0 20 20"
            fill="none"
            className="flex-shrink-0 ml-auto"
          >
            <path
              d="M7.5 5l5 5-5 5"
              stroke="#D1D5DC"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    );

  return (
    <div className="flex flex-col gap-2 px-5 pb-3">
      {/* 키워드 탭 */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar">
        {keywords.map((kw) => (
          <button
            key={kw}
            onClick={() => setSelected(kw)}
            className={`flex-shrink-0 px-3 py-1.5 rounded-full text-[13px] font-semibold transition-colors ${
              selected === kw
                ? "bg-[#51A2FF] text-white"
                : "bg-white text-[#51A2FF] border border-[#c8dff8]"
            }`}
          >
            {kw}
          </button>
        ))}
        {keywords.length < 3 && (
          <button
            onClick={() => navigate("/profile/keywords")}
            className="flex-shrink-0 px-3 py-1.5 rounded-full text-[13px] font-semibold text-[#A8A8A8] border border-[#E5E5E5] bg-white"
          >
            + 키워드 추가
          </button>
        )}
      </div>

      {/* 뉴스 목록 */}
      <div className="bg-white rounded-2xl overflow-hidden border border-[#F0F0F0]">
        {loadingNews ? (
          [0, 1, 2].map((i) => (
            <div
              key={i}
              className={`flex items-center gap-3 px-4 py-3 ${i < 2 ? "border-b border-[#F0F0F0]" : ""}`}
            >
              <div className="flex flex-col gap-1.5 flex-1">
                <div className="h-3 bg-gray-200 animate-pulse rounded-full w-4/5" />
                <div className="h-2.5 bg-gray-200 animate-pulse rounded-full w-16" />
              </div>
            </div>
          ))
        ) : news.length === 0 ? (
          <p className="text-[13px] text-[#A8A8A8] text-center py-4">
            관련 뉴스가 없습니다
          </p>
        ) : (
          news.map((item, i) => (
            <button
              key={item.id}
              onClick={() => onArticleClick(item.url)}
              className={`w-full flex items-center gap-3 px-4 py-3 active:bg-[#F7F9FF] transition-colors text-left ${
                i < news.length - 1 ? "border-b border-[#F0F0F0]" : ""
              }`}
            >
              <div className="flex flex-col gap-0.5 min-w-0">
                <p className="text-[13px] font-medium text-[#1A1A1A] line-clamp-1">
                  {item.title}
                </p>
                <p className="text-[11px] text-[#A8A8A8]">{item.timeAgo}</p>
              </div>
              <svg
                width="16"
                height="16"
                viewBox="0 0 20 20"
                fill="none"
                className="flex-shrink-0 ml-auto"
              >
                <path
                  d="M7.5 5l5 5-5 5"
                  stroke="#D1D5DC"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          ))
        )}
      </div>
    </div>
  );
};

const CARD_OVERLAP = 24;
const CLONES = 5;

const toArticleIndex = (n: number, i: number) => (((i - CLONES) % n) + n) % n;

const NewsCardSkeleton = ({ active = false }: { active?: boolean }) => (
  <div
    className={`bg-[#FBFBFB] rounded-2xl overflow-hidden flex-shrink-0 w-[clamp(248px,_63vw,_360px)] flex flex-col border-[1.2px] border-[#E5E5E5] transition-all duration-300 ${
      active ? "h-[clamp(320px,_81vw,_464px)]" : "h-[clamp(256px,_65vw,_371px)]"
    }`}
  >
    <div className="bg-gray-200 animate-pulse flex-shrink-0 h-[clamp(128px,_32.5vw,_186px)]" />
    <div className="flex flex-col flex-1 p-4 gap-3 overflow-hidden">
      <div className="h-3 bg-gray-200 animate-pulse rounded-full w-14" />
      <div className="flex flex-col gap-2">
        <div className="h-[15px] bg-gray-200 animate-pulse rounded-full w-full" />
        <div className="h-[15px] bg-gray-200 animate-pulse rounded-full w-3/4" />
      </div>
      <div className="flex gap-2 mt-1">
        <div className="h-6 bg-gray-200 animate-pulse rounded-[5px] w-14" />
        <div className="h-6 bg-gray-200 animate-pulse rounded-[5px] w-12" />
      </div>
    </div>
  </div>
);

const HomePage = () => {
  const navigate = useNavigate();
  const [notificationCount, setNotificationCount] = useState(0);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const main = document.querySelector("main");
    if (main) main.scrollTop = 0;
  }, []);

  useEffect(() => {
    const fetchCount = () => {
      notificationService
        .getUnreadCount()
        .then(setNotificationCount)
        .catch(() => {});
    };
    fetchCount();
    const onVisible = () => {
      if (!document.hidden) fetchCount();
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => document.removeEventListener("visibilitychange", onVisible);
  }, []);

  useEffect(() => {
    issueService
      .getCards("HOURLY")
      .then(setArticles)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const [activeIndex, setActiveIndex] = useState(CLONES);
  const scrollRef = useRef<HTMLDivElement>(null);
  const articlesRef = useRef(articles);
  const strideRef = useRef(248 - CARD_OVERLAP);
  const activeIdxRef = useRef(CLONES);

  useEffect(() => {
    articlesRef.current = articles;
  }, [articles]);

  const clonedArticles = useMemo(
    () => [
      ...articles.slice(-CLONES),
      ...articles,
      ...articles.slice(0, CLONES),
    ],
    [articles],
  );

  const scrollInit = useCallback(() => {
    const el = scrollRef.current;
    if (!el || articles.length === 0) return;
    const first = el.firstElementChild as HTMLElement | null;
    if (first?.offsetWidth)
      strideRef.current = first.offsetWidth - CARD_OVERLAP;
    el.scrollLeft = CLONES * strideRef.current;
    activeIdxRef.current = CLONES;
    setActiveIndex(CLONES);
  }, [articles.length]);

  useEffect(() => {
    scrollInit();
  }, [scrollInit]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el || articles.length === 0) return;

    let timer: ReturnType<typeof setTimeout>;
    let jumping = false;

    const snapTo = (idx: number) => {
      const s = strideRef.current;
      jumping = true;
      el.scrollLeft = idx * s;
      setActiveIndex(idx);
      activeIdxRef.current = idx;
      requestAnimationFrame(() =>
        requestAnimationFrame(() => {
          jumping = false;
        }),
      );
    };

    const settle = () => {
      if (jumping) return;
      const s = strideRef.current;
      const n = articlesRef.current.length;
      const cur = Math.round(el.scrollLeft / s);

      if (cur < CLONES) {
        snapTo(cur + n);
      } else if (cur >= CLONES + n) {
        snapTo(cur - n);
      } else {
        snapTo(cur);
      }
    };

    const onScroll = () => {
      if (jumping) return;
      const s = strideRef.current;
      const n = articlesRef.current.length;
      const index = Math.round(el.scrollLeft / s);
      setActiveIndex(index);
      activeIdxRef.current = index;
      clearTimeout(timer);
      // 클론 영역 진입 시 빠르게 wrap
      if (index < CLONES || index >= CLONES + n) {
        timer = setTimeout(settle, 50);
      } else {
        timer = setTimeout(settle, 300);
      }
    };

    const ro = new ResizeObserver(() => {
      const first = el.firstElementChild as HTMLElement | null;
      if (first?.offsetWidth)
        strideRef.current = first.offsetWidth - CARD_OVERLAP;
      el.scrollLeft = activeIdxRef.current * strideRef.current;
    });
    ro.observe(document.documentElement);

    el.addEventListener("scroll", onScroll, { passive: true });
    el.addEventListener("scrollend", settle);

    return () => {
      el.removeEventListener("scroll", onScroll);
      el.removeEventListener("scrollend", settle);
      clearTimeout(timer);
      ro.disconnect();
    };
  }, [articles.length]);

  return (
    <div className="relative min-h-full bg-[linear-gradient(to_top,_#E1F3FF_40%,_white_15%)]">
      {/* 알림 버튼 */}
      <div className="absolute top-4 right-5 z-10">
        <button
          onClick={() => navigate("/notification")}
          className="relative p-2 cursor-pointer"
        >
          <img
            src={notificationCount > 0 ? bellBlueIcon : bellIcon}
            alt="알림"
            className="w-9 h-9"
          />
          {notificationCount > 0 && (
            <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
              {notificationCount}
            </span>
          )}
        </button>
      </div>

      {/* 히어로 */}
      <div className="relative flex flex-col items-center px-5 pt-20 pb-3">
        {/* 별 장식 */}
        <img
          src={star}
          alt=""
          className="absolute top-[17rem] left-[80%] w-8 animate-star"
        />
        <img
          src={star}
          alt=""
          className="absolute top-[2rem] left-[30%] w-6 animate-star-delay-1"
        />
        <img
          src={star}
          alt=""
          className="absolute top-[15rem] left-[12%] w-8 animate-star-delay-2"
        />
        <img
          src={star}
          alt=""
          className="absolute top-[8rem] left-[7%] w-4 animate-star-delay-3"
        />
        <img
          src={star}
          alt=""
          className="absolute top-[8.5rem] right-[8%] w-5 animate-star-delay-4"
        />

        <div className="relative w-28">
          <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-52 h-28 bg-[#C8E4FF] rounded-full blur-xl opacity-60" />
          <img
            src={mascot}
            alt="아이슈 마스코트"
            className="relative w-full h-auto object-contain"
          />
          <img
            src={mascotGlass}
            alt=""
            className="absolute top-[8%] left-[16%] w-[70%] h-auto animate-glasses"
          />
          <img
            src={mascotHand}
            alt=""
            className="absolute top-[35%] left-[75%] w-[48%] h-auto animate-hand"
          />
        </div>
        <h2 className="text-xl font-bold text-[#51A2FF] tracking-normal mt-2">
          FOR YOU
        </h2>
        <p className="text-sm text-gray-400 mt-1 mb-4">
          지금 뜨는 이슈, 얼마나 믿을 수 있을까요?
        </p>
      </div>

      {/* 뉴스 카드 캐러셀 */}
      {loading || articles.length === 0 ? (
        <div className="w-full flex px-[calc(50%-clamp(124px,_31.5vw,_180px))] pb-4 items-center">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={`flex-shrink-0 ${i > 0 ? "-ml-6" : ""}`}
              style={{ zIndex: i === 1 ? 10 : 1 }}
            >
              <NewsCardSkeleton active={i === 1} />
            </div>
          ))}
        </div>
      ) : (
        <div
          ref={scrollRef}
          className="w-full overflow-x-scroll flex px-[calc(50%-clamp(124px,_31.5vw,_180px))] pb-4 no-scrollbar items-center"
        >
          {clonedArticles.map((article, index) => {
            const dist = Math.min(Math.abs(index - CLONES), 5);
            return (
              <div
                key={`${article.id}-${index}`}
                className={`flex-shrink-0 ${index > 0 ? "-ml-6" : ""}`}
                style={{
                  zIndex: activeIndex === index ? 10 : 1,
                  animation: `card-enter 520ms cubic-bezier(0.34, 1.56, 0.64, 1) ${120 + dist * 75}ms both`,
                }}
              >
                <NewsCard
                  article={article}
                  active={
                    toArticleIndex(articles.length, index) ===
                    toArticleIndex(articles.length, activeIndex)
                  }
                  onClick={() =>
                    navigate("/analysis", {
                      state: {
                        contentId: article.id,
                        title: article.title,
                        autoStart: true,
                      },
                    })
                  }
                />
              </div>
            );
          })}
        </div>
      )}

      {/* 키워드 뉴스 섹션 */}
      <div className="mt-2 pb-6">
        <KeywordSection
          onArticleClick={(url) =>
            navigate("/analysis", { state: { url, autoStart: true } })
          }
        />
      </div>
    </div>
  );
};

export default HomePage;
