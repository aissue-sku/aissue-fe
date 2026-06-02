import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { analysisService } from "../../services/analysis";
import { ApiError } from "../../services/client";
import type { AnalysisHistoryItem } from "../../types/api";

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

const scoreColor = (score: number) => {
  if (score >= 70) return { text: "var(--color-primary)", bg: "var(--color-primary-bg)" };
  if (score >= 40) return { text: "#F07010", bg: "#FEF5D3" };
  return { text: "#E03030", bg: "#FFE8E8" };
};

const formatDate = (iso: string) => {
  const d = new Date(iso);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")} ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
};

const AnalysisHistoryPage = () => {
  const navigate = useNavigate();
  const [history, setHistory] = useState<AnalysisHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    analysisService
      .getHistory()
      .then(setHistory)
      .catch((e) =>
        setError(
          e instanceof ApiError ? e.message : "이력을 불러오지 못했습니다.",
        ),
      )
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="h-full flex flex-col bg-[#FBFBFB] animate-slide-in">
      {/* 헤더 */}
      <header className="bg-white border-b border-[#F5F5F5] h-18 flex items-center justify-center px-5 shrink-0">
        <button
          onClick={() => navigate(-1)}
          className="absolute left-5 p-1 cursor-pointer active:opacity-60 transition-opacity"
          aria-label="뒤로 가기"
        >
          <BackIcon />
        </button>
        <h1 className="text-[18px] font-semibold text-[#1A1A1A] tracking-[-0.45px]">
          분석 이력
        </h1>
      </header>

      <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-3">
        {loading && (
          <>
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-4 flex flex-col gap-2 border border-[#F0F0F0]"
              >
                <div className="h-4 bg-gray-200 animate-pulse rounded-full w-4/5" />
                <div className="h-3 bg-gray-200 animate-pulse rounded-full w-2/5" />
              </div>
            ))}
          </>
        )}

        {error && (
          <div className="flex flex-1 items-center justify-center">
            <p className="text-[14px] text-red-400">{error}</p>
          </div>
        )}

        {!loading && !error && history.length === 0 && (
          <div className="flex flex-1 items-center justify-center">
            <p className="text-[14px] text-[#A8A8A8]">분석 이력이 없습니다.</p>
          </div>
        )}

        {!loading &&
          !error &&
          history.map((item) => {
            const { text, bg } = scoreColor(item.totalScore);
            return (
              <button
                key={item.id}
                onClick={() => {
                  if (item.contentId) {
                    navigate("/analysis/trust", {
                      state: {
                        contentId: String(item.contentId),
                        title: item.title,
                        url: item.url ?? undefined,
                      },
                    });
                  } else if (item.url) {
                    navigate("/analysis", {
                      state: { url: item.url, autoStart: true },
                    });
                  }
                }}
                className={`bg-white rounded-2xl p-4 border border-[#F0F0F0] flex flex-col gap-2 text-left transition-colors w-full ${item.contentId || item.url ? "active:bg-[var(--color-primary-bg)] cursor-pointer" : "cursor-default opacity-60"}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <p className="text-[14px] font-semibold text-[#1A1A1A] leading-snug line-clamp-2 flex-1">
                    {item.title}
                  </p>
                  <div
                    className="flex-shrink-0 rounded-full px-2.5 py-0.5 flex items-center gap-1"
                    style={{ backgroundColor: bg }}
                  >
                    <span
                      className="text-[13px] font-bold"
                      style={{ color: text }}
                    >
                      {item.totalScore}
                    </span>
                    <span
                      className="text-[11px] font-medium"
                      style={{ color: text }}
                    >
                      점
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className="text-[12px] font-semibold px-2 py-0.5 rounded-full"
                    style={{ color: text, backgroundColor: bg }}
                  >
                    {item.verdict}
                  </span>
                  <span className="text-[12px] text-[#A8A8A8]">
                    {formatDate(item.analyzedAt)}
                  </span>
                </div>
              </button>
            );
          })}
      </div>
    </div>
  );
};

export default AnalysisHistoryPage;
