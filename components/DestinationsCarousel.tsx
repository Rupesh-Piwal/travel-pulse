"use client";

import { FocusRail, type FocusRailItem } from "@/components/ui/focus-rail";

const DESTINATIONS: FocusRailItem[] = [
  {
    id: 1,
    title: "Kyoto, Japan",
    meta: "Culture • Serenity",
    description: "Experience the timeless beauty of ancient temples and tranquil gardens.",
    imageSrc: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=900&auto=format&fit=crop",
    href: "#",
  },
  {
    id: 2,
    title: "Bali, Indonesia",
    meta: "Tropical • Wellness",
    description: "Discover spiritual retreats amidst lush rice terraces and azure waters.",
    imageSrc: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=900&auto=format&fit=crop",
    href: "#",
  },
  {
    id: 3,
    title: "Cairo, Egypt",
    meta: "History • Desert",
    description: "Stand before the pyramids and unravel the mysteries of the pharaohs.",
    imageSrc: "https://images.unsplash.com/photo-1629468855534-450d7c4c5f72?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGVneXB0fGVufDB8fDB8fHww",
    href: "#",
  },
  {
    id: 4,
    title: "Santorini, Greece",
    meta: "Romance • Coastal",
    description: "Iconic white-washed architecture overlooking a breathtaking caldera.",
    imageSrc: "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?q=80&w=900&auto=format&fit=crop",
    href: "#",
  },
  {
    id: 5,
    title: "Tokyo, Japan",
    meta: "Urban • Neon",
    description: "A dazzling metropolis where neon streets meet profound traditions.",
    imageSrc: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?q=80&w=900&auto=format&fit=crop",
    href: "#",
  },
  {
    id: 6,
    title: "Rome, Italy",
    meta: "Heritage • Culinary",
    description: "Wander through living history and savor the art of la dolce vita.",
    imageSrc: "https://images.unsplash.com/photo-1775401152739-662f585e4360?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHx0b3BpYy1mZWVkfDU0fEZ6bzN6dU9ITjZ3fHxlbnwwfHx8fHw%3D",
    href: "#",
  },
  {
    id: 7,
    title: "Maldives",
    meta: "Luxury • Ocean",
    description: "Escape to private overwater villas floating on crystal-clear lagoons.",
    imageSrc: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?q=80&w=900&auto=format&fit=crop",
    href: "#",
  },
];

export default function DestinationsCarousel() {
  return (
    <FocusRail
      items={DESTINATIONS}
      autoPlay={false}
      loop={true}
    />
  );
}
