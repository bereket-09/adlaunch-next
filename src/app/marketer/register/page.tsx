"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from 'next/link';
import { 
    Mail, Lock, Building, FileText, MapPin, Phone, User, 
    CheckCircle2, CloudUpload, X, Briefcase, UserCheck, ChevronRight,
    Building2, ShieldCheck, Info
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
    Select, 
    SelectContent, 
    SelectItem, 
    SelectTrigger, 
    SelectValue 
} from "@/components/ui/select";
import Logo from "@/components/Logo";
import { useToast } from "@/hooks/use-toast";
import { API_ENDPOINTS } from "@/config/api";
import { marketerAPI } from "@/services/api";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface FileAttachment {
    file: File;
    type: string;
    id: string;
}

export default function MarketerRegisterPage() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        company_name: "",
        business_reg_number: "",
        business_address: "",
        contact_info: "",
        business_category: "",
        contact_person_name: "",
        contact_person_position: "",
    });
    
    const [files, setFiles] = useState<FileAttachment[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    
    const router = useRouter();
    const { toast } = useToast();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({ ...prev, [e.target.id]: e.target.value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = e.target.files;
        if (!selectedFiles) return;

        const newFiles: FileAttachment[] = [];
        for (let i = 0; i < selectedFiles.length; i++) {
            const file = selectedFiles[i];
            newFiles.push({
                file,
                type: "Business Document",
                id: Math.random().toString(36).substr(2, 9)
            });
        }
        setFiles(prev => [...prev, ...newFiles]);
    };

    const removeFile = (id: string) => {
        setFiles(prev => prev.filter(f => f.id !== id));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (files.length === 0) {
            toast({ title: "Documents Required", description: "Please attach at least one business document (TIN or License).", variant: "destructive" });
            return;
        }

        setIsLoading(true);
        try {
            // Step 1: Register Account
            const res = await fetch(API_ENDPOINTS.MARKETER.REGISTER, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (!res.ok || !data.status) {
                throw new Error(data.error || "Registration Failed");
            }

            const marketerId = data.marketer?._id || data.id;

            // Step 2: Upload Documents Sequentially
            for (let i = 0; i < files.length; i++) {
                setUploadProgress(Math.round(((i + 1) / files.length) * 100));
                await marketerAPI.uploadKYCDoc(marketerId, files[i].file, files[i].type);
            }

            setIsSubmitted(true);
            toast({
                title: "Application Received",
                description: "Your business profile is now in the verification queue.",
            });
        } catch (err: any) {
            toast({
                title: "Enrollment Error",
                description: err.message || "Failed to process application.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
            setUploadProgress(0);
        }
    };

    if (isSubmitted) {
        return (
            <div className="min-h-screen bg-white flex flex-col items-center justify-center p-8 text-center overflow-hidden font-sans">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[150px] pointer-events-none" />

                <div className="relative z-10 space-y-12 max-w-xl w-full">
                    <div className="animate-fade-in-up">
                        <Logo size="lg" className="mx-auto" />
                    </div>

                    <div className="inline-flex items-center justify-center p-10 bg-emerald-500/5 rounded-[3rem] border border-emerald-500/10 shadow-2xl shadow-emerald-500/5 animate-bounce-slow">
                        <CheckCircle2 className="h-16 w-16 text-emerald-500" />
                    </div>

                    <div className="space-y-6">
                        <h1 className="text-5xl font-black text-slate-900 italic uppercase tracking-tighter">Under Review</h1>
                        <p className="text-slate-500 text-xl font-medium leading-relaxed max-w-md mx-auto">
                            Your institutional credentials have been successfully encrypted and sent to our compliance team. 
                        </p>
                        <div className="pt-4 space-y-2">
                            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.4em]">Verification ETA</p>
                            <p className="text-slate-900 font-black italic uppercase tracking-widest bg-slate-100 py-2 px-6 rounded-full w-fit mx-auto text-xs">24 - 48 Hours</p>
                        </div>
                    </div>

                    <Button asChild className="w-full max-w-xs mx-auto bg-slate-900 text-white hover:bg-slate-800 h-16 rounded-[1.5rem] font-black uppercase tracking-widest transition-all shadow-xl active:scale-95">
                        <Link href="/marketer/login">Return to Portal</Link>
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white flex font-sans overflow-x-hidden text-slate-900">
            <div className="flex-1 flex items-center justify-center p-8 sm:p-16 relative overflow-y-auto">
                {/* Modern Ambient Background */}
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[160px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-orange-600/3 rounded-full blur-[160px] translate-y-1/2 -translate-x-1/2 pointer-events-none" />

                <div className="w-full max-w-[850px] space-y-12 relative z-10 py-16">
                    <div className="text-center space-y-6">
                        <div className="animate-fade-in-up">
                            <Logo size="lg" className="mx-auto" />
                        </div>
                        <div className="space-y-2">
                            <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-slate-900 italic uppercase leading-none">Partner Registration</h1>
                            <p className="text-slate-500 font-medium text-xl uppercase tracking-widest text-[10px]">Sign up your business for the AdRewards Network</p>
                        </div>
                    </div>

                    <div className="bg-white/40 backdrop-blur-3xl border border-slate-100 p-8 sm:p-14 rounded-[4rem] shadow-2xl shadow-slate-200/50">
                        <form onSubmit={handleSubmit} className="space-y-12">
                            
                            {/* Section 1: Business Identity */}
                            <div className="space-y-8">
                                <div className="flex items-center gap-3">
                                    <div className="h-8 w-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                                        <Building2 className="h-4 w-4" />
                                    </div>
                                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-900 italic">Business Profile</h3>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <Label htmlFor="company_name" className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] pl-1">Company Name</Label>
                                        <div className="relative group">
                                            <Building className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-focus-within:text-primary transition-colors" />
                                            <Input
                                                id="company_name"
                                                placeholder="Brand Identity Ltd."
                                                value={formData.company_name}
                                                onChange={handleChange}
                                                className="bg-slate-50/50 border-slate-100 text-slate-900 pl-12 h-14 rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary/30 transition-all font-bold placeholder:text-slate-300"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="business_category" className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] pl-1">Business Category</Label>
                                        <Select onValueChange={(v) => setFormData(p => ({...p, business_category: v}))}>
                                            <SelectTrigger className="h-14 rounded-2xl bg-slate-50/50 border-slate-100 font-bold">
                                                <SelectValue placeholder="Select Category" />
                                            </SelectTrigger>
                                            <SelectContent className="rounded-2xl border-slate-100 shadow-2xl">
                                                <SelectItem value="telecom">Telecommunications</SelectItem>
                                                <SelectItem value="banking">Banking & Finance</SelectItem>
                                                <SelectItem value="ecommerce">E-Commerce & Retail</SelectItem>
                                                <SelectItem value="government">Enterprise/Gov</SelectItem>
                                                <SelectItem value="agency">Marketing Agency</SelectItem>
                                                <SelectItem value="other">Other</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="business_reg_number" className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] pl-1">Business ID (TIN/License)</Label>
                                        <div className="relative group">
                                            <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-focus-within:text-primary transition-colors" />
                                            <Input
                                                id="business_reg_number"
                                                placeholder="ETH-..."
                                                value={formData.business_reg_number}
                                                onChange={handleChange}
                                                className="bg-slate-50/50 border-slate-100 text-slate-900 pl-12 h-14 rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary/30 transition-all font-mono font-bold"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="contact_info" className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] pl-1">Work Phone</Label>
                                        <div className="relative group">
                                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-focus-within:text-primary transition-colors" />
                                            <Input
                                                id="contact_info"
                                                placeholder="+251 ..."
                                                value={formData.contact_info}
                                                onChange={handleChange}
                                                className="bg-slate-50/50 border-slate-100 text-slate-900 pl-12 h-14 rounded-2xl focus:ring-4 focus:ring-primary/10 transition-all font-bold"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Section 2: Account Credentials */}
                            <div className="space-y-8">
                                <div className="flex items-center gap-3">
                                    <div className="h-8 w-8 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-600 border border-orange-500/20">
                                        <Lock className="h-4 w-4" />
                                    </div>
                                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-900 italic">Login Details</h3>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <Label htmlFor="name" className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] pl-1">Full Name</Label>
                                        <div className="relative group">
                                            <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-focus-within:text-primary transition-colors" />
                                            <Input
                                                id="name"
                                                placeholder="Lead Contact"
                                                value={formData.name}
                                                onChange={handleChange}
                                                className="bg-slate-50/50 border-slate-100 text-slate-900 pl-12 h-14 rounded-2xl font-bold"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="email" className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] pl-1">Email Address</Label>
                                        <div className="relative group">
                                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-focus-within:text-primary transition-colors" />
                                            <Input
                                                id="email"
                                                type="email"
                                                placeholder="corp@identity.et"
                                                value={formData.email}
                                                onChange={handleChange}
                                                className="bg-slate-50/50 border-slate-100 text-slate-900 pl-12 h-14 rounded-2xl font-bold"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="md:col-span-2 space-y-2">
                                        <Label htmlFor="password" title="Your Account Password" className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] pl-1">Password</Label>
                                        <div className="relative group">
                                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-focus-within:text-primary transition-colors" />
                                            <Input
                                                id="password"
                                                type="password"
                                                placeholder="••••••••••••"
                                                value={formData.password}
                                                onChange={handleChange}
                                                className="bg-slate-50/50 border-slate-100 text-slate-900 pl-12 h-14 rounded-2xl font-bold"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Section 3: Business Documents */}
                            <div className="space-y-8">
                                <div className="flex items-center gap-3">
                                    <div className="h-8 w-8 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-600 border border-blue-500/20">
                                        <FileText className="h-4 w-4" />
                                    </div>
                                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-900 italic">Verify Business</h3>
                                </div>
                                
                                <div className={cn(
                                    "border-2 border-dashed rounded-[2.5rem] p-12 text-center transition-all bg-slate-50/30",
                                    files.length > 0 ? "border-emerald-500/30" : "border-slate-200 hover:border-primary/40 hover:bg-primary/[0.02]"
                                )}>
                                    <input 
                                        type="file" 
                                        multiple 
                                        className="hidden" 
                                        id="doc-upload" 
                                        onChange={handleFileChange}
                                        accept=".pdf,.jpg,.jpeg,.png"
                                    />
                                    
                                    <div className="space-y-6">
                                        <div className="w-16 h-16 rounded-3xl mx-auto bg-white flex items-center justify-center shadow-xl border border-slate-100">
                                            <CloudUpload className="h-8 w-8 text-primary" />
                                        </div>
                                        <div className="space-y-2">
                                            <p className="font-black text-slate-900 uppercase italic tracking-tighter text-xl">Upload Business Proof</p>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">TIN Certificate, Business License, or ID</p>
                                        </div>
                                        <Button type="button" variant="outline" className="rounded-full border-slate-200 h-11 px-8 font-black uppercase tracking-widest text-[10px] hover:bg-slate-900 hover:text-white transition-all shadow-sm" asChild>
                                            <label htmlFor="doc-upload" className="cursor-pointer">Select Files</label>
                                        </Button>
                                    </div>
                                </div>

                                {files.length > 0 && (
                                    <div className="grid md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-4">
                                        {files.map((f) => (
                                            <div key={f.id} className="flex items-center justify-between p-4 bg-slate-900 text-white rounded-2xl border border-white/5 shadow-2xl">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-8 w-8 rounded-lg bg-white/10 flex items-center justify-center">
                                                        <FileText className="h-4 w-4 text-primary" />
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="text-[10px] font-black uppercase italic truncate max-w-[150px]">{f.file.name}</p>
                                                        <p className="text-[8px] font-bold text-slate-400 tracking-widest uppercase">{(f.file.size / 1024 / 1024).toFixed(2)} MB</p>
                                                    </div>
                                                </div>
                                                <button onClick={() => removeFile(f.id)} className="h-8 w-8 rounded-lg hover:bg-rose-500 transition-colors flex items-center justify-center">
                                                    <X className="h-4 w-4" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="pt-8 relative">
                                {isLoading && (
                                    <div className="absolute -top-12 left-0 w-full text-center space-y-2">
                                        <p className="text-[9px] font-black text-primary uppercase tracking-[0.4em] italic">Transmitting {uploadProgress}%</p>
                                        <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
                                            <div className="h-full bg-primary transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
                                        </div>
                                    </div>
                                )}
                                <Button
                                    type="submit"
                                    className="w-full h-20 rounded-[2rem] text-2xl font-black tracking-tighter uppercase italic bg-slate-900 text-white shadow-2xl active:scale-[0.98] transition-all hover:bg-slate-800 disabled:opacity-50"
                                    disabled={isLoading}
                                >
                                    {isLoading ? "Processing Gateway..." : "Request Access →"}
                                </Button>
                            </div>
                        </form>
                    </div>

                    <div className="text-center group">
                        <Link
                            href="/marketer/login"
                            className="text-[10px] font-black text-slate-400 hover:text-primary uppercase tracking-[0.4em] transition-all flex items-center justify-center gap-2"
                        >
                            Already have an invitation? <span className="text-slate-900 font-black group-hover:text-primary transition-colors">LOGIN HERE</span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
