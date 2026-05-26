import { useEffect, useRef } from "react";

interface Props {
  label: string;
  score: number;
  maxScore: number;
  delay?: number;
}

const ScoreBar = ({ label, score, maxScore, delay = 0 }: Props) => {
  const barRef = useRef<HTMLDivElement>(null);
  const percentage = (score / maxScore) * 100;

  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;
    bar.style.width = "0%";
    const timer = setTimeout(() => {
      bar.style.width = `${percentage}%`;
    }, 80 + delay);
    return () => clearTimeout(timer);
  }, [percentage, delay]);

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between">
        <span className="text-[14px] text-[#5E5E5E]">{label}</span>
        <span className="text-[14px] font-semibold text-[#51A2FF]">
          {score}/{maxScore}
        </span>
      </div>
      <div className="bg-[#F5F5F5] h-2 rounded-full overflow-hidden">
        <div
          ref={barRef}
          className="bg-[#51A2FF] h-full rounded-full"
          style={{ width: "0%", transition: "width 1s cubic-bezier(0.4, 0, 0.2, 1)" }}
        />
      </div>
    </div>
  );
};

export default ScoreBar;
