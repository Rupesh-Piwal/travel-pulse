"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";

const TIERS = [
  {
    name: "Voyager",
    price: "0",
    credits: "03",
    features: ["Essential Day Plans", "Curated Geo-Pins", "Standard Portfolio"],
    cta: "Join the Club",
    featured: false
  },
  {
    name: "Pathfinder",
    price: "749",
    credits: "15",
    features: ["Unlimited Destinations", "Priority Generation", "Concierge PDF Design", "Multi-region Logic"],
    cta: "Embrace the Journey",
    featured: true
  },
  {
    name: "Globalist",
    price: "1,499",
    credits: "50",
    features: ["Collaborative Planning", "Bespoke Branding", "Advanced Travel Intel", "Dedicated API Access"],
    cta: "Go Globalist",
    featured: false
  }
];

export default function PricingSection() {
  return (
    <section id="pricing" className="bg-[#F5EFE0] py-[160px] px-6 md:px-[8vw] relative overflow-hidden">
      <div className="max-w-[1240px] mx-auto relative z-10">
        <div className="text-center mb-24">
          <div className="text-[11px] font-sans uppercase tracking-[0.25em] text-terracotta font-bold mb-5 italic">Memberships</div>
          <h2 className="font-serif italic font-medium text-[clamp(40px,5vw,72px)] text-navy leading-none tracking-tight">
            Invest in your <span className="text-terracotta">discoveries.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-stretch">
          {TIERS.map((tier) => (
            <motion.div
              key={tier.name}
              whileHover={{ y: -10 }}
              className={`group relative p-10 rounded-[40px] flex flex-col transition-all duration-500 ${tier.featured
                  ? "bg-navy text-sand shadow-[0_50px_100px_-20px_rgba(15,25,35,0.3)] ring-1 ring-white/10"
                  : "bg-white text-navy shadow-[0_20px_60px_rgba(15,25,35,0.03)] border border-navy/5"
                }`}
            >
              {tier.featured && (
                <div className="absolute top-8 right-10">
                  <div className="bg-terracotta text-white font-sans text-[10px] uppercase font-bold tracking-widest px-4 py-1.5 rounded-full">
                    Curated Pick
                  </div>
                </div>
              )}

              <div className="text-terracotta text-[12px] font-bold uppercase tracking-[0.3em] mb-4">The {tier.name}</div>
              <div className="flex items-baseline gap-2 mb-8">
                <span className="font-serif italic text-[64px] leading-none tracking-tighter">₹{tier.price}</span>
                <span className={`font-sans text-[16px] font-medium tracking-widest uppercase ${tier.featured ? 'text-sand/30' : 'text-navy/20'}`}>/ Month</span>
              </div>

              <div className="h-[1px] w-full bg-current opacity-10 mb-10" />

              <div className="flex flex-col gap-6 mb-12">
                {tier.features.map(f => (
                  <div key={f} className="flex gap-4 items-center">
                    <Check className="w-4 h-4 text-terracotta shrink-0" />
                    <span className={`text-[15px] font-medium tracking-tight ${tier.featured ? 'text-sand/70' : 'text-navy/60'}`}>{f}</span>
                  </div>
                ))}
              </div>

              <button className={`w-full py-5 rounded-[20px] font-sans text-[14px] font-bold tracking-widest uppercase transition-all duration-500 mt-auto ${tier.featured
                  ? "bg-terracotta text-white hover:bg-terracotta/90"
                  : "bg-navy text-sand hover:bg-navy/90"
                }`}>
                {tier.cta}
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
