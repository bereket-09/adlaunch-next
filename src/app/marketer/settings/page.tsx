"use client";

import { useState, useEffect } from "react";
import {
    User,
    Bell,
    Shield,
    Save,
} from "lucide-react";
import MarketerLayout from "@/components/MarketerLayout";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

export default function MarketerSettingsPage() {
    const [profile, setProfile] = useState({
        companyName: "TechCorp Inc.",
        email: "",
        phone: "",
        address: "123 Business Street, Addis Ababa",
    });

    const [notifications] = useState({
        emailAlerts: true,
        budgetWarnings: true,
        campaignUpdates: true,
        weeklyReports: true,
        smsNotifications: false,
    });

    useEffect(() => {
        const userInfo = typeof window !== 'undefined' ? localStorage.getItem("userInfo") : null;
        if (userInfo) {
            try {
                const parsed = JSON.parse(userInfo);
                setProfile({
                    companyName: parsed.name || "TechCorp Inc.",
                    email: parsed.email || "",
                    phone: parsed.phone || "",
                    address: parsed.address || "123 Business Street, Addis Ababa",
                });
            } catch (e) {
                console.error("Failed to parse userInfo", e);
            }
        }
    }, []);

    return (
        <MarketerLayout title="Account Settings">
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Settings & Preferences</h1>
                    <p className="text-muted-foreground">Manage your identity, notification triggers, and security protocols</p>
                </div>

                <Tabs defaultValue="profile" className="space-y-6">
                    <TabsList className="bg-secondary/50 p-1 h-12">
                        <TabsTrigger value="profile" className="gap-2 h-10 px-6 font-medium"><User className="h-4 w-4" />Profile</TabsTrigger>
                        <TabsTrigger value="notifications" className="gap-2 h-10 px-6 font-medium"><Bell className="h-4 w-4" />Notifications</TabsTrigger>
                        <TabsTrigger value="security" className="gap-2 h-10 px-6 font-medium"><Shield className="h-4 w-4" />Security</TabsTrigger>
                    </TabsList>

                    <TabsContent value="profile" className="space-y-6">
                        <Card className="card-elevated border-none shadow-xl">
                            <CardHeader>
                                <CardTitle>Organization Identity</CardTitle>
                                <CardDescription>Verified details for your business account</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label className="text-xs uppercase tracking-wider text-muted-foreground">Legal Company Name</Label>
                                        <Input value={profile.companyName} readOnly className="h-11 bg-muted/50" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs uppercase tracking-wider text-muted-foreground">Primary Contact Email</Label>
                                        <Input value={profile.email} readOnly className="h-11 bg-muted/50" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs uppercase tracking-wider text-muted-foreground">Contact Phone</Label>
                                        <Input value={profile.phone} readOnly className="h-11 bg-muted/50" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs uppercase tracking-wider text-muted-foreground">Headquarters Address</Label>
                                        <Input value={profile.address} readOnly className="h-11 bg-muted/50" />
                                    </div>
                                </div>
                                <div className="pt-4">
                                    <Button disabled variant="outline" className="gap-2"><Save className="h-4 w-4" />Update Identity Request</Button>
                                    <p className="text-[10px] text-muted-foreground mt-2 italic">* Identity updates require admin verification</p>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="notifications" className="space-y-6">
                        <Card className="card-elevated border-none shadow-xl">
                            <CardHeader>
                                <CardTitle>Intelligent Alerts</CardTitle>
                                <CardDescription>Configure how and when you receive critical performance updates</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {Object.entries(notifications).map(([key, value]) => (
                                    <div key={key} className="flex items-center justify-between p-4 bg-secondary/20 rounded-xl">
                                        <div className="space-y-1">
                                            <Label className="capitalize font-semibold text-sm">{key.replace(/([A-Z])/g, " $1")}</Label>
                                            <p className="text-xs text-muted-foreground">
                                                {key === "budgetWarnings" ? "Critical alerts when account balance drops below 20%"
                                                    : key === "emailAlerts" ? "Daily performance digests and system status reports"
                                                        : key === "campaignUpdates" ? "Real-time state change notifications for active campaigns"
                                                            : key === "weeklyReports" ? "Comprehensive weekly PDF analytics delivered to your inbox"
                                                                : "Low-latency SMS alerts for emergency budget notifications"}
                                            </p>
                                        </div>
                                        <Switch checked={value} disabled />
                                    </div>
                                ))}
                                <Button disabled variant="gradient" className="w-full h-11"><Save className="h-4 w-4 mr-2" />Lock Preferences</Button>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="security" className="space-y-6">
                        <Card className="card-elevated border-none shadow-xl">
                            <CardHeader>
                                <CardTitle>Access Control</CardTitle>
                                <CardDescription>Multi-factor authentication and password policy management</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid gap-4">
                                    <div className="space-y-2">
                                        <Label className="text-xs uppercase tracking-wider">Current Password</Label>
                                        <Input type="password" placeholder="••••••••" readOnly className="h-11 bg-muted/30" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label className="text-xs uppercase tracking-wider">New Secure Password</Label>
                                            <Input type="password" readOnly className="h-11 bg-muted/30" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-xs uppercase tracking-wider">Verify Password</Label>
                                            <Input type="password" readOnly className="h-11 bg-muted/30" />
                                        </div>
                                    </div>
                                </div>
                                <Separator className="my-2" />
                                <div className="flex items-center justify-between p-4 border border-dashed rounded-xl border-primary/20">
                                    <div className="space-y-1">
                                        <Label className="font-bold">Two-Factor Authentication (2FA)</Label>
                                        <p className="text-xs text-muted-foreground">Enforce authentication via TOTP or Biometrics</p>
                                    </div>
                                    <Button variant="outline" size="sm" disabled>Configure 2FA</Button>
                                </div>
                                <Button disabled variant="gradient" className="gap-2 h-11"><Shield className="h-4 w-4" />Hardened Password Policy</Button>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </MarketerLayout>
    );
}
