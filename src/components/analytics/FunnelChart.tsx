interface FunnelStep {
  label: string;
  value: number;
}

interface FunnelChartProps {
  data: FunnelStep[];
  title?: string;
}

const STEP_COLORS = [
  { bar: 'linear-gradient(90deg, hsl(24,100%,50%), hsl(34,100%,55%))', badge: 'bg-orange-50 text-orange-600 border-orange-200' },
  { bar: 'linear-gradient(90deg, hsl(24,100%,58%), hsl(34,100%,62%))', badge: 'bg-amber-50 text-amber-600 border-amber-200' },
  { bar: 'linear-gradient(90deg, hsl(24,100%,66%), hsl(34,100%,70%))', badge: 'bg-yellow-50 text-yellow-600 border-yellow-200' },
  { bar: 'linear-gradient(90deg, hsl(24,100%,74%), hsl(34,100%,78%))', badge: 'bg-orange-50/50 text-orange-400 border-orange-100' },
];

const FunnelChart = ({ data, title }: FunnelChartProps) => {
  const maxValue = data.length > 0 ? Math.max(...data.map(d => d.value), 1) : 1;

  return (
    <div className="space-y-5">
      {title && <h3 className="font-semibold text-foreground text-sm">{title}</h3>}
      <div className="space-y-3">
        {data.map((step, index) => {
          const width = maxValue > 0 ? (step.value / maxValue) * 100 : 0;
          const conversionRate = index > 0 && data[index - 1].value > 0
            ? ((step.value / data[index - 1].value) * 100).toFixed(1)
            : "100";
          const colors = STEP_COLORS[index % STEP_COLORS.length];

          return (
            <div key={step.label}>
              <div className="flex justify-between items-center mb-1.5">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-black text-white"
                       style={{ background: colors.bar }}>
                    {index + 1}
                  </div>
                  <span className="text-sm font-semibold text-foreground">{step.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-foreground tabular-nums">{step.value.toLocaleString()}</span>
                  {index > 0 && (
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${colors.badge}`}>
                      ↓ {conversionRate}%
                    </span>
                  )}
                </div>
              </div>
              <div className="h-3 bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700 ease-out"
                  style={{ width: `${width}%`, background: colors.bar }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary */}
      {data.length >= 2 && data[0].value > 0 && (
        <div className="pt-3 border-t border-border/50 flex items-center justify-between">
          <span className="text-xs text-muted-foreground font-medium">Overall conversion</span>
          <span className="text-sm font-black text-primary">
            {((data[data.length - 1].value / data[0].value) * 100).toFixed(1)}%
          </span>
        </div>
      )}
    </div>
  );
};

export default FunnelChart;
