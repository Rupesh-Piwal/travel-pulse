import { ImageAssetData } from "./types";

export function rankAndSelectImage(images: ImageAssetData[], query: string): ImageAssetData | null {
  if (!images || images.length === 0) return null;

  // Simple scoring mechanism
  // In a real production system, this would analyze resolution, aspect ratio,
  // and possibly use AI vision to score the aesthetic quality.
  
  let bestImage = images[0];
  let highestScore = -1;

  for (const img of images) {
    let score = 0;

    // Prefer high resolution
    if (img.width && img.width >= 1920) score += 10;
    if (img.width && img.width >= 1080) score += 5;

    // Prefer landscape for hero
    if (img.width && img.height && img.width > img.height) score += 5;

    // Prefer Wikimedia for historical accuracy if author is present
    if (img.source === "wikimedia" && img.author !== "Unknown") score += 5;

    if (score > highestScore) {
      highestScore = score;
      bestImage = img;
    }
  }

  return bestImage;
}
