import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import mascot from "../../assets/mascot.png";
import mascotHand from "../../assets/mascot-hand.png";
import { analysisService } from "../../services/analysis";
import { ApiError } from "../../services/client";

const LOADING_DURATION = 3000;

const AnalysisPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = location.state as {
    url?: string;
    contentId?: string;
    title?: string;
    autoStart?: boolean;
  } | null;
  const prefillUrl = locationState?.url ?? "";
  const autoStart = !!locationState?.autoStart;
  const [url, setUrl] = useState(prefillUrl);
  const [loading, setLoading] = useState(autoStart);
  const [progress, setProgress] = useState(0);
  const [urlError, setUrlError] = useState<string | null>(null);
  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);

  useEffect(() => {
    if (!loading) return;

    const animate = (timestamp: number) => {
      if (!startRef.current) startRef.current = timestamp;
      const elapsed = timestamp - startRef.current;
      const next = Math.min((elapsed / LOADING_DURATION) * 100, 100);
      setProgress(next);
      if (elapsed < LOADING_DURATION) {
        rafRef.current = requestAnimationFrame(animate);
      }
    };

    rafRef.current = requestAnimationFrame(animate);

    // contentId 있으면 홈 카드 flow, URL만 있으면 제출 API flow
    const hasContentId = !!locationState?.contentId;
    const submitPromise =
      !hasContentId && url.trim()
        ? analysisService.submitContent("URL", url.trim())
        : Promise.resolve(null);

    let cancelled = false;

    const timer = setTimeout(async () => {
      try {
        const submitResult = await submitPromise;
        if (cancelled) return;

        if (submitResult) {
          navigate("/analysis/result", {
            state: { submitResult, title: locationState?.title },
          });
        } else {
          navigate("/analysis/result", {
            state: {
              url,
              contentId: locationState?.contentId,
              title: locationState?.title,
            },
          });
        }
      } catch (e) {
        if (cancelled) return;
        setUrlError(
          e instanceof ApiError
            ? e.message
            : "올바른 기사 URL을 입력해 주세요.",
        );
        setLoading(false);
      }
    }, LOADING_DURATION);

    return () => {
      cancelled = true;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      clearTimeout(timer);
      startRef.current = null;
    };
  }, [loading, navigate, url, locationState]);

  const handleAnalyze = () => {
    if (!url.trim()) return;
    setUrlError(null);
    setProgress(0);
    setLoading(true);
  };

  if (loading) {
    return (
      <div className="h-full bg-[#F5F5F5] flex flex-col items-center justify-center px-5 gap-8">
        <img
          src={mascot}
          alt="아이슈 마스코트"
          className="w-36 h-auto object-contain"
        />
        <div className="w-full flex flex-col items-center gap-4">
          <p className="text-[18px] font-bold text-[#51A2FF]">
            신뢰도 확인 중...
          </p>
          <div className="w-full h-[10px] bg-[#E0E0E0] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#51A2FF] rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-sm text-gray-400 text-center">
            신뢰도 확인을 위해 데이터를 분석하고 있어요
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-hidden bg-white flex flex-col px-5 py-6 animate-page-enter">
      {/* 중앙 콘텐츠 */}
      <div className="flex-1 flex flex-col items-center justify-center gap-8">
        {/* 마스코트 */}
        <div className="relative w-36">
          <img
            src={mascot}
            alt="아이슈 마스코트"
            className="w-full h-auto object-contain"
          />
          <img
            src={mascotHand}
            alt=""
            className="absolute top-[30%] left-[75%] w-[48%] h-auto animate-hand"
          />
        </div>

        {/* 타이틀 */}
        <h1 className="text-[24px] font-semibold text-[#51A2FF] text-center leading-[160%] tracking-[0px]">
          내가 보는 기사,
          <br />
          믿어도 되는지 확인해보세요!
        </h1>

        {/* URL 입력 */}
        <div className="w-full flex flex-col gap-2">
          <input
            type="url"
            value={url}
            onChange={(e) => {
              setUrl(e.target.value);
              setUrlError(null);
            }}
            placeholder="https://example.com/news/1"
            className={`w-full h-[56px] border rounded-xl px-4 text-[16px] text-gray-700 placeholder-gray-400 outline-none transition-colors ${
              urlError
                ? "border-red-400 focus:border-red-400"
                : "border-[#3B91F4]"
            }`}
          />
          {urlError ? (
            <p className="text-xs text-red-400 px-1">{urlError}</p>
          ) : (
            <p className="text-xs text-gray-400 px-1">
              링크만 붙여넣으면, 기사 신뢰도를 확인할 수 있어요
            </p>
          )}
        </div>
      </div>

      {/* 분석 버튼 */}
      <button
        onClick={handleAnalyze}
        className="w-full h-[50px] bg-[#51A2FF] text-white text-lg font-semibold rounded-[8px] cursor-pointer active:opacity-90 transition-opacity"
      >
        신뢰도 분석하기
      </button>
    </div>
  );
};

export default AnalysisPage;
