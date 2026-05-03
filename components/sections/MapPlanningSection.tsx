"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { PlaneTakeoff, Building, Upload, Check } from "lucide-react";

export default function MapPlanningSection() {
  return (
    <section className="bg-[#FEFEFF] py-24 md:py-32 px-6 md:px-[8vw] relative overflow-hidden">
      <div className="max-w-[1200px] mx-auto flex flex-col items-center">
        {/* Header Text */}
        <div className="text-center mb-16 md:mb-20 max-w-3xl flex flex-col items-center">

          <div className="text-[20px] md:text-[40px] font-[family-name:var(--font-serif)] italic leading-[0.95] text-terracotta"
          >
            Map-Integrated Planning

          </div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-navy text-3xl md:text-5xl lg:text-[52px] font-sans font-medium tracking-tight leading-[1.15] mb-6"
          >
            See everything on a map as you plan.
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-navy/60 text-lg md:text-xl max-w-2xl leading-relaxed"
          >
            Hotels and attractions appear on a live map as you explore. Visualize neighborhoods, distances, and how your days fit together.
          </motion.p>
        </div>

        {/* UI Mockup Container */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.7 }}
          className="w-full rounded-[24px] shadow-[0_30px_80px_-20px_rgba(15,25,35,0.15)] overflow-hidden bg-white border border-navy/5"
        >
          <div className="flex flex-col md:flex-row h-[800px] md:h-[650px]">
            {/* Left Side: Map */}
            <div className="relative w-full md:w-[55%] h-1/2 md:h-full bg-[#E5E7EB] border-b md:border-b-0 md:border-r border-navy/10 overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=2500&auto=format&fit=crop"
                alt="Map View"
                fill
                className="object-cover opacity-80"
              />
              {/* Map UI Overlay */}
              <div className="absolute inset-0 bg-blue-500/5 mix-blend-overlay" />

              {/* Map Pins */}
              <div className="absolute top-1/2 left-1/3 transform -translate-x-1/2 -translate-y-1/2">
                <div className="w-8 h-8 rounded-full bg-[#10B981] border-2 border-white shadow-lg flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-white" />
                </div>
              </div>
              <div className="absolute top-[40%] left-[60%] transform -translate-x-1/2 -translate-y-1/2">
                <div className="w-8 h-8 rounded-full bg-[#EF4444] border-2 border-white shadow-lg flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-white" />
                </div>
              </div>
              <div className="absolute top-[60%] left-[50%] transform -translate-x-1/2 -translate-y-1/2">
                <div className="px-3 py-1.5 rounded-full bg-white border border-navy/10 shadow-lg font-bold text-xs text-navy">
                  $150
                </div>
              </div>
            </div>

            {/* Right Side: Details Panel */}
            <div className="w-full md:w-[45%] h-1/2 md:h-full flex flex-col bg-white">
              {/* Top Image */}
              <div className="relative h-[240px] w-full shrink-0">
                <Image
                  src="https://images.unsplash.com/photo-1542259009477-d625272157b7?q=80&w=2069&auto=format&fit=crop"
                  alt="Hawaii Landscape"
                  fill
                  className="object-cover"
                />
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-[22px] font-bold text-navy tracking-tight">Waikiki Hotels $150/Night</h3>
                </div>

                <button className="flex items-center gap-2 px-4 py-2 bg-[#0F1923] text-white rounded-full text-xs font-semibold mb-8 hover:bg-[#0F1923]/90 transition-colors">
                  <Upload className="w-3.5 h-3.5" />
                  Share
                </button>

                {/* Journeys */}
                <div className="mb-8">
                  <h4 className="text-[13px] font-bold uppercase tracking-wider text-navy/50 mb-4">Journeys</h4>

                  {/* Flight 1 */}
                  <div className="flex items-center justify-between py-3 border-b border-navy/5">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded bg-blue-50 flex items-center justify-center shrink-0 mt-0.5">
                        <PlaneTakeoff className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <div className="text-[15px] font-bold text-navy">4:45 PM</div>
                        <div className="text-[13px] text-navy/70 font-medium">SFO</div>
                        <div className="text-[11px] text-navy/40 mt-1">Thursday, Apr 16</div>
                      </div>
                    </div>

                    <div className="text-center px-4">
                      <div className="text-[11px] text-navy/50">5h 35m</div>
                      <div className="text-[10px] text-navy/40">Nonstop</div>
                    </div>

                    <div className="text-right">
                      <div className="text-[15px] font-bold text-navy">7:20 PM</div>
                      <div className="text-[13px] text-navy/70 font-medium">HNL</div>
                      <div className="text-[11px] text-navy/40 mt-1">United</div>
                    </div>

                    <div className="text-[15px] font-bold text-navy ml-4">$395</div>
                  </div>

                  {/* Flight 2 */}
                  <div className="flex items-center justify-between py-3">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded bg-blue-50 flex items-center justify-center shrink-0 mt-0.5">
                        <PlaneTakeoff className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <div className="text-[15px] font-bold text-navy">7:00 AM</div>
                        <div className="text-[13px] text-navy/70 font-medium">HNL</div>
                        <div className="text-[11px] text-navy/40 mt-1">Sunday, Apr 19</div>
                      </div>
                    </div>

                    <div className="text-center px-4">
                      <div className="text-[11px] text-navy/50">5h 10m</div>
                      <div className="text-[10px] text-navy/40">Nonstop</div>
                    </div>

                    <div className="text-right">
                      <div className="text-[15px] font-bold text-navy">3:10 PM</div>
                      <div className="text-[13px] text-navy/70 font-medium">SFO</div>
                      <div className="text-[11px] text-navy/40 mt-1">United</div>
                    </div>

                    <button className="ml-4 px-3 py-1.5 bg-[#0F1923] text-white rounded text-xs font-bold flex items-center gap-1">
                      Book <span className="text-[10px]">▼</span>
                    </button>
                  </div>
                </div>

                {/* Stays */}
                <div>
                  <h4 className="text-[13px] font-bold uppercase tracking-wider text-navy/50 mb-4">Stays</h4>
                  <div className="flex items-center justify-between p-3 rounded-xl border border-navy/10 hover:border-navy/20 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-sand overflow-hidden relative shrink-0">
                        <Image src="https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop" alt="Hotel" fill className="object-cover" />
                      </div>
                      <div>
                        <div className="text-[14px] font-bold text-navy">Luana Waikiki Hotel & Suites</div>
                        <div className="text-[12px] text-navy/50">Apr 16 - Apr 19</div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <div className="text-[14px] font-bold text-navy">$160</div>
                      <button className="px-3 py-1.5 bg-[#0F1923] text-white rounded text-xs font-bold flex items-center gap-1">
                        Book <span className="text-[10px]">▼</span>
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
