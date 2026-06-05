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
    <div className={`h-full w-full overflow-hidden flex flex-col bg-[#FBFBFB] ${isExiting ? "animate-slide-out" : "animate-slide-in"}`}>
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

        const originalUrl = data.url || url;

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
              {originalUrl && (
                <a
                  href={originalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 w-full py-3 bg-[#F5F5F5] rounded-[10px] active:opacity-70 transition-opacity"
                >
                  <span className="text-[14px] font-semibold text-[#1A1A1A]">원문 보러가기</span>
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                    <path
                      d="M3.5 12.5L12.5 3.5M12.5 3.5H6.5M12.5 3.5V9.5"
                      stroke="#1A1A1A"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </a>
              )}
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

            {/* 관련 종목 기술적 분석 */}
            {relatedStocks.length > 0 && (
              <div className="bg-white px-5 py-5 flex flex-col gap-3">
                <h3 className="text-[16px] font-semibold text-[#1A1A1A]">관련 종목 분석</h3>
                <div className="flex flex-col gap-3">
                  {relatedStocks.map((stock) => {
                    const recColor = stock.recommendation === "BUY"
                      ? { bg: "#E8F5E9", text: "#2E7D32", accent: "#4CAF50" }
                      : stock.recommendation === "SELL"
                      ? { bg: "#FFEBEE", text: "#C62828", accent: "#EF5350" }
                      : { bg: "#FFF8E1", text: "#E65100", accent: "#FFA726" };
                    const changeSign = (stock.priceChange ?? 0) >= 0 ? "+" : "";
                    const isUp = (stock.priceChange ?? 0) >= 0;
                    const changeColor = isUp ? "#E03030" : "#1565C0";
                    const adxLabel = stock.signals?.adxStrength === "VERY_STRONG" || stock.signals?.adxStrength === "STRONG" ? "강" : stock.signals?.adxStrength === "MODERATE" ? "중" : "약";
                    const macdLabel = stock.signals?.macdSignal === "BUY" ? "매수" : stock.signals?.macdSignal === "SELL" ? "매도" : "중립";

                    return (
                      <a
                        key={stock.code}
                        href={`https://finance.naver.com/item/main.naver?code=${stock.code}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex flex-col rounded-[14px] overflow-hidden border border-[#F0F0F0] active:opacity-70 transition-opacity"
                        style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}
                      >
                        {/* 상단 컬러 액센트 바 */}
                        <div className="h-1 w-full" style={{ backgroundColor: recColor.accent }} />

                        <div className="flex flex-col gap-3 px-4 py-4">
                          {/* 종목명 행 */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="text-[16px] font-bold text-[#1A1A1A]">{stock.name}</span>
                              <span className="text-[11px] text-[#AAAAAA] font-medium">{stock.code}</span>
                              <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full" style={{ backgroundColor: 'var(--color-primary-bg)', color: 'var(--color-primary)' }}>
                                {stock.market}
                              </span>
                            </div>
                          </div>

                          {/* 현재가 */}
                          <div className="flex items-end gap-2">
                            <span className="text-[22px] font-bold text-[#1A1A1A] leading-none">
                              {(stock.currentPrice ?? 0).toLocaleString()}원
                            </span>
                            <span className="text-[13px] font-semibold pb-0.5" style={{ color: changeColor }}>
                              {changeSign}{(stock.priceChange ?? 0).toLocaleString()}원&nbsp;({changeSign}{stock.priceChangeRate?.toFixed(2)}%)
                            </span>
                          </div>

                          {/* 투자 점수 */}
                          <div className="flex items-center gap-3">
                            <span className="text-[12px] text-[#999] shrink-0">투자 점수</span>
                            <div className="flex-1 h-2 bg-[#F0F0F0] rounded-full overflow-hidden">
                              <div
                                className="h-full rounded-full"
                                style={{ width: `${stock.overallScore}%`, backgroundColor: recColor.accent, transition: "width 0.8s cubic-bezier(0.4,0,0.2,1)" }}
                              />
                            </div>
                            <span className="text-[14px] font-bold w-6 text-right" style={{ color: recColor.text }}>{stock.overallScore}</span>
                          </div>

                          <div className="border-t border-[#F5F5F5]" />

                          {/* 핵심 지표 */}
                          {stock.indicators && (
                            <div className="grid grid-cols-3 gap-2">
                              {[
                                { label: "RSI", value: stock.indicators.rsi?.toFixed(1), sub: stock.signals?.rsiSignal === "OVERBOUGHT" ? "과매수" : stock.signals?.rsiSignal === "OVERSOLD" ? "과매도" : "중립" },
                                { label: "MACD", value: macdLabel, sub: stock.signals?.trend === "BULLISH" ? "상승세" : stock.signals?.trend === "BEARISH" ? "하락세" : "중립" },
                                { label: "ADX", value: stock.indicators.adx?.toFixed(1), sub: `추세 ${adxLabel}` },
                              ].map(({ label, value, sub }) => (
                                <div key={label} className="bg-[#F8F9FA] rounded-[10px] px-3 py-2.5 flex flex-col gap-0.5">
                                  <span className="text-[10px] text-[#AAAAAA] font-medium">{label}</span>
                                  <span className="text-[14px] font-bold text-[#1A1A1A]">{value}</span>
                                  <span className="text-[10px] text-[#888]">{sub}</span>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* 지지/저항 */}
                          {stock.fibonacci && (
                            <div className="flex gap-2">
                              <div className="flex-1 flex items-center justify-between bg-blue-50 rounded-[10px] px-3 py-2.5">
                                <span className="text-[11px] text-blue-400 font-medium">지지선</span>
                                <span className="text-[13px] font-bold text-blue-700">{(stock.fibonacci.support ?? 0).toLocaleString()}원</span>
                              </div>
                              <div className="flex-1 flex items-center justify-between bg-red-50 rounded-[10px] px-3 py-2.5">
                                <span className="text-[11px] text-red-400 font-medium">저항선</span>
                                <span className="text-[13px] font-bold text-red-700">{(stock.fibonacci.resistance ?? 0).toLocaleString()}원</span>
                              </div>
                            </div>
                          )}

                          {/* 핵심 포인트 */}
                          {stock.keyPoints && stock.keyPoints.length > 0 ? (
                            <div className="flex flex-col gap-1.5">
                              {stock.keyPoints.map((point, i) => {
                                const pointStyle =
                                  point.type === "positive" ? { dot: "#4CAF50", bg: "#F1F8F1", text: "#2E6B2E" }
                                  : point.type === "negative" ? { dot: "#EF5350", bg: "#FFF1F1", text: "#962020" }
                                  : point.type === "warning"  ? { dot: "#FFA726", bg: "#FFF8EE", text: "#8A4B00" }
                                  : { dot: "#AAAAAA", bg: "#F5F5F5", text: "#555555" };
                                return (
                                  <div key={i} className="flex items-start gap-2 rounded-[8px] px-3 py-2" style={{ backgroundColor: pointStyle.bg }}>
                                    <span className="mt-[5px] w-[6px] h-[6px] rounded-full shrink-0" style={{ backgroundColor: pointStyle.dot }} />
                                    <p className="text-[12px] leading-[1.7]" style={{ color: pointStyle.text }}>{point.text}</p>
                                  </div>
                                );
                              })}
                            </div>
                          ) : (
                            <p className="text-[12px] text-[#666] leading-[1.7]">{stock.summary}</p>
                          )}
                        </div>
                      </a>
                    );
                  })}
                </div>
                <p className="text-[11px] text-[#BBBBBB] text-center">종목을 탭하면 네이버 금융에서 확인할 수 있어요</p>
                <div className="bg-[#F8F8F8] rounded-[10px] px-4 py-3">
                  <p className="text-[11px] text-[#AAAAAA] leading-[1.7] text-center">
                    본 분석은 투자 참고용 정보이며, 투자 권유가 아닙니다.<br />
                    모든 투자 판단과 그에 따른 손익은 투자자 본인에게 있습니다.
                  </p>
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
