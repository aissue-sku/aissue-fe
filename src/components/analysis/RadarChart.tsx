interface RadarChartData {
  label: string;
  score: number;
  maxScore: number;
}

interface Props {
  data: RadarChartData[];
  size?: number;
}

const GRID_LEVELS = [0.25, 0.5, 0.75, 1];

const RadarChart = ({ data, size = 260 }: Props) => {
  const n = data.length;
  if (n < 3) return null;

  const center = size / 2;
  const padding = 42;
  const radius = center - padding;

  const angleFor = (i: number) => -Math.PI / 2 + (i * 2 * Math.PI) / n;

  const pointAt = (i: number, fraction: number) => {
    const angle = angleFor(i);
    const r = radius * fraction;
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle),
    };
  };

  const polygonPoints = (fraction: number) =>
    Array.from({ length: n }, (_, i) => {
      const p = pointAt(i, fraction);
      return `${p.x},${p.y}`;
    }).join(" ");

  const dataPoints = data
    .map((d, i) => {
      const ratio = Math.max(0, Math.min(d.score / d.maxScore, 1));
      const p = pointAt(i, ratio);
      return `${p.x},${p.y}`;
    })
    .join(" ");

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {GRID_LEVELS.map((level) => (
        <polygon
          key={level}
          points={polygonPoints(level)}
          fill={level === 1 ? "#FAFAFA" : "none"}
          stroke="#E5E5E5"
          strokeWidth={1}
        />
      ))}

      {Array.from({ length: n }, (_, i) => {
        const p = pointAt(i, 1);
        return (
          <line
            key={i}
            x1={center}
            y1={center}
            x2={p.x}
            y2={p.y}
            stroke="#E5E5E5"
            strokeWidth={1}
          />
        );
      })}

      <polygon
        points={dataPoints}
        fill="var(--color-primary)"
        fillOpacity={0.22}
        stroke="var(--color-primary)"
        strokeWidth={2}
        strokeLinejoin="round"
      />

      {data.map((d, i) => {
        const ratio = Math.max(0, Math.min(d.score / d.maxScore, 1));
        const p = pointAt(i, ratio);
        return (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r={3.5}
            fill="var(--color-primary)"
          />
        );
      })}

      {data.map((d, i) => {
        const angle = angleFor(i);
        const labelRadius = radius + 18;
        const x = center + labelRadius * Math.cos(angle);
        const y = center + labelRadius * Math.sin(angle);
        let anchor: "start" | "middle" | "end" = "middle";
        if (x < center - 4) anchor = "end";
        else if (x > center + 4) anchor = "start";
        return (
          <text
            key={i}
            x={x}
            y={y}
            textAnchor={anchor}
            dominantBaseline="middle"
            fontSize="11"
            fontWeight="600"
            fill="#666"
          >
            {d.label}
          </text>
        );
      })}
    </svg>
  );
};

export default RadarChart;
