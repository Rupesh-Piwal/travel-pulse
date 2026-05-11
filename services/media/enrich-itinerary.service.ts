import { fetchWikimediaImage } from "./wikimedia.service";
import { fetchPexelsImage } from "./pexels.service";
import { ImageAssetData } from "./types";
import { uploadImageToR2, checkFileExists } from "./r2.service";
import crypto from "crypto";
import pLimit from "p-limit";

async function fetchAndCacheImage(
  url: string,
  fileName: string
): Promise<string | null> {
  try {
    // 1. Check if already exists in R2
    const existingUrl = await checkFileExists(fileName);
    if (existingUrl) {
      console.log(`⚡ Using cached R2 image: ${fileName}`);
      return existingUrl;
    }

    // 2. Fetch from source
    console.log(`📥 Fetching image from source: ${url}`);
    const res = await fetch(url);
    if (!res.ok) return null;
    const arrayBuffer = await res.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 3. Upload to R2
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

  const categoryUpper = category.toUpperCase();
  const queryLower = query.toLowerCase();

  // Enhanced detection
  const isLandmark = ["LANDMARK", "MUSEUM", "MONUMENT", "ATTRACTION"].includes(categoryUpper);
  const isFood = ["RESTAURANT", "CAFE", "FOOD", "DINING", "MEAL"].includes(categoryUpper) || 
                 queryLower.includes("restaurant") || 
                 queryLower.includes("cafe") || 
                 queryLower.includes("bistro") || 
                 queryLower.includes("eatery");

  // 1. Source Selection
  if (isLandmark) {
    asset = await fetchWikimediaImage(query, "landmark");
  }

  // Fallback to Pexels if Wikimedia fails or it's not a landmark
  if (!asset) {
    let pexelsQuery = "";
    let fallback = destination;

    if (isFood) {
      // For food, specific names like "Mango Restaurant" often return the fruit.
      // We use the destination + category for high-quality "vibe" imagery.
      const foodType = queryLower.includes("cafe") ? "cafe" : "restaurant";
      pexelsQuery = `${destination} ${foodType} interior food`;
      fallback = `aesthetic ${foodType} food`;
    } else {
      pexelsQuery = `${query} ${destination}`;
    }

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
  const limit = pLimit(5); // Process 5 images at a time
  const cache = new Map<string, ImageAssetData>();

  // Helper to resolve with local per-run cache
  const resolveWithCache = async (q: string, cat: string, dest: string) => {
    const cacheKey = `${q}-${cat}`.toLowerCase();
    if (cache.has(cacheKey)) return cache.get(cacheKey);
    
    try {
      const result = await resolveImage(q, cat, dest);
      if (result) cache.set(cacheKey, result);
      return result;
    } catch (e) {
      console.error(`Error resolving image for ${q}:`, e);
      return null;
    }
  };

  // 1. Enrich Hero Image
  if (!itineraryData.heroImage) {
    try {
      const heroAsset = await resolveWithCache(destination, "LANDMARK", destination);
      if (heroAsset) {
        itineraryData.heroImage = heroAsset;
      }
    } catch (e) {
      console.error("Hero image enrichment failed:", e);
    }
  }

  // 2. Prepare all activities for parallel processing
  const tasks = [];
  for (const day of itineraryData.days) {
    for (const activity of day.activities) {
      if (!activity.image) {
        tasks.push(limit(async () => {
          try {
            const query = activity.title;
            const category = activity.category || (activity.mealType !== "NONE" ? "RESTAURANT" : "ACTIVITY");

            const asset = await resolveWithCache(query, category, destination);
            if (asset) {
              activity.image = asset;
            }
          } catch (e) {
            console.error(`Activity image enrichment failed for ${activity.title}:`, e);
          }
        }));
      }
    }
  }

  // 3. Run parallel tasks
  if (tasks.length > 0) {
    console.log(`🚀 Processing ${tasks.length} images in parallel...`);
    await Promise.allSettled(tasks); // Use allSettled to ensure we don't fail if one fails
  }

  return itineraryData;
}
