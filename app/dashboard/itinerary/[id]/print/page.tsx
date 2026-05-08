import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { MapPin, Menu } from "lucide-react";
import { cn } from "@/lib/utils";

interface Activity {
  title: string;
  description: string;
  image: any | null;
  lat: number;
  lng: number;
  timeOfDay: "Morning" | "Afternoon" | "Evening";
  tags?: string[];
  bestTime?: string;
  curatorNote?: string;
}

interface Day {
  day: number;
  title: string;
  activities: Activity[];
  quote?: string;
}

interface ItineraryData {
  destination: string;
  days: Day[];
}

const COLORS = {
  background: "#FBF9F4",
  accent: "#B54A2A",
  text: "#111111",
  secondary: "#666666",
  footer: "#0F172A",
  tagBg: "#F0EFEA",
};

export default async function PrintItineraryPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const itinerary = await prisma.itinerary.findUnique({
    where: { id: resolvedParams.id },
  });

  if (!itinerary || !itinerary.data) {
    notFound();
  }

  const data = itinerary.data as unknown as ItineraryData;

  return (
    <div className="bg-[#FBF9F4] text-[#111111] font-sans print:bg-white w-full max-w-[210mm] mx-auto shadow-2xl print:shadow-none print:w-full">
      <style dangerouslySetInnerHTML={{
        __html: `
        @media print {
          @page {
            size: A4;
            margin: 0;
          }
          body {
            -webkit-print-color-adjust: exact;
            background-color: #FBF9F4 !important;
          }
          .page-break {
            page-break-after: always;
            break-after: page;
          }
          .break-inside-avoid {
            page-break-inside: avoid;
            break-inside: avoid;
          }
          * {
            overflow: visible !important;
          }
        }
      `}} />

      {data.days.map((day, dayIndex) => (
        <div key={day.day} className="relative flex flex-col page-break">

          {/* Header */}
          <header className="px-12 py-8 flex justify-between items-center border-b border-black/5 bg-[#FBF9F4]">
            <div className="text-[14px] font-serif font-bold tracking-[0.1em] uppercase">
              The {itinerary.destination} Editorial
            </div>
            <nav className="hidden md:flex gap-8 text-[9px] font-bold tracking-[0.2em] text-[#666666] uppercase">
              <span className="hover:text-black cursor-pointer">Stay</span>
              <span className="hover:text-black cursor-pointer">Dine</span>
              <span className="text-[#B54A2A] border-b border-[#B54A2A] cursor-pointer">Explore</span>
              <span className="hover:text-black cursor-pointer">Culture</span>
            </nav>
            <Menu className="w-5 h-5 text-[#111111]" />
          </header>

          <main className="flex-1 px-12 py-12">
            {/* Day Title Section */}
            <div className="mb-12">
              <p className="text-[10px] font-bold tracking-[0.2em] text-[#B54A2A] uppercase mb-4">
                Itinerary Chapter {day.day}
              </p>
              <div className="flex justify-between items-end border-b-2 border-[#B54A2A] pb-6">
                <h1 className="text-[100px] font-serif font-normal leading-[0.8] tracking-tight uppercase">
                  Day {String(day.day).padStart(2, '0')}
                </h1>
                <h2 className="text-4xl font-serif italic text-[#111111] max-w-[400px] text-right leading-[1.1]">
                  {day.title}
                </h2>
              </div>
            </div>

            {/* Banner Layout for Day 02 or every alternate day */}
            {day.day % 2 === 0 && day.activities[0]?.image && (
              <div className="mb-20">
                <div className="relative w-full aspect-[21/9] overflow-hidden mb-6">
                  <img
                    src={typeof day.activities[0].image === 'string' ? day.activities[0].image : day.activities[0].image?.url}
                    className="w-full h-full object-cover grayscale-[10%]"
                    alt={day.activities[0].title}
                  />
                  <div className="absolute bottom-0 left-0 bg-white/90 backdrop-blur-sm p-8 max-w-sm">
                    <h3 className="text-2xl font-serif mb-2">{day.activities[0].title}</h3>
                    <p className="text-[12px] text-[#666666] leading-relaxed">
                      {day.activities[0].description.split('.')[0]}.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Quote Block */}
            <div className="flex gap-10 mb-24 mt-8">
              <div className="w-[4px] bg-[#B54A2A] shrink-0 h-44"></div>
              <p className="text-[34px] font-serif italic leading-[1.25] text-[#111111] max-w-[720px] font-normal">
                "{day.quote || `The transition from the architectural steel of the station to the vermilion gates of Fushimi Inari is ${itinerary.destination}'s most striking juxtaposition. It is a city that lives simultaneously in the future and the distant past.`}"
              </p>
            </div>

            {/* Activities Section */}
            <div className="space-y-28">
              {day.activities.filter((_, idx) => day.day % 2 !== 0 || idx !== 0).map((activity, actIndex) => (
                <div key={actIndex} className="break-inside-avoid">
                  <div className={cn(
                    "flex gap-20 items-center",
                    actIndex % 2 === 1 ? "flex-row-reverse" : "flex-row"
                  )}>
                    {/* Activity Content */}
                    <div className="w-[45%]">
                      <div className="flex items-center gap-4 mb-4">
                        <span className="text-[12px] font-bold tracking-[0.15em] text-[#111111]">
                          {activity.timeOfDay === "Morning" ? "09:00 AM" : activity.timeOfDay === "Afternoon" ? "11:00 AM" : "07:00 PM"}
                        </span>
                        <span className="px-3 py-1 bg-[#F0EFEA] text-[9px] font-bold tracking-[0.1em] text-[#666666] uppercase">
                          {activity.tags?.[0] || (activity.timeOfDay === "Morning" ? "ANIMAL" : "SHRINE")}
                        </span>
                      </div>
                      <h3 className="text-[44px] font-serif mb-6 leading-[1.1] tracking-tight">
                        {activity.title}
                      </h3>
                      <p className="text-[15px] leading-[1.6] text-[#444444] mb-8 font-sans">
                        {activity.description}
                      </p>

                      {/* Best Time Tag */}
                      <div className="inline-flex items-center gap-2.5 px-4 py-2.5 bg-[#000000] text-white text-[9px] font-bold uppercase tracking-[0.15em]">
                        <MapPin className="w-3 h-3" />
                        Best Time: {activity.bestTime || (activity.timeOfDay === "Morning" ? "MORNING LIGHT" : "LATE AFTERNOON")}
                      </div>

                      {(activity.curatorNote || true) && (
                        <div className="mt-14 pt-8 border-t border-black/10">
                          <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] mb-4 text-[#111111]">Curator's Note</h4>
                          <p className="text-[14px] italic text-[#555555] font-serif leading-relaxed">
                            {activity.curatorNote || "Take a moment to sit on the veranda of the Hondo (main hall) facing the pond. The view is designed to inspire contemplation."}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Activity Image */}
                    <div className="w-[55%] relative">
                      {activity.image ? (
                        <div className="relative group">
                          <img
                            src={typeof activity.image === 'string' ? activity.image : activity.image?.url}
                            alt={activity.title}
                            className="w-full aspect-[4/3] object-cover grayscale-[15%] brightness-[0.98] transition-all duration-700"
                          />
                          {/* Decorative overlap image for some variety */}
                          {actIndex % 2 === 0 && (
                            <div className="absolute -bottom-14 -left-14 w-2/3 border-[10px] border-[#FBF9F4] shadow-2xl hidden md:block">
                              <img
                                src={typeof activity.image === 'string' ? activity.image : activity.image?.url}
                                className="w-full aspect-video object-cover grayscale brightness-[0.9]"
                                alt="detail"
                              />
                            </div>
                          )}
                          {actIndex % 2 === 1 && (
                            <div className="absolute -top-14 -right-14 w-1/2 border-[10px] border-[#FBF9F4] shadow-2xl hidden md:block">
                              <img
                                src={typeof activity.image === 'string' ? activity.image : activity.image?.url}
                                className="w-full aspect-square object-cover grayscale-[50%] brightness-[0.8]"
                                alt="detail"
                              />
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="w-full aspect-[4/3] bg-[#F0EFEA] flex items-center justify-center border border-black/5">
                          <span className="text-[11px] font-serif italic text-[#999999] tracking-widest uppercase">Imagery Pending Selection</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Inter-activity Connector Line */}
                  {actIndex < day.activities.length - 1 && (
                    <div className="flex flex-col items-center py-20">
                      <div className="w-[1px] h-16 bg-black/10"></div>
                      <div className="flex items-center gap-3 my-4 text-[9px] font-bold tracking-[0.3em] text-[#888888] uppercase bg-[#FBF9F4] px-4 py-1">
                        <MapPin className="w-3 h-3 text-[#B54A2A]" />
                        15 MIN JR NARA LINE
                      </div>
                      <div className="w-[1px] h-16 bg-black/10"></div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </main>

          {/* Footer */}
          <footer className="bg-[#0F172A] text-white px-12 py-20 text-center mt-auto">
            <h4 className="text-2xl font-serif italic tracking-[0.1em] mb-10 text-white/90">
              The {itinerary.destination} Editorial
            </h4>
            <div className="flex justify-center gap-16 text-[10px] font-bold tracking-[0.4em] uppercase text-white/40 mb-14">
              <span className="hover:text-white cursor-pointer transition-colors">Privacy</span>
              <span className="hover:text-white cursor-pointer transition-colors">Contact</span>
              <span className="hover:text-white cursor-pointer transition-colors">Credits</span>
            </div>
            <div className="space-y-3">
              <p className="text-[9px] tracking-[0.3em] text-white/20 uppercase font-medium">
                © {new Date().getFullYear()} The {itinerary.destination} Editorial. All Rights Reserved.
              </p>
              <p className="text-[9px] tracking-[0.3em] text-white/20 uppercase font-medium">
                Printed Digitally in {itinerary.destination}
              </p>
            </div>
          </footer>
        </div>
      ))}
    </div>
  );
}


