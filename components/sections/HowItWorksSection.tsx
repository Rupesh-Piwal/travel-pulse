"use client";

import { motion } from "framer-motion";
import { MapPin, Loader2, Share2 } from "lucide-react";
import { fadeUp, staggerContainer } from "@/lib/animations";

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="bg-[#F5EFE0] py-[140px] px-6 md:px-[8vw] relative overflow-hidden">
      {/* Subtle background flair */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-terracotta/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3" />

      <div className="max-w-[1240px] mx-auto text-center relative z-10">
        {/* Top Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-flex items-center justify-center px-5 py-1.5 mb-8 rounded-full border border-navy/10 bg-white/50 backdrop-blur-sm"
        >
          <span className="text-[10px] font-sans text-navy/60 font-bold uppercase tracking-[0.2em]">
            The Process
          </span>
        </motion.div>

        {/* Title & Subtitle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
        >
          <h2 className="font-serif italic font-medium text-[clamp(32px,5vw,64px)] text-navy leading-[1.05] mb-6 tracking-tight">
            Crafting your <span className="text-terracotta">perfect</span> escape.
          </h2>
          <p className="font-sans text-[16px] md:text-[20px] text-navy/60 max-w-[640px] mx-auto mb-20 leading-relaxed font-medium">
            Our meticulous generation process combines premium aesthetics with personalized travel intelligence.
          </p>
        </motion.div>

        {/* 4 Cards Grid */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-left"
        >
          {/* Card 1 */}
          <motion.div variants={fadeUp} className="group relative flex flex-col items-center text-center p-8 rounded-[32px] bg-white shadow-[0_10px_40px_rgba(15,25,35,0.03)] hover:shadow-[0_30px_70px_rgba(15,25,35,0.08)] transition-all duration-500 border border-white/50">
            <div className="w-20 h-20 rounded-full bg-navy/5 flex items-center justify-center mb-8 relative">
              <MapPin className="w-8 h-8 text-terracotta fill-terracotta/20" />
              <div className="absolute inset-0 rounded-full border border-terracotta/20 scale-125 opacity-0 group-hover:opacity-100 group-hover:scale-150 transition-all duration-700" />
            </div>
            <div className="text-terracotta text-[12px] font-bold uppercase tracking-widest mb-3">Phase 01</div>
            <h3 className="text-navy font-serif text-[22px] mb-4">Set Preferences</h3>
            <p className="text-navy/50 text-[15px] leading-relaxed font-medium">Define your destination, duration, and the unique vibe of your journey.</p>
          </motion.div>

          {/* Card 2 */}
          <motion.div variants={fadeUp} className="group relative flex flex-col items-center text-center p-8 rounded-[32px] bg-white shadow-[0_10px_40px_rgba(15,25,35,0.03)] hover:shadow-[0_30px_70px_rgba(15,25,35,0.08)] transition-all duration-500 border border-white/50">
            <div className="w-20 h-20 rounded-full bg-navy/5 flex items-center justify-center mb-8 relative overflow-hidden">
              <img src="https://images.unsplash.com/photo-1542820229-081e0c12af0b?q=80&w=200&auto=format&fit=crop" className="w-full h-full object-cover brightness-75 group-hover:scale-110 transition-transform duration-700" alt="Vibe" />
              <div className="absolute inset-0 bg-navy/20" />
            </div>
            <div className="text-terracotta text-[12px] font-bold uppercase tracking-widest mb-3">Phase 02</div>
            <h3 className="text-navy font-serif text-[22px] mb-4">Choose a Vibe</h3>
            <p className="text-navy/50 text-[15px] leading-relaxed font-medium">From adventure to serenity, select a style that resonates with your soul.</p>
          </motion.div>

          {/* Card 3 */}
          <motion.div variants={fadeUp} className="group relative flex flex-col items-center text-center p-8 rounded-[32px] bg-navy shadow-[0_30px_70px_rgba(15,25,35,0.2)] transition-all duration-500 border border-white/5 scale-105 z-10 overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
            <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center mb-8 relative">
              <Loader2 className="w-8 h-8 text-sand animate-spin" />
            </div>
            <div className="text-terracotta text-[12px] font-bold uppercase tracking-widest mb-3">Phase 03</div>
            <h3 className="text-sand font-serif text-[22px] mb-4">AI Processing</h3>
            <p className="text-sand/50 text-[15px] leading-relaxed font-medium">Our advanced algorithms orchestrate every minute of your trip with precision.</p>
          </motion.div>

          {/* Card 4 */}
          <motion.div variants={fadeUp} className="group relative flex flex-col items-center text-center p-8 rounded-[32px] bg-white shadow-[0_10px_40px_rgba(15,25,35,0.03)] hover:shadow-[0_30px_70px_rgba(15,25,35,0.08)] transition-all duration-500 border border-white/50">
            <div className="w-20 h-20 rounded-full bg-navy/5 flex items-center justify-center mb-8 relative">
              <Share2 className="w-8 h-8 text-terracotta fill-terracotta/20" />
            </div>
            <div className="text-terracotta text-[12px] font-bold uppercase tracking-widest mb-3">Phase 04</div>
            <h3 className="text-navy font-serif text-[22px] mb-4">Export & Share</h3>
            <p className="text-navy/50 text-[15px] leading-relaxed font-medium">Download your guide as a stunning PDF or share your journey with the world.</p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
