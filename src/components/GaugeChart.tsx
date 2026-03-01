interface GaugeChartProps {
  label: string;
  value: number;
  max?: number;
  isPercentage?: boolean;
}

const GaugeChart = ({ label, value, max = 300, isPercentage = false }: GaugeChartProps) => {
  const radius = 40;
  const circumference = Math.PI * radius; // semi-circle
  const percentage = isPercentage ? value / 100 : value / max;
  const offset = circumference * (1 - percentage);

  return (
    <div className="flex flex-col items-center gap-1">
      <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        {label}
      </span>
      <div className="relative w-28 h-16">
        <svg viewBox="0 0 100 55" className="w-full h-full">
          {/* Track */}
          <path
            d="M 10 50 A 40 40 0 0 1 90 50"
            fill="none"
            stroke="hsl(var(--gauge-track))"
            strokeWidth="8"
            strokeLinecap="round"
          />
          {/* Fill */}
          <path
            d="M 10 50 A 40 40 0 0 1 90 50"
            fill="none"
            stroke="hsl(var(--gauge-fill))"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={`${circumference}`}
            strokeDashoffset={offset}
            className="transition-all duration-1000 ease-out"
            style={{
              animation: 'gauge-fill 1.5s ease-out forwards',
            }}
          />
        </svg>
      </div>
      <span className="text-2xl font-bold font-display text-primary -mt-2">
        {isPercentage ? `${value}%` : value}
      </span>
    </div>
  );
};

export default GaugeChart;
