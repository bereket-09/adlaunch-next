interface FunnelStep {
  label: string;
  value: number;
  color?: string;
}

interface FunnelChartProps {
  data: FunnelStep[];
  title?: string;
}

const FunnelChart = ({ data, title }: FunnelChartProps) => {
  const maxValue = Math.max(...data.map(d => d.value));
  
  return (
    <div className="space-y-4">
      {title && <h3 className="font-semibold text-foreground">{title}</h3>}
      <div className="space-y-3">
        {data.map((step, index) => {
          const width = (step.value / maxValue) * 100;
          const conversionRate = index > 0 
            ? ((step.value / data[index - 1].value) * 100).toFixed(1) 
            : "100";
          
          return (
            <div key={step.label} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{step.label}</span>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-foreground">{step.value.toLocaleString()}</span>
                  {index > 0 && (
                    <span className="text-xs text-muted-foreground">({conversionRate}%)</span>
                  )}
                </div>
              </div>
              <div className="relative h-8 bg-secondary/50 rounded overflow-hidden">
                <div 
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary to-orange-500 rounded transition-all duration-500"
                  style={{ width: `${width}%`, opacity: 1 - (index * 0.15) }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FunnelChart;
