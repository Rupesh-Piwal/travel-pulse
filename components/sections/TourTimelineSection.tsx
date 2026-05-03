"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const TOUR_TEXT_TOP =
  "We've planned a seamless multi-destination itinerary tailored to your preferences. Here's a sample 10-day journey visiting three iconic cities:";
const TOUR_TEXT_TOP_HIGHLIGHT = "Osaka, Kyoto, and Tokyo.";
const TOUR_TEXT_BOTTOM =
  "No need to worry about routes, schedules, or finding places — everything is already organized. We'll show you where to go, what to see, and where to eat, so you can simply";
const TOUR_TEXT_BOTTOM_HIGHLIGHT = "enjoy the journey.";

const TOUR_STOPS = [
  {
    days: "Days 1–3",
    city: "Osaka",
    leftPhotos: [
      { src: "https://images.unsplash.com/photo-1590559899731-a382839e5549?q=80&w=500&auto=format", alt: "Cherry blossoms and Osaka castle", rotate: -4 },
      { src: "https://images.unsplash.com/photo-1563245372-f21724e3856d?q=80&w=500&auto=format", alt: "Osaka city skyline", rotate: 3 },
    ],
    rightPhotos: [
      { src: "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?q=80&w=500&auto=format", alt: "Traditional Japanese architecture", rotate: 2 },
    ],
  },
  {
    days: "Days 4–6",
    city: "Kyoto",
    leftPhotos: [] as { src: string; alt: string; rotate: number }[],
    rightPhotos: [
      { src: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=500&auto=format", alt: "Kyoto temple at dusk", rotate: -3 },
      { src: "https://images.unsplash.com/photo-1528360983277-13d401cdc186?q=80&w=500&auto=format", alt: "Kyoto bamboo grove", rotate: 4 },
    ],
  },
  {
    days: "Days 7–10",
    city: "Tokyo",
    leftPhotos: [
      { src: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=500&auto=format", alt: "Tokyo neon streets at night", rotate: 3 },
    ],
    rightPhotos: [
      { src: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?q=80&w=500&auto=format", alt: "Tokyo skyline at night", rotate: -2 },
      { src: "https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?q=80&w=500&auto=format", alt: "Fushimi Inari torii gates", rotate: 5 },
    ],
  },
];

type PhotoItem = { src: string; alt: string; rotate: number };

function PhotoStack({ photos, delay = 0 }: { photos: PhotoItem[]; delay?: number }) {
  if (photos.length === 0) return null;

  if (photos.length === 1) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ delay, duration: 0.6, ease: "easeOut" }}
        className="relative w-28 h-[84px] flex-shrink-0 rounded-[10px] overflow-hidden shadow-[0_12px_40px_rgba(0,0,0,0.65)] border border-white/10"
        style={{ rotate: photos[0].rotate }}
      >
        <Image src={photos[0].src} alt={photos[0].alt} fill sizes="112px" className="object-cover" />
      </motion.div>
    );
  }

  return (
    <div className="relative flex-shrink-0" style={{ width: "148px", height: "108px" }}>
      {photos.map((photo, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0.88 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: delay + i * 0.1, duration: 0.6, ease: "easeOut" }}
          className="absolute w-[112px] h-[84px] rounded-[10px] overflow-hidden shadow-[0_12px_40px_rgba(0,0,0,0.65)] border border-white/10"
          style={{
            top: `${i * 18}px`,
            left: `${i * 16}px`,
            zIndex: photos.length - i,
            rotate: photo.rotate,
          }}
        >
          <Image src={photo.src} alt={photo.alt} fill sizes="112px" className="object-cover" />
        </motion.div>
      ))}
    </div>
  );
}

export default function TourTimelineSection() {
  return (
    <div className="bg-[#FEFEFF] px-6 md:px-[8vw] relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-navy/10 to-transparent" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-terracotta/[0.04] rounded-full blur-[180px] pointer-events-none" />

      <div className="max-w-[1200px] mx-auto relative z-10">


        {/* ── Two-column layout ── */}
        <div className="grid grid-cols-1 md:grid-cols-[2fr_3fr] gap-10 md:gap-16 lg:gap-24">

          {/* LEFT: text paragraphs – spaced top & bottom to align with first/last stops */}
          <div className="flex flex-col justify-between gap-8 md:gap-0 md:py-8">
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.7 }}
              className="text-navy/55 text-[13px] md:text-[14px] leading-[1.85] font-sans"
            >
              {TOUR_TEXT_TOP}{" "}
              <span className="font-medium" style={{ color: "#C4632C" }}>
                {TOUR_TEXT_TOP_HIGHLIGHT}
              </span>
            </motion.p>

            <motion.p
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.7 }}
              className="text-navy/55 text-[13px] md:text-[14px] leading-[1.85] font-sans"
            >
              {TOUR_TEXT_BOTTOM}{" "}
              <span className="font-medium" style={{ color: "#C4632C" }}>
                {TOUR_TEXT_BOTTOM_HIGHLIGHT}
              </span>
            </motion.p>
          </div>

          {/* RIGHT: vertical timeline */}
          <div className="relative">

            {/* Vertical connecting line (desktop) */}
            <motion.div
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="absolute hidden md:block w-px bg-navy/20 origin-top"
              style={{ left: "calc(40% + 7px)", top: "28px", bottom: "28px" }}
            />

            {/* Vertical connecting line (mobile) */}
            <div className="absolute md:hidden left-[11px] top-2 bottom-2 w-px bg-navy/20" />

            {/* ── Stops ── */}
            <div>
              {TOUR_STOPS.map((stop, idx) => {
                const hasPhotos = stop.leftPhotos.length > 0 || stop.rightPhotos.length > 0;
                const minH = hasPhotos ? "160px" : "110px";
                return (
                  <div key={stop.city}>

                    {/* DESKTOP STOP */}
                    <div
                      className="relative hidden md:flex items-center"
                      style={{ minHeight: minH }}
                    >
                      {/* Left zone: [stacked photos] → [label right-aligned before dot] */}
                      <div
                        className="flex items-center justify-end gap-4 pr-3 h-full"
                        style={{ width: "calc(40% - 7px)" }}
                      >
                        {stop.leftPhotos.length > 0 && (
                          <PhotoStack photos={stop.leftPhotos} delay={0.1 + idx * 0.13} />
                        )}
                        <motion.div
                          initial={{ opacity: 0, x: 10 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.15 + idx * 0.13, duration: 0.5 }}
                          className="text-right flex-shrink-0"
                        >
                          <p className="text-navy/40 text-[9px] tracking-[0.18em] uppercase font-bold mb-[3px]">
                            {stop.days}
                          </p>
                          <h3 className="text-navy font-bold text-[22px] leading-none tracking-tight">
                            {stop.city}
                          </h3>
                        </motion.div>
                      </div>

                      {/* Dot */}
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        whileInView={{ scale: 1, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{
                          delay: 0.22 + idx * 0.13,
                          duration: 0.4,
                          type: "spring",
                          stiffness: 280,
                        }}
                        className="w-[14px] h-[14px] rounded-full bg-navy/90 ring-[4px] ring-navy/15 flex-shrink-0 z-10"
                      />

                      {/* Right zone: photos */}
                      <div className="flex-1 flex items-center pl-5">
                        {stop.rightPhotos.length > 0 && (
                          <PhotoStack photos={stop.rightPhotos} delay={0.28 + idx * 0.13} />
                        )}
                      </div>
                    </div>

                    {/* MOBILE STOP */}
                    <motion.div
                      initial={{ opacity: 0, x: -12 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.12, duration: 0.6 }}
                      className="relative md:hidden pl-9 pb-10 last:pb-0"
                    >
                      <div className="absolute left-[5px] top-[4px] w-3 h-3 rounded-full bg-navy/90 ring-[3px] ring-navy/20 z-10" />
                      <p className="text-navy/40 text-[9px] tracking-[0.15em] uppercase font-bold mb-[3px]">
                        {stop.days}
                      </p>
                      <h3 className="text-navy font-bold text-lg leading-tight mb-3">
                        {stop.city}
                      </h3>
                      <div className="flex gap-2 flex-wrap">
                        {[...stop.leftPhotos, ...stop.rightPhotos].slice(0, 3).map((photo, j) => (
                          <div
                            key={j}
                            className="relative w-[88px] h-[66px] rounded-[8px] overflow-hidden shadow-lg border border-white/10 flex-shrink-0"
                          >
                            <Image
                              src={photo.src}
                              alt={photo.alt}
                              fill
                              sizes="88px"
                              className="object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    </motion.div>

                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
