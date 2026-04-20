"use client";

import Link from "next/link";
import { Loader2, MapPin, Share2, Check } from "lucide-react";
import DestinationsCarousel from "@/components/DestinationsCarousel";
import { motion, Variants } from "framer-motion";
import Hero from "@/components/Hero";

// Framer Motion Variants
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] } }
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } }
};

export default function TravelPulseHome() {
  return (
    <div className="font-sans bg-[#0F1923] text-sand selection:bg-terracotta/30 min-h-screen overflow-x-hidden">
      
      <main>
        <Hero />

        {/* ──── SECTION 2: HOW IT WORKS ──── */}
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
                   <img src="https://images.unsplash.com/photo-1542820229-081e0c12af0b?q=80&w=200&auto=format&fit=crop" className="w-full h-full object-cover brightness-75 group-hover:scale-110 transition-transform duration-700" />
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

        {/* ──── SECTION 3: LIVE DEMO ──── */}
        <section className="bg-navy py-[160px] px-6 md:px-[8vw] overflow-hidden relative">
          {/* Background Gradient flair */}
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-terracotta/5 rounded-full blur-[140px] translate-y-1/2 -translate-x-1/2" />
          
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            className="max-w-[1240px] mx-auto flex flex-col lg:flex-row items-center gap-20"
          >
            {/* Left Copy */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="flex-1 w-full relative z-10"
            >
              <div className="text-[11px] font-sans uppercase tracking-[0.25em] text-terracotta font-bold mb-5 italic">Sensory Build</div>
              <h2 className="font-serif italic font-medium text-[clamp(36px,5vw,60px)] text-sand leading-[1.05] mb-8 tracking-tight">
                Architecting your<br />voyage, <span className="text-terracotta">live.</span>
              </h2>
              <p className="font-sans text-[18px] md:text-[20px] text-sand/60 leading-relaxed mb-10 max-w-[480px]">
                Witness the transformation. Our engine meticulously sequences your itinerary, weaving together high-fidelity imagery and geodata in real-time.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { icon: "⚡", label: "Dynamic Streams" },
                  { icon: "📸", label: "Editorial Assets" },
                  { icon: "🗺️", label: "Spatial Logic" },
                  { icon: "✨", label: "Polished Guides" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-3 py-3 px-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                    <span className="text-terracotta text-lg">{item.icon}</span>
                    <span className="text-sand/80 text-[14px] font-medium tracking-wide uppercase">{item.label}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right Mockup */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
              className="flex-[1.3] w-full perspective-[2000px]"
            >
              <div className="bg-[#151F2A] rounded-[24px] shadow-[0_60px_120px_-20px_rgba(0,0,0,0.6)] border border-white/5 overflow-hidden flex flex-col relative w-full aspect-[4/3] rotate-y-[-5deg] rotate-x-[2deg]">
                {/* Browser Chrome */}
                <div className="h-12 bg-white/5 flex items-center px-6 gap-2 border-b border-white/5 backdrop-blur-xl">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-white/10" />
                    <div className="w-3 h-3 rounded-full bg-white/10" />
                    <div className="w-3 h-3 rounded-full bg-white/10" />
                  </div>
                  <div className="mx-auto bg-black/20 h-6 px-10 rounded-full flex items-center justify-center text-[10px] text-sand/20 font-sans tracking-widest uppercase">
                    secure.nomadgo.build
                  </div>
                </div>

                {/* Progress Screen */}
                <div className="p-10 flex-1 flex flex-col gap-10 relative overflow-hidden">
                  <div className="flex justify-between items-start">
                    <h3 className="font-serif italic text-[32px] text-sand leading-tight">Kyoto: The<br />Timeless Escape</h3>
                    <div className="text-terracotta text-[12px] font-bold uppercase tracking-widest pt-2">Phase 05 / 08</div>
                  </div>

                  <div className="flex flex-col gap-6">
                    {[
                      { status: "complete", text: "Curating cultural landmarks" },
                      { status: "complete", text: "Optimizing geographic sequencing" },
                      { status: "active", text: "Generating sensory descriptions" },
                      { status: "pending", text: "Finalizing editorial PDF export" },
                    ].map((step, i) => (
                      <div key={i} className="flex items-center gap-5 translate-x-0 hover:translate-x-2 transition-transform">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 border ${
                          step.status === 'complete' ? 'bg-terracotta border-terracotta' : 
                          step.status === 'active' ? 'bg-white/10 border-white/20' : 'bg-transparent border-white/10'
                        }`}>
                          {step.status === 'complete' && <Check className="w-3.5 h-3.5 text-white" />}
                          {step.status === 'active' && <div className="w-2 h-2 rounded-full bg-terracotta animate-pulse" />}
                        </div>
                        <span className={`font-sans text-[15px] tracking-wide ${
                          step.status === 'complete' ? 'text-sand/40' : 
                          step.status === 'active' ? 'text-sand font-medium' : 'text-sand/20'
                        }`}>
                          {step.text}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Aesthetic blobs */}
                  <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-terracotta/10 rounded-full blur-[100px]" />
                </div>
              </div>
            </motion.div>
          </motion.div>
        </section>
        {/* ──── SECTION 3.5: TRUSTED BY TRAVELERS ──── */}
        <section className="bg-[#F5EFE0] py-[160px] px-6 md:px-[8vw] relative overflow-hidden">
          {/* Faded Background elements */}
          <div className="absolute top-1/2 left-[40%] -translate-x-1/2 -translate-y-1/2 opacity-[0.03] select-none pointer-events-none">
             <svg width="600" height="600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.5">
               <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
             </svg>
          </div>
          
          <div className="max-w-[1240px] mx-auto flex flex-col lg:flex-row items-center gap-20 relative z-10">
            {/* Left Column: Text & Stats */}
            <div className="flex-1 w-full text-center lg:text-left">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="font-serif italic font-medium text-[clamp(36px,5vw,60px)] text-navy leading-[1.05] mb-8 tracking-tight">
                  Trusted by Travelers <br /><span className="text-terracotta">Worldwide.</span>
                </h2>
                <p className="font-sans text-[18px] text-navy/60 leading-relaxed mb-12 max-w-[500px] mx-auto lg:mx-0">
                  Thousands of travelers trust us to turn their dream trips into reality. With years of experience and a passion for excellence, we deliver seamless travel experiences.
                </p>
              </motion.div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4 max-w-[500px] mx-auto lg:mx-0">
                {[
                  { value: "10,000+", label: "Happy Travelers" },
                  { value: "120+", label: "Destinations" },
                  { value: "4.9", label: "Average Rating" },
                  { value: "24/7", label: "Travel Support" }
                ].map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="p-6 rounded-[24px] bg-white shadow-[0_10px_40px_rgba(15,25,35,0.02)] border border-navy/5 flex flex-col items-center lg:items-start group hover:border-terracotta/20 transition-colors"
                  >
                    <span className="font-serif italic text-[28px] text-terracotta leading-none mb-2">{stat.value}</span>
                    <span className="font-sans text-[12px] text-navy/40 font-bold uppercase tracking-widest">{stat.label}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Right Column: Masonry Image Grid */}
            <div className="flex-1 w-full relative">
              {/* Flight Path SVG */}
              <div className="absolute inset-0 pointer-events-none z-0 overflow-visible">
                <svg className="w-full h-full opacity-20" viewBox="0 0 400 400" fill="none">
                  <motion.path
                    d="M50,100 C150,50 250,150 350,100"
                    stroke="currentColor"
                    strokeWidth="1"
                    strokeDasharray="4 4"
                    initial={{ pathLength: 0 }}
                    whileInView={{ pathLength: 1 }}
                    transition={{ duration: 2, ease: "easeInOut" }}
                    className="text-navy"
                  />
                  <motion.path
                    d="M350,100 C300,200 100,300 50,250"
                    stroke="currentColor"
                    strokeWidth="1"
                    strokeDasharray="4 4"
                    initial={{ pathLength: 0 }}
                    whileInView={{ pathLength: 1 }}
                    transition={{ duration: 2, delay: 0.5, ease: "easeInOut" }}
                    className="text-navy"
                  />
                </svg>
              </div>

              <div className="grid grid-cols-2 gap-4 relative z-10">
                {/* Image 1: Tall */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8 }}
                  className="rounded-[32px] overflow-hidden aspect-[3/4] shadow-2xl"
                >
                  <img src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=600" className="w-full h-full object-cover" alt="Beach" />
                </motion.div>
                {/* Image 2: Square/Short */}
                <div className="flex flex-col gap-4">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="rounded-[32px] overflow-hidden aspect-square shadow-2xl bg-white"
                  >
                    <img src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=600" className="w-full h-full object-cover" alt="Mountains" />
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="rounded-[32px] overflow-hidden aspect-[4/5] shadow-2xl bg-white"
                  >
                    <img src="https://images.unsplash.com/photo-1582972236019-ea4af5db4423?auto=format&fit=crop&q=80&w=600" className="w-full h-full object-cover" alt="Temple" />
                  </motion.div>
                </div>
                {/* Image 4: Horizontal (Overlap or shifted) */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                  className="rounded-[32px] overflow-hidden aspect-square shadow-2xl -mt-16 bg-white"
                >
                  <img src="https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&q=80&w=600" className="w-full h-full object-cover" alt="Lake" />
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* ──── SECTION 4: DESTINATIONS CAROUSEL ──── */}
        <section id="explore" className="bg-[#F5EFE0] py-[120px] overflow-hidden relative">
          <div className="max-w-[1240px] mx-auto relative z-10">
            {/* Heading */}
            <div className="flex flex-col md:flex-row items-end justify-between mb-16 px-6 gap-8">
              <div className="text-left">
                <div className="text-[11px] font-sans uppercase tracking-[0.25em] text-terracotta font-bold mb-4 italic">Collections</div>
                <h2 className="font-serif italic font-medium text-[clamp(36px,5vw,60px)] text-navy leading-[1] tracking-tight">
                  Timeless <span className="text-terracotta">destinations</span>
                </h2>
              </div>
              <p className="font-sans text-[16px] text-navy/60 max-w-[380px] leading-relaxed font-medium pb-1 md:text-right">
                Curated sanctuaries and vibrant metropolises, handpicked for the discerning traveler.
              </p>
            </div>

            {/* Carousel */}
            <div className="px-6 md:px-0">
              <DestinationsCarousel />
            </div>
          </div>
          
          {/* Bottom text flourish */}
          <div className="absolute bottom-10 left-0 w-full whitespace-nowrap overflow-hidden opacity-[0.03] select-none pointer-events-none">
            <span className="font-serif italic text-[140px] text-navy">EXPLORE BEYOND THE HORIZON · DISCOVER LUXURY</span>
          </div>
        </section>

        {/* ──── SECTION 5: PDF EXPORT SHOWCASE ──── */}
        <section className="bg-navy py-[160px] px-6 md:px-[8vw] relative overflow-hidden">
          <div className="max-w-[1240px] mx-auto flex flex-col items-center relative z-10">
            <div className="max-w-[800px] w-full text-center mb-24">
              <div className="text-[11px] font-sans uppercase tracking-[0.25em] text-terracotta font-bold mb-5 italic">The Export</div>
              <h2 className="font-serif italic font-medium text-[clamp(36px,5vw,60px)] text-sand mb-8 leading-[1.05] tracking-tight">
                A physical companion <br />for the <span className="text-terracotta">modern</span> explorer.
              </h2>
              <p className="font-sans text-[18px] text-sand/50 max-w-[560px] mx-auto leading-relaxed">
                Every itinerary manifests as a bespoke digital guide—meticulously formatted for clarity, aesthetic, and portability.
              </p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 100 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
              className="w-full max-w-[1000px] aspect-[1.414/0.9] bg-white rounded-[4px] shadow-[0_80px_160px_-40px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col relative scale-[1.05]"
            >
              {/* PDF Mockup Content */}
              <div className="absolute inset-0 p-[5%] bg-white flex flex-col gap-[3%]">
                <div className="flex justify-between items-baseline border-b-2 border-navy pb-4 mb-4">
                  <div className="font-serif text-[clamp(40px,5vw,72px)] text-navy leading-none tracking-tighter">KYOTO</div>
                  <div className="font-serif italic text-navy/40 text-[clamp(14px,2vw,20px)]">05 Days in Japan</div>
                </div>
                
                <div className="flex flex-1 gap-12 overflow-hidden">
                  <div className="flex-1 flex flex-col gap-8">
                    <img src="https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=800&auto=format&fit=crop" className="w-full aspect-[4/3] object-cover grayscale-[20%] hover:grayscale-0 transition-all duration-700" alt="Kyoto" />
                    <div className="flex flex-col gap-3">
                      <div className="h-[2px] bg-navy/20 w-full" />
                      <div className="h-[2px] bg-navy/20 w-[80%]" />
                      <div className="h-[2px] bg-navy/20 w-[95%]" />
                      <div className="h-[2px] bg-navy/20 w-[60%]" />
                    </div>
                  </div>
                  <div className="flex-1 flex flex-col gap-10 pt-10">
                     <div className="flex flex-col gap-2">
                       <h4 className="font-serif text-terracotta text-[24px] uppercase tracking-widest font-bold">DAY 01</h4>
                       <span className="font-sans text-navy/40 text-[12px] font-bold tracking-[0.2em] uppercase">Arrival & Immersion</span>
                     </div>
                     <div className="flex flex-col gap-6">
                        <div className="flex items-start gap-4">
                          <span className="font-serif italic text-navy text-2xl">01</span>
                          <div className="h-[2px] bg-navy/10 w-full mt-4" />
                        </div>
                        <div className="flex items-start gap-4">
                          <span className="font-serif italic text-navy text-2xl">02</span>
                          <div className="h-[2px] bg-navy/10 w-full mt-4" />
                        </div>
                        <div className="flex items-start gap-4">
                          <span className="font-serif italic text-navy text-2xl">03</span>
                          <div className="h-[2px] bg-navy/10 w-full mt-4" />
                        </div>
                     </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
          
          {/* Subtle logo in bg */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-serif italic text-[300px] text-white/[0.02] select-none pointer-events-none">NG</div>
        </section>

        {/* ──── SECTION 6: PRICING ──── */}
        <section id="pricing" className="bg-[#F5EFE0] py-[160px] px-6 md:px-[8vw] relative overflow-hidden">
          <div className="max-w-[1240px] mx-auto relative z-10">
            <div className="text-center mb-24">
              <div className="text-[11px] font-sans uppercase tracking-[0.25em] text-terracotta font-bold mb-5 italic">Memberships</div>
              <h2 className="font-serif italic font-medium text-[clamp(40px,5vw,72px)] text-navy leading-none tracking-tight">
                Invest in your <span className="text-terracotta">discoveries.</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-stretch">
              {[
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
              ].map((tier) => (
                <motion.div 
                  key={tier.name}
                  whileHover={{ y: -10 }}
                  className={`group relative p-10 rounded-[40px] flex flex-col transition-all duration-500 ${
                    tier.featured 
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

                  <button className={`w-full py-5 rounded-[20px] font-sans text-[14px] font-bold tracking-widest uppercase transition-all duration-500 mt-auto ${
                    tier.featured 
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
      </main>

      <footer className="bg-navy pt-[120px] pb-12 px-6 md:px-[8vw] border-t border-white/5 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-terracotta/20 to-transparent" />
        
        <div className="max-w-[1240px] mx-auto relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start mb-24 gap-16">
            <div className="flex flex-col gap-6 max-w-[320px]">
              <div className="font-serif italic text-[32px] text-sand leading-none tracking-tighter">NomadGo</div>
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
    </div>
  );
}
