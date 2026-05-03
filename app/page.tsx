
import Hero from "@/components/Hero";
import ExploreSection from "@/components/sections/ExploreSection";
import GuidesSection from "@/components/sections/GuidesSection";
import MapPlanningSection from "@/components/sections/MapPlanningSection";
import PricingSection from "@/components/sections/PricingSection";
import Footer from "@/components/Footer";

export default function TravelPulseHome() {
  return (
    <div className="font-sans bg-[#FEFEFF] text-[#0F1923] selection:bg-terracotta/30 min-h-screen overflow-x-hidden">
      <main>
        <Hero />
        <ExploreSection />
        <GuidesSection />
        <MapPlanningSection />
        <PricingSection />
      </main>
      <Footer />
    </div>
  );
}
