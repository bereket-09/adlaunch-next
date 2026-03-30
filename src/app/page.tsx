"use client";

import Link from "next/link";
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
            <Link href="#features" className="hover:text-primary transition-colors">Infrastructure</Link>
            <Link href="#how-it-works" className="hover:text-primary transition-colors">How it Works</Link>
            <Link href="#reach" className="hover:text-primary transition-colors">Market Reach</Link>
            <Link href="/contact" className="hover:text-primary transition-colors">Support</Link>
          </nav>
          <div className="flex items-center gap-8">
            <Link href="/marketer/login" className="hidden sm:block">
              <Button variant="ghost" className="text-slate-300 hover:text-white font-black uppercase tracking-widest text-[10px]">Marketer Hub</Button>
            </Link>
            <Link href="/marketer/login">
              <Button className="bg-primary text-white hover:bg-orange-600 shadow-orange-glow px-10 h-14 rounded-2xl font-black uppercase tracking-tighter italic scale-100 hover:scale-[1.02] active:scale-[0.98] transition-all">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section - Premium Dark */}
      <section className="relative min-h-screen flex items-center justify-center pt-32 bg-slate-950 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 right-0 w-[1000px] h-[1000px] bg-primary/10 rounded-full blur-[150px] -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-orange-600/5 rounded-full blur-[150px] translate-y-1/2 -translate-x-1/2" />
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.05] bg-[size:60px_60px]" />
        </div>

        <div className="container mx-auto max-w-7xl relative z-10 px-8">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-12 text-left">
              <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-white/5 border border-white/10 text-primary text-[10px] font-black uppercase tracking-[0.4em] animate-fade-in">
                The Ethiopia Ad Infrastructure
              </div>

              <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.85] uppercase italic text-white animate-fade-in-up [animation-delay:100ms]">
                Reach more <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-primary to-orange-500 italic">Impact Every View.</span>
              </h1>

              <div className="space-y-6 max-w-xl animate-fade-in-up [animation-delay:200ms]">
                <p className="text-xl md:text-2xl text-slate-400 font-medium leading-relaxed">
                  Launch high-impact video campaigns that actually get watched. Guaranteed human engagement with Zero Fraud.
                </p>
                <div className="flex flex-wrap gap-x-8 gap-y-4">
                  <div className="flex items-center gap-3">
                    <Shield className="h-5 w-5 text-primary" />
                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Ethio-Telecom Verified</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Shield className="h-5 w-5 text-primary" />
                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Safaricom Ready</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-6 animate-fade-in-up [animation-delay:300ms] w-full max-w-md">
                <Link href="/marketer/login" className="flex-1">
                  <Button className="w-full h-20 bg-primary text-white shadow-orange-glow hover:scale-105 transition-all text-2xl font-black uppercase tracking-tighter italic rounded-[2rem]">
                    Launch Now
                  </Button>
                </Link>
                <Link href="#how-it-works" className="flex-1">
                  <Button variant="outline" className="w-full h-20 text-2xl font-black uppercase tracking-tighter italic rounded-[2rem] border-white/10 bg-white/5 text-white hover:bg-white/10 transition-all">
                    How it Works
                  </Button>
                </Link>
              </div>
            </div>

            <div className="relative group animate-fade-in-right [animation-delay:400ms]">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary to-orange-600 rounded-[3rem] blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative bg-slate-900 border border-white/10 rounded-[3rem] overflow-hidden aspect-video shadow-2xl">
                 <img src="/campaign_dashboard_mockup_1774874037229.png" alt="Dashboard Mockup" className="w-full h-full object-cover opacity-80 group-hover:scale-105 group-hover:opacity-100 transition-all duration-700" />
              </div>
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

      {/* Trust Section */}
      <section className="py-12 bg-white border-b border-slate-100">
        <div className="container mx-auto px-8">
          <div className="flex flex-col md:flex-row items-center justify-center gap-12 md:gap-32 text-center">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Integrated with elite infrastructure</p>
            <div className="flex flex-wrap justify-center gap-16 items-center opacity-30 grayscale saturate-0">
               <div className="text-3xl font-black tracking-tighter italic text-slate-900 underline decoration-primary decoration-4">ETHIO-TELECOM</div>
               <div className="text-3xl font-black tracking-tighter italic text-slate-900">SAFARICOM</div>
               <div className="text-3xl font-black tracking-tighter italic text-slate-900 underline decoration-orange-500 decoration-4">LOCAL BANKS</div>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="py-40 bg-white">
        <div className="container mx-auto px-8">
          <div className="text-center max-w-3xl mx-auto mb-32 space-y-6">
            <h2 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter text-slate-900">Two-Way <span className="text-primary italic">Synergy.</span></h2>
            <p className="text-slate-500 text-xl font-medium">A streamlined ecosystem connecting regional brands with engaged local viewers.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
             <div className="space-y-20">
                {[
                  {
                    step: "01",
                    title: "For Marketers",
                    desc: "Upload high-quality video creative and set your audience profile. Our systems verify the content and distribute it across our regional network.",
                    points: ["Precise Keyword Targeting", "Verified Completion Rate"]
                  },
                  {
                    step: "02",
                    title: "For Viewers",
                    desc: "Local audience watches the platform's video content. Once they engage with your ad, they unlock digital rewards, ensuring 100% focus.",
                    points: ["Ethio-Telecom verified engagement", "Zero Reward Fraud"]
                  }
                ].map((item, i) => (
                  <div key={i} className="flex gap-12 group">
                    <div className="text-6xl font-black italic text-slate-100 group-hover:text-primary/10 transition-colors duration-500">{item.step}</div>
                    <div className="space-y-6">
                       <h3 className="text-3xl font-black italic uppercase tracking-tight text-slate-900">{item.title}</h3>
                       <p className="text-slate-500 text-lg leading-relaxed max-w-md">{item.desc}</p>
                       <div className="flex gap-4">
                          {item.points.map((p, idx) => (
                             <span key={idx} className="text-[8px] font-black uppercase tracking-widest bg-slate-100 px-4 py-2 rounded-full text-slate-500">{p}</span>
                          ))}
                       </div>
                    </div>
                  </div>
                ))}
             </div>
             
             <div className="relative group">
                <div className="absolute -inset-4 bg-primary/5 rounded-[4rem] group-hover:bg-primary/10 transition-colors" />
                <div className="relative bg-slate-50 border border-slate-200 rounded-[3rem] overflow-hidden shadow-xl p-12">
                   <div className="space-y-8">
                      <div className="relative w-full aspect-[9/16] bg-slate-950 rounded-[2.5rem] overflow-hidden shadow-2xl mx-auto max-w-[280px]">
                         <img src="/viewer_app_mockup_1774874221939.png" alt="Mobile Experience" className="w-full h-full object-cover opacity-90" />
                      </div>
                      <div className="text-center">
                         <p className="text-[10px] font-black text-primary uppercase tracking-[0.4em]">Real-Time Rewards</p>
                         <p className="text-slate-400 text-xs font-bold uppercase mt-2 italic">Active Ad Completion Unit</p>
                      </div>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Features Grid - PACKED */}
      <section id="features" className="py-40 bg-slate-950 text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('/grid.svg')] opacity-[0.03] bg-[size:40px_40px]" />
        
        <div className="container mx-auto px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-end justify-between mb-32 gap-12">
            <div className="space-y-8 max-w-2xl">
              <h2 className="text-6xl md:text-8xl font-black italic uppercase tracking-tighter leading-[0.85]">Regional <span className="text-primary italic">Infrastructure.</span></h2>
              <p className="text-slate-400 text-xl font-medium">Built from the ground up to solve the challenges of digital advertising within Ethiopia.</p>
            </div>
            <div className="text-right">
               <p className="text-[80px] font-black italic tracking-tighter text-white opacity-5">04+</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { title: "Low Latency", desc: "Optimized for regional network nodes to ensure buffer-free video delivery.", icon: Activity },
              { title: "Fraud Immunity", desc: "Proprietary AI filters out bot traffic using device fingerprints.", icon: Shield },
              { title: "Smart Rewards", desc: "Seamless integration with local digital gift cards and points.", icon: Sparkles },
              { title: "Live Insights", desc: "Track every impression and conversion as it happens.", icon: BarChart3 },
              { title: "Cross-Device", desc: "Your ads follow the user from mobile apps to web dashboards.", icon: Users },
              { title: "Ethio-ID", desc: "Verified audience segments based on regional demographics.", icon: ShieldCheck },
              { title: "Batch Launch", desc: "Manage multiple campaigns simultaneously with bulk uploads.", icon: Play },
              { title: "Local Support", desc: "Dedicated regional account managers based in Addis Ababa.", icon: Mail },
            ].map((f, i) => (
              <div key={i} className="p-12 bg-white/5 border border-white/10 rounded-[2.5rem] hover:bg-primary transition-all duration-500 group">
                 <f.icon className="h-10 w-10 text-primary group-hover:text-white mb-8 transition-colors" />
                 <h3 className="text-2xl font-black italic uppercase tracking-tight mb-4 group-hover:text-white">{f.title}</h3>
                 <p className="text-slate-500 group-hover:text-white/80 font-medium leading-relaxed text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Market Reach Stats - PACKED */}
      <section id="reach" className="py-40 bg-white border-b border-slate-100 overflow-hidden relative">
        <div className="absolute inset-0 bg-primary/3 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
        
        <div className="container mx-auto px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-32 items-center">
             <div className="space-y-12">
                <h2 className="text-6xl font-black italic uppercase tracking-tighter leading-[0.9] text-slate-900">Dominating the <br /> <span className="text-primary">Regional Market.</span></h2>
                <div className="space-y-12">
                   {[
                     { label: "Reach in Addis Ababa", val: "84%" },
                     { label: "Active Mobile Viewers", val: "10M+" },
                     { label: "Brand Partnerships", val: "500+" }
                   ].map((item, i) => (
                     <div key={i} className="space-y-4">
                        <div className="flex justify-between items-end">
                           <p className="text-xs font-black uppercase text-slate-500 tracking-[0.2em]">{item.label}</p>
                           <p className="text-4xl font-black italic text-slate-900 tracking-tighter">{item.val}</p>
                        </div>
                        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                           <div className="h-full bg-primary rounded-full transition-all duration-1000 w-[70%]" />
                        </div>
                     </div>
                   ))}
                </div>
             </div>

             <div className="bg-slate-50 border border-slate-100 p-16 rounded-[4rem] shadow-2xl shadow-slate-200/50 space-y-10">
                <div className="space-y-2">
                   <h3 className="text-3xl font-black italic uppercase tracking-tight text-slate-900">Scale Fast.</h3>
                   <p className="text-slate-500 font-medium">Join our curated network of high-net-worth advertisers.</p>
                </div>
                <div className="space-y-6">
                   <div className="p-6 bg-white rounded-3xl border border-slate-100 flex items-center gap-6">
                      <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-black">1</div>
                      <p className="text-sm font-bold text-slate-700 italic uppercase">Apply for Marketer Access</p>
                   </div>
                   <div className="p-6 bg-white rounded-3xl border border-slate-100 flex items-center gap-6">
                      <div className="h-12 w-12 rounded-2xl bg-orange-600/10 flex items-center justify-center text-orange-600 font-black">2</div>
                      <p className="text-sm font-bold text-slate-700 italic uppercase">Deploy First Video Campaign</p>
                   </div>
                   <div className="p-6 bg-white rounded-3xl border border-slate-100 flex items-center gap-6">
                      <div className="h-12 w-12 rounded-2xl bg-slate-900/10 flex items-center justify-center text-slate-900 font-black">3</div>
                      <p className="text-sm font-bold text-slate-700 italic uppercase">Monitor Real-Time Conversions</p>
                   </div>
                </div>
                <Link href="/marketer/login">
                  <Button className="w-full h-20 bg-slate-900 text-white shadow-2xl text-xl font-black uppercase tracking-tighter italic rounded-[2rem] hover:bg-slate-800 transition-all">
                    Onboard Now
                  </Button>
                </Link>
             </div>
          </div>
        </div>
      </section>

      {/* FAQ or Detail Section - PACKED */}
      <section className="py-40 bg-slate-50/50">
        <div className="container mx-auto px-8 max-w-5xl">
           <div className="text-center mb-24 space-y-4">
              <p className="text-[10px] font-black text-primary uppercase tracking-[0.5em]">Clear Answers</p>
              <h2 className="text-5xl font-black italic uppercase tracking-tighter text-slate-900">Platform Intelligence.</h2>
           </div>
           
           <div className="space-y-4">
              {[
                { q: "How do you verify human viewers?", a: "We utilize multi-factor identity signals including regional mobile provider (MTN, Ethio-Telecom) metadata and hardware-bound biometric tokens where applicable." },
                { q: "What is the minimum budget?", a: "AdRewards supports scaling from small regional campaigns to large-scale national deployments with dynamic tier-based pricing." },
                { q: "Do you support regional scripts?", a: "Yes, our video delivery and reward units are fully localized for Amharic, Oromo, and other regional languages." }
              ].map((item, i) => (
                <div key={i} className="bg-white border border-slate-100 p-10 rounded-[2.5rem] shadow-sm hover:shadow-md transition-shadow group">
                   <h4 className="text-xl font-black italic uppercase tracking-tight mb-4 text-slate-900 group-hover:text-primary transition-colors">{item.q}</h4>
                   <p className="text-slate-500 font-medium leading-relaxed">{item.a}</p>
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-60 px-8 text-center bg-white relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="container mx-auto max-w-4xl space-y-12 relative z-10">
          <h2 className="text-6xl md:text-8xl font-black italic uppercase tracking-tighter text-slate-900 leading-none">
            Scale your <br /><span className="text-primary">Impact.</span>
          </h2>
          <p className="text-xl text-slate-500 font-medium italic uppercase tracking-widest text-[10px]">The Future of Regional Advertising is here.</p>
          <Link href="/marketer/login">
            <Button size="xl" className="h-24 bg-primary text-white shadow-orange-glow text-2xl font-black uppercase tracking-tighter italic px-20 rounded-[2.5rem] transition-all hover:scale-105 active:scale-95">
              Contact Us Now
              <ArrowRight className="h-8 w-8 ml-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer - PACKED */}
      <footer className="pt-32 pb-20 px-8 bg-white border-t border-slate-100">
        <div className="container mx-auto max-w-7xl">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-24 mb-32">
             <div className="space-y-10">
                <Logo size="md" />
                <p className="text-slate-500 text-sm font-medium leading-relaxed">The leading digital advertising bridge connecting global brands with the heart of Ethiopia.</p>
                <div className="flex gap-6 opacity-40">
                   <Users className="h-5 w-5" />
                   <Shield className="h-5 w-5" />
                   <Activity className="h-5 w-5" />
                </div>
             </div>
             
             <div className="space-y-8">
                <p className="text-[10px] font-black text-slate-900 uppercase tracking-[0.4em]">Infrastructure</p>
                <ul className="space-y-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
                   <li><Link href="#features" className="hover:text-primary">Video Delivery</Link></li>
                   <li><Link href="#reach" className="hover:text-primary">Reward Nodes</Link></li>
                   <li><Link href="/marketer/login" className="hover:text-primary">Engagement API</Link></li>
                </ul>
             </div>
             
             <div className="space-y-8">
                <p className="text-[10px] font-black text-slate-900 uppercase tracking-[0.4em]">Company</p>
                <ul className="space-y-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
                   <li><Link href="/privacy" className="hover:text-primary">Privacy Node</Link></li>
                   <li><Link href="/terms" className="hover:text-primary">Transparency</Link></li>
                   <li><Link href="/contact" className="hover:text-primary">Global Contact</Link></li>
                </ul>
             </div>
             
             <div className="space-y-8">
                <p className="text-[10px] font-black text-slate-900 uppercase tracking-[0.4em]">Regional Office</p>
                <p className="text-xs font-bold text-slate-400 leading-relaxed uppercase tracking-widest">
                   Bole Road, Addis Ababa <br />
                   Ethiopia Regional HQ <br />
                   support@adrewards.et
                </p>
             </div>
          </div>
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-12 border-t border-slate-50 pt-12">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">© 2026 AdRewards Ethiopia Group. All rights reserved.</p>
            <div className="flex gap-12 text-[10px] font-black text-slate-900 uppercase tracking-[0.3em] italic">
               <span>Secure</span>
               <span>Verified</span>
               <span>Distributed</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
