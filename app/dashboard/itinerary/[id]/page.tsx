import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { motion } from "framer-motion";
import { 
  MapPin, 
  Clock, 
  Map as MapIcon, 
  Calendar,
  Sparkles,
  ArrowLeft,
  Share2,
  Download
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface Activity {
  title: string;
  description: string;
  image: string | null;
  lat: number;
  lng: number;
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

export default async function ItineraryViewPage({ params }: { params: { id: string } }) {
  const itinerary = await prisma.itinerary.findUnique({
    where: { id: params.id },
  });

  if (!itinerary || !itinerary.data) {
    notFound();
  }

  const data = itinerary.data as unknown as ItineraryData;

  return (
    <div className="max-w-6xl mx-auto pb-20">
      {/* Navigation Header */}
      <div className="flex items-center justify-between mb-8">
        <Link href="/dashboard">
          <Button variant="ghost" className="rounded-full gap-2 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Button>
        </Link>
        <div className="flex gap-3">
          <Button variant="outline" className="rounded-xl border-border/50 gap-2">
            <Share2 className="w-4 h-4" />
            Share
          </Button>
          <Button variant="outline" className="rounded-xl border-border/50 gap-2">
            <Download className="w-4 h-4" />
            Export PDF
          </Button>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative h-64 md:h-80 rounded-3xl overflow-hidden mb-12 border border-border/50 shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent z-10" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2021&auto=format&fit=crop')] bg-cover bg-center" />
        
        <div className="absolute bottom-8 left-8 z-20 space-y-2">
          <Badge className="bg-orange-600/90 text-white border-0 hover:bg-orange-600 px-3 py-1 text-xs font-semibold uppercase tracking-wider">
            {itinerary.vibe} Exploration
          </Badge>
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-white tracking-tight">
            {itinerary.destination}
          </h1>
          <div className="flex items-center gap-4 text-white/80 font-medium">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              {itinerary.days} Days
            </div>
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-orange-400" />
              {itinerary.budget} Budget
            </div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr,300px] gap-12">
        {/* Main Content: Daily Schedule */}
        <div className="space-y-16">
          {data.days.map((day, dayIndex) => (
            <div key={day.day} id={`day-${day.day}`} className="space-y-8 scroll-mt-24">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-orange-600 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-orange-950/20">
                  {day.day}
                </div>
                <div>
                  <h2 className="text-2xl font-serif font-semibold">{day.title}</h2>
                  <p className="text-muted-foreground text-sm">Experience the soul of the city</p>
                </div>
              </div>

              <div className="space-y-6 ml-6 pl-10 border-l border-dashed border-border/50 relative">
                {day.activities.map((activity, actIndex) => (
                  <div key={actIndex} className="relative group">
                    {/* Activity Bullet */}
                    <div className="absolute -left-[53px] top-6 w-6 h-6 rounded-full bg-accent border-4 border-background group-hover:bg-orange-600 transition-colors duration-300" />
                    
                    <div className="bg-accent/20 backdrop-blur-md rounded-2xl border border-border/40 p-6 hover:border-border/80 transition-all duration-300 group-hover:translate-x-1">
                      <div className="flex flex-col md:flex-row gap-6">
                        <div className="w-full md:w-48 h-32 rounded-xl bg-accent/40 overflow-hidden flex-shrink-0 border border-border/20">
                          {activity.image ? (
                            <img src={activity.image} alt={activity.title} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <MapIcon className="w-8 h-8 text-muted-foreground/30" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 space-y-3">
                          <div className="flex items-center justify-between">
                            <h3 className="text-xl font-semibold group-hover:text-orange-500 transition-colors">
                              {activity.title}
                            </h3>
                            <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground bg-accent/30 px-2 py-1 rounded-md">
                              <Clock className="w-3 h-3" />
                              Morning
                            </div>
                          </div>
                          <p className="text-muted-foreground leading-relaxed text-sm">
                            {activity.description}
                          </p>
                          <div className="flex items-center gap-4 pt-2">
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <MapPin className="w-3.5 h-3.5" />
                              Location Details
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Sidebar: Navigation & Info */}
        <aside className="space-y-8 hidden lg:block">
          <div className="sticky top-24 space-y-6">
            <div className="bg-accent/20 backdrop-blur-md rounded-3xl border border-border/40 p-6 space-y-6">
              <h4 className="font-semibold text-lg">Trip Overview</h4>
              
              <div className="space-y-4">
                {data.days.map((day) => (
                  <a 
                    key={day.day}
                    href={`#day-${day.day}`}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-accent/40 transition-all text-muted-foreground hover:text-foreground group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-accent/60 flex items-center justify-center text-xs font-bold group-hover:bg-orange-600 group-hover:text-white transition-all">
                      {day.day}
                    </div>
                    <span className="text-sm font-medium truncate">{day.title}</span>
                  </a>
                ))}
              </div>

              <div className="pt-4 border-t border-border/50">
                <Button className="w-full bg-accent hover:bg-accent/80 text-foreground gap-2 rounded-xl border border-border/50 h-12">
                  <MapIcon className="w-4 h-4" />
                  View Interactive Map
                </Button>
              </div>
            </div>

            <div className="bg-gradient-to-br from-orange-600/20 to-orange-950/20 rounded-3xl border border-orange-500/20 p-6 text-center space-y-4">
              <Sparkles className="w-8 h-8 text-orange-500 mx-auto" />
              <p className="text-sm font-medium">Ready to travel?</p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Save this itinerary to your mobile device for offline access during your trip.
              </p>
              <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white rounded-xl h-11">
                Save Offline
              </Button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
