interface FunnelStage {
  label: string;
  value: string | number;
  raw: number;
}

interface FunnelChartProps {
  stages: FunnelStage[];
}

const FunnelChart = ({ stages }: FunnelChartProps) => {
  const maxRaw = Math.max(...stages.map((s) => s.raw));

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {stages.map((stage, i) => {
        const widthPercent = maxRaw > 0 ? Math.max((stage.raw / maxRaw) * 100, 18) : 18;
        const opacity = 1 - i * 0.07;

        return (
          <div key={i} className="flex items-center gap-3 group">
            {/* Label */}
            <div className="w-[140px] shrink-0 text-right">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground group-hover:text-foreground transition-colors">
                {stage.label}
              </span>
            </div>

            {/* Bar */}
            <div className="flex-1 flex items-center">
              <div
                className="h-8 rounded-md flex items-center justify-center transition-all duration-300 group-hover:scale-[1.02] relative overflow-hidden"
                style={{
                  width: `${widthPercent}%`,
                  background: `linear-gradient(90deg, hsl(var(--primary) / ${opacity}), hsl(var(--primary) / ${opacity * 0.7}))`,
                }}
              >
                <div
                  className="absolute inset-0 opacity-20"
                  style={{
                    background: "linear-gradient(180deg, rgba(255,255,255,0.15) 0%, transparent 100%)",
                  }}
                />
                <span className="text-xs font-bold text-primary-foreground relative z-10 drop-shadow-sm">
                  {stage.value}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default FunnelChart;
