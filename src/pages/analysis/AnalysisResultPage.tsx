import { useState, useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import mascotHand from "../../assets/mascot-hand.png";
import { analysisService } from "../../services/analysis";
import { useMascotConfig } from "../../hooks/useMascotConfig";
import { ApiError } from "../../services/client";
import type { CritiqueItem, ContentAnalysisResponse } from "../../types/api";

interface LocationState {
  contentId?: string;
  title?: string;
  url?: string;
  submitResult?: ContentAnalysisResponse;
}

const STATUS_THEME: Record<string, { text: string; badge: string }> = {
  주의: { text: '#E03030', badge: '#FFE8E8' },
  참고: { text: '#F07010', badge: '#FEF5D3' },
  확인: { text: '#3B91F4', badge: '#EEF8FF' },
};
const getTheme = (status: string) => STATUS_THEME[status] ?? STATUS_THEME['참고'];
const DESC_BG = '#EEF8FF';
const DESC_TEXT = '#51A2FF';

const MAX_SCORES: Record<string, number> = {
  credibility: 25, accuracy: 25, bias: 20, crossVerification: 20, transparency: 10,
};
const SECTION_LABELS: Record<string, string> = {
  credibility: '출처 신뢰도', accuracy: '내용 정확성', bias: '편향성 분석',
  crossVerification: '교차검증', transparency: '투명성',
};

const deriveStatus = (score: number, max: number): '주의' | '참고' | '확인' => {
  const pct = score / max;
  if (pct >= 0.7) return '확인';
  if (pct >= 0.4) return '참고';
  return '주의';
};

const AnalysisResultPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { contentId, title, submitResult } = (location.state as LocationState) ?? {};

  const mascotConfig = useMascotConfig();
  const [critiques, setCritiques] = useState<CritiqueItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const derivedCritiques = useMemo<CritiqueItem[]>(() => {
    if (!submitResult) return [];
    return (Object.keys(SECTION_LABELS) as (keyof typeof SECTION_LABELS)[]).map((key) => {
      const section = submitResult[key as keyof ContentAnalysisResponse] as { score: number; reason: string; items: { label: string; score: number }[] };
      const max = MAX_SCORES[key];
      return {
        label: SECTION_LABELS[key],
        count: section.items.length,
        status: deriveStatus(section.score, max),
        description: section.reason,
      };
    });
  }, [submitResult]);

  useEffect(() => {
    if (submitResult || !contentId) return;
    setLoading(true);
    analysisService
      .getCritique(contentId)
      .then((res) => setCritiques(res.critiques))
      .catch((e) => setError(e instanceof ApiError ? e.message : "분석 결과를 불러오지 못했습니다."))
      .finally(() => setLoading(false));
  }, [contentId, submitResult]);

  const displayCritiques = submitResult ? derivedCritiques : critiques;

  const handleNext = () => {
    if (submitResult) {
      navigate("/analysis/trust", { state: { submitResult, title } });
    } else {
      navigate("/analysis/trust", { state: { contentId, title } });
    }
  };

  return (
    <div className="h-full overflow-hidden bg-[#FBFBFB] flex flex-col animate-slide-in">
      <div className="flex-1 overflow-y-auto px-5 pt-8 pb-4">
        {/* 마스코트 */}
        <div className="flex flex-col items-center mb-6">
          <div className="relative w-24">
            <img
              src={mascotConfig.faceImage}
              alt="아이슈 마스코트"
              className="w-full h-auto object-contain"
              style={{ filter: mascotConfig.filter }}
            />
            {mascotConfig.clothImage && (
              <img src={mascotConfig.clothImage} alt="" className="absolute top-0 left-0 w-full h-auto" />
            )}
            {mascotConfig.hatImage && (
              <img src={mascotConfig.hatImage} alt="" className="absolute top-0 left-0 w-full h-auto" />
            )}
            <img
              src={mascotHand}
              alt=""
              className="absolute top-[35%] left-[75%] w-[48%] h-auto"
              style={{ filter: mascotConfig.filter }}
            />
          </div>
          <h1 className="text-[24px] font-semibold text-[#51A2FF] text-center mt-4 leading-[160%]">
            분석 결과를 알려드릴게요.
          </h1>
        </div>

        {/* 카드 컨테이너 */}
        <div className="bg-white rounded-[16px] p-5 shadow-[0px_1px_1.5px_rgba(0,0,0,0.1),0px_1px_3px_rgba(0,0,0,0.1)] flex flex-col gap-4">
          <p className="text-[16px] font-semibold text-[#1A1A1A]">기사 분석 결과</p>

          {loading && (
            <div className="flex justify-center py-6">
              <div className="w-5 h-5 border-2 border-[#5b9cf6] border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          {error && (
            <p className="text-[13px] text-red-400 text-center py-4">{error}</p>
          )}

          {!loading && !error && (
            <div className="flex flex-col gap-3">
              {displayCritiques.map((item, i) => {
                const theme = getTheme(item.status);
                return (
                  <div key={i} className="flex flex-col gap-2">
                    <div className="bg-[#F5F5F5] rounded-[10px] px-[10px] py-[10px] flex items-center justify-between">
                      <p className="text-[14px] font-semibold text-[#1A1A1A]">
                        {item.label}{" "}
                        <span style={{ color: theme.text }}>{item.count}건</span> 감지
                      </p>
                      <div className="rounded-full px-2 py-0.5 flex items-center gap-1 ml-2 flex-shrink-0" style={{ backgroundColor: theme.badge }}>
                        <span className="text-[11px] font-semibold whitespace-nowrap" style={{ color: theme.text }}>
                          {item.status}
                        </span>
                      </div>
                    </div>
                    <div className="rounded-[10px] px-[15px] py-[15px]" style={{ backgroundColor: DESC_BG }}>
                      <p className="text-[13px] leading-[160%]" style={{ color: DESC_TEXT }}>
                        {item.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <button
            onClick={handleNext}
            className="w-full h-[50px] bg-[#51A2FF] text-white text-lg font-semibold rounded-[8px] cursor-pointer active:opacity-90 transition-opacity"
          >
            다음
          </button>
        </div>
      </div>
    </div>
  );
};

export default AnalysisResultPage;
