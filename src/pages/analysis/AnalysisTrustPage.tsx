import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import CircularProgress from "../../components/analysis/CircularProgress";
import ScoreBar from "../../components/analysis/ScoreBar";
import DetailSection from "../../components/analysis/DetailSection";
import RelatedArticleCard from "../../components/analysis/RelatedArticleCard";
import { analysisService } from "../../services/analysis";
import { ApiError } from "../../services/client";
import type { ContentAnalysisResponse } from "../../types/api";

const MAX_SCORES: Record<string, number> = {
  credibility: 25,
  accuracy: 25,
  bias: 20,
  crossVerification: 20,
  transparency: 10,
};

interface LocationState {
  contentId?: string;
  title?: string;
  submitResult?: ContentAnalysisResponse;
}

const BackIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path
      d="M15 18l-6-6 6-6"
      stroke="#1A1A1A"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const AnalysisTrustPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { contentId, title, submitResult } = (location.state as LocationState) ?? {};

  const [data, setData] = useState<ContentAnalysisResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    if (submitResult) {
      setData(submitResult);
      return;
    }
    if (!contentId) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    analysisService
      .getContentAnalysis(contentId)
      .then(setData)
      .catch((e) => setError(e instanceof ApiError ? e.message : "신뢰도 데이터를 불러오지 못했습니다."))
      .finally(() => setLoading(false));
  }, [contentId, submitResult]);

  const handleBack = () => {
    setIsExiting(true);
    setTimeout(() => navigate(-1), 280);
  };

  return (
    <div className={`h-full overflow-hidden flex flex-col bg-[#FBFBFB] ${isExiting ? "animate-slide-out" : "animate-slide-in"}`}>
      {/* 헤더 */}
      <header className="bg-white border-b border-[#F5F5F5] h-14 flex items-center justify-center px-5 shrink-0">
        <button
          onClick={handleBack}
          className="absolute left-5 p-1 cursor-pointer active:opacity-60 transition-opacity"
          aria-label="뒤로 가기"
        >
          <BackIcon />
        </button>
        <h1 className="text-[18px] font-semibold text-[#1A1A1A] tracking-[-0.45px]">
          신뢰도 확인
        </h1>
      </header>

      <div className="flex-1 overflow-y-auto flex flex-col">
      {loading && (
        <div className="flex flex-1 items-center justify-center">
          <div className="w-6 h-6 border-2 border-[#5b9cf6] border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {error && (
        <div className="flex flex-1 items-center justify-center">
          <p className="text-[14px] text-red-400">{error}</p>
        </div>
      )}

      {data && (() => {
        const SECTIONS = [
          { key: "credibility",       label: "출처 신뢰도", section: data.credibility },
          { key: "accuracy",          label: "내용 정확성", section: data.accuracy },
          { key: "bias",              label: "편향성 분석", section: data.bias },
          { key: "crossVerification", label: "교차검증",   section: data.crossVerification },
          { key: "transparency",      label: "투명성",      section: data.transparency },
        ];

        return (
          <div className="flex flex-col gap-4 pb-4">
            {/* 기사 제목 + 원형 신뢰도 그래프 */}
            <div className="bg-white px-6 pt-6 pb-8 flex flex-col gap-6">
              {title && !title.startsWith('http') && (
                <h2 className="text-[24px] font-semibold text-[#1A1A1A] leading-[1.4] break-words">
                  {title}
                </h2>
              )}
              <div className="flex justify-center py-2">
                <CircularProgress percentage={data.totalScore} status={data.verdict} />
              </div>
            </div>

            {/* 항목별 점수 */}
            <div className="bg-white px-5 py-[30px] flex flex-col gap-4">
              <h3 className="text-[16px] font-semibold text-[#1A1A1A]">항목별 점수</h3>
              <div className="flex flex-col gap-3">
                {SECTIONS.map(({ key, label, section }, i) => (
                  <ScoreBar
                    key={key}
                    label={label}
                    score={section.score}
                    maxScore={MAX_SCORES[key]}
                    delay={i * 80}
                  />
                ))}
              </div>
            </div>

            {/* 상세 분석 */}
            <div className="bg-white px-5 py-5 flex flex-col gap-4">
              <h3 className="text-[16px] font-semibold text-[#1A1A1A]">상세 분석</h3>
              <div className="flex flex-col gap-4">
                {SECTIONS.map(({ key, label, section }, i) => (
                  <DetailSection
                    key={key}
                    title={label}
                    score={section.score}
                    maxScore={MAX_SCORES[key]}
                    items={section.items}
                    isLast={i === SECTIONS.length - 1}
                  />
                ))}
              </div>
            </div>

            {/* 팩트체크 */}
            {data.factChecks.length > 0 && (
              <div className="bg-white px-5 py-5 flex flex-col gap-4">
                <h3 className="text-[16px] font-semibold text-[#1A1A1A]">팩트체크</h3>
                <div className="flex flex-col gap-3">
                  {data.factChecks.map((fc, i) => (
                    <div key={i} className="flex flex-col gap-2">
                      <div className="flex items-center justify-between gap-2 bg-[#F5F5F5] rounded-[10px] px-3 py-2">
                        <p className="text-[13px] font-semibold text-[#1A1A1A] flex-1">{fc.claim}</p>
                        <span className="text-[11px] font-semibold text-[#51A2FF] bg-[#EEF8FF] rounded-full px-2 py-0.5 flex-shrink-0">
                          {fc.status}
                        </span>
                      </div>
                      <div className="bg-[#EEF8FF] rounded-[10px] px-3 py-3">
                        <p className="text-[12px] text-[#51A2FF] leading-[160%]">{fc.evidence}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 신뢰도가 높은 관련 기사 */}
            {data.relatedArticles.length > 0 && (
              <div className="bg-white px-5 py-5 flex flex-col gap-4 shadow-[0px_1px_1.5px_rgba(0,0,0,0.1),0px_1px_3px_rgba(0,0,0,0.1)]">
                <div className="flex flex-col gap-2">
                  <h3 className="text-[18px] font-semibold text-[#51A2FF]">
                    신뢰도가 높은 관련 기사
                  </h3>
                  <p className="text-[14px] text-[#8F8F8F] leading-[1.6]">
                    이 주제와 관련하여 신뢰도가 높은 다른 기사를 확인해보세요
                  </p>
                </div>
                <div className="flex flex-col gap-3">
                  {data.relatedArticles.map((article) => (
                    <RelatedArticleCard key={article.title} {...article} />
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })()}
      </div>
    </div>
  );
};

export default AnalysisTrustPage;
