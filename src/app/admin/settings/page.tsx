"use client";

import { useState } from "react";
import {
    Save, Shield, Bell, Globe, Database, Mail, Key, Server,
    RefreshCcw, Terminal, Zap, ShieldCheck, Activity, Cpu,
    Cloud, Lock, Network, Settings2, BellRing, UserCog,
    ChevronRight, ExternalLink, Cog, ShieldAlert, BarChart3,
    DollarSign
} from "lucide-react";
import AdminLayout from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import KPICard from "@/components/analytics/KPICard";

export default function AdminSettingsPage() {
    const [platformSettings, setPlatformSettings] = useState({
        platformName: "AdLaunch Admin",
        supportEmail: "support@adlaunch.et",
        maintenanceMode: false,
        debugMode: false,
    });

    const [securitySettings, setSecuritySettings] = useState({
        twoFactorRequired: true,
        sessionTimeout: 30,
        ipWhitelisting: false,
        auditLogging: true,
    });

    const [notificationSettings, setNotificationSettings] = useState({
        systemAlerts: true,
        fraudAlerts: true,
        budgetAlerts: true,
        dailyReports: true,
    });

    const [apiSettings, setApiSettings] = useState({
        rateLimit: 1000,
        timeout: 30,
        retryAttempts: 3,
    });

    const handleSave = () => {
        toast.success("Settings updated successfully.");
    };

    return (
        <AdminLayout title="System Settings">
            <div className="space-y-6 animate-in fade-in duration-500">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1">
                        <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
                            Configuration Dashboard
                            <Badge className="bg-primary/10 text-primary border-none font-bold py-0.5 px-2 text-[10px]">v4.2.0</Badge>
                        </h1>
                        <p className="text-muted-foreground text-sm">Manage global variables, security policies, and system-wide notifications.</p>
                    </div>
                    <div className="flex items-center gap-3 bg-background/50 backdrop-blur-sm p-2 rounded-2xl border border-border/50 shadow-sm">
                        <Button variant="outline" size="sm" className="h-9 rounded-xl px-4 gap-2 border-border/50 font-bold hover:bg-secondary">
                            <RefreshCcw className="h-4 w-4" /> Reset
                        </Button>
                        <Button onClick={handleSave} size="sm" className="h-9 rounded-xl px-6 font-bold gap-2">
                            <Save className="h-4 w-4" /> Save Changes
                        </Button>
                    </div>
                </div>

                {/* System Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <KPICard title="System Status" value="Online" icon={Cpu} trend="neutral" />
                    <KPICard title="Security Health" value="Optimal" icon={ShieldCheck} trend="up" change={0.1} />
                    <KPICard title="API Latency" value="14ms" icon={Zap} trend="down" change={1.2} />
                </div>

                <Tabs defaultValue="general" className="space-y-6">
                    <div className="bg-background/50 backdrop-blur-sm p-2 rounded-2xl border border-border/50 shadow-sm overflow-x-auto">
                        <TabsList className="bg-secondary/20 p-1 rounded-xl h-auto flex gap-1 min-w-max">
                            <TabsTrigger value="general" className="rounded-lg px-6 py-2.5 gap-2 text-xs font-bold transition-all">
                                <Globe className="h-4 w-4" /> General
                            </TabsTrigger>
                            <TabsTrigger value="security" className="rounded-lg px-6 py-2.5 gap-2 text-xs font-bold transition-all">
                                <Lock className="h-4 w-4" /> Security
                            </TabsTrigger>
                            <TabsTrigger value="notifications" className="rounded-lg px-6 py-2.5 gap-2 text-xs font-bold transition-all">
                                <BellRing className="h-4 w-4" /> Notifications
                            </TabsTrigger>
                            <TabsTrigger value="api" className="rounded-lg px-6 py-2.5 gap-2 text-xs font-bold transition-all">
                                <Network className="h-4 w-4" /> API
                            </TabsTrigger>
                            <TabsTrigger value="integrations" className="rounded-lg px-6 py-2.5 gap-2 text-xs font-bold transition-all">
                                <Cloud className="h-4 w-4" /> Integrations
                            </TabsTrigger>
                        </TabsList>
                    </div>

                    <TabsContent value="general" className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                        <Card className="border border-border/50 shadow-sm bg-background/50 backdrop-blur-sm rounded-2xl overflow-hidden">
                            <CardHeader className="bg-secondary/10 border-b border-border/50 py-4 px-6">
                                <CardTitle className="text-lg font-bold">General Settings</CardTitle>
                                <CardDescription className="text-xs">Update your platform identity and operational modes.</CardDescription>
                            </CardHeader>
                            <CardContent className="p-6 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-1.5">
                                        <Label htmlFor="platformName" className="text-xs font-bold">Platform Name</Label>
                                        <Input
                                            id="platformName"
                                            className="h-10 rounded-xl"
                                            value={platformSettings.platformName}
                                            onChange={(e) => setPlatformSettings({ ...platformSettings, platformName: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label htmlFor="supportEmail" className="text-xs font-bold">Support Email</Label>
                                        <Input
                                            id="supportEmail"
                                            type="email"
                                            className="h-10 rounded-xl"
                                            value={platformSettings.supportEmail}
                                            onChange={(e) => setPlatformSettings({ ...platformSettings, supportEmail: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <Separator className="bg-border/50" />

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="flex items-center justify-between p-4 bg-secondary/20 rounded-xl border border-border/50 hover:bg-secondary/30 transition-all">
                                        <div className="space-y-0.5">
                                            <Label className="text-sm font-bold">Maintenance Mode</Label>
                                            <p className="text-xs text-muted-foreground">Suspend platform access for updates.</p>
                                        </div>
                                        <Switch
                                            checked={platformSettings.maintenanceMode}
                                            onCheckedChange={(checked) => setPlatformSettings({ ...platformSettings, maintenanceMode: checked })}
                                        />
                                    </div>

                                    <div className="flex items-center justify-between p-4 bg-secondary/20 rounded-xl border border-border/50 hover:bg-secondary/30 transition-all">
                                        <div className="space-y-0.5">
                                            <Label className="text-sm font-bold">Debug Mode</Label>
                                            <p className="text-xs text-muted-foreground">Enable detailed system logs for troubleshooting.</p>
                                        </div>
                                        <Switch
                                            checked={platformSettings.debugMode}
                                            onCheckedChange={(checked) => setPlatformSettings({ ...platformSettings, debugMode: checked })}
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="security" className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                        <Card className="border border-border/50 shadow-sm bg-background/50 backdrop-blur-sm rounded-2xl overflow-hidden">
                            <CardHeader className="bg-secondary/10 border-b border-border/50 py-4 px-6">
                                <CardTitle className="text-lg font-bold">Security Policies</CardTitle>
                                <CardDescription className="text-xs">Enforce authentication rules and access controls.</CardDescription>
                            </CardHeader>
                            <CardContent className="p-6 space-y-6">
                                <div className="flex items-center justify-between p-5 bg-slate-900 rounded-xl border border-slate-800">
                                    <div className="space-y-1">
                                        <Label className="text-base font-bold text-white">Require Multi-Factor Authentication</Label>
                                        <p className="text-xs text-slate-400">All admin users must use 2FA to log in.</p>
                                    </div>
                                    <Switch
                                        checked={securitySettings.twoFactorRequired}
                                        onCheckedChange={(checked) => setSecuritySettings({ ...securitySettings, twoFactorRequired: checked })}
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-1.5">
                                        <Label className="text-xs font-bold">Session Timeout (minutes)</Label>
                                        <Input
                                            type="number"
                                            className="h-10 rounded-xl max-w-[200px]"
                                            value={securitySettings.sessionTimeout}
                                            onChange={(e) => setSecuritySettings({ ...securitySettings, sessionTimeout: parseInt(e.target.value) })}
                                        />
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between p-3 rounded-lg border border-border/50">
                                            <Label className="text-sm font-semibold">IP Access Control</Label>
                                            <Switch
                                                checked={securitySettings.ipWhitelisting}
                                                onCheckedChange={(checked) => setSecuritySettings({ ...securitySettings, ipWhitelisting: checked })}
                                                size="sm"
                                            />
                                        </div>
                                        <div className="flex items-center justify-between p-3 rounded-lg border border-border/50">
                                            <Label className="text-sm font-semibold">System Audit Logs</Label>
                                            <Switch
                                                checked={securitySettings.auditLogging}
                                                onCheckedChange={(checked) => setSecuritySettings({ ...securitySettings, auditLogging: checked })}
                                                size="sm"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="notifications" className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                        <Card className="border border-border/50 shadow-sm bg-background/50 backdrop-blur-sm rounded-2xl overflow-hidden">
                            <CardHeader className="bg-secondary/10 border-b border-border/50 py-4 px-6">
                                <CardTitle className="text-lg font-bold">Notification Preferences</CardTitle>
                                <CardDescription className="text-xs">Configure how you receive system alerts and reports.</CardDescription>
                            </CardHeader>
                            <CardContent className="p-6 space-y-3">
                                {[
                                    { label: "System Failures", sub: "Critical errors, service downtime, and crashes.", state: notificationSettings.systemAlerts, icon: Zap, color: "text-red-500" },
                                    { label: "Fraud Alerts", sub: "Suspicious activities and security threats.", state: notificationSettings.fraudAlerts, icon: ShieldAlert, color: "text-amber-500" },
                                    { label: "Budget Depletion", sub: "When marketer accounts reach low balance limits.", state: notificationSettings.budgetAlerts, icon: DollarSign, color: "text-emerald-500" },
                                    { label: "Daily Digests", sub: "Summary reports of platform performance.", state: notificationSettings.dailyReports, icon: BarChart3, color: "text-blue-500" },
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center justify-between p-4 bg-secondary/10 rounded-xl border border-border/50 hover:bg-secondary/20 transition-all">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-10 h-10 rounded-lg bg-background flex items-center justify-center border border-border/50 ${item.color}`}>
                                                <item.icon className="h-5 w-5" />
                                            </div>
                                            <div className="space-y-0.5">
                                                <Label className="text-sm font-bold">{item.label}</Label>
                                                <p className="text-xs text-muted-foreground">{item.sub}</p>
                                            </div>
                                        </div>
                                        <Switch checked={item.state} />
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="api" className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                        <Card className="border border-border/50 shadow-sm bg-background/50 backdrop-blur-sm rounded-2xl overflow-hidden">
                            <CardHeader className="bg-secondary/10 border-b border-border/50 py-4 px-6">
                                <CardTitle className="text-lg font-bold">API Configuration</CardTitle>
                                <CardDescription className="text-xs">Manage API rate limits and connection settings.</CardDescription>
                            </CardHeader>
                            <CardContent className="p-6 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="space-y-1.5">
                                        <Label className="text-xs font-bold">Rate Limit (req/sec)</Label>
                                        <Input
                                            type="number"
                                            className="h-10 rounded-xl font-mono text-sm"
                                            value={apiSettings.rateLimit}
                                            onChange={(e) => setApiSettings({ ...apiSettings, rateLimit: parseInt(e.target.value) })}
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label className="text-xs font-bold">Timeout (ms)</Label>
                                        <Input
                                            type="number"
                                            className="h-10 rounded-xl font-mono text-sm"
                                            value={apiSettings.timeout}
                                            onChange={(e) => setApiSettings({ ...apiSettings, timeout: parseInt(e.target.value) })}
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label className="text-xs font-bold">Retry Attempts</Label>
                                        <Input
                                            type="number"
                                            className="h-10 rounded-xl font-mono text-sm"
                                            value={apiSettings.retryAttempts}
                                            onChange={(e) => setApiSettings({ ...apiSettings, retryAttempts: parseInt(e.target.value) })}
                                        />
                                    </div>
                                </div>

                                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 shadow-sm overflow-hidden">
                                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-4 flex items-center gap-2">
                                        <Terminal className="h-3 w-3" /> Core API Endpoints
                                    </h4>
                                    <div className="space-y-2">
                                        {[
                                            { method: "POST", path: "/v1/telemetry", tag: "Analytics", color: "text-emerald-400" },
                                            { method: "POST", path: "/v1/campaign/sync", tag: "Sync", color: "text-emerald-400" },
                                            { method: "GET", path: "/v1/health", tag: "Health", color: "text-blue-400" },
                                        ].map((api, i) => (
                                            <div key={i} className="flex items-center gap-4 py-2 px-3 rounded-lg hover:bg-white/5 transition-all">
                                                <span className={`${api.color} font-mono text-[10px] w-12 font-bold`}>{api.method}</span>
                                                <span className="flex-1 font-mono text-slate-300 text-xs">{api.path}</span>
                                                <Badge variant="outline" className="border-slate-800 text-[9px] font-bold text-slate-500 px-2 h-5">{api.tag}</Badge>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="integrations" className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                        <Card className="border border-border/50 shadow-sm bg-background/50 backdrop-blur-sm rounded-2xl overflow-hidden">
                            <CardHeader className="bg-secondary/10 border-b border-border/50 py-4 px-6">
                                <CardTitle className="text-lg font-bold">External Integrations</CardTitle>
                                <CardDescription className="text-xs">Connect external services and mobile network operators.</CardDescription>
                            </CardHeader>
                            <CardContent className="p-6 space-y-4">
                                {[
                                    { name: "MNO Core Service", desc: "Subscriber mapping and billing integration.", status: "Connected", icon: Network, color: "text-emerald-400" },
                                    { name: "SMS Gateway", desc: "Transactional messaging and auth codes.", status: "Connected", icon: Mail, color: "text-emerald-400" },
                                    { name: "Fulfillment Engine", desc: "Reward delivery and resource allocation.", status: "Standby", icon: Key, color: "text-blue-400" },
                                ].map((int, i) => (
                                    <div key={i} className="flex items-center justify-between p-4 bg-secondary/10 rounded-xl border border-border/50 hover:bg-secondary/20 transition-all">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-background flex items-center justify-center border border-border/50 shadow-sm">
                                                <int.icon className={`h-6 w-6 ${int.color}`} />
                                            </div>
                                            <div className="space-y-0.5">
                                                <h4 className="text-sm font-bold flex items-center gap-2">
                                                    {int.name}
                                                    <div className={`w-1.5 h-1.5 rounded-full ${int.status === 'Connected' ? 'bg-emerald-500 animate-pulse' : 'bg-blue-500'}`} />
                                                </h4>
                                                <p className="text-xs text-muted-foreground">{int.desc}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Badge variant="outline" className="font-bold text-[9px] px-2 py-0 border-border/50 bg-background">{int.status}</Badge>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg"><ChevronRight className="h-4 w-4" /></Button>
                                        </div>
                                    </div>
                                ))}
                                <Button variant="outline" className="w-full h-11 border-dashed rounded-xl text-xs font-bold text-muted-foreground hover:text-primary hover:border-primary transition-all">
                                    + Add Integration
                                </Button>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </AdminLayout>
    );
}
