import { useState } from "react";
import { Calendar, Filter, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

interface FilterConfig {
  msisdn?: boolean;
  campaign?: boolean;
  status?: boolean;
  dateRange?: boolean;
  deviceType?: boolean;
  completionRate?: boolean;
  rewardType?: boolean;
  region?: boolean;
}

interface AnalyticsFiltersProps {
  config?: FilterConfig;
  onFiltersChange?: (filters: Record<string, any>) => void;
}

const AnalyticsFilters = ({ 
  config = { msisdn: true, campaign: true, status: true, dateRange: true },
  onFiltersChange 
}: AnalyticsFiltersProps) => {
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [dateFrom, setDateFrom] = useState<Date>();
  const [dateTo, setDateTo] = useState<Date>();
  const [showFilters, setShowFilters] = useState(false);

  const updateFilter = (key: string, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange?.(newFilters);
  };

  const clearFilters = () => {
    setFilters({});
    setDateFrom(undefined);
    setDateTo(undefined);
    onFiltersChange?.({});
  };

  const activeFilterCount = Object.keys(filters).filter(k => filters[k]).length;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        {config.msisdn && (
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search MSISDN..." 
              className="pl-9 w-[200px]"
              onChange={(e) => updateFilter('msisdn', e.target.value)}
            />
          </div>
        )}

        {config.campaign && (
          <Select onValueChange={(val) => updateFilter('campaign', val)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Campaigns" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Campaigns</SelectItem>
              <SelectItem value="summer-promo">Summer Promo 2024</SelectItem>
              <SelectItem value="data-bundle">Data Bundle Offer</SelectItem>
              <SelectItem value="voice-pack">Voice Pack Deal</SelectItem>
            </SelectContent>
          </Select>
        )}

        {config.status && (
          <Select onValueChange={(val) => updateFilter('status', val)}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="partial">Partial View</SelectItem>
              <SelectItem value="abandoned">Abandoned</SelectItem>
            </SelectContent>
          </Select>
        )}

        {config.dateRange && (
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Calendar className="h-4 w-4" />
                {dateFrom && dateTo 
                  ? `${format(dateFrom, 'MMM d')} - ${format(dateTo, 'MMM d')}`
                  : "Date Range"
                }
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarComponent
                mode="range"
                selected={{ from: dateFrom, to: dateTo }}
                onSelect={(range) => {
                  setDateFrom(range?.from);
                  setDateTo(range?.to);
                  updateFilter('dateRange', range);
                }}
              />
            </PopoverContent>
          </Popover>
        )}

        <Button 
          variant="outline" 
          className="gap-2"
          onClick={() => setShowFilters(!showFilters)}
        >
          <Filter className="h-4 w-4" />
          More Filters
          {activeFilterCount > 0 && (
            <Badge variant="secondary" className="ml-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
              {activeFilterCount}
            </Badge>
          )}
        </Button>

        {activeFilterCount > 0 && (
          <Button variant="ghost" size="sm" onClick={clearFilters} className="text-muted-foreground">
            <X className="h-4 w-4 mr-1" />
            Clear
          </Button>
        )}
      </div>

      {showFilters && (
        <div className="flex flex-wrap gap-3 p-4 bg-secondary/30 rounded-lg border border-border/50 animate-fade-in">
          {config.deviceType && (
            <Select onValueChange={(val) => updateFilter('deviceType', val)}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Device Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Devices</SelectItem>
                <SelectItem value="mobile">Mobile</SelectItem>
                <SelectItem value="tablet">Tablet</SelectItem>
                <SelectItem value="desktop">Desktop</SelectItem>
              </SelectContent>
            </Select>
          )}

          {config.completionRate && (
            <Select onValueChange={(val) => updateFilter('completionRate', val)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Completion %" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Rates</SelectItem>
                <SelectItem value="100">100% Complete</SelectItem>
                <SelectItem value="75-99">75% - 99%</SelectItem>
                <SelectItem value="50-74">50% - 74%</SelectItem>
                <SelectItem value="below-50">Below 50%</SelectItem>
              </SelectContent>
            </Select>
          )}

          {config.rewardType && (
            <Select onValueChange={(val) => updateFilter('rewardType', val)}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Reward Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Rewards</SelectItem>
                <SelectItem value="data">Data Bundle</SelectItem>
                <SelectItem value="voice">Voice Minutes</SelectItem>
                <SelectItem value="sms">SMS Bundle</SelectItem>
              </SelectContent>
            </Select>
          )}

          {config.region && (
            <Select onValueChange={(val) => updateFilter('region', val)}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Region" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Regions</SelectItem>
                <SelectItem value="north">North</SelectItem>
                <SelectItem value="south">South</SelectItem>
                <SelectItem value="east">East</SelectItem>
                <SelectItem value="west">West</SelectItem>
              </SelectContent>
            </Select>
          )}
        </div>
      )}
    </div>
  );
};

export default AnalyticsFilters;
