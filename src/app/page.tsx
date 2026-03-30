"use client";

import Link from "next/link";
import { Play, Users, BarChart3, Shield, ArrowRight, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import Logo from "@/components/Logo";

export default function IndexPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-primary/30 selection:text-white overflow-x-hidden">
      {/* Decorative Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-orange-600/5 rounded-full blur-[120px]" />
      </div>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-500 bg-[#050505]/60 backdrop-blur-3xl border-b border-white/5">
        <div className="container mx-auto px-8 h-24 flex items-center justify-between">
          <Logo size="md" />
          <div className="flex items-center gap-8">
            <Link href="/marketer/login" className="hidden sm:block">
              <Button variant="ghost" className="text-slate-400 hover:text-white hover:bg-white/5 font-black uppercase tracking-widest text-[10px]">Partner Hub</Button>
            </Link>
            <Link href="/marketer/login">
              <Button className="bg-white text-black hover:bg-white/90 shadow-xl px-10 h-14 rounded-2xl font-black uppercase tracking-tighter italic scale-100 hover:scale-[1.02] active:scale-[0.98] transition-all">
                Enter Portal
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-60 pb-40 px-8">
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="flex flex-col items-center text-center space-y-12">
            <div className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full bg-white/[0.03] border border-white/10 text-primary text-[10px] font-black uppercase tracking-[0.4em] animate-fade-in-up">
              <span className="h-2 w-2 rounded-full bg-primary animate-pulse shadow-[0_0_12px_rgba(255,109,0,0.8)]" />
              Revolutionizing Digital Engagement
            </div>

            <h1 className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter leading-[0.85] uppercase italic animate-fade-in-up [animation-delay:100ms]">
              Dominate <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-primary to-orange-400">Your Reach.</span>
            </h1>

            <p className="text-xl md:text-2xl text-slate-400 font-medium max-w-3xl leading-relaxed animate-fade-in-up [animation-delay:200ms]">
              Precision video campaigns with guaranteed completion rates and deep audience intelligence.
            </p>

            <div className="flex flex-col sm:flex-row gap-8 justify-center animate-fade-in-up [animation-delay:300ms] w-full max-w-2xl">
              <Link href="/marketer/login" className="flex-1">
                <Button className="w-full h-20 bg-gradient-to-r from-orange-600 to-primary text-white shadow-orange-glow hover:opacity-95 text-2xl font-black uppercase tracking-tighter italic rounded-[2rem] transition-all active:scale-[0.98]">
                  Launch Now
                  <ArrowRight className="h-6 w-6 ml-3" />
                </Button>
              </Link>
              <Link href="/watch?v=demo" className="flex-1">
                <Button variant="outline" className="w-full h-20 text-2xl font-black uppercase tracking-tighter italic rounded-[2rem] border-white/10 bg-white/[0.02] hover:bg-white/5 transition-all active:scale-[0.98]">
                  <Play className="h-6 w-6 mr-3 fill-current" />
                  View Showcase
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="container mx-auto px-8 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 sm:gap-24 items-center">
            {[
              { value: "100k+", label: "Real-time Views", icon: Play },
              { value: "95%", label: "Completion Rate", icon: Activity },
              { value: "100+", label: "Premium Brands", icon: Shield },
              { value: "5M+", label: "Global Audience", icon: Users },
            ].map((stat, i) => (
              <div key={i} className="group flex flex-col items-center">
                <p className="text-5xl md:text-7xl font-black tracking-tighter italic text-white group-hover:text-primary transition-colors duration-500">{stat.value}</p>
                <div className="mt-3 flex items-center gap-3">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-40 px-8 bg-white/[0.01] border-y border-white/5 relative">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-32 space-y-6">
            <h2 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter">Engineered for <span className="text-primary">Impact.</span></h2>
            <p className="text-slate-500 font-medium text-lg max-w-2xl mx-auto uppercase tracking-widest text-xs">
              State-of-the-art infrastructure built to scale your message.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-12">
            {[
              {
                icon: Play,
                title: "Zero Skip-Rates",
                description: "Our proprietary playback protocol ensures every second is watched, maximizing your ad spend.",
              },
              {
                icon: BarChart3,
                title: "Precision Analytics",
                description: "Deep dive into audience behavior with real-time tracking and conversion intelligence.",
              },
              {
                icon: Shield,
                title: "Fraud Immunity",
                description: "Multi-layered verification nodes guarantee that every view comes from a real human audience.",
              },
            ].map((f, i) => (
              <div
                key={i}
                className="group relative bg-white/[0.02] backdrop-blur-3xl border border-white/5 p-16 rounded-[4rem] hover:bg-white/[0.04] hover:border-white/10 transition-all duration-500"
              >
                <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.1] transition-opacity">
                   <f.icon className="h-32 w-32" />
                </div>
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-primary/10 text-primary mb-10 group-hover:scale-110 transition-transform duration-500 shadow-2xl shadow-primary/20">
                  <f.icon className="h-10 w-10" />
                </div>
                <h3 className="text-3xl font-black italic uppercase tracking-tight mb-4">{f.title}</h3>
                <p className="text-slate-400 font-medium text-lg leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-60 px-8 overflow-hidden text-center">
        <div className="absolute inset-0 bg-primary/5 pointer-events-none" />
        <div className="container mx-auto relative z-10 max-w-4xl space-y-12">
          <h2 className="text-6xl md:text-8xl font-black italic uppercase tracking-tighter leading-[0.85]">
            Scale Your <br />
            <span className="text-primary italic">Ambition.</span>
          </h2>
          <p className="text-xl md:text-2xl text-slate-400 font-medium max-w-2xl mx-auto leading-relaxed uppercase tracking-[0.1em] text-sm">
            Join the elite network of brands leveraging high-impact video at scale.
          </p>
          <div className="pt-8">
            <Link href="/marketer/login">
              <Button size="xl" className="h-24 bg-white text-black hover:bg-white/90 shadow-2xl text-3xl font-black uppercase tracking-tighter italic px-20 rounded-[2.5rem] transition-all hover:scale-105 active:scale-95">
                Apply Today
                <ArrowRight className="h-8 w-8 ml-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 px-8 bg-[#050505] border-t border-white/5">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            <Logo size="md" />
            <div className="flex flex-wrap justify-center gap-12 text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">
              <a className="hover:text-primary transition-all cursor-pointer">Security Protocol</a>
              <a className="hover:text-primary transition-all cursor-pointer">Transparency</a>
              <a className="hover:text-primary transition-all cursor-pointer">Terms of Service</a>
              <a className="hover:text-primary transition-all cursor-pointer">Contact Desk</a>
            </div>
            <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em]">© 2026 AdRewards Group.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
