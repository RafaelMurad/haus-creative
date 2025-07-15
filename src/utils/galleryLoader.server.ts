import fs from 'fs';
import path from 'path';

export interface MediaItem {
  id: string;
  type: 'image' | 'video';
  url: string;
  title: string;
  description: string;
  category: string;
}

export interface GalleryData {
  id: string;
  items: MediaItem[];
}

const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
const VIDEO_EXTENSIONS = ['.mp4', '.webm', '.mov', '.avi'];

function detectType(filename: string): 'image' | 'video' {
  const ext = path.extname(filename).toLowerCase();
  if (VIDEO_EXTENSIONS.includes(ext)) return 'video';
  return 'image';
}

export function getGalleryIds(): string[] {
  // Hardcoded for 12 galleries
  return Array.from({ length: 12 }, (_, i) => `gallery${i + 1}`);
}

export function getGalleryItems(galleryId: string): MediaItem[] {
  const dir = path.join(process.cwd(), 'public', 'assets', galleryId);
  if (!fs.existsSync(dir)) return [];
  const files = fs.readdirSync(dir).filter((file) => {
    const ext = path.extname(file).toLowerCase();
    return IMAGE_EXTENSIONS.includes(ext) || VIDEO_EXTENSIONS.includes(ext);
  });
  return files.map((filename, idx) => ({
    id: `${galleryId}-${idx}`,
    type: detectType(filename),
    url: `/assets/${galleryId}/${filename}`,
    title: '',
    description: '',
    category: galleryId,
  }));
}

export function getAllGalleries(): GalleryData[] {
  return getGalleryIds().map((id) => ({
    id,
    items: getGalleryItems(id),
  }));
}
