"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

const guides = [
  {
    name: "Turkey",
    slug: "turkey",
    image: "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?q=80&w=800&auto=format&fit=crop",
  },
  {
    name: "Switzerland",
    slug: "switzerland",
    image: "https://images.unsplash.com/photo-1527668752968-14dc70a27c95?q=80&w=800&auto=format&fit=crop",
  },
  {
    name: "Indonesia",
    slug: "indonesia",
    image: "https://images.unsplash.com/photo-1553621042-f6e147245754?q=80&w=800&auto=format&fit=crop",
  },
  {
    name: "Thailand",
    slug: "thailand",
    image: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?q=80&w=800&auto=format&fit=crop",
  },
  {
    name: "Vietnam",
    slug: "vietnam",
    image: "https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=800&auto=format&fit=crop",
  },
  {
    name: "Japan",
    slug: "japan",
    image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=800&auto=format&fit=crop",
  },
  {
    name: "United States",
    slug: "united-states",
    image: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=800&auto=format&fit=crop",
  },
  {
    name: "Panama",
    slug: "panama",
    image: "https://images.unsplash.com/photo-1596422846543-74c6e2ca0121?q=80&w=800&auto=format&fit=crop",
  }
];

export default function GuidesSection() {
  return (
    <section className="bg-[#FEFEFF] py-[30px] md:py-[60px] px-6 md:px-[8vw] border-t border-navy/5">
      <div className="max-w-[1240px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
          className="mb-12 md:mb-16 text-center"
        >
          <div className="text-[20px] md:text-[32px] font-serif italic leading-none text-terracotta mb-2">
            Guides
          </div>
          <h2 className="text-navy text-[28px] md:text-[44px] font-sans font-medium tracking-tighter leading-[1.1] mb-8">
            Not sure where to go? Start with these guides.
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
          {guides.map((guide, idx) => (
            <Link
              key={guide.slug}
              href={`/dashboard/itinerary/${guide.slug}`}
              className="group block"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: idx * 0.05 }}
                className="flex flex-col gap-3"
              >
                <div className="relative w-full aspect-[4/5] rounded-[24px] overflow-hidden bg-gray-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)]">
                  <Image
                    src={guide.image}
                    alt={guide.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                  {/* Subtle gradient overlay to make it look premium */}
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
                <h3 className="text-navy font-medium text-[15px] md:text-[17px] tracking-tight ml-1 group-hover:text-terracotta transition-colors duration-300">
                  {guide.name}
                </h3>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
