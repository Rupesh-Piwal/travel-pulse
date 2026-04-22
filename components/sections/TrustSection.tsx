"use client";

import { motion } from "framer-motion";
import WorldMap from "../ui/world-map";

export default function TrustSection() {
  return (
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

        <div>
          <WorldMap
            dots={[
              {
                start: {
                  lat: 64.2008,
                  lng: -149.4937,
                }, // Alaska (Fairbanks)
                end: {
                  lat: 34.0522,
                  lng: -118.2437,
                }, // Los Angeles
              },
              {
                start: { lat: 64.2008, lng: -149.4937 }, // Alaska (Fairbanks)
                end: { lat: -15.7975, lng: -47.8919 }, // Brazil (Brasília)
              },
              {
                start: { lat: -15.7975, lng: -47.8919 }, // Brazil (Brasília)
                end: { lat: 38.7223, lng: -9.1393 }, // Lisbon
              },
              {
                start: { lat: 51.5074, lng: -0.1278 }, // London
                end: { lat: 28.6139, lng: 77.209 }, // New Delhi
              },
              {
                start: { lat: 28.6139, lng: 77.209 }, // New Delhi
                end: { lat: 43.1332, lng: 131.9113 }, // Vladivostok
              },
              {
                start: { lat: 28.6139, lng: 77.209 }, // New Delhi
                end: { lat: -1.2921, lng: 36.8219 }, // Nairobi
              },
            ]}
          />
        </div>
      </div>
    </section>
  );
}
