import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import CircularProgress from "../../components/analysis/CircularProgress";
import ScoreBar from "../../components/analysis/ScoreBar";
import DetailSection from "../../components/analysis/DetailSection";
import RelatedArticleCard from "../../components/analysis/RelatedArticleCard";
import { analysisService } from "../../services/analysis";
import { ApiError } from "../../services/client";
import type { ContentAnalysisResponse, StockAnalysisResponse } from "../../types/api";

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
  url?: string;
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
  const { contentId, title, submitResult, url } = (location.state as LocationState) ?? {};

  const [data, setData] = useState<ContentAnalysisResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isExiting, setIsExiting] = useState(false);
  const [relatedStocks, setRelatedStocks] = useState<StockAnalysisResponse[]>([]);

  useEffect(() => {
    if (submitResult) {
      setData(submitResult);
      return;
    }
    if (!contentId) return;
    setLoading(true);
    analysisService
      .getContentAnalysis(contentId)
      .then(setData)
      .catch((e) => setError(e instanceof ApiError ? e.message : "신뢰도 데이터를 불러오지 못했습니다."))
      .finally(() => setLoading(false));
  }, [contentId, submitResult]);

  useEffect(() => {
    if (submitResult?.stocks) {
      setRelatedStocks(submitResult.stocks);
    }
  }, [submitResult]);

  const handleBack = () => {
    setIsExiting(true);
    setTimeout(() => navigate(-1), 280);
  };

  return (
    <div className={`h-full overflow-hidden flex flex-col bg-[#FBFBFB] ${isExiting ? "animate-slide-out" : "animate-slide-in"}`}>
      {/* 헤더 */}
      <header className="bg-white border-b border-[#F5F5F5] h-18 flex items-center justify-center px-5 shrink-0">
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
          <div className="w-6 h-6 border-2 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {error && (
        <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8">
          <p className="text-[14px] text-[#A8A8A8] text-center">{error}</p>
          {url && (
            <button
              onClick={() => navigate("/analysis", { state: { url, autoStart: true } })}
              className="px-6 py-3 bg-[var(--color-primary)] text-white text-[15px] font-semibold rounded-[10px] active:opacity-80 transition-opacity"
            >
              분석하기
            </button>
          )}
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
                        <span className="text-[11px] font-semibold text-[var(--color-primary)] bg-[var(--color-primary-bg)] rounded-full px-2 py-0.5 flex-shrink-0">
                          {fc.status}
                        </span>
                      </div>
                      <div className="bg-[var(--color-primary-bg)] rounded-[10px] px-3 py-3">
                        <p className="text-[12px] text-[var(--color-primary)] leading-[160%]">{fc.evidence}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 관련 종목 기술적 분석 */}
            {relatedStocks.length > 0 && (
              <div className="bg-white px-5 py-5 flex flex-col gap-3">
                <h3 className="text-[16px] font-semibold text-[#1A1A1A]">관련 종목 기술적 분석</h3>
                <div className="flex flex-col gap-3">
                  {relatedStocks.map((stock) => {
                    const recColor = stock.recommendation === "BUY"
                      ? { bg: "#E8F5E9", text: "#2E7D32" }
                      : stock.recommendation === "SELL"
                      ? { bg: "#FFEBEE", text: "#C62828" }
                      : { bg: "#FFF8E1", text: "#F57F17" };
                    const recLabel = stock.recommendation === "BUY" ? "매수" : stock.recommendation === "SELL" ? "매도" : "관망";
                    const changeSign = (stock.priceChange ?? 0) >= 0 ? "+" : "";
                    const changeColor = (stock.priceChange ?? 0) >= 0 ? "#C62828" : "#1565C0";

                    return (
                      <a
                        key={stock.code}
                        href={`https://finance.naver.com/item/main.naver?code=${stock.code}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex flex-col gap-3 bg-[#F8F9FA] rounded-[12px] px-4 py-4 active:opacity-70 transition-opacity"
                      >
                        {/* 종목명 + 추천 뱃지 */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-[15px] font-semibold text-[#1A1A1A]">{stock.name}</span>
                            <span className="text-[11px] text-[#999]">{stock.code}</span>
                            <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full" style={{ backgroundColor: 'var(--color-primary-bg)', color: 'var(--color-primary)' }}>
                              {stock.market}
                            </span>
                          </div>
                          <span className="text-[12px] font-bold px-2.5 py-1 rounded-full" style={{ backgroundColor: recColor.bg, color: recColor.text }}>
                            {recLabel}
                          </span>
                        </div>

                        {/* 현재가 + 등락 */}
                        <div className="flex items-baseline gap-2">
                          <span className="text-[20px] font-bold text-[#1A1A1A]">
                            {(stock.currentPrice ?? 0).toLocaleString()}원
                          </span>
                          <span className="text-[13px] font-medium" style={{ color: changeColor }}>
                            {changeSign}{(stock.priceChange ?? 0).toLocaleString()}원 ({changeSign}{stock.priceChangeRate?.toFixed(2)}%)
                          </span>
                        </div>

                        {/* 핵심 지표 */}
                        {stock.indicators && (
                          <div className="grid grid-cols-3 gap-2">
                            {[
                              { label: "RSI", value: stock.indicators.rsi?.toFixed(1) },
                              { label: "MACD", value: stock.signals?.macdSignal === "BUY" ? "매수↑" : stock.signals?.macdSignal === "SELL" ? "매도↓" : "중립" },
                              { label: "ADX", value: `${stock.indicators.adx?.toFixed(1)} (${stock.signals?.adxStrength === "VERY_STRONG" ? "강" : stock.signals?.adxStrength === "STRONG" ? "강" : stock.signals?.adxStrength === "MODERATE" ? "중" : "약"})` },
                            ].map(({ label, value }) => (
                              <div key={label} className="bg-white rounded-[8px] px-3 py-2 flex flex-col gap-0.5">
                                <span className="text-[10px] text-[#999]">{label}</span>
                                <span className="text-[13px] font-semibold text-[#1A1A1A]">{value}</span>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* 피보나치 지지/저항 */}
                        {stock.fibonacci && (
                          <div className="flex gap-2">
                            <div className="flex-1 bg-blue-50 rounded-[8px] px-3 py-2">
                              <p className="text-[10px] text-blue-400">지지선</p>
                              <p className="text-[13px] font-semibold text-blue-700">{(stock.fibonacci.support ?? 0).toLocaleString()}원</p>
                            </div>
                            <div className="flex-1 bg-red-50 rounded-[8px] px-3 py-2">
                              <p className="text-[10px] text-red-400">저항선</p>
                              <p className="text-[13px] font-semibold text-red-700">{(stock.fibonacci.resistance ?? 0).toLocaleString()}원</p>
                            </div>
                          </div>
                        )}

                        {/* 종합 의견 */}
                        <p className="text-[12px] text-[#666] leading-[1.6]">{stock.summary}</p>

                        {/* 종합 점수 바 */}
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] text-[#999] w-14 shrink-0">투자 점수</span>
                          <div className="flex-1 h-1.5 bg-[#E5E5E5] rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all duration-700"
                              style={{ width: `${stock.overallScore}%`, backgroundColor: recColor.text }}
                            />
                          </div>
                          <span className="text-[12px] font-bold w-8 text-right" style={{ color: recColor.text }}>{stock.overallScore}</span>
                        </div>
                      </a>
                    );
                  })}
                </div>
                <p className="text-[11px] text-[#BBBBBB] text-center">종목을 탭하면 네이버 금융에서 실시간 시세를 확인할 수 있습니다</p>
              </div>
            )}

            {/* 신뢰도가 높은 관련 기사 */}
            {data.relatedArticles.length > 0 && (
              <div className="bg-white px-5 py-5 flex flex-col gap-4 shadow-[0px_1px_1.5px_rgba(0,0,0,0.1),0px_1px_3px_rgba(0,0,0,0.1)]">
                <div className="flex flex-col gap-2">
                  <h3 className="text-[18px] font-semibold text-[var(--color-primary)]">
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
