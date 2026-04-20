import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Clock, MapPin, MapTrifold as MapIcon, CalendarBlank, Sparkle } from "@phosphor-icons/react";

interface Activity {
  title: string;
  description: string;
  image: string | null;
  lat: number;
  lng: number;
  timeOfDay: "Morning" | "Afternoon" | "Evening";
}

interface Day {
  day: number;
  title: string;
  activities: Activity[];
}

interface ItineraryData {
  destination: string;
  days: Day[];
}

export default async function PrintItineraryPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const itinerary = await prisma.itinerary.findUnique({
    where: { id: resolvedParams.id },
  });

  if (!itinerary || !itinerary.data) {
    notFound();
  }

  const data = itinerary.data as unknown as ItineraryData;

  // The PDF generator forces media="print". We design directly for print.
  // We use standard A4 max width and clear, high-contrast colors matching the request.
  return (
    <div className="bg-white min-h-screen text-slate-900 font-sans p-10 max-w-[210mm] mx-auto print:p-0 print:m-0 print:max-w-none">
      
      {/* HEADER PAGE */}
      <div className="mb-10 pb-6 border-b-4 border-slate-900/10">
        <div className="flex justify-between items-end mb-4">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">
              NomadGo Prepared Itinerary
            </p>
            <h1 className="text-5xl font-black text-slate-900 tracking-tight leading-none mb-2">
              {itinerary.destination}
            </h1>
            <p className="text-sm font-semibold text-orange-600 uppercase tracking-widest">
              {itinerary.vibe} Exploration
            </p>
          </div>
          
          <div className="text-right">
            <div className="flex flex-col items-end gap-1.5">
              <div className="flex items-center gap-2 text-slate-600 font-bold text-sm bg-slate-100 px-3 py-1.5 rounded-lg">
                <CalendarBlank className="w-4 h-4 text-slate-400" />
                {itinerary.days} Days
              </div>
              <div className="flex items-center gap-2 text-slate-600 font-bold text-sm bg-slate-100 px-3 py-1.5 rounded-lg uppercase">
                <Sparkle className="w-4 h-4 text-slate-400" />
                {itinerary.budget} Budget
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* TIMELINE */}
      <div className="space-y-12">
        {data.days.map((day) => (
          <div key={day.day} className="break-inside-avoid shadow-sm rounded-2xl overflow-hidden border border-slate-200">
            
            {/* Day Header (Grey Block from mockup) */}
            <div className="bg-slate-100 px-6 py-3 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider text-sm flex justify-between items-center">
              <span>DAY {day.day}</span>
              <span className="text-slate-500 text-xs">{day.title}</span>
            </div>

            <div className="p-6">
              <div className="relative border-l-2 border-slate-300 ml-4 space-y-10 py-2">
                {day.activities.map((activity, actIndex) => (
                  <div key={actIndex} className="relative pl-10 break-inside-avoid">
                    
                    {/* Activity Icon/Bullet on the line */}
                    <div className="absolute -left-[1.1rem] top-1 w-8 h-8 rounded-full bg-white border-[3px] border-orange-500 shadow-sm flex items-center justify-center">
                      <MapPin className="w-3.5 h-3.5 text-orange-600" />
                    </div>

                    <div className="flex md:flex-row flex-col gap-6">
                      <div className="flex-1 space-y-2">
                        {/* Time of Day & Title */}
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{activity.timeOfDay}</span>
                          </div>
                          <h3 className="text-xl font-bold text-slate-800 leading-tight">
                            {activity.title}
                          </h3>
                        </div>
                        
                        <p className="text-sm font-medium text-slate-600 leading-relaxed">
                          {activity.description}
                        </p>
                      </div>

                      {/* Optional Thumbnail */}
                      {activity.image && (
                        <div className="w-32 h-24 rounded-xl overflow-hidden shadow-sm flex-shrink-0 border border-slate-200">
                          <img src={activity.image} alt={activity.title} className="w-full h-full object-cover" />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
