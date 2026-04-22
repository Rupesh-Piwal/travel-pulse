"use client";

import Hero from "@/components/Hero";
import ExploreSection from "@/components/sections/ExploreSection";
import HowItWorksSection from "@/components/sections/HowItWorksSection";
import TrustSection from "@/components/sections/TrustSection";
import PdfExportSection from "@/components/sections/PdfExportSection";
import PricingSection from "@/components/sections/PricingSection";
import Footer from "@/components/Footer";

export default function TravelPulseHome() {
  return (
    <div className="font-sans bg-[#0F1923] text-sand selection:bg-terracotta/30 min-h-screen overflow-x-hidden">
      <main>
        <Hero />
        <ExploreSection />
        <HowItWorksSection />
        
        <TrustSection />
        <PdfExportSection />
        <PricingSection />
      </main>
      <Footer />
    </div>
  );
}
