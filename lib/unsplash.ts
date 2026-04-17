/**
 * Unsplash Image Utility
 * 
 * To use this, get a free Access Key from https://unsplash.com/developers
 * and add it to your .env as UNSPLASH_ACCESS_KEY.
 */

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1488085061387-422e29b40080?q=80&w=2000&auto=format&fit=crop"; // More neutral premium travel image

export async function fetchUnsplashImage(
  query: string, 
  orientation: "landscape" | "portrait" | "squarish" = "landscape",
  fallbackQuery?: string
): Promise<string> {
  const accessKey = process.env.UNSPLASH_ACCESS_KEY;
  
  if (!accessKey) {
    return `https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1200&auto=format&fit=crop&query=${encodeURIComponent(query)}`;
  }

  const tryFetch = async (q: string) => {
    try {
      const response = await fetch(
        `https://api.unsplash.com/search/photos?query=${encodeURIComponent(q)}&orientation=${orientation}&per_page=1`,
        {
          headers: {
            Authorization: `Client-ID ${accessKey}`,
          },
        }
      );

      if (!response.ok) return null;
      const data = await response.json();
      return (data.results && data.results.length > 0) ? data.results[0].urls.regular : null;
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

  return imageUrl || FALLBACK_IMAGE;
}
