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
  // This function generates the list of items for a gallery based on the files in public/assets/galleryX
  // In a real app, you might use fs.readdirSync in getStaticProps or getServerSideProps
  // Here, we just generate the URLs based on known filenames for demo purposes
  // Replace this logic with dynamic import or server-side file reading as needed
  const base = `/assets/${galleryId}/`;
  // Example: for gallery1, files are Gallery1-1.png, Gallery1-2.png, ...
  // For demo, hardcode file lists for each gallery. In production, scan the directory.
  let files: string[] = [];
  switch (galleryId) {
    case 'gallery1':
      files = [
        ...Array.from({ length: 10 }, (_, i) => `Gallery1-${i + 1}.png`),
        'Gallery1-6.jpg',
      ];
      break;
    case 'gallery2':
      files = Array.from({ length: 10 }, (_, i) => `Gallery2-${i + 1}.png`);
      break;
    case 'gallery3':
      files = ['Gallery3-Cover.png', 'Gallery3-Video.mp4'];
      break;
    case 'gallery4':
      files = Array.from({ length: 8 }, (_, i) => `Gallery4-${i + 1}.png`);
      break;
    case 'gallery5':
      files = ['Gallery5-Cover.png', 'Gallery5-Video.mp4'];
      break;
    case 'gallery6':
      files = Array.from({ length: 4 }, (_, i) => `Gallery6-${i + 1}.png`);
      break;
    case 'gallery7':
      files = [
        'Gallery7-1 .png',
        ...Array.from({ length: 8 }, (_, i) => `Gallery7-${i + 2}.png`),
      ];
      break;
    case 'gallery8':
      files = ['Gallery8-1.png'];
      break;
    case 'gallery9':
      files = ['Gallery9-Cover.png', 'Gallery9-Video.mp4'];
      break;
    case 'gallery10':
      files = ['Gallery10-Cover.png', 'Gallery10-Ouronyx-Mobile.mp4', 'Gallery10-Ouronyx.mp4'];
      break;
    case 'gallery11':
      files = ['Gallery11-1.png', 'Gallery11-2.png'];
      break;
    case 'gallery12':
      files = Array.from({ length: 6 }, (_, i) => `Gallery12-${i + 1}.png`);
      break;
    default:
      files = [];
  }
  return files.map((filename, idx) => ({
    id: `${galleryId}-${idx}`,
    type: detectType(filename),
    url: base + filename,
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
