import { LucideIcon, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface KPICardProps {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon: LucideIcon;
  trend?: 'up' | 'down' | 'neutral';
  prefix?: string;
  suffix?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const KPICard = ({
  title,
  value,
  change,
  changeLabel,
  icon: Icon,
  trend = 'neutral',
  prefix = '',
  suffix = '',
  className,
  size = 'md'
}: KPICardProps) => {
  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;
  
  const sizeClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };
  
  const valueSizes = {
    sm: 'text-xl',
    md: 'text-2xl lg:text-3xl',
    lg: 'text-3xl lg:text-4xl'
  };

  return (
    <div className={cn(
      "card-elevated",
      sizeClasses[size],
      className
    )}>
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground font-medium">{title}</p>
          <p className={cn("font-bold text-foreground", valueSizes[size])}>
            {prefix}{typeof value === 'number' ? value.toLocaleString() : value}{suffix}
          </p>
          {(change !== undefined || changeLabel) && (
            <div className="flex items-center gap-1.5">
              <TrendIcon className={cn(
                "h-4 w-4",
                trend === 'up' && "text-green-500",
                trend === 'down' && "text-red-500",
                trend === 'neutral' && "text-muted-foreground"
              )} />
              <span className={cn(
                "text-sm font-medium",
                trend === 'up' && "text-green-500",
                trend === 'down' && "text-red-500",
                trend === 'neutral' && "text-muted-foreground"
              )}>
                {change !== undefined && `${change > 0 ? '+' : ''}${change}%`}
                {changeLabel && ` ${changeLabel}`}
              </span>
            </div>
          )}
        </div>
        <div className="p-3 rounded-xl bg-primary/10">
          <Icon className="h-6 w-6 text-primary" />
        </div>
      </div>
    </div>
  );
};

export default KPICard;
