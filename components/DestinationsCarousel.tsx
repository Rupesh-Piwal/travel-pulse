"use client";

import { useCallback, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, MapPin } from "lucide-react";

/* ─── Data ─────────────────────────────────────────────────── */

const DESTINATIONS = [
  {
    name: "Kyoto, Japan",
    img: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=900&auto=format&fit=crop",
  },
  {
    name: "Bali, Indonesia",
    img: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=900&auto=format&fit=crop",
  },
  {
    name: "Levanto, Italy",
    img: "https://images.unsplash.com/photo-1533676802871-eca1ae998cd5?q=80&w=900&auto=format&fit=crop",
  },
  {
    name: "Santorini, Greece",
    img: "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?q=80&w=900&auto=format&fit=crop",
  },
  {
    name: "Tokyo, Japan",
    img: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?q=80&w=900&auto=format&fit=crop",
  },
  {
    name: "Paris, France",
    img: "https://images.unsplash.com/photo-1502602881226-540bbefa4266?q=80&w=900&auto=format&fit=crop",
  },
  {
    name: "Maldives",
    img: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?q=80&w=900&auto=format&fit=crop",
  },
] as const;

const N = DESTINATIONS.length; // 7 — keeps 2 hidden cards (one each side) for clean looping

/* ─── Layout constants ─────────────────────────────────────── */

// Card sizes by absolute distance from center (0 = center, 1 = adjacent, 2 = edge)
const CARD = [
  { w: 430, h: 648, opacity: 1, zIndex: 50 },    // center
  { w: 278, h: 616, opacity: 1, zIndex: 40 },    // ±1
  { w: 116, h: 584, opacity: 0.85, zIndex: 30 }, // ±2
] as const;

const GAP = 8;              // px between cards
const CONTAINER_H = 720;   // total carousel track height

const EASE = [0.25, 0.1, 0.25, 1] as const;
const TRANSITION = { duration: 0.5, ease: EASE };
const INSTANT   = { duration: 0 };

/* ─── Helpers ───────────────────────────────────────────────── */

/** Circular relative position: returns value in -(N/2)..+(N/2) */
function getRelPos(i: number, selected: number): number {
  let pos = (i - selected + N) % N;
  if (pos > N / 2) pos -= N;
  return pos;
}

/** Framer-motion animate target for a card at relPos */
function computeTarget(relPos: number) {
  const abs   = Math.abs(relPos);
  const sign  = relPos > 0 ? 1 : relPos < 0 ? -1 : 0;
  const cfg   = abs < 3 ? CARD[abs] : CARD[2];

  // Horizontal center offset from container midpoint
  let cx = 0;
  if (abs === 1) {
    cx = sign * (CARD[0].w / 2 + GAP + CARD[1].w / 2);
  } else if (abs === 2) {
    cx = sign * (CARD[0].w / 2 + GAP + CARD[1].w + GAP + CARD[2].w / 2);
  } else if (abs >= 3) {
    // Fully off-screen buffer
    cx = sign * (CARD[0].w / 2 + GAP + CARD[1].w + GAP + CARD[2].w + 60);
  }

  return {
    // left: 50% is the base; x shifts so the card center lands on cx
    x:      cx - cfg.w / 2,
    // vertically center each card in the track
    y:      (CONTAINER_H - cfg.h) / 2,
    width:  cfg.w,
    height: cfg.h,
    opacity: abs >= 3 ? 0 : cfg.opacity,
    zIndex:  abs >= 3 ? 10 : cfg.zIndex,
  };
}

/* ─── Component ─────────────────────────────────────────────── */

export default function DestinationsCarousel() {
  const [selected, setSelected] = useState(0);

  /**
   * Track previous relPos per card so we can give hidden cards that
   * switch sides (e.g. relPos −3 → +3) an instant transition,
   * preventing a ghostly sweep across the screen.
   */
  const prevRelRef = useRef<Record<number, number>>({});

  function getTransition(i: number, newRel: number) {
    const oldRel = prevRelRef.current[i];
    prevRelRef.current[i] = newRel;

    if (oldRel === undefined) return TRANSITION; // first render

    const oldAbs = Math.abs(oldRel);
    const newAbs = Math.abs(newRel);
    const sideSwitched =
      oldAbs >= 3 &&
      newAbs >= 3 &&
      oldRel !== 0 &&
      newRel !== 0 &&
      Math.sign(oldRel) !== Math.sign(newRel);

    return sideSwitched ? INSTANT : TRANSITION;
  }

  const prev = useCallback(() => setSelected((s) => (s - 1 + N) % N), []);
  const next = useCallback(() => setSelected((s) => (s + 1) % N), []);

  return (
    <div>
      {/* ── Track ────────────────────────────────────────── */}
      <div
        className="relative overflow-hidden"
        style={{ height: CONTAINER_H }}
        role="region"
        aria-label="Destinations carousel"
        aria-live="polite"
      >
        {DESTINATIONS.map((dest, i) => {
          const relPos     = getRelPos(i, selected);
          const target     = computeTarget(relPos);
          const transition = getTransition(i, relPos);
          const isCenter   = relPos === 0;

          return (
            <motion.div
              key={dest.name}
              style={{
                position: "absolute",
                left: "50%",
                top: 0,
                zIndex: target.zIndex,
              }}
              animate={{
                x:       target.x,
                y:       target.y,
                width:   target.width,
                height:  target.height,
                opacity: target.opacity,
              }}
              initial={false}
              transition={transition}
              className={[
                "rounded-[20px] overflow-hidden select-none",
                !isCenter ? "cursor-pointer" : "",
              ].join(" ")}
              onClick={() => !isCenter && setSelected(i)}
              tabIndex={isCenter ? -1 : 0}
              role={isCenter ? "presentation" : "button"}
              aria-label={isCenter ? undefined : `Go to ${dest.name}`}
              onKeyDown={(e) => {
                if (!isCenter && (e.key === "Enter" || e.key === " ")) {
                  e.preventDefault();
                  setSelected(i);
                }
              }}
            >
              <img
                src={dest.img}
                alt={dest.name}
                className="w-full h-full object-cover pointer-events-none"
                draggable={false}
              />

              {/* Center card overlays */}
              {isCenter && (
                <>
                  {/* Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent pointer-events-none" />

                  {/* Location label */}
                  <div className="absolute bottom-[76px] left-6 right-6 flex items-center gap-2 pointer-events-none">
                    <MapPin
                      className="w-5 h-5 shrink-0"
                      style={{ color: "#1BBCBC", fill: "#1BBCBC" }}
                      aria-hidden="true"
                    />
                    <span className="text-white font-bold text-[22px] leading-tight drop-shadow">
                      {dest.name}
                    </span>
                  </div>

                  {/* Explore pill */}
                  <button
                    className="absolute bottom-5 left-1/2 -translate-x-1/2 w-[200px] bg-white/20 backdrop-blur-md rounded-full py-3 text-white font-medium text-[16px] hover:bg-white/30 transition-colors whitespace-nowrap"
                    aria-label={`Explore ${dest.name}`}
                  >
                    Explore
                  </button>
                </>
              )}
            </motion.div>
          );
        })}

        {/* ── Navigation arrows ─────────────────────────── */}
        <button
          onClick={prev}
          aria-label="Previous destination"
          className="absolute left-6 top-1/2 -translate-y-1/2 z-[200] w-12 h-12 rounded-full flex items-center justify-center text-white shadow-xl hover:scale-110 active:scale-95 transition-transform"
          style={{ backgroundColor: "#1BBCBC" }}
        >
          <ChevronLeft className="w-5 h-5" strokeWidth={2.5} />
        </button>

        <button
          onClick={next}
          aria-label="Next destination"
          className="absolute right-6 top-1/2 -translate-y-1/2 z-[200] w-12 h-12 rounded-full flex items-center justify-center text-white shadow-xl hover:scale-110 active:scale-95 transition-transform"
          style={{ backgroundColor: "#1BBCBC" }}
        >
          <ChevronRight className="w-5 h-5" strokeWidth={2.5} />
        </button>
      </div>

      {/* ── Dot indicators ───────────────────────────────── */}
      <div className="flex justify-center items-center gap-[10px] mt-10" role="tablist" aria-label="Carousel navigation">
        {DESTINATIONS.map((dest, i) => (
          <button
            key={i}
            role="tab"
            aria-selected={i === selected}
            aria-label={`Go to ${dest.name}`}
            onClick={() => setSelected(i)}
            className="rounded-full transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-2"
            style={{
              width:           i === selected ? 12 : 8,
              height:          8,
              backgroundColor: i === selected ? "#1BBCBC" : "rgba(14,25,34,0.2)",
              outline:         i === selected ? "none" : undefined,
            }}
          />
        ))}
      </div>
    </div>
  );
}
