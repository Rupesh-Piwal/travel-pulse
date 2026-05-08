export interface ImageAssetData {
  url: string;
  source: "wikimedia" | "pexels" | "unsplash" | "system";
  originalUrl?: string;
  author?: string;
  attribution?: string;
  license?: string;
  width?: number;
  height?: number;
  cachedPath?: string;
}

export interface EnrichmentConfig {
  destination: string;
  type: "destination" | "landmark" | "restaurant" | "hotel" | "activity";
  query?: string;
}
