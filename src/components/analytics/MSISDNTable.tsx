import { useState } from "react";
import { Eye, CheckCircle2, XCircle, Clock, ChevronDown, ChevronUp, Star } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import ExportButton from "./ExportButton";
import AnalyticsFilters from "./AnalyticsFilters";

interface MSISDNRecord {
  id: string;
  msisdn: string;
  timestamp: string;
  campaign: string;
  completionRate: number;
  rewardStatus: 'success' | 'failed' | 'pending' | 'retry';
  adsWatched: number;
  deviceType: string;
  isHighValue: boolean;
}

const mockData: MSISDNRecord[] = [
  { id: '1', msisdn: '+234801****234', timestamp: '2024-01-15 14:32:05', campaign: 'Summer Promo', completionRate: 100, rewardStatus: 'success', adsWatched: 12, deviceType: 'Mobile', isHighValue: true },
  { id: '2', msisdn: '+234802****567', timestamp: '2024-01-15 14:28:12', campaign: 'Data Bundle', completionRate: 100, rewardStatus: 'success', adsWatched: 8, deviceType: 'Mobile', isHighValue: true },
  { id: '3', msisdn: '+234803****890', timestamp: '2024-01-15 14:25:33', campaign: 'Summer Promo', completionRate: 78, rewardStatus: 'failed', adsWatched: 3, deviceType: 'Tablet', isHighValue: false },
  { id: '4', msisdn: '+234804****123', timestamp: '2024-01-15 14:22:44', campaign: 'Voice Pack', completionRate: 100, rewardStatus: 'pending', adsWatched: 5, deviceType: 'Mobile', isHighValue: false },
  { id: '5', msisdn: '+234805****456', timestamp: '2024-01-15 14:18:55', campaign: 'Data Bundle', completionRate: 45, rewardStatus: 'retry', adsWatched: 2, deviceType: 'Desktop', isHighValue: false },
  { id: '6', msisdn: '+234806****789', timestamp: '2024-01-15 14:15:22', campaign: 'Summer Promo', completionRate: 100, rewardStatus: 'success', adsWatched: 15, deviceType: 'Mobile', isHighValue: true },
  { id: '7', msisdn: '+234807****012', timestamp: '2024-01-15 14:12:33', campaign: 'Voice Pack', completionRate: 92, rewardStatus: 'success', adsWatched: 7, deviceType: 'Mobile', isHighValue: false },
  { id: '8', msisdn: '+234808****345', timestamp: '2024-01-15 14:08:44', campaign: 'Data Bundle', completionRate: 100, rewardStatus: 'success', adsWatched: 20, deviceType: 'Mobile', isHighValue: true },
];

const MSISDNTable = () => {
  const [sortField, setSortField] = useState<keyof MSISDNRecord>('timestamp');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [data] = useState(mockData);

  const handleSort = (field: keyof MSISDNRecord) => {
    if (sortField === field) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDir('desc');
    }
  };

  const SortIcon = ({ field }: { field: keyof MSISDNRecord }) => {
    if (sortField !== field) return null;
    return sortDir === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />;
  };

  const getStatusBadge = (status: MSISDNRecord['rewardStatus']) => {
    const config = {
      success: { icon: CheckCircle2, label: 'Success', className: 'bg-green-100 text-green-700 border-green-200' },
      failed: { icon: XCircle, label: 'Failed', className: 'bg-red-100 text-red-700 border-red-200' },
      pending: { icon: Clock, label: 'Pending', className: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
      retry: { icon: Clock, label: 'Retry', className: 'bg-orange-100 text-primary border-orange-200' },
    };
    const { icon: Icon, label, className } = config[status];
    return (
      <Badge variant="outline" className={className}>
        <Icon className="h-3 w-3 mr-1" />
        {label}
      </Badge>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <AnalyticsFilters 
          config={{ msisdn: true, campaign: true, status: true, dateRange: true, deviceType: true, completionRate: true }}
        />
        <ExportButton filename="msisdn-report" />
      </div>

      <div className="rounded-lg border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-secondary/50">
              <TableHead className="cursor-pointer hover:text-primary" onClick={() => handleSort('msisdn')}>
                <div className="flex items-center gap-1">MSISDN <SortIcon field="msisdn" /></div>
              </TableHead>
              <TableHead className="cursor-pointer hover:text-primary" onClick={() => handleSort('timestamp')}>
                <div className="flex items-center gap-1">Timestamp <SortIcon field="timestamp" /></div>
              </TableHead>
              <TableHead>Campaign</TableHead>
              <TableHead className="cursor-pointer hover:text-primary" onClick={() => handleSort('completionRate')}>
                <div className="flex items-center gap-1">Completion <SortIcon field="completionRate" /></div>
              </TableHead>
              <TableHead>Reward Status</TableHead>
              <TableHead className="cursor-pointer hover:text-primary" onClick={() => handleSort('adsWatched')}>
                <div className="flex items-center gap-1">Ads Watched <SortIcon field="adsWatched" /></div>
              </TableHead>
              <TableHead>Device</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((record) => (
              <TableRow key={record.id} className="hover:bg-secondary/30">
                <TableCell className="font-mono">
                  <div className="flex items-center gap-2">
                    {record.msisdn}
                    {record.isHighValue && (
                      <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">{record.timestamp}</TableCell>
                <TableCell>{record.campaign}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-2 bg-secondary rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${record.completionRate === 100 ? 'bg-green-500' : 'bg-primary'}`}
                        style={{ width: `${record.completionRate}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium">{record.completionRate}%</span>
                  </div>
                </TableCell>
                <TableCell>{getStatusBadge(record.rewardStatus)}</TableCell>
                <TableCell className="font-medium">{record.adsWatched}</TableCell>
                <TableCell className="text-muted-foreground">{record.deviceType}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>Showing 1-8 of 1,234 records</span>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" disabled>Previous</Button>
          <Button variant="outline" size="sm">Next</Button>
        </div>
      </div>
    </div>
  );
};

export default MSISDNTable;
