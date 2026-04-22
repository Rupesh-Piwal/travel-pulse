"use client";

import DestinationsCarousel from "@/components/DestinationsCarousel";

export default function ExploreSection() {
  return (
    <section id="explore" className="bg-[#F5EFE0] py-[120px] overflow-hidden relative">
      <div className="max-w-[1240px] mx-auto relative z-10">
        {/* Heading */}
        <div className="flex flex-col items-center text-center mb-16 px-6 max-w-[800px] mx-auto">

          <div className="text-[11px] font-serif  uppercase tracking-[0.25em] text-terracotta font-bold mb-4 italic">Collections</div>
          <h2 className="font-serif italic font-medium text-[clamp(36px,5vw,60px)] text-navy leading-[1] tracking-tight mb-6">
            Timeless <span className="text-terracotta">destinations</span>
          </h2>
          <p className="font-sans text-[16px] text-navy/60 leading-relaxed font-medium">
            Curated sanctuaries and vibrant metropolises, handpicked for the discerning traveler.
          </p>
        </div>

        {/* Carousel */}
        <div className="px-6 md:px-0">
          <DestinationsCarousel />
        </div>
      </div>


    </section>
  );
}
