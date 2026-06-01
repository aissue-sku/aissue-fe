import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

const STEPS = [
  {
    title: "홈에서 뉴스 카드 확인",
    desc: "카드를 좌우로 스와이프하면\n오늘의 주요 이슈를 확인할 수 있어요.",
    illustration: <StepCard1 />,
  },
  {
    title: "카드 탭으로 신뢰도 분석",
    desc: "카드를 탭하면 AI가 해당 기사의\n신뢰도를 자동으로 분석해 드려요.",
    illustration: <StepCard2 />,
  },
  {
    title: "URL로 직접 분석하기",
    desc: "분석 탭에서 기사 URL을 붙여넣으면\n어떤 기사든 신뢰도를 확인할 수 있어요.",
    illustration: <StepCard3 />,
  },
  {
    title: "키워드 구독으로 맞춤 뉴스",
    desc: "관심 키워드를 구독하면\n관련 최신 뉴스를 홈에서 바로 확인해요.",
    illustration: <StepCard4 />,
  },
];

// ── 일러스트 ─────────────────────────────────────────────────────────────────

function StepCard1() {
  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* 캐러셀 스트립: 가운데 카드(index 2)가 중앙, 슬라이드로 index 3이 활성화됐다 복귀 */}
      <div
        className="absolute flex items-center h-[220px] animate-guide-carousel"
        style={{ left: "calc(50% - 322px)", top: "calc(50% - 110px)" }}
      >
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={`relative flex-shrink-0 w-[148px] rounded-2xl bg-white overflow-hidden border border-[#E5E5E5] ${
              i > 0 ? "-ml-6" : ""
            } ${
              i === 2
                ? "animate-guide-card2"
                : i === 3
                ? "animate-guide-card3"
                : "animate-guide-card-side"
            }`}
          >
            <div className="h-[45%] bg-[var(--color-primary-border)]" />
            <div className="p-2 flex flex-col gap-1.5">
              <div className="h-2 bg-[#D0E8FF] rounded-full w-1/3" />
              <div className="h-2 bg-gray-200 rounded-full w-full" />
              <div className="h-2 bg-gray-200 rounded-full w-4/5" />
              <div className="flex gap-1 mt-0.5">
                <div className="h-4 w-10 bg-[var(--color-primary-bg)] rounded" />
                <div className="h-4 w-8 bg-[var(--color-primary-bg)] rounded" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StepCard2() {
  return (
    <div className="relative w-full flex flex-col items-center justify-center h-full gap-4">
      {/* 카드 */}
      <div className="w-[200px] h-[200px] bg-white rounded-2xl shadow-lg flex flex-col overflow-hidden border border-[#E5E5E5]">
        <div className="h-[90px] bg-[var(--color-primary-border)]" />
        <div className="p-3 flex flex-col gap-2">
          <div className="h-2.5 bg-[#D0E8FF] rounded-full w-1/3" />
          <div className="h-3 bg-gray-200 rounded-full w-full" />
          <div className="h-3 bg-gray-200 rounded-full w-3/4" />
        </div>
      </div>
      {/* 탭 리플 */}
      <div className="absolute top-[90px] left-1/2 -translate-x-1/2">
        <div className="w-10 h-10 rounded-full bg-[var(--color-primary)] opacity-0 animate-tap-ripple" />
      </div>
      {/* 로딩 바 */}
      <div className="w-[200px] flex flex-col items-center gap-2">
        <p className="text-[13px] font-semibold text-[var(--color-primary)]">
          신뢰도 확인 중...
        </p>
        <div className="w-full h-2 bg-[#E0E0E0] rounded-full overflow-hidden">
          <div className="h-full bg-[var(--color-primary)] rounded-full animate-progress-bar" />
        </div>
      </div>
    </div>
  );
}

function StepCard3() {
  return (
    <div className="relative w-full flex flex-col items-center justify-center h-full gap-5">
      {/* URL 입력창 */}
      <div className="w-[240px] h-[52px] border-2 border-[var(--color-primary)] rounded-xl px-4 flex items-center gap-2 bg-white">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path
            d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"
            style={{ stroke: 'var(--color-primary)' }}
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"
            style={{ stroke: 'var(--color-primary)' }}
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
        <p className="text-[13px] text-[#697584] animate-url-type overflow-hidden whitespace-nowrap">
          https://news.example.com/...
        </p>
      </div>
      {/* 버튼 */}
      <div className="w-[240px] h-[46px] bg-[var(--color-primary)] rounded-[8px] flex items-center justify-center animate-btn-pulse">
        <span className="text-white text-[15px] font-semibold">
          신뢰도 분석하기
        </span>
      </div>
      {/* 결과 미리보기 */}
      <div className="w-[240px] bg-white rounded-2xl border border-[#E5E5E5] p-3 flex items-center gap-3 animate-result-enter">
        <div className="w-12 h-12 rounded-full bg-[var(--color-primary-bg)] flex items-center justify-center flex-shrink-0">
          <span className="text-[18px] font-bold text-[var(--color-primary)]">85</span>
        </div>
        <div className="flex flex-col gap-1">
          <div className="h-2.5 bg-[#D0E8FF] rounded-full w-20" />
          <div className="h-2 bg-gray-200 rounded-full w-28" />
        </div>
      </div>
    </div>
  );
}

function StepCard4() {
  const chips = ["삼성전자", "AI", "부동산", "+ 추가"];
  return (
    <div className="relative w-full flex flex-col items-center justify-center h-full gap-4">
      {/* 키워드 칩들 */}
      <div className="flex flex-wrap gap-2 justify-center w-[240px]">
        {chips.map((kw, i) => (
          <div
            key={kw}
            className={`px-3 py-1.5 rounded-full text-[13px] font-semibold border flex items-center gap-1
              ${kw === "+ 추가" ? "border-dashed border-[#C0C0C0] text-[#A8A8A8]" : "bg-[var(--color-primary)] text-white border-transparent"}
            `}
            style={{
              animation: `card-enter 400ms cubic-bezier(0.34,1.56,0.64,1) ${i * 100}ms both`,
            }}
          >
            {kw !== "+ 추가" && (
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                <path
                  d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
            {kw}
          </div>
        ))}
      </div>
      {/* 뉴스 아이템 */}
      <div className="w-[240px] bg-white rounded-2xl border border-[#F0F0F0] overflow-hidden">
        {[
          "삼성전자 1분기 실적 발표",
          "AI 규제법 국회 통과",
          "부동산 거래량 회복세",
        ].map((title, i) => (
          <div
            key={title}
            className={`flex items-center gap-3 px-3 py-2.5 ${i < 2 ? "border-b border-[#F0F0F0]" : ""}`}
            style={{
              animation: `card-enter 350ms ease ${300 + i * 80}ms both`,
            }}
          >
            <div className="w-7 h-7 rounded-md bg-[var(--color-primary-bg)] flex-shrink-0" />
            <p className="text-[12px] text-[#1A1A1A] font-medium line-clamp-1">
              {title}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── 메인 페이지 ──────────────────────────────────────────────────────────────

const GuidePage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [exiting, setExiting] = useState(false);
  const touchStartX = useRef(0);

  const goTo = (next: number) => {
    if (next < 0 || next >= STEPS.length) return;
    setStep(next);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) < 40) return;
    if (dx < 0) goTo(step + 1);
    else goTo(step - 1);
  };

  const isLast = step === STEPS.length - 1;

  return (
    <div
      className={`h-full flex flex-col bg-white ${exiting ? "animate-slide-out" : "animate-slide-in"}`}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* 헤더 */}
      <header className="h-18 flex items-center justify-between px-5 border-b border-[#F5F5F5] shrink-0">
        <button
          onClick={() => {
            setExiting(true);
            setTimeout(() => navigate(-1), 280);
          }}
          className="p-1 active:opacity-60 transition-opacity"
          aria-label="뒤로 가기"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M15 18l-6-6 6-6"
              stroke="#1A1A1A"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <h1 className="text-[18px] font-semibold text-[#1A1A1A] tracking-[-0.45px]">
          사용 가이드
        </h1>
        <div className="w-[60px]" />
      </header>

      {/* 스텝 도트 */}
      <div className="flex items-center justify-center gap-2 pt-5 shrink-0">
        {STEPS.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`rounded-full transition-all duration-300 ${
              i === step ? "w-6 h-2 bg-[var(--color-primary)]" : "w-2 h-2 bg-[#D0E8FF]"
            }`}
          />
        ))}
      </div>

      {/* 일러스트 영역 */}
      <div className="flex-1 flex items-center justify-center px-6 min-h-0 py-4">
        <div className="w-full max-w-[320px] h-full max-h-[320px]" key={step}>
          {STEPS[step].illustration}
        </div>
      </div>

      {/* 텍스트 + 버튼 */}
      <div className="shrink-0 px-6 pb-10 flex flex-col gap-6">
        <div className="text-center flex flex-col gap-2" key={`text-${step}`}>
          <h2 className="text-[22px] font-bold text-[#1A1A1A] animate-fade-up">
            {STEPS[step].title}
          </h2>
          <p
            className="text-[15px] text-[#8F8F8F] leading-[1.7] whitespace-pre-line animate-fade-up"
            style={{ animationDelay: "60ms" }}
          >
            {STEPS[step].desc}
          </p>
        </div>

        <div className="flex gap-3">
          {step > 0 && (
            <button
              onClick={() => goTo(step - 1)}
              className="flex-1 h-[50px] border border-[#E5E5E5] rounded-[10px] text-[16px] font-semibold text-[#8F8F8F] active:bg-[#F5F5F5] transition-colors"
            >
              이전
            </button>
          )}
          <button
            onClick={() => {
              if (isLast) {
                setExiting(true);
                setTimeout(() => navigate("/analysis"), 280);
              } else {
                goTo(step + 1);
              }
            }}
            className="flex-1 h-[50px] bg-[var(--color-primary)] rounded-[10px] text-[16px] font-semibold text-white active:opacity-90 transition-opacity"
          >
            {isLast ? "시작하기" : "다음"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default GuidePage;
