interface FunnelStage {
  label: string;
  value: string | number;
  raw: number;
}

interface FunnelChartProps {
  stages: FunnelStage[];
}

const FUNNEL_COLORS = [
  "hsl(0, 75%, 50%)",      // red
  "hsl(20, 90%, 55%)",     // orange-red
  "hsl(30, 95%, 55%)",     // orange
  "hsl(40, 95%, 55%)",     // amber
  "hsl(50, 95%, 50%)",     // yellow
  "hsl(80, 65%, 45%)",     // yellow-green
  "hsl(140, 60%, 42%)",    // green
  "hsl(170, 60%, 42%)",    // teal
  "hsl(195, 80%, 50%)",    // cyan
  "hsl(210, 80%, 55%)",    // blue
];

const FunnelChart = ({ stages }: FunnelChartProps) => {
  const totalStages = stages.length;
  const svgWidth = 320;
  const svgHeight = 380;
  const topWidth = 280;
  const bottomWidth = 60;
  const stageGap = 3;
  const totalGap = stageGap * (totalStages - 1);
  const usableHeight = svgHeight - totalGap;
  const stageHeight = usableHeight / totalStages;

  const getStageWidth = (index: number) => {
    const t = index / (totalStages - 1);
    return topWidth - t * (topWidth - bottomWidth);
  };

  return (
    <div className="flex flex-col items-center w-full">
      <svg
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        className="w-full max-w-[280px]"
        preserveAspectRatio="xMidYMid meet"
      >
        {stages.map((stage, i) => {
          const y = i * (stageHeight + stageGap);
          const wTop = getStageWidth(i);
          const wBottom = getStageWidth(i + 1 < totalStages ? i + 1 : i);
          const actualBottom = i === totalStages - 1 ? wBottom * 0.6 : wBottom;
          const cx = svgWidth / 2;

          // Trapezoid with slight ribbon/notch effect
          const notch = 4;
          const points = [
            `${cx - wTop / 2},${y}`,
            `${cx + wTop / 2},${y}`,
            `${cx + actualBottom / 2},${y + stageHeight}`,
            `${cx - actualBottom / 2},${y + stageHeight}`,
          ].join(" ");

          const color = FUNNEL_COLORS[i % FUNNEL_COLORS.length];

          return (
            <g key={i}>
              <polygon
                points={points}
                fill={color}
                stroke="hsl(var(--background))"
                strokeWidth="1"
                className="transition-opacity hover:opacity-80"
              />
              {/* Highlight stripe on top */}
              <line
                x1={cx - wTop / 2 + 8}
                y1={y + 2}
                x2={cx + wTop / 2 - 8}
                y2={y + 2}
                stroke="rgba(255,255,255,0.25)"
                strokeWidth="2"
                strokeLinecap="round"
              />
              {/* Label */}
              <text
                x={cx}
                y={y + stageHeight / 2 + 1}
                textAnchor="middle"
                dominantBaseline="middle"
                className="fill-white font-bold"
                style={{ fontSize: wTop > 120 ? "9px" : "7px", textShadow: "0 1px 2px rgba(0,0,0,0.4)" }}
              >
                {stage.label}: {stage.value}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

export default FunnelChart;
