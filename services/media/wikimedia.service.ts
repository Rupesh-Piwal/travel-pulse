import { ImageAssetData } from "./types";

const WIKIMEDIA_API_URL = "https://en.wikipedia.org/w/api.php";
const COMMONS_API_URL = "https://commons.wikimedia.org/w/api.php";

interface WikimediaImageResult {
  title: string;
  url: string;
  descriptionurl: string;
  extmetadata: any;
}

export async function fetchWikimediaImage(
  query: string,
  type: "destination" | "landmark"
): Promise<ImageAssetData | null> {
  try {
    const searchUrl = new URL(COMMONS_API_URL);
    searchUrl.searchParams.append("action", "query");
    searchUrl.searchParams.append("generator", "search");
    searchUrl.searchParams.append("gsrsearch", query);
    searchUrl.searchParams.append("gsrnamespace", "6"); // File namespace
    searchUrl.searchParams.append("gsrlimit", "5");
    searchUrl.searchParams.append("prop", "imageinfo");
    searchUrl.searchParams.append("iiprop", "url|extmetadata|size");
    searchUrl.searchParams.append("format", "json");

    const res = await fetch(searchUrl.toString());
    const data = await res.json();

    const pages = data.query?.pages;
    if (!pages) return null;

    // Convert object of pages to array
    const images = Object.values(pages);
    
    // Filter out common UI icons (flags, logos, maps)
    const validImages = images.filter((page: any) => {
      const title = page.title.toLowerCase();
      return !title.includes(".svg") && !title.includes("map") && !title.includes("logo") && !title.includes("flag");
    });

    if (validImages.length === 0) return null;

    // Take the first valid image's imageinfo
    const imageInfo = (validImages[0] as any).imageinfo?.[0];
    if (!imageInfo) return null;

    // Build the ImageAssetData object
    const extMeta = imageInfo.extmetadata || {};
    
    let author = extMeta.Artist?.value;
    if (author) {
      // Clean HTML tags from author
      author = author.replace(/<[^>]*>?/gm, '');
    }

    return {
      url: imageInfo.url,
      source: "wikimedia",
      originalUrl: imageInfo.descriptionurl,
      author: author || "Unknown",
      attribution: extMeta.Credit?.value || extMeta.Attribution?.value || "",
      license: extMeta.LicenseShortName?.value || extMeta.License?.value || "Public Domain",
      width: imageInfo.width,
      height: imageInfo.height,
    };
  } catch (error) {
    console.error("Wikimedia API error:", error);
    return null;
  }
}
