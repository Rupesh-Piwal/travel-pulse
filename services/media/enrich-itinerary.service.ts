import { fetchWikimediaImage } from "./wikimedia.service";
import { fetchPexelsImage } from "./pexels.service";
import { ImageAssetData } from "./types";
import { uploadImageToR2 } from "./r2.service";
import crypto from "crypto";

async function fetchAndCacheImage(
  url: string,
  fileName: string
): Promise<string | null> {
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const arrayBuffer = await res.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    // Upload to R2
    const r2Url = await uploadImageToR2(buffer, fileName, res.headers.get("content-type") || "image/jpeg");
    return r2Url || url; // Fallback to original URL if R2 fails
  } catch (error) {
    console.error("Error caching image:", error);
    return url; // Fallback
  }
}

export async function resolveImage(
  query: string,
  category: string,
  destination: string
): Promise<ImageAssetData | null> {
  let asset: ImageAssetData | null = null;

  const isLandmark = ["LANDMARK", "MUSEUM", "MONUMENT"].includes(category.toUpperCase());
  const isFood = ["RESTAURANT", "CAFE", "FOOD"].includes(category.toUpperCase());

  // 1. Source Selection
  if (isLandmark) {
    asset = await fetchWikimediaImage(query, "landmark");
  }

  // Fallback to Pexels if Wikimedia fails or it's not a landmark
  if (!asset) {
    // If it's a restaurant, searching for specific names usually fails on Pexels.
    // We should search for generic high-quality food/restaurant imagery instead of destination-specific ones.
    let pexelsQuery = isFood ? `aesthetic restaurant interior food` : `${query} ${destination}`;
    let fallback = isFood ? `fine dining food` : destination;
    asset = await fetchPexelsImage(pexelsQuery, "landscape", fallback);
  }

  if (!asset) return null;

  // 2. Cache in R2
  const hash = crypto.createHash("md5").update(asset.url).digest("hex");
  const ext = asset.url.split('.').pop()?.split('?')[0] || "jpg";
  const fileName = `assets/${hash}.${ext}`;

  const cachedUrl = await fetchAndCacheImage(asset.url, fileName);
  if (cachedUrl) {
    asset.cachedPath = cachedUrl;
  }

  return asset;
}

export async function enrichItineraryWithImages(itineraryData: any, destination: string) {
  // Enrich Hero Image
  if (!itineraryData.heroImage) {
    const heroAsset = await resolveImage(destination, "LANDMARK", destination);
    if (heroAsset) {
      itineraryData.heroImage = heroAsset;
    }
  }

  // Enrich Activities sequentially to avoid rate limits initially
  for (const day of itineraryData.days) {
    for (const activity of day.activities) {
      if (!activity.image) {
        const query = activity.title;
        const category = activity.category || (activity.mealType !== "NONE" ? "RESTAURANT" : "ACTIVITY");
        
        const asset = await resolveImage(query, category, destination);
        if (asset) {
          activity.image = asset;
        }
      }
    }
  }

  return itineraryData;
}
