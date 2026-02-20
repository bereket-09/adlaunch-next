import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ScatterChart, Scatter, ZAxis } from "recharts";
import { useState } from "react";

const campaignData = [
  { name: 'Summer Promo', cpc: 0.15, completions: 45000, spend: 6750, roi: 234 },
  { name: 'Data Bundle', cpc: 0.12, completions: 38000, spend: 4560, roi: 189 },
  { name: 'Voice Pack', cpc: 0.18, completions: 29000, spend: 5220, roi: 156 },
  { name: 'Holiday Special', cpc: 0.20, completions: 52000, spend: 10400, roi: 312 },
];

const scatterData = [
  { x: 45000, y: 6750, z: 234, name: 'Summer Promo' },
  { x: 38000, y: 4560, z: 189, name: 'Data Bundle' },
  { x: 29000, y: 5220, z: 156, name: 'Voice Pack' },
  { x: 52000, y: 10400, z: 312, name: 'Holiday Special' },
];

const CampaignComparison = () => {
  const [metric, setMetric] = useState<'cpc' | 'roi'>('cpc');

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="card-elevated">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-semibold">CPC Effectiveness Comparison</CardTitle>
          <Select value={metric} onValueChange={(v) => setMetric(v as 'cpc' | 'roi')}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cpc">CPC Rate</SelectItem>
              <SelectItem value="roi">ROI %</SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={campaignData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis dataKey="name" type="category" width={100} stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Bar 
                  dataKey={metric} 
                  fill="hsl(var(--primary))" 
                  radius={[0, 4, 4, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card className="card-elevated">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Spend vs Completions Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  type="number" 
                  dataKey="x" 
                  name="Completions" 
                  stroke="hsl(var(--muted-foreground))" 
                  fontSize={12}
                  tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
                />
                <YAxis 
                  type="number" 
                  dataKey="y" 
                  name="Spend" 
                  stroke="hsl(var(--muted-foreground))" 
                  fontSize={12}
                  tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                />
                <ZAxis type="number" dataKey="z" range={[100, 500]} name="ROI" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                  formatter={(value, name) => {
                    if (name === 'Completions') return value.toLocaleString();
                    if (name === 'Spend') return `$${value.toLocaleString()}`;
                    return `${value}%`;
                  }}
                />
                <Legend />
                <Scatter 
                  name="Campaigns" 
                  data={scatterData} 
                  fill="hsl(var(--primary))"
                />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card className="card-elevated lg:col-span-2">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Campaign Performance Matrix</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Campaign</th>
                  <th className="text-right py-3 px-4 font-semibold text-muted-foreground">CPC Rate</th>
                  <th className="text-right py-3 px-4 font-semibold text-muted-foreground">Completions</th>
                  <th className="text-right py-3 px-4 font-semibold text-muted-foreground">Total Spend</th>
                  <th className="text-right py-3 px-4 font-semibold text-muted-foreground">ROI</th>
                  <th className="text-right py-3 px-4 font-semibold text-muted-foreground">Efficiency Score</th>
                </tr>
              </thead>
              <tbody>
                {campaignData.map((campaign) => (
                  <tr key={campaign.name} className="border-b border-border/50 hover:bg-secondary/30">
                    <td className="py-3 px-4 font-medium">{campaign.name}</td>
                    <td className="py-3 px-4 text-right">${campaign.cpc.toFixed(2)}</td>
                    <td className="py-3 px-4 text-right">{campaign.completions.toLocaleString()}</td>
                    <td className="py-3 px-4 text-right">${campaign.spend.toLocaleString()}</td>
                    <td className="py-3 px-4 text-right text-green-600 font-medium">{campaign.roi}%</td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <div className="w-20 h-2 bg-secondary rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary"
                            style={{ width: `${Math.min(campaign.roi / 3, 100)}%` }}
                          />
                        </div>
                        <span className="text-muted-foreground">{(campaign.roi / 3).toFixed(0)}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CampaignComparison;
