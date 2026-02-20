"use client";

import { useState } from "react";
import { Calendar, Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

interface CampaignFilterConfig {
  campaign?: boolean;
  marketer?: boolean;
  status?: boolean;
  dateRange?: boolean;
}

interface CampaignFiltersProps {
  config?: CampaignFilterConfig;
  campaigns?: any[];
  marketers?: any[];
  onFiltersChange?: (filters: Record<string, any>) => void;
  sortBy?: string;
  onSortChange?: (value: string) => void;
}

const CampaignFilters = ({
  config = { campaign: true, marketer: true, status: true, dateRange: true },
  campaigns = [],
  marketers = [],
  onFiltersChange,
  sortBy = "created_desc",
  onSortChange,
}: CampaignFiltersProps) => {
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

  const activeFilterCount = Object.keys(filters).filter(
    (k) => filters[k]
  ).length;

  return (
    <div className="flex flex-wrap items-center gap-3 w-full">
      {/* ---------------- MAIN FILTERS ---------------- */}
      {config.campaign && (
        <Select onValueChange={(val) => updateFilter("campaign", val)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All Campaigns" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Campaigns</SelectItem>
            {campaigns.map((c) => (
              <SelectItem key={c._id} value={c._id}>
                {c.campaign_name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {config.marketer && (
        <Select onValueChange={(val) => updateFilter("marketer", val)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All Marketers" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Marketers</SelectItem>
            {marketers.map((m) => (
              <SelectItem key={m._id} value={m._id}>
                {m.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {config.status && (
        <Select onValueChange={(val) => updateFilter("status", val)}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="paused">Paused</SelectItem>
            <SelectItem value="pending_approval">Pending</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
          </SelectContent>
        </Select>
      )}

      {config.dateRange && (
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Calendar className="h-4 w-4" />
              {dateFrom && dateTo
                ? `${format(dateFrom, "MMM d")} - ${format(dateTo, "MMM d")}`
                : "Date Range"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <CalendarComponent
              mode="range"
              selected={{ from: dateFrom, to: dateTo }}
              onSelect={(range) => {
                setDateFrom(range?.from);
                setDateTo(range?.to);
                updateFilter("dateRange", range);
              }}
            />
          </PopoverContent>
        </Popover>
      )}

      {/* ---------------- MORE FILTERS BUTTON ---------------- */}
      <Button
        variant="outline"
        className="gap-2"
        onClick={() => setShowFilters(!showFilters)}
      >
        <Filter className="h-4 w-4" />
        More Filters
        {activeFilterCount > 0 && (
          <Badge
            variant="secondary"
            className="ml-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
          >
            {activeFilterCount}
          </Badge>
        )}
      </Button>

      {activeFilterCount > 0 && (
        <Button
          variant="ghost"
          size="sm"
          onClick={clearFilters}
          className="text-muted-foreground"
        >
          <X className="h-4 w-4 mr-1" />
          Clear
        </Button>
      )}

      {/* ---------------- ADDITIONAL FILTERS AREA ---------------- */}
      {showFilters && (
        <div className="flex flex-wrap gap-3 p-4 bg-secondary/30 rounded-lg border border-border/50 animate-fade-in">
          {/* You can add more optional filters here */}
          {/* ---------------- SORTING ---------------- */}
          <Select value={sortBy} onValueChange={(val) => onSortChange?.(val)}>
            <SelectTrigger>
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="created_desc">Newest First</SelectItem>
              <SelectItem value="created_asc">Oldest First</SelectItem>
              <SelectItem value="budget_desc">Budget High → Low</SelectItem>
              <SelectItem value="budget_asc">Budget Low → High</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
};

export default CampaignFilters;
