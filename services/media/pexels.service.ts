import { ImageAssetData } from "./types";
import { connection } from "@/lib/bull/connection";

const CURATED_FALLBACKS = [
  "https://images.pexels.com/photos/210186/pexels-photo-210186.jpeg?auto=compress&cs=tinysrgb&w=1200", // Mountains/Lake
  "https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg?auto=compress&cs=tinysrgb&w=1200", // High-end Food
  "https://images.pexels.com/photos/189349/pexels-photo-189349.jpeg?auto=compress&cs=tinysrgb&w=1200", // Beach
  "https://images.pexels.com/photos/699459/pexels-photo-699459.jpeg?auto=compress&cs=tinysrgb&w=1200", // City/Architecture
  "https://images.pexels.com/photos/262047/pexels-photo-262047.jpeg?auto=compress&cs=tinysrgb&w=1200", // Restaurant Interior
];

const getFallbackImage = (query: string): ImageAssetData => {
  const index = query.length % CURATED_FALLBACKS.length;
  return {
    url: CURATED_FALLBACKS[index],
    source: "system",
    author: "Pexels",
    license: "Pexels License",
  };
};

export async function fetchPexelsImage(
  query: string,
  orientation: "landscape" | "portrait" | "square" = "landscape",
  fallbackQuery?: string
): Promise<ImageAssetData> {
  const apiKey = process.env.PEXELS_API_KEY;
  
  const tryFetch = async (q: string): Promise<ImageAssetData | null> => {
    if (!apiKey) return null;

    try {
      const response = await fetch(
        `https://api.pexels.com/v1/search?query=${encodeURIComponent(q)}&orientation=${orientation}&per_page=5`,
        {
          headers: {
            Authorization: apiKey,
          },
        }
      );

      if (!response.ok) return null;

      const data = await response.json();
      const photos = data.photos || [];
      
      if (photos.length === 0) return null;

      // Randomly pick one of the top results for variety
      const randomIndex = Math.floor(Math.random() * Math.min(photos.length, 5));
      const photo = photos[randomIndex];
      const url = photo.src.large2x || photo.src.original;

      return {
        url,
        source: "pexels",
        originalUrl: photo.url,
        author: photo.photographer,
        attribution: `Photo by ${photo.photographer} on Pexels`,
        license: "Pexels License",
        width: photo.width,
        height: photo.height,
      };
    } catch (error) {
      console.error(`Error fetching Pexels image for ${q}:`, error);
      return null;
    }
  };

  let imageAsset = await tryFetch(query);
  
  if (!imageAsset && fallbackQuery) {
    imageAsset = await tryFetch(fallbackQuery);
  }

  return imageAsset || getFallbackImage(query);
}
