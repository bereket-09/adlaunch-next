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
            <Link href="#features" className="hover:text-primary transition-colors">Features</Link>
            <Link href="#how-it-works" className="hover:text-primary transition-colors">How it Works</Link>
            <Link href="#results" className="hover:text-primary transition-colors">Results</Link>
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
            <div className="space-y-10 text-left">
              <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-white/5 border border-white/10 text-primary text-[10px] font-black uppercase tracking-[0.4em] animate-fade-in">
                Modern Video Advertising
              </div>

              <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.85] uppercase italic text-white animate-fade-in-up [animation-delay:100ms]">
                Reach more. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-primary to-orange-500 italic">Impact Every View.</span>
              </h1>

              <div className="space-y-6 max-w-xl animate-fade-in-up [animation-delay:200ms]">
                <p className="text-xl md:text-2xl text-slate-400 font-medium leading-relaxed">
                  Launch video campaigns that people actually watch. Guaranteed engagement with real humans.
                </p>
                <div className="flex flex-wrap gap-x-8 gap-y-4">
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-primary" />
                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Verified Viewers</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-primary" />
                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Zero Bot Traffic</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-6 animate-fade-in-up [animation-delay:300ms] w-full max-w-lg">
                <Link href="/marketer/login" className="flex-1">
                  <Button className="w-full h-16 bg-primary text-white shadow-orange-glow hover:scale-105 transition-all text-xl font-black uppercase tracking-tighter italic rounded-2xl">
                    Get Started
                  </Button>
                </Link>
                <Link href="#how-it-works" className="flex-1">
                  <Button variant="outline" className="w-full h-16 text-xl font-black uppercase tracking-tighter italic rounded-2xl border-white/10 bg-white/5 text-white hover:bg-white/10 transition-all">
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>

            <div className="relative group animate-fade-in-right [animation-delay:400ms]">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary to-orange-600 rounded-[3rem] blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative bg-slate-900 border border-white/10 rounded-[3rem] overflow-hidden aspect-video shadow-2xl">
                 <img src="/campaign_dashboard_mockup.png" alt="Dashboard Preview" className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-all duration-700" />
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
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Trusted by brands across the nation</p>
            <div className="flex flex-wrap justify-center gap-16 items-center opacity-30 grayscale saturate-0">
               <div className="text-3xl font-black tracking-tighter italic text-slate-900">PREMIUM BRANDS</div>
               <div className="text-3xl font-black tracking-tighter italic text-slate-900 underline decoration-primary decoration-4">LEADING FIRMS</div>
               <div className="text-3xl font-black tracking-tighter italic text-slate-900">GLOBAL PARTNERS</div>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="py-40 bg-white">
        <div className="container mx-auto px-8">
          <div className="text-center max-w-3xl mx-auto mb-32 space-y-6">
            <h2 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter text-slate-900">Watch & <span className="text-primary italic">Grow.</span></h2>
            <p className="text-slate-500 text-xl font-medium">A simple, effective way to connect with your target audience.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-24 items-center">
             <div className="space-y-16">
                {[
                  {
                    step: "01",
                    title: "For Marketers",
                    desc: "Upload your video message and set your target audience. We ensure your content is seen by real people who are interested in your brand.",
                    points: ["Target Real People", "Guaranteed Views"]
                  },
                  {
                    step: "02",
                    title: "For Viewers",
                    desc: "Our community watches high-quality videos and gets rewarded for their attention. This ensures your message isn't just displayed, but actually watched.",
                    points: ["High Retention", "High Engagement"]
                  }
                ].map((item, i) => (
                  <div key={i} className="flex gap-10 group">
                    <div className="text-6xl font-black italic text-slate-100 group-hover:text-primary transition-colors duration-500">{item.step}</div>
                    <div className="space-y-4">
                       <h3 className="text-3xl font-black italic uppercase tracking-tight text-slate-900">{item.title}</h3>
                       <p className="text-slate-500 text-lg leading-relaxed max-w-md">{item.desc}</p>
                       <div className="flex gap-4">
                          {item.points.map((p, idx) => (
                             <span key={idx} className="text-[10px] font-black uppercase tracking-widest bg-slate-100 px-4 py-2 rounded-full text-slate-500">{p}</span>
                          ))}
                       </div>
                    </div>
                  </div>
                ))}
             </div>
             
             <div className="relative group">
                <div className="absolute -inset-4 bg-primary/5 rounded-[4rem] group-hover:bg-primary/10 transition-colors" />
                <div className="relative bg-white border border-slate-200 rounded-[3rem] overflow-hidden shadow-2xl p-10">
                   <div className="relative w-full aspect-[9/16] bg-slate-950 rounded-[2.5rem] overflow-hidden shadow-2xl mx-auto max-w-[300px]">
                      <img src="/viewer_app_mockup.png" alt="App Experience" className="w-full h-full object-cover opacity-90" />
                   </div>
                   <div className="text-center mt-10">
                      <p className="text-sm font-black text-slate-400 uppercase tracking-widest italic">Seamless Engagement</p>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-40 bg-slate-950 text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('/grid.svg')] opacity-[0.03] bg-[size:40px_40px]" />
        
        <div className="container mx-auto px-8 relative z-10">
          <div className="space-y-8 max-w-2xl mb-32">
            <h2 className="text-6xl md:text-8xl font-black italic uppercase tracking-tighter leading-[0.85]">Built for <span className="text-primary italic">Impact.</span></h2>
            <p className="text-slate-400 text-xl font-medium">Simple tools to manage your campaigns and track your success in real-time.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { title: "Real Views", desc: "No bots. No fake traffic. Just real humans watching your video content.", icon: Users },
              { title: "High Engagement", desc: "Users are focused on your message to earn rewards, leading to better brand recall.", icon: Activity },
              { title: "Live Tracking", desc: "Watch your campaign results climb in real-time with our simple dashboard.", icon: BarChart3 },
              { title: "Simple Setup", desc: "Launch your first campaign in minutes with our intuitive uploader.", icon: Play },
              { title: "Secure Portal", desc: "Your data and campaigns are protected with institutional-grade security.", icon: Shield },
              { title: "Smart Targeting", desc: "Reach the specific groups of people most likely to love your brand.", icon: Sparkles },
              { title: "Support Always", desc: "Our team is here to help you optimize your creative for the best results.", icon: Mail },
              { title: "Scale Fast", desc: "Start small and grow your reach as you see the results come in.", icon: ShieldCheck },
            ].map((f, i) => (
              <div key={i} className="p-10 bg-white/5 border border-white/10 rounded-[2.5rem] hover:bg-primary transition-all duration-500 group">
                 <f.icon className="h-10 w-10 text-primary group-hover:text-white mb-8 transition-colors" />
                 <h3 className="text-2xl font-black italic uppercase tracking-tight mb-4 group-hover:text-white">{f.title}</h3>
                 <p className="text-slate-500 group-hover:text-white/80 font-medium leading-relaxed text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section id="results" className="py-40 bg-white overflow-hidden relative">
        <div className="absolute inset-0 bg-primary/3 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
        
        <div className="container mx-auto px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-32 items-center">
             <div className="space-y-12">
                <h2 className="text-6xl font-black italic uppercase tracking-tighter leading-[0.9] text-slate-900">Proven <br /> <span className="text-primary">Performance.</span></h2>
                <div className="space-y-12">
                   {[
                     { label: "View Completion Rate", val: "92%" },
                     { label: "Average Brand Recall", val: "78%" },
                     { label: "Happy Marketers", val: "100%" }
                   ].map((item, i) => (
                     <div key={i} className="space-y-4">
                        <div className="flex justify-between items-end">
                           <p className="text-xs font-black uppercase text-slate-500 tracking-[0.2em]">{item.label}</p>
                           <p className="text-4xl font-black italic text-slate-900 tracking-tighter">{item.val}</p>
                        </div>
                        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                           <div className="h-full bg-primary rounded-full w-[85%]" />
                        </div>
                     </div>
                   ))}
                </div>
             </div>

             <div className="bg-slate-50 border border-slate-100 p-16 rounded-[4rem] shadow-2xl space-y-10">
                <div className="space-y-4">
                   <h3 className="text-4xl font-black italic uppercase tracking-tight text-slate-900">Join the Future.</h3>
                   <p className="text-slate-500 font-medium text-lg">Stop wasting your budget on ignored ads. Start getting watched.</p>
                </div>
                <Link href="/marketer/login" className="block">
                  <Button className="w-full h-20 bg-slate-900 text-white shadow-2xl text-xl font-black uppercase tracking-tighter italic rounded-[2rem] hover:bg-slate-800 transition-all">
                    Start Your Campaign
                  </Button>
                </Link>
             </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-60 px-8 text-center bg-white relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="container mx-auto max-w-4xl space-y-12 relative z-10">
          <h2 className="text-6xl md:text-8xl font-black italic uppercase tracking-tighter text-slate-900 leading-none">
            Scale Your <br /><span className="text-primary italic">Success.</span>
          </h2>
          <p className="text-xl text-slate-500 font-medium italic uppercase tracking-widest text-[10px]">Simple setup. Real results.</p>
          <Link href="/marketer/login">
            <Button size="xl" className="h-24 bg-primary text-white shadow-orange-glow text-2xl font-black uppercase tracking-tighter italic px-20 rounded-[2.5rem] transition-all hover:scale-105 active:scale-95">
              Contact Sales
              <ArrowRight className="h-8 w-8 ml-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="pt-32 pb-20 px-8 bg-white border-t border-slate-100">
        <div className="container mx-auto max-w-7xl">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-24 mb-32">
             <div className="space-y-10">
                <Logo size="md" />
                <p className="text-slate-500 text-sm font-medium leading-relaxed max-w-xs">Building the most engaged bridge between brands and audiences in the modern market.</p>
             </div>
             
             <div className="space-y-8">
                <p className="text-[10px] font-black text-slate-900 uppercase tracking-[0.4em]">Navigation</p>
                <ul className="space-y-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
                   <li><Link href="#features" className="hover:text-primary transition-colors">Features</Link></li>
                   <li><Link href="#how-it-works" className="hover:text-primary transition-colors">How it Works</Link></li>
                   <li><Link href="/privacy" className="hover:text-primary transition-colors">Privacy</Link></li>
                   <li><Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
                </ul>
             </div>
             
             <div className="space-y-8">
                <p className="text-[10px] font-black text-slate-900 uppercase tracking-[0.4em]">Connect</p>
                <p className="text-xs font-bold text-slate-400 leading-relaxed uppercase tracking-widest">
                   AdRewards Group <br />
                   support@adrewards.app
                </p>
             </div>
          </div>
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-12 border-t border-slate-50 pt-12">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">© 2026 AdRewards Ethiopia. Every view counts.</p>
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
