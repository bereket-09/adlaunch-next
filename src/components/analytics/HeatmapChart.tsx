interface HeatmapData {
  day: string;
  hour: number;
  value: number;
}

interface HeatmapChartProps {
  data: HeatmapData[];
  title?: string;
}

const HeatmapChart = ({ data, title }: HeatmapChartProps) => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const hours = Array.from({ length: 24 }, (_, i) => i);
  
  const maxValue = Math.max(...data.map(d => d.value));
  
  const getValue = (day: string, hour: number) => {
    const item = data.find(d => d.day === day && d.hour === hour);
    return item?.value || 0;
  };
  
  const getColor = (value: number) => {
    const intensity = value / maxValue;
    if (intensity < 0.2) return 'bg-orange-100';
    if (intensity < 0.4) return 'bg-orange-200';
    if (intensity < 0.6) return 'bg-orange-300';
    if (intensity < 0.8) return 'bg-orange-400';
    return 'bg-primary';
  };

  return (
    <div className="space-y-4">
      {title && <h3 className="font-semibold text-foreground">{title}</h3>}
      <div className="overflow-x-auto">
        <div className="min-w-[600px]">
          {/* Hour labels */}
          <div className="flex gap-1 mb-2 pl-12">
            {hours.filter((_, i) => i % 3 === 0).map(hour => (
              <div key={hour} className="text-xs text-muted-foreground w-[36px] text-center">
                {hour.toString().padStart(2, '0')}:00
              </div>
            ))}
          </div>
          
          {/* Heatmap grid */}
          <div className="space-y-1">
            {days.map(day => (
              <div key={day} className="flex items-center gap-1">
                <span className="text-xs text-muted-foreground w-10">{day}</span>
                <div className="flex gap-0.5">
                  {hours.map(hour => {
                    const value = getValue(day, hour);
                    return (
                      <div
                        key={hour}
                        className={`w-3 h-6 rounded-sm ${getColor(value)} transition-colors hover:ring-2 hover:ring-primary/50 cursor-pointer`}
                        title={`${day} ${hour}:00 - ${value.toLocaleString()} views`}
                      />
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
          
          {/* Legend */}
          <div className="flex items-center gap-2 mt-4 pl-12">
            <span className="text-xs text-muted-foreground">Less</span>
            <div className="flex gap-0.5">
              <div className="w-3 h-3 rounded-sm bg-orange-100" />
              <div className="w-3 h-3 rounded-sm bg-orange-200" />
              <div className="w-3 h-3 rounded-sm bg-orange-300" />
              <div className="w-3 h-3 rounded-sm bg-orange-400" />
              <div className="w-3 h-3 rounded-sm bg-primary" />
            </div>
            <span className="text-xs text-muted-foreground">More</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeatmapChart;
