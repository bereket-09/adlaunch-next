"use client";

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
  accent?: boolean;
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
  size = 'md',
  accent = false
}: KPICardProps) => {
  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;

  const sizeClasses = { sm: 'p-4', md: 'p-5', lg: 'p-6' };
  const valueSizes = { sm: 'text-xl', md: 'text-2xl', lg: 'text-3xl' };
  const iconSizes = { sm: 'h-4 w-4', md: 'h-5 w-5', lg: 'h-6 w-6' };
  const iconWrapSizes = { sm: 'w-9 h-9', md: 'w-10 h-10', lg: 'w-12 h-12' };

  if (accent) {
    return (
      <div className={cn("card-orange relative overflow-hidden", sizeClasses[size], className)}>
        {/* Decorative circles */}
        <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-white/10" />
        <div className="absolute -bottom-4 -left-4 w-16 h-16 rounded-full bg-white/10" />
        <div className="relative z-10">
          <div className="flex items-start justify-between mb-3">
            <div className={cn("rounded-xl bg-white/20 flex items-center justify-center", iconWrapSizes[size])}>
              <Icon className={cn("text-white", iconSizes[size])} />
            </div>
            {(change !== undefined) && (
              <div className="flex items-center gap-1 bg-white/20 rounded-full px-2 py-0.5">
                <TrendIcon className="h-3 w-3 text-white" />
                <span className="text-[10px] font-bold text-white">
                  {change > 0 ? '+' : ''}{change}%
                </span>
              </div>
            )}
          </div>
          <p className={cn("font-bold text-white leading-none mb-1", valueSizes[size])}>
            {prefix}{typeof value === 'number' ? value.toLocaleString() : value}{suffix}
          </p>
          <p className="text-xs font-semibold text-white/70 uppercase tracking-wider">{title}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("card-elevated relative overflow-hidden group", sizeClasses[size], className)}>
      {/* Subtle gradient bg on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" 
           style={{ background: 'linear-gradient(135deg, hsl(24 100% 50% / 0.03), hsl(34 100% 55% / 0.03))' }} />
      
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-3">
          <div className={cn(
            "rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110",
            iconWrapSizes[size],
            "bg-primary/10"
          )}>
            <Icon className={cn("text-primary", iconSizes[size])} />
          </div>
          {(change !== undefined) && (
            <div className={cn(
              "flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold",
              trend === 'up' && "bg-green-50 text-green-600 border border-green-100",
              trend === 'down' && "bg-red-50 text-red-500 border border-red-100",
              trend === 'neutral' && "bg-secondary text-muted-foreground border border-border/50"
            )}>
              <TrendIcon className="h-3 w-3" />
              {change > 0 ? '+' : ''}{change}%
            </div>
          )}
        </div>

        <p className={cn("font-bold text-foreground leading-none mb-1.5 tracking-tight", valueSizes[size])}>
          {prefix}{typeof value === 'number' ? value.toLocaleString() : value}{suffix}
        </p>
        <p className="text-xs font-semibold text-muted-foreground">{title}</p>

        {changeLabel && (
          <p className="text-xs text-muted-foreground mt-1.5 opacity-70">{changeLabel}</p>
        )}
      </div>
    </div>
  );
};

export default KPICard;
