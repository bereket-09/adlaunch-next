"use client";

import { useState, useEffect, useCallback } from "react";
import {
    Shield,
    ShieldBan,
    Plus,
    Trash2,
    RefreshCw,
    Search,
    AlertTriangle,
    Globe,
    Smartphone,
    User,
    Monitor,
    Upload,
    ChevronLeft,
    ChevronRight,
    Activity,
    XCircle,
    CheckCircle,
    Clock,
    Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { API_ENDPOINTS } from "@/config/api";
import { blacklistAPI } from "@/services/api";
import AdminLayout from "@/components/AdminLayout";

type BlacklistEntry = {
    _id: string;
    type: "msisdn" | "ip" | "device" | "user_agent";
    value: string;
    reason: string;
    severity: "warn" | "block" | "permanent";
    blocked_by: string;
    notes: string;
    is_active: boolean;
    hit_count: number;
    last_hit_at: string | null;
    created_at: string;
    expires_at: string | null;
};

type BlacklistStats = {
    total_active: number;
    total_inactive: number;
    by_type: Record<string, number>;
    by_severity: Record<string, number>;
    top_triggered: {
        type: string;
        value: string;
        hit_count: number;
        severity: string;
        last_hit_at: string;
    }[];
};

const typeIcons: Record<string, any> = {
    msisdn: Smartphone,
    ip: Globe,
    device: Monitor,
    user_agent: User,
};

const severityColors: Record<string, string> = {
    warn: "bg-amber-100 text-amber-800 border-amber-200",
    block: "bg-red-100 text-red-800 border-red-200",
    permanent: "bg-red-200 text-red-900 border-red-300",
};

const severityBadgeColors: Record<string, string> = {
    warn: "bg-amber-500/10 text-amber-500 border border-amber-500/20",
    block: "bg-red-500/10 text-red-500 border border-red-500/20",
    permanent: "bg-red-700/10 text-red-700 border border-red-700/20",
};

export default function BlacklistPage() {
    const [entries, setEntries] = useState<BlacklistEntry[]>([]);
    const [stats, setStats] = useState<BlacklistStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [statsLoading, setStatsLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [filterType, setFilterType] = useState<string>("");
    const [filterSeverity, setFilterSeverity] = useState<string>("");
    const [showActive, setShowActive] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showBulkModal, setShowBulkModal] = useState(false);
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    // Add form state
    const [newEntry, setNewEntry] = useState({
        type: "msisdn" as "msisdn" | "ip" | "device" | "user_agent",
        value: "",
        reason: "manual",
        severity: "block" as "warn" | "block" | "permanent",
        notes: "",
        blocked_by: "admin",
    });

    // Bulk add state
    const [bulkText, setBulkText] = useState("");
    const [bulkType, setBulkType] = useState<"msisdn" | "ip">("msisdn");
    const [bulkSeverity, setBulkSeverity] = useState<"warn" | "block" | "permanent">("block");

    const fetchEntries = useCallback(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                page: String(page),
                limit: "20",
                is_active: String(showActive),
            });
            if (search) params.set("search", search);
            if (filterType) params.set("type", filterType);
            if (filterSeverity) params.set("severity", filterSeverity);

            const json = await blacklistAPI.list(params);
            if (json.status) {
                setEntries(json.entries);
                setTotalPages(json.pagination.pages || 1);
            }
        } catch (err) {
            console.error("Failed to fetch blacklist:", err);
        } finally {
            setLoading(false);
        }
    }, [page, search, filterType, filterSeverity, showActive]);

    const fetchStats = useCallback(async () => {
        setStatsLoading(true);
        try {
            const json = await blacklistAPI.getStats();
            if (json.status) setStats(json.stats);
        } catch (err) {
            console.error("Failed to fetch blacklist stats:", err);
        } finally {
            setStatsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchEntries();
    }, [fetchEntries]);

    useEffect(() => {
        fetchStats();
    }, [fetchStats]);

    const handleAdd = async () => {
        if (!newEntry.value.trim()) return;
        setActionLoading("add");
        try {
            const json = await blacklistAPI.add(newEntry);
            if (json.status) {
                setShowAddModal(false);
                setNewEntry({
                    type: "msisdn",
                    value: "",
                    reason: "manual",
                    severity: "block",
                    notes: "",
                    blocked_by: "admin",
                });
                fetchEntries();
                fetchStats();
            }
        } catch (err) {
            console.error("Add failed:", err);
        } finally {
            setActionLoading(null);
        }
    };

    const handleBulkAdd = async () => {
        const values = bulkText
            .split("\n")
            .map((v) => v.trim())
            .filter(Boolean);
        if (!values.length) return;
        setActionLoading("bulk");
        try {
            const json = await blacklistAPI.bulkAdd({
                entries: values.map((v) => ({
                    type: bulkType,
                    value: v,
                    severity: bulkSeverity,
                    reason: "bulk_import",
                })),
                blocked_by: "admin",
            });
            if (json.status) {
                setShowBulkModal(false);
                setBulkText("");
                fetchEntries();
                fetchStats();
            }
        } catch (err) {
            console.error("Bulk add failed:", err);
        } finally {
            setActionLoading(null);
        }
    };

    const handleDeactivate = async (id: string) => {
        setActionLoading(id);
        try {
            const json = await blacklistAPI.remove(id);
            if (json.status) {
                fetchEntries();
                fetchStats();
            }
        } catch {
            console.error("Deactivate failed");
        } finally {
            setActionLoading(null);
        }
    };

    const handlePermanentDelete = async (id: string) => {
        if (!confirm("Permanently delete this entry? This cannot be undone.")) return;
        setActionLoading(id);
        try {
            const json = await blacklistAPI.permanentDelete(id);
            if (json.status) {
                fetchEntries();
                fetchStats();
            }
        } catch {
            console.error("Delete failed");
        } finally {
            setActionLoading(null);
        }
    };

    return (
        <AdminLayout title="Blacklist Manager">
            <div className="space-y-8 animate-in fade-in duration-500">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-red-600 via-rose-500 to-orange-500 bg-clip-text text-transparent">
                            Blacklist Manager
                        </h1>
                        <p className="text-muted-foreground mt-1 text-sm">
                            Block suspicious MSISDNs, IPs, and devices from accessing the
                            platform
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            className="gap-2"
                            onClick={() => setShowBulkModal(true)}
                        >
                            <Upload className="h-4 w-4" /> Bulk Import
                        </Button>
                        <Button
                            size="sm"
                            className="gap-2 bg-gradient-to-r from-red-600 to-rose-500 hover:from-red-700 hover:to-rose-600 text-white shadow-lg shadow-red-500/20"
                            onClick={() => setShowAddModal(true)}
                        >
                            <Plus className="h-4 w-4" /> Add Entry
                        </Button>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        {
                            label: "Active Blocks",
                            value: stats?.total_active ?? "—",
                            icon: ShieldBan,
                            color: "text-red-500",
                            bg: "bg-red-500/10",
                        },
                        {
                            label: "Inactive",
                            value: stats?.total_inactive ?? "—",
                            icon: CheckCircle,
                            color: "text-emerald-500",
                            bg: "bg-emerald-500/10",
                        },
                        {
                            label: "MSISDNs Blocked",
                            value: stats?.by_type?.msisdn ?? 0,
                            icon: Smartphone,
                            color: "text-blue-500",
                            bg: "bg-blue-500/10",
                        },
                        {
                            label: "IPs Blocked",
                            value: stats?.by_type?.ip ?? 0,
                            icon: Globe,
                            color: "text-purple-500",
                            bg: "bg-purple-500/10",
                        },
                    ].map((stat, i) => (
                        <div
                            key={i}
                            className="bg-card/50 backdrop-blur border border-border/50 rounded-2xl p-5 transition-all hover:shadow-lg hover:border-border"
                        >
                            <div className="flex items-center gap-3 mb-3">
                                <div className={`p-2 rounded-xl ${stat.bg}`}>
                                    <stat.icon className={`h-4 w-4 ${stat.color}`} />
                                </div>
                                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                                    {stat.label}
                                </span>
                            </div>
                            <p className="text-2xl font-extrabold tracking-tight">
                                {statsLoading ? (
                                    <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                                ) : (
                                    stat.value
                                )}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Top Triggered */}
                {stats?.top_triggered && stats.top_triggered.length > 0 && (
                    <div className="bg-card/50 backdrop-blur border border-border/50 rounded-2xl p-5">
                        <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
                            <Activity className="h-4 w-4 text-amber-500" />
                            Most Triggered Entries
                        </h3>
                        <div className="grid gap-2">
                            {stats.top_triggered.slice(0, 5).map((entry, i) => (
                                <div
                                    key={i}
                                    className="flex items-center justify-between p-3 rounded-xl bg-secondary/30 border border-border/30"
                                >
                                    <div className="flex items-center gap-3">
                                        <span
                                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${severityBadgeColors[entry.severity] ?? severityBadgeColors.block
                                                }`}
                                        >
                                            {entry.type}
                                        </span>
                                        <span className="font-mono text-sm font-bold">
                                            {entry.value}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                        <span className="font-bold text-amber-600">
                                            {entry.hit_count} hits
                                        </span>
                                        {entry.last_hit_at && (
                                            <span className="flex items-center gap-1">
                                                <Clock className="h-3 w-3" />
                                                {new Date(entry.last_hit_at).toLocaleDateString()}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Filters */}
                <div className="flex flex-wrap items-center gap-3">
                    <div className="relative flex-1 min-w-[200px]">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search by value..."
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                setPage(1);
                            }}
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-card/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                        />
                    </div>

                    <select
                        value={filterType}
                        onChange={(e) => {
                            setFilterType(e.target.value);
                            setPage(1);
                        }}
                        className="px-3 py-2.5 rounded-xl border border-border bg-card/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                    >
                        <option value="">All Types</option>
                        <option value="msisdn">MSISDN</option>
                        <option value="ip">IP Address</option>
                        <option value="device">Device</option>
                        <option value="user_agent">User Agent</option>
                    </select>

                    <select
                        value={filterSeverity}
                        onChange={(e) => {
                            setFilterSeverity(e.target.value);
                            setPage(1);
                        }}
                        className="px-3 py-2.5 rounded-xl border border-border bg-card/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                    >
                        <option value="">All Severity</option>
                        <option value="warn">Warn</option>
                        <option value="block">Block</option>
                        <option value="permanent">Permanent</option>
                    </select>

                    <Button
                        variant={showActive ? "default" : "outline"}
                        size="sm"
                        className="gap-1"
                        onClick={() => {
                            setShowActive(!showActive);
                            setPage(1);
                        }}
                    >
                        {showActive ? (
                            <ShieldBan className="h-3.5 w-3.5" />
                        ) : (
                            <CheckCircle className="h-3.5 w-3.5" />
                        )}
                        {showActive ? "Active" : "Inactive"}
                    </Button>

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                            fetchEntries();
                            fetchStats();
                        }}
                        className="gap-1"
                    >
                        <RefreshCw className="h-3.5 w-3.5" /> Refresh
                    </Button>
                </div>

                {/* Table */}
                <div className="bg-card/50 backdrop-blur border border-border/50 rounded-2xl overflow-hidden">
                    {loading ? (
                        <div className="flex items-center justify-center py-20">
                            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                        </div>
                    ) : entries.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                            <Shield className="h-12 w-12 mb-4 opacity-30" />
                            <p className="font-bold">No entries found</p>
                            <p className="text-sm mt-1">
                                Try adjusting your filters or add a new entry
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-border/50 bg-secondary/20">
                                        <th className="text-left p-4 font-bold text-xs text-muted-foreground uppercase tracking-wider">
                                            Type
                                        </th>
                                        <th className="text-left p-4 font-bold text-xs text-muted-foreground uppercase tracking-wider">
                                            Value
                                        </th>
                                        <th className="text-left p-4 font-bold text-xs text-muted-foreground uppercase tracking-wider">
                                            Severity
                                        </th>
                                        <th className="text-left p-4 font-bold text-xs text-muted-foreground uppercase tracking-wider">
                                            Reason
                                        </th>
                                        <th className="text-left p-4 font-bold text-xs text-muted-foreground uppercase tracking-wider">
                                            Hits
                                        </th>
                                        <th className="text-left p-4 font-bold text-xs text-muted-foreground uppercase tracking-wider">
                                            Added
                                        </th>
                                        <th className="text-right p-4 font-bold text-xs text-muted-foreground uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {entries.map((entry) => {
                                        const TypeIcon = typeIcons[entry.type] || Shield;
                                        return (
                                            <tr
                                                key={entry._id}
                                                className="border-b border-border/30 hover:bg-secondary/10 transition-colors"
                                            >
                                                <td className="p-4">
                                                    <div className="flex items-center gap-2">
                                                        <TypeIcon className="h-4 w-4 text-muted-foreground" />
                                                        <span className="text-xs font-bold uppercase tracking-wider">
                                                            {entry.type}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="p-4">
                                                    <span className="font-mono font-bold text-foreground">
                                                        {entry.value}
                                                    </span>
                                                </td>
                                                <td className="p-4">
                                                    <span
                                                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border ${severityBadgeColors[entry.severity]
                                                            }`}
                                                    >
                                                        {entry.severity}
                                                    </span>
                                                </td>
                                                <td className="p-4 text-muted-foreground">
                                                    {entry.reason}
                                                </td>
                                                <td className="p-4">
                                                    <span
                                                        className={`font-bold ${entry.hit_count > 10
                                                            ? "text-red-500"
                                                            : entry.hit_count > 0
                                                                ? "text-amber-500"
                                                                : "text-muted-foreground"
                                                            }`}
                                                    >
                                                        {entry.hit_count}
                                                    </span>
                                                </td>
                                                <td className="p-4 text-muted-foreground text-xs">
                                                    {new Date(entry.created_at).toLocaleDateString()}
                                                </td>
                                                <td className="p-4 text-right">
                                                    <div className="flex items-center justify-end gap-1">
                                                        {entry.is_active && (
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                className="h-8 w-8 p-0 text-amber-500 hover:text-amber-600 hover:bg-amber-50"
                                                                onClick={() => handleDeactivate(entry._id)}
                                                                disabled={actionLoading === entry._id}
                                                                title="Deactivate"
                                                            >
                                                                {actionLoading === entry._id ? (
                                                                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                                                ) : (
                                                                    <XCircle className="h-3.5 w-3.5" />
                                                                )}
                                                            </Button>
                                                        )}
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50"
                                                            onClick={() => handlePermanentDelete(entry._id)}
                                                            disabled={actionLoading === entry._id}
                                                            title="Delete permanently"
                                                        >
                                                            <Trash2 className="h-3.5 w-3.5" />
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-between p-4 border-t border-border/30">
                            <span className="text-xs text-muted-foreground">
                                Page {page} of {totalPages}
                            </span>
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={page <= 1}
                                    onClick={() => setPage(page - 1)}
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={page >= totalPages}
                                    onClick={() => setPage(page + 1)}
                                >
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Add Entry Modal */}
                {showAddModal && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
                        <div className="bg-card border border-border rounded-3xl p-8 w-full max-w-lg shadow-2xl animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2.5 rounded-xl bg-red-500/10">
                                    <ShieldBan className="h-5 w-5 text-red-500" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-extrabold">Add Blacklist Entry</h2>
                                    <p className="text-xs text-muted-foreground">
                                        Block a specific MSISDN, IP, device, or user agent
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5 block">
                                            Type
                                        </label>
                                        <select
                                            value={newEntry.type}
                                            onChange={(e) =>
                                                setNewEntry({ ...newEntry, type: e.target.value as any })
                                            }
                                            className="w-full px-3 py-2.5 rounded-xl border border-border bg-secondary/20 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                                        >
                                            <option value="msisdn">MSISDN</option>
                                            <option value="ip">IP Address</option>
                                            <option value="device">Device</option>
                                            <option value="user_agent">User Agent</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5 block">
                                            Severity
                                        </label>
                                        <select
                                            value={newEntry.severity}
                                            onChange={(e) =>
                                                setNewEntry({
                                                    ...newEntry,
                                                    severity: e.target.value as any,
                                                })
                                            }
                                            className="w-full px-3 py-2.5 rounded-xl border border-border bg-secondary/20 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                                        >
                                            <option value="warn">Warn (log only)</option>
                                            <option value="block">Block</option>
                                            <option value="permanent">Permanent</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5 block">
                                        Value
                                    </label>
                                    <input
                                        type="text"
                                        value={newEntry.value}
                                        onChange={(e) =>
                                            setNewEntry({ ...newEntry, value: e.target.value })
                                        }
                                        placeholder={
                                            newEntry.type === "msisdn"
                                                ? "e.g. 251912345678"
                                                : newEntry.type === "ip"
                                                    ? "e.g. 192.168.1.100"
                                                    : "Enter value..."
                                        }
                                        className="w-full px-3 py-2.5 rounded-xl border border-border bg-secondary/20 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/20"
                                    />
                                </div>

                                <div>
                                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5 block">
                                        Reason
                                    </label>
                                    <select
                                        value={newEntry.reason}
                                        onChange={(e) =>
                                            setNewEntry({ ...newEntry, reason: e.target.value })
                                        }
                                        className="w-full px-3 py-2.5 rounded-xl border border-border bg-secondary/20 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                                    >
                                        <option value="manual">Manual</option>
                                        <option value="fraud">Fraud Detected</option>
                                        <option value="abuse">Platform Abuse</option>
                                        <option value="bot">Bot Activity</option>
                                        <option value="vpn">VPN/Proxy</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5 block">
                                        Notes (optional)
                                    </label>
                                    <textarea
                                        value={newEntry.notes}
                                        onChange={(e) =>
                                            setNewEntry({ ...newEntry, notes: e.target.value })
                                        }
                                        placeholder="Additional context..."
                                        rows={2}
                                        className="w-full px-3 py-2.5 rounded-xl border border-border bg-secondary/20 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-3 mt-6">
                                <Button
                                    variant="outline"
                                    className="flex-1"
                                    onClick={() => setShowAddModal(false)}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    className="flex-1 bg-gradient-to-r from-red-600 to-rose-500 text-white"
                                    onClick={handleAdd}
                                    disabled={!newEntry.value.trim() || actionLoading === "add"}
                                >
                                    {actionLoading === "add" ? (
                                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                    ) : (
                                        <ShieldBan className="h-4 w-4 mr-2" />
                                    )}
                                    Block
                                </Button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Bulk Import Modal */}
                {showBulkModal && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
                        <div className="bg-card border border-border rounded-3xl p-8 w-full max-w-lg shadow-2xl animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2.5 rounded-xl bg-orange-500/10">
                                    <Upload className="h-5 w-5 text-orange-500" />
                                </div>
                                size="sm"
                                <div>
                                    <h2 className="text-lg font-extrabold">Bulk Import</h2>
                                    <p className="text-xs text-muted-foreground">
                                        Add multiple entries at once (one per line, max 500)
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5 block">
                                            Type
                                        </label>
                                        <select
                                            value={bulkType}
                                            onChange={(e) => setBulkType(e.target.value as any)}
                                            className="w-full px-3 py-2.5 rounded-xl border border-border bg-secondary/20 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                                        >
                                            <option value="msisdn">MSISDN</option>
                                            <option value="ip">IP Address</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5 block">
                                            Severity
                                        </label>
                                        <select
                                            value={bulkSeverity}
                                            onChange={(e) => setBulkSeverity(e.target.value as any)}
                                            className="w-full px-3 py-2.5 rounded-xl border border-border bg-secondary/20 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                                        >
                                            <option value="warn">Warn</option>
                                            <option value="block">Block</option>
                                            <option value="permanent">Permanent</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5 block">
                                        Values (one per line)
                                    </label>
                                    <textarea
                                        value={bulkText}
                                        onChange={(e) => setBulkText(e.target.value)}
                                        placeholder={
                                            bulkType === "msisdn"
                                                ? "251912345678\n251911111111\n251922222222"
                                                : "192.168.1.1\n10.0.0.1\n172.16.0.1"
                                        }
                                        rows={8}
                                        className="w-full px-3 py-2.5 rounded-xl border border-border bg-secondary/20 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                                    />
                                    <p className="text-xs text-muted-foreground mt-1">
                                        {bulkText.split("\n").filter(Boolean).length} entries detected
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-3 mt-6">
                                <Button
                                    variant="outline"
                                    className="flex-1"
                                    onClick={() => setShowBulkModal(false)}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    className="flex-1 bg-gradient-to-r from-orange-600 to-amber-500 text-white"
                                    onClick={handleBulkAdd}
                                    disabled={
                                        !bulkText.trim() || actionLoading === "bulk"
                                    }
                                >
                                    {actionLoading === "bulk" ? (
                                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                    ) : (
                                        <Upload className="h-4 w-4 mr-2" />
                                    )}
                                    Import All
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
