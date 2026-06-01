import { useNavigate, useLocation } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import mascot from "../../assets/mascot.png";
import mascotHand from "../../assets/mascot-hand.png";
import type { KeywordNewsItem } from "../../types/api";

interface LocationState {
  article: KeywordNewsItem;
  keyword: string;
}

const NewsArticlePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { article, keyword } = (location.state as LocationState) ?? {};

  if (!article) {
    navigate(-1);
    return null;
  }

  const handleOpenArticle = () => {
    if (article.url) window.open(article.url, "_blank", "noopener,noreferrer");
  };

  const handleAnalyze = () => {
    navigate("/analysis", { state: { url: article.url, title: article.title } });
  };

  return (
    <div className="h-full overflow-hidden bg-white flex flex-col animate-slide-in">
      {/* 헤더 */}
      <div className="h-14 flex items-center px-5 bg-white relative pt-5 flex-shrink-0">
        <button
          onClick={() => navigate(-1)}
          className="size-6 flex-shrink-0 flex items-center justify-center z-10"
        >
          <ChevronLeft size={24} className="text-[#1a1a1a]" />
        </button>
        <p className="absolute inset-x-0 text-center text-[18px] font-semibold text-[#1a1a1a] tracking-[-0.45px] pointer-events-none">
          {keyword}
        </p>
      </div>

      {/* 본문 */}
      <div className="flex flex-col px-5 pt-5 pb-6 gap-5">
        {/* 기사 카드 */}
        <div className="rounded-[16px] border border-[#e8eaed] px-4 py-4 flex flex-col gap-2">
          <p className="text-[17px] font-semibold text-[#1a1a1a] leading-[1.6]">
            {article.title}
          </p>
          <span className="text-[12px] text-[#a8a8a8]">{article.timeAgo}</span>
        </div>

        {/* 기사 보러가기 */}
        <button
          onClick={handleOpenArticle}
          className="w-full h-[52px] rounded-[12px] border border-[var(--color-primary)] text-[16px] font-semibold text-[var(--color-primary)] bg-[var(--color-primary-bg)] active:bg-[#dff0ff] transition-colors"
        >
          기사 보러가기
        </button>

        {/* 분석 유도 카드 */}
        <div className="rounded-[16px] bg-[var(--color-primary-bg)] px-4 pt-4 pb-4 flex flex-col gap-4">
          <div className="flex items-center gap-5">
            {/* 마스코트: 몸통 + 손 */}
            <div className="relative w-9 flex-shrink-0">
              <img src={mascot} alt="아이슈 마스코트" className="w-full h-auto object-contain" />
              <img
                src={mascotHand}
                alt=""
                className="absolute top-[35%] left-[75%] w-[48%] h-auto"
              />
            </div>
            <div className="flex flex-col gap-[2px]">
              <p className="text-[15px] font-semibold leading-[1.5] text-[#1a1a1a]">
                이 기사,{" "}
                <span className="text-[var(--color-primary)]">그대로 믿어도 괜찮을까요?</span>
              </p>
              <p className="text-[14px] leading-[1.5] text-[#1a1a1a]">
                <span className="text-[var(--color-primary)] font-semibold">AI가 분석한 결과</span>를 확인해보세요
              </p>
            </div>
          </div>

          <button
            onClick={handleAnalyze}
            className="w-full h-[50px] rounded-[12px] bg-[var(--color-primary)] text-white text-[16px] font-semibold active:opacity-90 transition-opacity"
          >
            분석 결과 보기
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewsArticlePage;
