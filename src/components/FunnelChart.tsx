interface FunnelStage {
  label: string;
  value: string | number;
  raw: number;
}

interface FunnelChartProps {
  stages: FunnelStage[];
}

const FUNNEL_COLORS = [
  "hsl(0, 75%, 50%)",
  "hsl(20, 90%, 55%)",
  "hsl(30, 95%, 55%)",
  "hsl(40, 95%, 55%)",
  "hsl(50, 95%, 50%)",
  "hsl(80, 65%, 45%)",
  "hsl(140, 60%, 42%)",
  "hsl(170, 60%, 42%)",
  "hsl(195, 80%, 50%)",
  "hsl(210, 80%, 55%)",
];

const FunnelChart = ({ stages }: FunnelChartProps) => {
  const totalStages = stages.length;
  const funnelWidth = 260;
  const labelAreaWidth = 160;
  const svgWidth = funnelWidth + labelAreaWidth + 20;
  const svgHeight = 420;
  const topWidth = 240;
  const bottomWidth = 50;
  const stageGap = 3;
  const totalGap = stageGap * (totalStages - 1);
  const usableHeight = svgHeight - totalGap;
  const stageHeight = usableHeight / totalStages;
  const funnelCx = labelAreaWidth + funnelWidth / 2;

  const getStageWidth = (index: number) => {
    const t = index / (totalStages - 1);
    return topWidth - t * (topWidth - bottomWidth);
  };

  return (
    <div className="w-full flex justify-center">
      <svg
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        className="w-full max-w-[400px]"
        preserveAspectRatio="xMidYMid meet"
      >
        {stages.map((stage, i) => {
          const y = i * (stageHeight + stageGap);
          const wTop = getStageWidth(i);
          const wBottom = i === totalStages - 1 ? getStageWidth(i) * 0.6 : getStageWidth(i + 1);
          const color = FUNNEL_COLORS[i % FUNNEL_COLORS.length];

          const points = [
            `${funnelCx - wTop / 2},${y}`,
            `${funnelCx + wTop / 2},${y}`,
            `${funnelCx + wBottom / 2},${y + stageHeight}`,
            `${funnelCx - wBottom / 2},${y + stageHeight}`,
          ].join(" ");

          const labelY = y + stageHeight / 2;
          const leftEdge = funnelCx - wTop / 2;

          return (
            <g key={i}>
              <polygon
                points={points}
                fill={color}
                stroke="hsl(var(--background))"
                strokeWidth="1"
                className="transition-opacity hover:opacity-80"
              />
              <line
                x1={funnelCx - wTop / 2 + 6}
                y1={y + 2}
                x2={funnelCx + wTop / 2 - 6}
                y2={y + 2}
                stroke="rgba(255,255,255,0.2)"
                strokeWidth="2"
                strokeLinecap="round"
              />
              {/* Value inside funnel */}
              <text
                x={funnelCx}
                y={labelY + 1}
                textAnchor="middle"
                dominantBaseline="middle"
                fill="white"
                fontWeight="bold"
                style={{ fontSize: "12px", textShadow: "0 1px 3px rgba(0,0,0,0.5)" }}
              >
                {stage.value}
              </text>
              {/* Label outside (left) with connector line */}
              <line
                x1={leftEdge - 4}
                y1={labelY}
                x2={labelAreaWidth - 4}
                y2={labelY}
                stroke="hsl(var(--muted-foreground))"
                strokeWidth="0.5"
                opacity="0.4"
                strokeDasharray="2,2"
              />
              <text
                x={labelAreaWidth - 8}
                y={labelY + 1}
                textAnchor="end"
                dominantBaseline="middle"
                fill="hsl(var(--foreground))"
                fontWeight="600"
                style={{ fontSize: "10px" }}
              >
                {stage.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

export default FunnelChart;
