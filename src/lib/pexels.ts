interface PexelsPhoto {
  src: {
    original: string;
    large2x: string;
    large: string;
    medium: string;
  };
  alt: string;
}

interface PexelsResponse {
  photos: PexelsPhoto[];
}

export async function fetchCoverImage(
  keyword: string
): Promise<string | null> {
  const apiKey = process.env.PEXELS_API_KEY;
  if (!apiKey) {
    console.error("PEXELS_API_KEY is not set");
    return null;
  }

  try {
    const response = await fetch(
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(
        keyword
      )}&per_page=5&orientation=landscape`,
      {
        headers: {
          Authorization: apiKey,
        },
      }
    );

    if (!response.ok) {
      console.error("Pexels API error:", response.status);
      return null;
    }

    const data: PexelsResponse = await response.json();

    if (data.photos.length === 0) {
      return null;
    }

    // Return a random photo from the top results for variety
    const randomIndex = Math.floor(Math.random() * data.photos.length);
    return data.photos[randomIndex].src.large2x;
  } catch (error) {
    console.error("Pexels fetch error:", error);
    return null;
  }
}
