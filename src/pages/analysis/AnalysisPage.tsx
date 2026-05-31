import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import mascotHand from "../../assets/mascot-hand.png";
import { analysisService } from "../../services/analysis";
import { ApiError } from "../../services/client";
import { useMascotConfig } from "../../hooks/useMascotConfig";

const FAST_DURATION = 3000;
const SLOW_CAP = 78;
const SLOW_REACH_MS = 7000;

const STEPS = [
  "기사 내용 수집 중...",
  "출처 신뢰도 확인 중...",
  "내용 정확성 분석 중...",
  "교차검증 중...",
  "신뢰도 점수 계산 중...",
];

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
  const [stepIndex, setStepIndex] = useState(0);
  const [jumping, setJumping] = useState(false);
  const [urlError, setUrlError] = useState<string | null>(null);
  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);
  const mascotConfig = useMascotConfig();

  const hasContentId = !!locationState?.contentId;

  useEffect(() => {
    if (!loading) return;

    startRef.current = null;
    let cancelled = false;

    if (hasContentId) {
      const animate = (ts: number) => {
        if (!startRef.current) startRef.current = ts;
        const elapsed = ts - startRef.current;
        setProgress(Math.min((elapsed / FAST_DURATION) * 100, 100));
        if (elapsed < FAST_DURATION) rafRef.current = requestAnimationFrame(animate);
      };
      rafRef.current = requestAnimationFrame(animate);

      const timer = setTimeout(() => {
        if (!cancelled) navigate("/analysis/result", {
          state: {
            url,
            contentId: locationState?.contentId,
            title: locationState?.title,
          },
        });
      }, FAST_DURATION);

      return () => {
        cancelled = true;
        clearTimeout(timer);
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        startRef.current = null;
      };
    }

    // URL 제출 flow: 서서히 78%까지 채우다가 API 완료 시 100% 점프
    if (!url.trim()) return;

    let apiDone = false;

    const animate = (ts: number) => {
      if (!startRef.current) startRef.current = ts;
      const elapsed = ts - startRef.current;
      const t = Math.min(elapsed / SLOW_REACH_MS, 1);
      const eased = (1 - Math.pow(1 - t, 2)) * SLOW_CAP;
      setProgress(eased);
      if (!apiDone) rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);

    let msgIdx = 0;
    const msgTimer = setInterval(() => {
      msgIdx = (msgIdx + 1) % STEPS.length;
      setStepIndex(msgIdx);
    }, 1800);

    analysisService
      .submitContent("URL", url.trim())
      .then((result) => {
        if (cancelled) return;
        apiDone = true;
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        clearInterval(msgTimer);
        setJumping(true);
        setProgress(100);
        setTimeout(() => {
          if (!cancelled) navigate("/analysis/result", {
            state: { submitResult: result, title: locationState?.title },
          });
        }, 500);
      })
      .catch((e) => {
        if (cancelled) return;
        apiDone = true;
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        clearInterval(msgTimer);
        setUrlError(
          e instanceof ApiError ? e.message : "올바른 기사 URL을 입력해 주세요.",
        );
        setLoading(false);
      });

    return () => {
      cancelled = true;
      apiDone = true;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      clearInterval(msgTimer);
      startRef.current = null;
    };
  }, [loading, navigate, url, locationState, hasContentId]);

  const handleAnalyze = () => {
    if (!url.trim()) return;
    setUrlError(null);
    setProgress(0);
    setStepIndex(0);
    setJumping(false);
    setLoading(true);
  };

  if (loading) {
    const title = hasContentId ? "신뢰도 확인 중..." : STEPS[stepIndex];

    return (
      <div className="h-full bg-[#F5F5F5] flex flex-col items-center justify-center px-5 gap-8">
        <div className="relative w-36">
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
        </div>
        <div className="w-full flex flex-col items-center gap-4">
          <p key={title} className="text-[18px] font-bold text-[#51A2FF] animate-fade-in">
            {title}
          </p>
          <div className="w-full h-[10px] bg-[#E0E0E0] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#51A2FF] rounded-full"
              style={{
                width: `${progress}%`,
                transition: jumping ? "width 0.5s ease" : "none",
              }}
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
            className="absolute top-[30%] left-[75%] w-[48%] h-auto animate-hand"
            style={{ filter: mascotConfig.filter }}
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
