"use client";

import Link from "next/link";
import { Play, Users, BarChart3, Shield, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Logo from "@/components/Logo";

export default function IndexPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100 text-foreground">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-orange-200 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Logo />
          <div className="flex items-center gap-4">
            <Link href="/marketer/login">
              <Button variant="ghost" className="hover:text-primary">Marketers Login</Button>
            </Link>
            <Link href="/admin/login">
              <Button className="bg-primary text-white hover:bg-primary/90 shadow-md px-6">Admin Portal</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-36 pb-24 px-4 relative overflow-hidden">
        {/* Background Decorative Shapes */}
        <div className="absolute top-10 right-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-10 w-72 h-72 bg-orange-300/10 rounded-full blur-3xl" />

        <div className="container mx-auto text-center max-w-4xl relative">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-orange-200 to-orange-100 text-primary text-sm font-medium mb-8 animate-fade-in shadow-sm">
            <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
            Premium Video Advertisement Platform
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-foreground mb-6 animate-slide-up">
            Boost Your Reach With
            <span className="text-primary"> High-Impact Video Ads</span>
          </h1>

          <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto animate-slide-up opacity-90">
            Deliver powerful video campaigns with guaranteed views, real engagement, and next-level analytics.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up">
            <Link href="/marketer/login">
              <Button className="bg-gradient-to-r from-primary to-orange-600 text-white shadow-xl hover:opacity-90 px-8 py-6 text-lg rounded-2xl">
                Get Started
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </Link>
            <Link href="/watch?v=demo">
              <Button variant="outline" className="px-8 py-6 text-lg rounded-2xl border-orange-300 hover:bg-orange-50">
                <Play className="h-5 w-5 mr-2" />
                Watch Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white/70 backdrop-blur-lg border-y border-orange-100">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
            {[
              { value: "100k+", label: "Daily Views" },
              { value: "95%", label: "Completion Rate" },
              { value: "100+", label: "Active Marketers" },
              { value: "5M+", label: "Users Reached" },
            ].map((stat, i) => (
              <div key={i} className="text-center p-4 rounded-xl hover:bg-orange-50 transition-all">
                <p className="text-4xl font-extrabold text-primary drop-shadow-sm">{stat.value}</p>
                <p className="text-muted-foreground mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Why Advertisers Choose Us</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Built for performance. Designed for growth. Trusted by brands.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {[
              {
                icon: Play,
                title: "Guaranteed Views",
                description: "Every viewer watches the full ad — no skipping, no fast-forwarding.",
              },
              {
                icon: BarChart3,
                title: "Advanced Analytics",
                description: "Track engagement, audience behavior, and campaign ROI in real-time.",
              },
              {
                icon: Shield,
                title: "Fraud Protection",
                description: "Protect your budget with secure, verified view tracking.",
              },
            ].map((f, i) => (
              <div
                key={i}
                className="bg-white shadow-xl p-10 rounded-3xl border border-orange-100 hover:border-primary/40 transition-all group"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-orange-100 text-primary mb-6 group-hover:scale-110 transition-transform">
                  <f.icon className="h-8 w-8" />
                </div>
                <h3 className="text-2xl font-semibold mb-3">{f.title}</h3>
                <p className="text-muted-foreground">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 bg-gradient-to-br from-primary to-orange-600 text-white text-center">
        <div className="container mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Scale Your Campaigns?</h2>
          <p className="text-lg opacity-90 mb-10 max-w-xl mx-auto">
            Start creating high-impact video ads today and reach millions instantly.
          </p>
          <Link href="/marketer/login">
            <Button size="xl" className="bg-white text-primary hover:bg-white/90 shadow-xl text-lg px-10 py-6 rounded-2xl">
              Start Your Campaign
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-14 px-4 bg-white border-t border-orange-200">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <Logo size="sm" />
            <p className="text-sm text-muted-foreground">© 2026 AdRewards Pro. All rights reserved.</p>
            <div className="flex gap-6 text-sm text-muted-foreground">
              <a className="hover:text-primary transition-colors cursor-pointer">Privacy</a>
              <a className="hover:text-primary transition-colors cursor-pointer">Terms</a>
              <a className="hover:text-primary transition-colors cursor-pointer">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
