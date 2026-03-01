interface GaugeChartProps {
  label: string;
  value: number;
  max?: number;
  isPercentage?: boolean;
}

const GaugeChart = ({ label, value, max = 300, isPercentage = false }: GaugeChartProps) => {
  const percentage = isPercentage ? value / 100 : value / max;
  const startAngle = -225;
  const endAngle = 45;
  const totalAngle = endAngle - startAngle; // 270 degrees
  const currentAngle = startAngle + totalAngle * percentage;

  const radius = 38;
  const cx = 50;
  const cy = 50;

  // Arc path helper
  const polarToCartesian = (angle: number) => {
    const rad = (angle * Math.PI) / 180;
    return { x: cx + radius * Math.cos(rad), y: cy + radius * Math.sin(rad) };
  };

  const describeArc = (start: number, end: number) => {
    const s = polarToCartesian(start);
    const e = polarToCartesian(end);
    const largeArc = end - start > 180 ? 1 : 0;
    return `M ${s.x} ${s.y} A ${radius} ${radius} 0 ${largeArc} 1 ${e.x} ${e.y}`;
  };

  // Needle endpoint
  const needleLen = 30;
  const needleRad = (currentAngle * Math.PI) / 180;
  const needleX = cx + needleLen * Math.cos(needleRad);
  const needleY = cy + needleLen * Math.sin(needleRad);

  // Tick marks
  const ticks = Array.from({ length: 11 }, (_, i) => {
    const angle = startAngle + (totalAngle * i) / 10;
    const rad = (angle * Math.PI) / 180;
    const outerR = 44;
    const innerR = 40;
    return {
      x1: cx + innerR * Math.cos(rad),
      y1: cy + innerR * Math.sin(rad),
      x2: cx + outerR * Math.cos(rad),
      y2: cy + outerR * Math.sin(rad),
    };
  });

  return (
    <div className="flex flex-col items-center gap-0">
      <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-1">
        {label}
      </span>
      <div className="relative w-24 h-20">
        <svg viewBox="0 0 100 75" className="w-full h-full overflow-visible">
          <circle cx={cx} cy={cy} r={radius + 4} fill="none" stroke="hsl(var(--gauge-fill))" strokeWidth="0.5" opacity="0.15" />
          <path d={describeArc(startAngle, endAngle)} fill="none" stroke="hsl(var(--gauge-track))" strokeWidth="6" strokeLinecap="round" />
          <path d={describeArc(startAngle, startAngle + totalAngle * Math.min(percentage, 1))} fill="none" stroke="hsl(var(--gauge-fill))" strokeWidth="6" strokeLinecap="round" filter="url(#glow)" />
          {ticks.map((tick, i) => (
            <line key={i} x1={tick.x1} y1={tick.y1} x2={tick.x2} y2={tick.y2} stroke="hsl(var(--muted-foreground))" strokeWidth={i % 5 === 0 ? "1" : "0.5"} opacity={i % 5 === 0 ? 0.7 : 0.3} />
          ))}
          <circle cx={cx} cy={cy} r="4" fill="hsl(var(--gauge-fill))" />
          <circle cx={cx} cy={cy} r="2.5" fill="hsl(var(--background))" />
          <line x1={cx} y1={cy} x2={needleX} y2={needleY} stroke="hsl(var(--gauge-fill))" strokeWidth="2" strokeLinecap="round" className="origin-center" style={{ filter: "drop-shadow(0 0 3px hsl(170 80% 45% / 0.5))" }} />
          <defs>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>
        </svg>
      </div>
      <span className="text-xl font-bold font-display text-primary -mt-3">
        {isPercentage ? `${value}%` : value}
      </span>
    </div>
  );
};

export default GaugeChart;
