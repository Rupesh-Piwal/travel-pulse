"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-navy pt-[120px] pb-12 px-6 md:px-[8vw] border-t border-white/5 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-terracotta/20 to-transparent" />

      <div className="max-w-[1240px] mx-auto relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start mb-24 gap-16">
          <div className="flex flex-col gap-6 max-w-[320px]">
            <div className="font-serif italic text-[32px] text-sand leading-none tracking-tighter">Nomad<span className="text-terracotta">Go</span> </div>
            <div className="font-sans text-[16px] text-sand/40 leading-relaxed font-medium">Architecting the world's most immersive, AI-free personal travel guides. Beyond the algorithm.</div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-x-20 gap-y-10">
            <div className="flex flex-col gap-6">
              <span className="text-[10px] uppercase tracking-[0.3em] text-terracotta font-bold">Platform</span>
              <div className="flex flex-col gap-4">
                <Link href="#explore" className="text-sand/50 hover:text-sand text-[14px] font-medium transition-colors">Destinations</Link>
                <Link href="#pricing" className="text-sand/50 hover:text-sand text-[14px] font-medium transition-colors">Memberships</Link>
                <Link href="/dashboard" className="text-sand/50 hover:text-sand text-[14px] font-medium transition-colors">Dashboard</Link>
              </div>
            </div>
            <div className="flex flex-col gap-6">
              <span className="text-[10px] uppercase tracking-[0.3em] text-terracotta font-bold">Company</span>
              <div className="flex flex-col gap-4">
                <Link href="#" className="text-sand/50 hover:text-sand text-[14px] font-medium transition-colors">Our Ethos</Link>
                <Link href="#" className="text-sand/50 hover:text-sand text-[14px] font-medium transition-colors">Journal</Link>
                <Link href="#" className="text-sand/50 hover:text-sand text-[14px] font-medium transition-colors">Concierge</Link>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center border-t border-white/5 pt-12 gap-6">
          <p className="font-sans text-[11px] text-sand/20 font-bold uppercase tracking-[0.2em]">
            © 2024 NomadGo · All Rights Reserved
          </p>
          <div className="flex gap-8 font-sans text-[11px] text-sand/30 font-bold uppercase tracking-[0.2em]">
            <Link href="#" className="hover:text-sand transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-sand transition-colors">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
