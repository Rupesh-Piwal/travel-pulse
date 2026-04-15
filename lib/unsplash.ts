/**
 * Unsplash Image Utility
 * 
 * To use this, get a free Access Key from https://unsplash.com/developers
 * and add it to your .env as UNSPLASH_ACCESS_KEY.
 */

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2000&auto=format&fit=crop";

export async function fetchUnsplashImage(query: string, orientation: "landscape" | "portrait" | "squarish" = "landscape"): Promise<string> {
  const accessKey = process.env.UNSPLASH_ACCESS_KEY;
  
  if (!accessKey) {
    // If no key, return a placeholder that uses the Unsplash source logic 
    // (Note: source.unsplash.com is legacy, using a direct search URL instead)
    return `https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1200&auto=format&fit=crop&query=${encodeURIComponent(query)}`;
  }

  try {
    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&orientation=${orientation}&per_page=1`,
      {
        headers: {
          Authorization: `Client-ID ${accessKey}`,
        },
      }
    );

    if (!response.ok) throw new Error("Unsplash rate limit or error");

    const data = await response.json();
    
    if (data.results && data.results.length > 0) {
      // We use the regular URL for a good balance of quality and speed
      return data.results[0].urls.regular;
    }

    return FALLBACK_IMAGE;
  } catch (error) {
    console.error("Error fetching image from Unsplash:", error);
    return FALLBACK_IMAGE;
  }
}
