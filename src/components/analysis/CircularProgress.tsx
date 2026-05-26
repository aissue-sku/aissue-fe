import { useEffect, useRef } from "react";
import sirenIcon from "../../assets/siren.svg";
import warnIcon from "../../assets/warn.svg";
import checkIcon from "../../assets/check.svg";

interface Props {
  percentage: number;
  status: string;
}

const SIZE = 160;
const STROKE = 14;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const getTheme = (p: number) => {
  if (p < 34) return { color: "#FF6B6B", track: "#FFE8E8", icon: sirenIcon };
  if (p < 67) return { color: "#FFBB29", track: "#FEF5D3", icon: warnIcon };
  return { color: "#4AEEC0", track: "#DDF6F5", icon: checkIcon };
};

const CircularProgress = ({ percentage, status }: Props) => {
  const circleRef = useRef<SVGCircleElement>(null);
  const targetOffset = CIRCUMFERENCE * (1 - percentage / 100);
  const { color, track, icon } = getTheme(percentage);

  useEffect(() => {
    const circle = circleRef.current;
    if (!circle) return;
    circle.style.strokeDashoffset = String(CIRCUMFERENCE);
    const timer = setTimeout(() => {
      circle.style.strokeDashoffset = String(targetOffset);
    }, 80);
    return () => clearTimeout(timer);
  }, [targetOffset]);

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative" style={{ width: SIZE, height: SIZE }}>
        <svg
          width={SIZE}
          height={SIZE}
          style={{ transform: "rotate(-90deg)" }}
          className="absolute inset-0"
        >
          {/* 트랙 */}
          <circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            fill="none"
            stroke={track}
            strokeWidth={STROKE}
          />
          {/* 진행 원호 */}
          <circle
            ref={circleRef}
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            fill="none"
            stroke={color}
            strokeWidth={STROKE}
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={CIRCUMFERENCE}
            style={{ transition: "stroke-dashoffset 1.2s cubic-bezier(0.4, 0, 0.2, 1)" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-0.5">
          <span className="text-[32px] font-bold leading-[1.2]" style={{ color }}>
            {percentage}%
          </span>
          <span className="text-[12px] text-[#A8A8A8]">신뢰도</span>
        </div>
      </div>

      {/* 상태 배지 */}
      <div className="flex items-center gap-1.5">
        <img src={icon} alt="" width={20} height={20} />
        <span className="text-[18px] font-semibold" style={{ color }}>{status}</span>
      </div>
    </div>
  );
};

export default CircularProgress;
