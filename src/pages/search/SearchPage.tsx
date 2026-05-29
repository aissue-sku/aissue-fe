import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, TrendingUp } from "lucide-react";
import fireIcon from "../../assets/fire.svg";
import bellIcon from "../../assets/bell.svg";
import bellBlueIcon from "../../assets/bell-blue.svg";
import { useKeywords } from "../../hooks/useKeywords";
import UpgradeModal from "../../components/common/UpgradeModal";
import { keywordService } from "../../services";
import type { PopularKeyword } from "../../types/api";

const SearchPage = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const { keywords, toggleSubscribe } = useKeywords();
  const [popularKeywords, setPopularKeywords] = useState<PopularKeyword[]>([]);
  const [popularLoading, setPopularLoading] = useState(true);

  useEffect(() => {
    keywordService
      .getPopularKeywords()
      .then(setPopularKeywords)
      .catch(() => {})
      .finally(() => setPopularLoading(false));
  }, []);

  const goToResult = (keyword: string) => {
    if (!keyword.trim()) return;
    navigate(`/search/result?q=${encodeURIComponent(keyword.trim())}`);
  };

  const rankStyle = (rank: number) =>
    rank <= 3 ? "bg-[#FFF0EE] text-[#FF6B6B]" : "bg-[#EEF4FF] text-[#7BA7FF]";

  return (
    <div className="min-h-full bg-transparent px-5 pt-6 pb-6 animate-page-enter">
      {/* 검색창 */}
      <div className="flex items-center gap-3 bg-[#F2F3F5] rounded-[8px] px-5 h-[52px] mb-5">
        <Search size={18} className="text-[#8E99A7] flex-shrink-0" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && goToResult(query)}
          placeholder="요즘 트렌드 뉴스를 검색해보세요!"
          className="flex-1 text-[16px] text-[#697584] placeholder-[#8E99A7] outline-none bg-transparent"
        />
        {query.trim() && (
          <button onClick={() => goToResult(query)} className="flex-shrink-0">
            <Search size={18} className="text-[#5b9cf6]" />
          </button>
        )}
      </div>

      {/* 인기 검색어 */}
      <div className="flex items-center gap-2 mb-8 flex-wrap">
        <span className="text-sm text-gray-400 flex-shrink-0">인기 검색어:</span>
        {popularLoading ? (
          [40, 56, 48].map((w) => (
            <div key={w} className="h-7 rounded-full bg-gray-200 animate-pulse" style={{ width: w }} />
          ))
        ) : (
          popularKeywords.map((item) => (
            <button
              key={item.keyword}
              onClick={() => goToResult(item.keyword)}
              className="px-4 py-1 rounded-full text-sm font-semibold bg-[#F2F3F5] text-[#697584] active:bg-[#5b9cf6] active:text-white transition-colors cursor-pointer"
            >
              {item.keyword}
            </button>
          ))
        )}
      </div>

      {/* 급상승 키워드 */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-[24px] font-semibold text-[#3B91F4] leading-[22px] tracking-[0px]">
          급상승 키워드 Top 10
        </h2>
        <span className="text-xs text-[#737E8C]">(최근 1시간)</span>
      </div>

      <div className="flex flex-col">
        {keywords.map((item, idx) => (
          <div
            key={item.rank}
            onClick={() => goToResult(item.keyword)}
            className={`flex items-center gap-3 h-[80px] cursor-pointer ${
              idx < keywords.length - 1 ? "border-b border-gray-100" : ""
            }`}
            style={{
              animation: `card-enter 400ms cubic-bezier(0.4, 0, 0.2, 1) ${idx * 60}ms both`,
            }}
          >
            {/* 순위 뱃지 */}
            <span
              className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0 ${rankStyle(item.rank)}`}
            >
              {item.rank}
            </span>

            {/* 키워드 */}
            <span className="flex-1 text-[15px] font-semibold text-gray-800">
              {item.keyword}
              {item.hot && idx < 3 && (
                <img
                  src={fireIcon}
                  alt=""
                  className="inline-block ml-1 w-4 h-4 align-middle"
                />
              )}
            </span>

            {/* 증가 수치 */}
            <div className="flex items-center gap-1 min-w-[56px]">
              <TrendingUp size={14} className="text-[#FF6B6B] flex-shrink-0" />
              <div className="flex flex-col items-end leading-tight">
                <span className="text-xs font-bold text-[#FF6B6B]">
                  +{item.count}건
                </span>
                <span className="text-[10px] text-gray-400">급상승</span>
              </div>
            </div>

            {/* 알림 */}
            <button
              onClick={async (e) => {
                e.stopPropagation();
                const ok = await toggleSubscribe(item.keyword, item.subscribed);
                if (!ok) setShowUpgradeModal(true);
              }}
              className="w-8 h-8 flex items-center justify-center cursor-pointer flex-shrink-0"
            >
              <img
                src={item.subscribed ? bellBlueIcon : bellIcon}
                alt="알림"
                className="w-5 h-5"
              />
            </button>
          </div>
        ))}
      </div>
      {showUpgradeModal && <UpgradeModal onClose={() => setShowUpgradeModal(false)} />}
    </div>
  );
};

export default SearchPage;
