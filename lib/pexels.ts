/**
 * Pexels Image Utility
 * 
 * To use this, get a free API Key from https://www.pexels.com/api/
 * and add it to your .env as PEXELS_API_KEY.
 * Pexels is more precise for landmarks and specific locations than Unsplash.
 */

import { connection } from "@/lib/bull/connection";

// Reuse your curated premium fallbacks for the "Luxury" aesthetic
const CURATED_FALLBACKS = [
  "https://images.pexels.com/photos/210186/pexels-photo-210186.jpeg?auto=compress&cs=tinysrgb&w=1200", // Mountains/Lake
  "https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg?auto=compress&cs=tinysrgb&w=1200", // High-end Food
  "https://images.pexels.com/photos/189349/pexels-photo-189349.jpeg?auto=compress&cs=tinysrgb&w=1200", // Beach
  "https://images.pexels.com/photos/699459/pexels-photo-699459.jpeg?auto=compress&cs=tinysrgb&w=1200", // City/Architecture
  "https://images.pexels.com/photos/262047/pexels-photo-262047.jpeg?auto=compress&cs=tinysrgb&w=1200", // Restaurant Interior
  "https://images.pexels.com/photos/2101187/pexels-photo-2101187.jpeg?auto=compress&cs=tinysrgb&w=1200", // Travel/Explorer
  "https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=1200", // Luxury Hotel
  "https://images.pexels.com/photos/941861/pexels-photo-941861.jpeg?auto=compress&cs=tinysrgb&w=1200", // Fine Dining
  "https://images.pexels.com/photos/2507007/pexels-photo-2507007.jpeg?auto=compress&cs=tinysrgb&w=1200", // Neon City
  "https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=1200"  // Coffee/Cafe
];

const getFallbackImage = (query: string) => {
  const index = query.length % CURATED_FALLBACKS.length;
  return CURATED_FALLBACKS[index];
};

export async function fetchPexelsImage(
  query: string, 
  orientation: "landscape" | "portrait" | "square" = "landscape",
  fallbackQuery?: string
): Promise<string> {
  const apiKey = process.env.PEXELS_API_KEY;
  
  const tryFetch = async (q: string) => {
    if (!apiKey) return null;

    const cacheKey = `pexels:image:${encodeURIComponent(q)}:${orientation}`;

    try {
      // 1. Check Redis Cache
      const cached = await connection.get(cacheKey);
      if (cached) return cached;

      // Pexels API call
      const response = await fetch(
        `https://api.pexels.com/v1/search?query=${encodeURIComponent(q)}&orientation=${orientation}&per_page=5`,
        {
          headers: {
            Authorization: apiKey,
          },
        }
      );

      if (!response.ok) {
        console.warn(`Pexels API error (${response.status}) for: ${q}`);
        return null;
      }

      const data = await response.json();
      const photos = data.photos || [];
      
      if (photos.length === 0) return null;

      // We take the FIRST result for maximum precision, 
      // unlike Unsplash where we might have needed to randomize.
      const url = photos[0].src.large2x || photos[0].src.original;

      // 2. Cache in Redis (24 hours)
      if (url) {
        await connection.set(cacheKey, url, "EX", 86400);
      }

      return url;
    } catch (error) {
      console.error(`Error fetching Pexels image for ${q}:`, error);
      return null;
    }
  };

  // 1. Try primary specific query
  let imageUrl = await tryFetch(query);
  
  // 2. Try fallback query if primary failed
  if (!imageUrl && fallbackQuery) {
    imageUrl = await tryFetch(fallbackQuery);
  }

  // 3. Final Result: API image OR a dynamic relevant fallback
  return imageUrl || getFallbackImage(query);
}
