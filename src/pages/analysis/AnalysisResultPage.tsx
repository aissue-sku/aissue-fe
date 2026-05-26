import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import mascot from "../../assets/mascot.png";
import mascotHand from "../../assets/mascot-hand.png";
import { analysisService } from "../../services/analysis";
import { ApiError } from "../../services/client";
import type { CritiqueItem } from "../../types/api";

interface LocationState {
  contentId?: string;
  title?: string;
  url?: string;
}

const CheckIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
    <path
      d="M2 6l3 3 5-5"
      stroke="#3B91F4"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const AnalysisResultPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { contentId, title } = (location.state as LocationState) ?? {};

  const [critiques, setCritiques] = useState<CritiqueItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!contentId) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    analysisService
      .getCritique(contentId)
      .then((res) => setCritiques(res.critiques))
      .catch((e) => setError(e instanceof ApiError ? e.message : "분석 결과를 불러오지 못했습니다."))
      .finally(() => setLoading(false));
  }, [contentId]);

  const handleNext = () => {
    navigate("/analysis/trust", { state: { contentId, title } });
  };

  return (
    <div className="h-full overflow-hidden bg-[#FBFBFB] flex flex-col animate-slide-in">
      <div className="flex-1 overflow-y-auto px-5 pt-8 pb-4">
        {/* 마스코트 */}
        <div className="flex flex-col items-center mb-6">
          <div className="relative w-24">
            <img src={mascot} alt="아이슈 마스코트" className="w-full h-auto object-contain" />
            <img
              src={mascotHand}
              alt=""
              className="absolute top-[35%] left-[75%] w-[48%] h-auto"
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
              {critiques.map((item, i) => (
                <div key={i} className="flex flex-col gap-2">
                  <div className="bg-[#F5F5F5] rounded-[10px] px-[10px] py-[10px] flex items-center justify-between">
                    <p className="text-[14px] font-semibold text-[#1A1A1A]">
                      {item.label}{" "}
                      <span className="text-[#3B91F4]">{item.count}건</span> 감지
                    </p>
                    <div className="bg-[#EEF8FF] rounded-full px-2 py-0.5 flex items-center gap-1 ml-2 flex-shrink-0">
                      {item.status === "참고" && <CheckIcon />}
                      <span className="text-[11px] font-semibold text-[#3B91F4] whitespace-nowrap">
                        {item.status}
                      </span>
                    </div>
                  </div>
                  <div className="bg-[#EEF8FF] rounded-[10px] px-[15px] py-[15px]">
                    <p className="text-[13px] text-[#51A2FF] leading-[160%]">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
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
