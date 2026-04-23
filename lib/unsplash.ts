/**
 * Unsplash Image Utility
 * 
 * To use this, get a free Access Key from https://unsplash.com/developers
 * and add it to your .env as UNSPLASH_ACCESS_KEY.
 */

import { connection } from "@/lib/bull/connection";

// A curated list of premium, high-quality travel and food images to use as fallbacks
// This guarantees the app maintains its "Luxury" aesthetic even if the Unsplash API is rate-limited.
const CURATED_FALLBACKS = [
  "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=1200&auto=format&fit=crop", // Mountains/Lake
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1200&auto=format&fit=crop", // High-end Food
  "https://images.unsplash.com/photo-1515238152791-8216bfdf89a7?q=80&w=1200&auto=format&fit=crop", // Beach
  "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?q=80&w=1200&auto=format&fit=crop", // Paris/City
  "https://images.unsplash.com/photo-1514933651103-005eec06c04b?q=80&w=1200&auto=format&fit=crop", // Restaurant Interior
  "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=1200&auto=format&fit=crop", // Road trip / Explorer
  "https://images.unsplash.com/photo-1541336032412-2048a678540d?q=80&w=1200&auto=format&fit=crop", // Luxury Hotel
  "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1200&auto=format&fit=crop", // Fine Dining
  "https://images.unsplash.com/photo-1480796927426-f609979314bd?q=80&w=1200&auto=format&fit=crop", // Tokyo/Neon City
  "https://images.unsplash.com/photo-1501504905252-473c47e087f8?q=80&w=1200&auto=format&fit=crop"  // Coffee/Cafe
];

const getFallbackImage = (query: string) => {
  // If we hit the rate limit, we pick a random premium image.
  // We use the query length to deterministically pick an image so it doesn't change on every render,
  // but it looks random across different activities.
  const index = query.length % CURATED_FALLBACKS.length;
  return CURATED_FALLBACKS[index];
};

export async function fetchUnsplashImage(
  query: string, 
  orientation: "landscape" | "portrait" | "squarish" = "landscape",
  fallbackQuery?: string
): Promise<string> {
  const accessKey = process.env.UNSPLASH_ACCESS_KEY;
  
  const tryFetch = async (q: string) => {
    if (!accessKey) return null;

    const cacheKey = `unsplash:image:${encodeURIComponent(q)}:${orientation}`;

    try {
      // 1. Check Redis Cache
      const cached = await connection.get(cacheKey);
      if (cached) return cached;

      const response = await fetch(
        `https://api.unsplash.com/search/photos?query=${encodeURIComponent(q)}&orientation=${orientation}&per_page=10`,
        {
          headers: {
            Authorization: `Client-ID ${accessKey}`,
          },
        }
      );

      if (!response.ok) {
        console.warn(`Unsplash API error (${response.status}) for: ${q}`);
        return null;
      }

      const data = await response.json();
      const results = data.results || [];
      
      if (results.length === 0) return null;

      // Pick a random image from the top 10 results to ensure variety
      const randomIndex = Math.floor(Math.random() * results.length);
      const url = results[randomIndex].urls.regular;

      // 2. Cache in Redis (24 hours)
      if (url) {
        await connection.set(cacheKey, url, "EX", 86400);
      }

      return url;
    } catch (error) {
      console.error(`Error fetching image for ${q}:`, error);
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
