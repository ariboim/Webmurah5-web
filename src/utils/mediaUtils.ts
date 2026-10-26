/**
 * Media utility for converting Google Drive & YouTube links into embeddable URLs,
 * and handling local file image uploads to Base64 strings.
 */

export interface ParsedMedia {
  type: 'image' | 'youtube' | 'drive_video' | 'unknown';
  originalUrl: string;
  embedUrl: string;
  thumbnailUrl?: string;
}

/**
 * Extracts Google Drive File ID from various share link formats:
 * - https://drive.google.com/file/d/FILE_ID/view?usp=sharing
 * - https://drive.google.com/open?id=FILE_ID
 * - https://drive.google.com/uc?id=FILE_ID
 * - https://drive.google.com/file/d/FILE_ID/preview
 */
export function extractGoogleDriveId(url: string): string | null {
  if (!url) return null;
  const trimmed = url.trim();

  // Pattern: /file/d/FILE_ID or /d/FILE_ID
  const matchPath = trimmed.match(/\/d\/([a-zA-Z0-9_-]+)/);
  if (matchPath && matchPath[1]) {
    return matchPath[1];
  }

  // Pattern: ?id=FILE_ID or &id=FILE_ID
  const matchParam = trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (matchParam && matchParam[1]) {
    return matchParam[1];
  }

  return null;
}

/**
 * Converts Google Drive file link to a direct public viewable image URL.
 */
export function convertGoogleDriveImageUrl(url: string): string {
  const driveId = extractGoogleDriveId(url);
  if (driveId) {
    // lh3.googleusercontent.com/d/ID is Google's fast CDN direct image endpoint
    return `https://lh3.googleusercontent.com/d/${driveId}`;
  }
  return url.trim();
}

/**
 * Converts Google Drive video file link to an embeddable preview iframe URL.
 */
export function convertGoogleDriveVideoUrl(url: string): string {
  const driveId = extractGoogleDriveId(url);
  if (driveId) {
    return `https://drive.google.com/file/d/${driveId}/preview`;
  }
  return url.trim();
}

/**
 * Extracts YouTube 11-char Video ID from:
 * - https://www.youtube.com/watch?v=VIDEO_ID
 * - https://youtu.be/VIDEO_ID
 * - https://www.youtube.com/shorts/VIDEO_ID
 * - https://www.youtube.com/embed/VIDEO_ID
 */
export function extractYouTubeId(url: string): string | null {
  if (!url) return null;
  const trimmed = url.trim();

  const regex = /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([a-zA-Z0-9_-]{11})/;
  const match = trimmed.match(regex);
  return match && match[1] ? match[1] : null;
}

/**
 * Converts a YouTube link into a responsive embed player URL.
 */
export function convertYouTubeEmbedUrl(url: string): string | null {
  const ytid = extractYouTubeId(url);
  if (ytid) {
    return `https://www.youtube-nocookie.com/embed/${ytid}?rel=0&modestbranding=1`;
  }
  return null;
}

/**
 * Gets high-res YouTube video thumbnail URL.
 */
export function getYouTubeThumbnail(url: string): string | null {
  const ytid = extractYouTubeId(url);
  if (ytid) {
    return `https://img.youtube.com/vi/${ytid}/hqdefault.jpg`;
  }
  return null;
}

/**
 * Detects whether a URL is YouTube, Google Drive video, or other.
 */
export function detectVideoSource(url: string): 'youtube' | 'drive' | 'direct' | 'none' {
  if (!url || typeof url !== 'string' || !url.trim()) return 'none';
  const trimmed = url.trim().toLowerCase();

  if (trimmed.includes('youtube.com') || trimmed.includes('youtu.be')) {
    return 'youtube';
  }
  if (trimmed.includes('drive.google.com')) {
    return 'drive';
  }
  if (trimmed.match(/\.(mp4|webm|ogg)(\?.*)?$/i)) {
    return 'direct';
  }
  return 'none';
}

/**
 * Reads a File object and converts it to Base64 string for instant local preview and persistent storage.
 */
export function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    // Max 4MB for localStorage safety
    if (file.size > 4 * 1024 * 1024) {
      reject(new Error('Ukuran file maksimal 4MB agar performa tetap cepat.'));
      return;
    }
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('Gagal membaca file gambar.'));
    reader.readAsDataURL(file);
  });
}
