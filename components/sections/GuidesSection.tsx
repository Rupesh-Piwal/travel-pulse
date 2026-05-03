"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

const guides = [
  {
    name: "Maldives",
    slug: "maldives",
    image: "https://images.pexels.com/photos/29289155/pexels-photo-29289155.jpeg",
  },
  {
    name: "Switzerland",
    slug: "switzerland",
    image: "https://images.unsplash.com/photo-1527668752968-14dc70a27c95?q=80&w=800&auto=format&fit=crop",
  },
  {
    name: "Singapore",
    slug: "singapore",
    image: "https://images.pexels.com/photos/20768105/pexels-photo-20768105.jpeg",
  },
  {
    name: "Scotland",
    slug: "scotland",
    image: "https://images.unsplash.com/photo-1641038321852-bc96d970e2e5?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    name: "Rome",
    slug: "rome",
    image: "https://images.pexels.com/photos/1797161/pexels-photo-1797161.jpeg",
  },
  {
    name: "Japan",
    slug: "japan",
    image: "https://images.pexels.com/photos/35066466/pexels-photo-35066466.jpeg",
  },
  {
    name: "Great Wall of China",
    slug: "great-wall-of-china",
    image: "https://images.pexels.com/photos/17615499/pexels-photo-17615499.jpeg",
  },
  {
    name: "Cambodia",
    slug: "cambodia",
    image: "https://images.pexels.com/photos/5278961/pexels-photo-5278961.jpeg",
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
                <div className="relative w-full aspect-video rounded-[16px] overflow-hidden bg-gray-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)]">
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
