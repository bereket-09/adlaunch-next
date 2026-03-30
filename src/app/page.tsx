"use client";

import Link from "next/link";
import { Play, Users, BarChart3, Shield, ArrowRight, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import Logo from "@/components/Logo";

export default function IndexPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-primary/20 selection:text-primary overflow-x-hidden">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-500 bg-black/20 backdrop-blur-3xl border-b border-white/5">
        <div className="container mx-auto px-8 h-24 flex items-center justify-between">
          <Logo size="md" forceWhite />
          <div className="flex items-center gap-8">
            <Link href="/marketer/login" className="hidden sm:block">
              <Button variant="ghost" className="text-slate-300 hover:text-white font-black uppercase tracking-widest text-[10px]">Marketer Hub</Button>
            </Link>
            <Link href="/marketer/login">
              <Button className="bg-primary text-white hover:bg-orange-600 shadow-xl px-10 h-14 rounded-2xl font-black uppercase tracking-tighter italic scale-100 hover:scale-[1.02] active:scale-[0.98] transition-all">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section - Premium Dark */}
      <section className="relative min-h-[90vh] flex items-center justify-center pt-24 bg-slate-950 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-orange-600/5 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2" />
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.05] bg-center [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
        </div>

        <div className="container mx-auto max-w-6xl relative z-10 px-8">
          <div className="flex flex-col items-center text-center space-y-10">
            <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-white/5 border border-white/10 text-primary text-[10px] font-black uppercase tracking-[0.4em] animate-fade-in">
              The Next-Gen Video Ad Network
            </div>

            <h1 className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter leading-[0.85] uppercase italic text-white animate-fade-in-up [animation-delay:100ms]">
              Reach more. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-primary">Impact Every View.</span>
            </h1>

            <p className="text-xl md:text-2xl text-slate-400 font-medium max-w-3xl leading-relaxed animate-fade-in-up [animation-delay:200ms]">
              Ethiopia's leading digital advertising network. Launch high-impact video campaigns targeting millions of local viewers.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center animate-fade-in-up [animation-delay:300ms] w-full max-w-xl">
              <Link href="/marketer/login" className="flex-1">
                <Button className="w-full h-20 bg-primary text-white shadow-orange-glow hover:bg-orange-600 text-2xl font-black uppercase tracking-tighter italic rounded-[2rem] transition-all active:scale-[0.98]">
                  Launch Campaign
                </Button>
              </Link>
              <Link href="/watch?v=demo" className="flex-1">
                <Button variant="outline" className="w-full h-20 text-2xl font-black uppercase tracking-tighter italic rounded-[2rem] border-white/10 bg-white/5 text-white hover:bg-white/10 transition-all active:scale-[0.98]">
                  <Play className="h-6 w-6 mr-3 fill-current" />
                  View Demo
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

      {/* Stats Section - Clean Light */}
      <section className="py-24 bg-white border-b border-slate-100">
        <div className="container mx-auto px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
            {[
              { value: "100k+", label: "Regional Views" },
              { value: "95%", label: "Completion Rate" },
              { value: "100+", label: "Active Brands" },
              { value: "5M+", label: "Reach" },
            ].map((stat, i) => (
              <div key={i} className="space-y-2">
                <p className="text-5xl md:text-6xl font-black tracking-tighter italic text-slate-900">{stat.value}</p>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-40 px-8 bg-slate-50/50">
        <div className="container mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-3 gap-8">
            {[
              {
                icon: Play,
                title: "Premium Content",
                description: "Your ads served alongside high-quality video content that users actually want to watch.",
              },
              {
                icon: BarChart3,
                title: "Smart Analytics",
                description: "Real-time verification and engagement metrics optimized for the regional market.",
              },
              {
                icon: Shield,
                title: "Brand Safety",
                description: "100% human-verified views with zero-tolerance for bot traffic or low-quality placements.",
              },
            ].map((f, i) => (
              <div
                key={i}
                className="group bg-white border border-slate-100 p-12 rounded-[3.5rem] hover:shadow-2xl transition-all duration-500"
              >
                <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                  <f.icon className="h-8 w-8" />
                </div>
                <h3 className="text-2xl font-black italic uppercase tracking-tight mb-4 text-slate-900">{f.title}</h3>
                <p className="text-slate-500 font-medium leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-60 px-8 text-center bg-white">
        <div className="container mx-auto max-w-4xl space-y-12">
          <h2 className="text-6xl md:text-8xl font-black italic uppercase tracking-tighter text-slate-900">
            Start <span className="text-primary italic">Growing.</span>
          </h2>
          <Link href="/marketer/login">
            <Button size="xl" className="h-24 bg-slate-900 text-white hover:bg-slate-800 shadow-2xl text-2xl font-black uppercase tracking-tighter italic px-20 rounded-[2.5rem] transition-all hover:scale-105 active:scale-95">
              Contact Us Now
              <ArrowRight className="h-8 w-8 ml-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 px-8 bg-slate-50 border-t border-slate-100">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            <Logo size="md" />
            <div className="flex gap-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
              <Link href="/privacy" className="hover:text-primary transition-all">Privacy</Link>
              <Link href="/terms" className="hover:text-primary transition-all">Terms</Link>
              <Link href="/contact" className="hover:text-primary transition-all">Contact</Link>
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">© 2026 AdRewards Group.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
