// Pure helper for YouTube ID extraction (Safe for both Server and Client)
export function extractYouTubeId(urlOrId) {
  if (!urlOrId || typeof urlOrId !== "string") return "";
  const cleaned = urlOrId.trim();

  // If already a clean 11-char YouTube ID (e.g. jfKfPfyJRdk, jrCNO4-Z5zQ)
  if (/^[a-zA-Z0-9_-]{11}$/.test(cleaned)) {
    return cleaned;
  }

  // Regex patterns for YouTube URLs
  const patterns = [
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|shorts\/|live\/|user\/\S+\/u\/\d+\/))([a-zA-Z0-9_-]{11})/i,
    /[?&]v=([a-zA-Z0-9_-]{11})/i,
  ];

  for (const pattern of patterns) {
    const match = cleaned.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  return "";
}
