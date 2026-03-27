"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
    ShieldCheck, 
    Upload, 
    FileText, 
    Link as LinkIcon, 
    CheckCircle2, 
    AlertCircle, 
    Clock,
    Plus,
    X,
    Building2,
    User,
    Phone,
    Briefcase,
    Loader2
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import MarketerLayout from "@/components/MarketerLayout";
import { useToast } from "@/hooks/use-toast";
import { marketerAPI } from "@/services/api";

export default function MarketerKYCPage() {
    const [marketer, setMarketer] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [docs, setDocs] = useState<any[]>([]);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [selectedDocType, setSelectedDocType] = useState("Business License");
    const [formData, setFormData] = useState({
        company_name: "",
        business_reg_number: "",
        business_address: "",
        business_category: "",
        contact_person_name: "",
        contact_person_phone: "",
        contact_person_position: ""
    });

    const router = useRouter();
    const { toast } = useToast();

    useEffect(() => {
        fetchMarketerData();
    }, []);

    const fetchMarketerData = async () => {
        try {
            const id = localStorage.getItem("marketer_id");
            if (!id) return;
            const res = await marketerAPI.get(id);
            if (res.status) {
                setMarketer(res.marketer);
                setFormData({
                    company_name: res.marketer.company_name || "",
                    business_reg_number: res.marketer.business_reg_number || "",
                    business_address: res.marketer.business_address || "",
                    business_category: res.marketer.business_category || "",
                    contact_person_name: res.marketer.contact_person?.name || "",
                    contact_person_phone: res.marketer.contact_person?.phone || "",
                    contact_person_position: res.marketer.contact_person?.position || ""
                });
                setDocs(res.marketer.kyc_documents || []);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const id = localStorage.getItem("marketer_id");
            if (!id) return;

            const updateData = {
                company_name: formData.company_name,
                business_reg_number: formData.business_reg_number,
                business_address: formData.business_address,
                business_category: formData.business_category,
                contact_person: {
                    name: formData.contact_person_name,
                    phone: formData.contact_person_phone,
                    position: formData.contact_person_position
                }
            };

            const res = await marketerAPI.update(id, updateData);
            if (res.status) {
                toast({ title: "KYC Details Updated", description: "Your information has been saved." });
                fetchMarketerData();
            }
        } catch (error) {
            toast({ title: "Update Failed", variant: "destructive" });
        } finally {
            setSaving(false);
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const id = localStorage.getItem("marketer_id");
        if (!id) return;

        setUploading(true);
        try {
            const res = await marketerAPI.uploadKYCDoc(id, file, selectedDocType);
            if (res.status) {
                toast({ title: "Document Uploaded", description: "Awaiting administrative review." });
                fetchMarketerData();
            }
        } catch (error: any) {
            toast({ title: "Upload Failed", description: error.message || "Could not upload document.", variant: "destructive" });
        } finally {
            setUploading(false);
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'verified': return <CheckCircle2 className="h-5 w-5 text-green-500" />;
            case 'pending': return <Clock className="h-5 w-5 text-orange-500 animate-pulse" />;
            case 'rejected': return <AlertCircle className="h-5 w-5 text-red-500" />;
            default: return <ShieldCheck className="h-5 w-5 text-slate-400" />;
        }
    };

    if (loading) return <MarketerLayout><div className="flex items-center justify-center min-h-[60vh]"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div></MarketerLayout>;

    return (
        <MarketerLayout title="Identity & KYC">
            <div className="max-w-5xl mx-auto space-y-8 pb-20">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-8 rounded-[2.5rem] shadow-xl shadow-orange-500/5 border border-orange-100">
                    <div className="flex items-center gap-6">
                        <div className={`w-20 h-20 rounded-3xl flex items-center justify-center text-3xl shadow-2xl ${
                            marketer?.kyc_status === 'verified' ? 'bg-green-500 text-white' : 
                            marketer?.kyc_status === 'rejected' ? 'bg-red-500 text-white' : 'bg-orange-500 text-white'
                        }`}>
                            {marketer?.kyc_status === 'verified' ? <CheckCircle2 className="h-10 w-10" /> : <ShieldCheck className="h-10 w-10" />}
                        </div>
                        <div>
                            <h1 className="text-3xl font-black tracking-tighter text-slate-900">Compliance Center</h1>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Account Status:</span>
                                <span className={`text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full border ${
                                    marketer?.kyc_status === 'verified' ? 'bg-green-50 border-green-200 text-green-700' :
                                    marketer?.kyc_status === 'rejected' ? 'bg-red-50 border-red-200 text-red-700' : 'bg-orange-50 border-orange-200 text-orange-700'
                                }`}>
                                    {marketer?.kyc_status || 'Unverified'}
                                </span>
                            </div>
                        </div>
                    </div>
                    {marketer?.admin_comments && (
                        <div className="flex-1 md:max-w-xs bg-red-50 p-4 rounded-2xl border border-red-100">
                            <p className="text-[10px] font-black text-red-700 uppercase mb-1">Admin Feedback</p>
                            <p className="text-xs text-red-600/80 font-medium">{marketer.admin_comments}</p>
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Forms */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Company Details */}
                        <Card className="rounded-[2rem] border-0 shadow-lg overflow-hidden">
                            <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-8">
                                <div className="flex items-center gap-3">
                                    <div className="p-2.5 bg-white rounded-xl border border-slate-200 shadow-sm"><Building2 className="h-5 w-5 text-primary" /></div>
                                    <div>
                                        <CardTitle className="text-xl font-bold">Business Profile</CardTitle>
                                        <CardDescription>Official registration details for your brand</CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="p-8 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold text-slate-500 uppercase">Legal Company Name</Label>
                                        <Input 
                                            value={formData.company_name} 
                                            onChange={e => setFormData({...formData, company_name: e.target.value})}
                                            placeholder="e.g. Acme Corporation PLC" 
                                            className="h-12 rounded-xl"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold text-slate-500 uppercase">Registration Number</Label>
                                        <Input 
                                            value={formData.business_reg_number} 
                                            onChange={e => setFormData({...formData, business_reg_number: e.target.value})}
                                            placeholder="e.g. ET-123456" 
                                            className="h-12 rounded-xl"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold text-slate-500 uppercase">Business Category</Label>
                                        <Select value={formData.business_category} onValueChange={v => setFormData({...formData, business_category: v})}>
                                            <SelectTrigger className="h-12 rounded-xl">
                                                <SelectValue placeholder="Select industry" />
                                            </SelectTrigger>
                                            <SelectContent className="rounded-xl">
                                                <SelectItem value="retail">Retail & E-commerce</SelectItem>
                                                <SelectItem value="finance">Finance & Fintech</SelectItem>
                                                <SelectItem value="tech">Technology & SaaS</SelectItem>
                                                <SelectItem value="health">Healthcare</SelectItem>
                                                <SelectItem value="fmcg">FMCG</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold text-slate-500 uppercase">Headquarters Address</Label>
                                        <Input 
                                            value={formData.business_address} 
                                            onChange={e => setFormData({...formData, business_address: e.target.value})}
                                            placeholder="City, Area, Building..." 
                                            className="h-12 rounded-xl"
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Contact Person */}
                        <Card className="rounded-[2rem] border-0 shadow-lg overflow-hidden">
                            <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-8">
                                <div className="flex items-center gap-3">
                                    <div className="p-2.5 bg-white rounded-xl border border-slate-200 shadow-sm"><User className="h-5 w-5 text-primary" /></div>
                                    <div>
                                        <CardTitle className="text-xl font-bold">Authorized Representative</CardTitle>
                                        <CardDescription>Primary contact for compliance matters</CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="p-8 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold text-slate-500 uppercase">Full Name</Label>
                                        <Input 
                                            value={formData.contact_person_name} 
                                            onChange={e => setFormData({...formData, contact_person_name: e.target.value})}
                                            placeholder="John Doe" 
                                            className="h-12 rounded-xl"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold text-slate-500 uppercase">Mobile Number</Label>
                                        <Input 
                                            value={formData.contact_person_phone} 
                                            onChange={e => setFormData({...formData, contact_person_phone: e.target.value})}
                                            placeholder="251..." 
                                            className="h-12 rounded-xl"
                                        />
                                    </div>
                                    <div className="md:col-span-2 space-y-2">
                                        <Label className="text-xs font-bold text-slate-500 uppercase">Position / Job Title</Label>
                                        <Input 
                                            value={formData.contact_person_position} 
                                            onChange={e => setFormData({...formData, contact_person_position: e.target.value})}
                                            placeholder="e.g. Marketing Director" 
                                            className="h-12 rounded-xl"
                                        />
                                    </div>
                                </div>
                            </CardContent>
                            <div className="bg-slate-50 p-6 flex justify-end border-t border-slate-100">
                                <Button 
                                    variant="gradient" 
                                    className="px-8 rounded-xl font-bold"
                                    onClick={handleSave}
                                    disabled={saving}
                                >
                                    {saving ? "Saving Changes..." : "Update Details"}
                                </Button>
                            </div>
                        </Card>
                    </div>

                    {/* Right column: Documents & Progress */}
                    <div className="space-y-8">
                        <Card className="rounded-[2rem] border-0 shadow-lg bg-slate-900 text-white overflow-hidden">
                            <CardHeader className="p-8 pb-4">
                                <CardTitle className="text-xl font-bold flex items-center justify-between">
                                    KYC Documents
                                    <Button variant="ghost" size="icon" className="text-white h-8 w-8 rounded-lg hover:bg-white/10">
                                        <Plus className="h-4 w-4" />
                                    </Button>
                                </CardTitle>
                                <CardDescription className="text-slate-400">Upload business licenses and IDs</CardDescription>
                            </CardHeader>
                            <CardContent className="p-8 pt-4 space-y-4">
                                {docs.length === 0 ? (
                                    <div className="border-2 border-dashed border-white/10 rounded-2xl p-8 text-center bg-white/5">
                                        <Upload className="h-8 w-8 text-white/20 mx-auto mb-3" />
                                        <p className="text-xs font-bold text-white/40 uppercase tracking-widest">No Documents Uploaded</p>
                                    </div>
                                ) : (
                                    docs.map((doc, idx) => (
                                        <div key={idx} className="bg-white/5 border border-white/10 p-4 rounded-xl flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-orange-600/20 flex items-center justify-center">
                                                    <FileText className="h-5 w-5 text-orange-500" />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-xs truncate max-w-[120px]">{doc.file_name || 'Document'}</p>
                                                    <span className="text-[10px] text-white/40 uppercase">{doc.doc_type}</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {doc.status === 'approved' ? (
                                                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                                                ) : doc.status === 'rejected' ? (
                                                    <AlertCircle className="h-4 w-4 text-red-500" />
                                                ) : (
                                                    <Clock className="h-4 w-4 text-orange-500" />
                                                )}
                                            </div>
                                        </div>
                                    ))
                                )}
                                                                <div className="mt-8 p-6 bg-gradient-to-br from-orange-600 to-orange-500 rounded-3xl">
                                    <h4 className="text-sm font-black uppercase tracking-widest mb-1 text-white">Upload Center</h4>
                                    <p className="text-[10px] text-white/80 mb-4 font-medium uppercase tracking-tighter italic">Official verification documents only. Supported: PDF, PNG, JPG (Max 5MB)</p>
                                    
                                    <div className="space-y-3">
                                        <Select value={selectedDocType} onValueChange={setSelectedDocType}>
                                            <SelectTrigger className="h-10 rounded-xl bg-white/10 border-white/20 text-white font-bold text-[10px] uppercase">
                                                <SelectValue placeholder="Doc Type" />
                                            </SelectTrigger>
                                            <SelectContent className="rounded-xl">
                                                <SelectItem value="Business License">Business License</SelectItem>
                                                <SelectItem value="Tax Identification (TIN)">Tax ID (TIN)</SelectItem>
                                                <SelectItem value="Identity Document">Identity Document</SelectItem>
                                                <SelectItem value="Bank Statement">Bank Statement</SelectItem>
                                                <SelectItem value="Other">Other</SelectItem>
                                            </SelectContent>
                                        </Select>

                                        <div className="relative">
                                            <input 
                                                type="file" 
                                                id="kyc-upload" 
                                                className="hidden" 
                                                onChange={handleFileUpload}
                                                accept=".pdf,.png,.jpg,.jpeg"
                                            />
                                            <Button 
                                                className="w-full bg-white text-orange-600 hover:bg-white/90 font-black text-[10px] uppercase tracking-[0.2em] h-10 rounded-xl shadow-xl"
                                                onClick={() => document.getElementById('kyc-upload')?.click()}
                                                disabled={uploading}
                                            >
                                                {uploading ? "TRANSMITTING..." : "SELECT FILE & UPLOAD"}
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50">
                            <h3 className="font-bold text-slate-900 mb-4">Vetting Process</h3>
                            <div className="space-y-6">
                                {[
                                    { label: 'Profile Setup', complete: true },
                                    { label: 'Business Docs', complete: docs.length > 0 },
                                    { label: 'Admin Review', complete: marketer?.kyc_status === 'verified', pending: marketer?.kyc_status === 'pending' },
                                    { label: 'Final Approval', complete: marketer?.status === 'active' }
                                ].map((step, idx) => (
                                    <div key={idx} className="flex items-center gap-4">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 ${
                                            step.complete ? 'bg-green-500 border-green-500 text-white shadow-[0_0_10px_rgba(34,197,94,0.3)]' :
                                            step.pending ? 'bg-orange-500 border-orange-500 text-white animate-pulse' :
                                            'bg-white border-slate-200 text-slate-400'
                                        }`}>
                                            {step.complete ? <CheckCircle2 className="h-4 w-4" /> : idx + 1}
                                        </div>
                                        <div>
                                            <p className={`text-xs font-bold ${step.complete ? 'text-slate-900' : 'text-slate-400'}`}>{step.label}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </MarketerLayout>
    );
}
