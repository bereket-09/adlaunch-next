"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { 
  ArrowRight, 
  Play, 
  Shield, 
  BarChart3, 
  Activity, 
  Users, 
  Sparkles, 
  ShieldCheck, 
  Mail 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Logo from "@/components/Logo";

export default function IndexPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-primary/20 selection:text-primary overflow-x-hidden">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-500 bg-black/40 backdrop-blur-3xl border-b border-white/5">
        <div className="container mx-auto px-8 h-24 flex items-center justify-between">
          <Logo size="md" forceWhite />
          <nav className="hidden lg:flex items-center gap-12 text-[10px] font-black uppercase tracking-[0.3em] text-slate-300">
            <Link href="#features" className="hover:text-primary transition-colors">Features</Link>
            <Link href="#how-it-works" className="hover:text-primary transition-colors">How it Works</Link>
            <Link href="#results" className="hover:text-primary transition-colors">Results</Link>
            <Link href="/contact" className="hover:text-primary transition-colors">Support</Link>
          </nav>
          <div className="flex items-center gap-8">
            <Link href="/marketer/login" className="hidden sm:block">
              <Button variant="ghost" className="text-slate-300 hover:text-white font-black uppercase tracking-widest text-[10px]">Marketer Hub</Button>
            </Link>
            <Link href="/marketer/login" className="hidden sm:block">
              <Button className="bg-primary text-white hover:bg-orange-600 shadow-orange-glow px-10 h-14 rounded-2xl font-black uppercase tracking-tighter italic scale-100 hover:scale-[1.02] active:scale-[0.98] transition-all">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section - Minimalist & Centered */}
      <section className="relative min-h-screen flex items-center justify-center pt-32 bg-slate-950 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 z-0 text-center">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-primary/10 rounded-full blur-[180px]" />
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.03] bg-[size:60px_60px]" />
        </div>

        <div className="container mx-auto max-w-5xl relative z-10 px-8 text-center">
          <div className="space-y-12">
            <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-white/5 border border-white/10 text-primary text-[10px] font-black uppercase tracking-[0.4em] animate-fade-in mx-auto">
              The Digital Ad Network
            </div>

            <h1 className="text-4xl sm:text-6xl md:text-[7.5rem] font-black tracking-tighter leading-[0.8] uppercase italic text-white animate-fade-in-up [animation-delay:100ms] max-w-4xl mx-auto">
              Real Views. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-primary to-orange-500 italic">Guaranteed Impact.</span>
            </h1>

            <div className="space-y-8 max-w-2xl mx-auto animate-fade-in-up [animation-delay:200ms]">
              <p className="text-xl md:text-2xl text-slate-400 font-medium leading-relaxed">
                Reach millions with video campaigns that are actually watched. Join a community of brands that prioritize results over noise.
              </p>
              <div className="flex justify-center flex-wrap gap-8">
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-primary" />
                  <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Verified Human Traffic</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-primary" />
                  <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Premium Brand Safety</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 animate-fade-in-up [animation-delay:300ms] w-full max-w-lg mx-auto">
              <Link href="/marketer/login" className="flex-1">
                <Button className="w-full h-18 bg-primary text-white shadow-orange-glow hover:scale-105 transition-all text-xl font-black uppercase tracking-tighter italic rounded-2xl">
                  Launch Now
                </Button>
              </Link>
              <Link href="#features" className="flex-1">
                <Button variant="outline" className="w-full h-18 text-xl font-black uppercase tracking-tighter italic rounded-2xl border-white/10 bg-white/5 text-white hover:bg-white/10 transition-all">
                  Features
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce opacity-20">
          <div className="w-6 h-10 rounded-full border-2 border-white flex justify-center pt-2">
            <div className="w-1 h-2 bg-white rounded-full" />
          </div>
        </div>
      </section>

      {/* How it Works - Simple 2-Column Text */}
      <section id="how-it-works" className="py-40 bg-white">
        <div className="container mx-auto px-8">
          <div className="text-center max-w-3xl mx-auto mb-32 space-y-6">
            <h2 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter text-slate-900 leading-none">Watch & <span className="text-primary italic">Grow.</span></h2>
            <p className="text-slate-500 text-xl font-medium">A direct bridge from your brand to an engaged audience.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-20 max-w-6xl mx-auto">
            {[
              {
                step: "01",
                title: "Create & Target",
                desc: "Upload your video message and select who you want to reach. We take care of setting up the proper channels for max visibility.",
                perks: ["Smart Segmentation", "Easy Uploads"]
              },
              {
                step: "02",
                title: "View & Engage",
                desc: "Your content is watched by real people in our network. Engagement is recorded in real-time, providing immediate feedback.",
                perks: ["Verified Engagement", "Real Results"]
              }
            ].map((item, i) => (
              <div key={i} className="p-12 bg-slate-50 border border-slate-100 rounded-[3rem] space-y-10 group hover:bg-white hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500">
                <div className="text-6xl font-black italic text-slate-200 group-hover:text-primary transition-colors">{item.step}</div>
                <div className="space-y-6">
                   <h3 className="text-4xl font-black italic uppercase tracking-tight text-slate-900">{item.title}</h3>
                   <p className="text-slate-500 text-xl leading-relaxed">{item.desc}</p>
                   <div className="flex flex-wrap gap-3 pt-4">
                      {item.perks.map((p, idx) => (
                         <span key={idx} className="text-[10px] font-black uppercase tracking-widest bg-slate-100 px-5 py-2 rounded-full text-slate-600 italic group-hover:bg-primary/5 group-hover:text-primary">{p}</span>
                      ))}
                   </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Simplified Features Grid */}
      <section id="features" className="py-40 bg-slate-950 text-white relative">
        <div className="container mx-auto px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-32 space-y-8">
            <h2 className="text-6xl md:text-7xl font-black italic uppercase tracking-tighter leading-none">Powerful <br /><span className="text-primary italic">Intelligence.</span></h2>
            <p className="text-slate-400 text-xl font-medium">Tools built to give you full control over your campaign success.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: "Real Views", desc: "No bots. Just human focus on your brand.", icon: Users },
              { title: "Live Insights", desc: "Watch your reach climb second-by-second.", icon: Activity },
              { title: "Smart Targeting", desc: "Connect with those who seek your service.", icon: Sparkles },
              { title: "Secure Portal", desc: "Institutional-grade data protection.", icon: Shield },
              { title: "Fast Setup", desc: "Go live as soon as your video is ready.", icon: Play },
              { title: "Total Success", desc: "Guaranteed engagement from start to end.", icon: ShieldCheck },
            ].map((f, i) => (
              <div key={i} className="p-12 bg-white/5 border border-white/10 rounded-[3rem] hover:bg-white/10 transition-all group">
                 <f.icon className="h-10 w-10 text-primary mb-8" />
                 <h3 className="text-2xl font-black italic uppercase tracking-tight mb-4 group-hover:text-primary transition-colors">{f.title}</h3>
                 <p className="text-slate-500 font-medium leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Simplified Results */}
      <section id="results" className="py-40 bg-white">
        <div className="container mx-auto px-8 text-center max-w-4xl mx-auto space-y-24">
          <h2 className="text-6xl md:text-8xl font-black italic uppercase tracking-tighter text-slate-900 leading-none">Proven <br /><span className="text-primary">Performance.</span></h2>
          
          <div className="grid sm:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              { val: "92%", label: "Real View Rate", color: "from-primary" },
              { val: "78%", label: "Brand Recall", color: "from-orange-500" },
              { val: "100%", label: "Satisfaction", color: "from-slate-900" }
            ].map((stat, i) => (
              <div key={i} className="relative group p-12 bg-slate-950 rounded-[3rem] overflow-hidden">
                <div className={cn("absolute inset-0 opacity-10 bg-gradient-to-br transition-all duration-500 group-hover:opacity-20", stat.color, "to-transparent")} />
                <div className="relative z-10 space-y-4">
                  <p className="text-6xl font-black italic tracking-tighter text-white">{stat.val}</p>
                  <div className="h-1 w-12 bg-primary rounded-full" />
                  <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-20">
            <Link href="/marketer/login">
              <Button size="xl" className="h-24 bg-slate-900 text-white shadow-2xl text-2xl font-black uppercase tracking-tighter italic px-20 rounded-[2.5rem] transition-all hover:scale-105 active:scale-95">
                Join the Network
                <ArrowRight className="h-8 w-8 ml-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer - Final Clean Structure */}
      <footer className="pt-32 pb-20 px-8 bg-slate-50 border-t border-slate-200">
        <div className="container mx-auto max-w-7xl">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-32 mb-32">
             <div className="space-y-10">
                <Logo size="md" />
                <p className="text-slate-500 text-sm font-medium leading-relaxed max-w-xs uppercase italic tracking-widest">Connecting Premium Brands with the Heart of the Audience.</p>
             </div>
             
             <div className="grid grid-cols-2 gap-12">
               <div className="space-y-10">
                  <p className="text-[10px] font-black text-slate-900 uppercase tracking-[0.4em]">Company</p>
                  <ul className="space-y-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
                     <li><Link href="#features" className="hover:text-primary">Features</Link></li>
                     <li><Link href="/privacy" className="hover:text-primary">Privacy</Link></li>
                     <li><Link href="/terms" className="hover:text-primary">Terms</Link></li>
                  </ul>
               </div>
               <div className="space-y-10">
                  <p className="text-[10px] font-black text-slate-900 uppercase tracking-[0.4em]">Connect</p>
                  <p className="text-xs font-bold text-slate-400 leading-relaxed uppercase tracking-widest italic">
                     Addis Ababa <br />
                     support@adrewards.app
                  </p>
               </div>
             </div>
          </div>
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-12 border-t border-slate-200 pt-12">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">© 2026 AdRewards Group. All rights reserved.</p>
            <div className="flex gap-12 text-[10px] font-black text-slate-900 uppercase tracking-[0.3em] italic">
               <span>Simple</span>
               <span>Direct</span>
               <span>Effective</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
