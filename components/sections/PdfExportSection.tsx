"use client";

import { motion } from "framer-motion";

export default function PdfExportSection() {
  return (
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
  );
}
