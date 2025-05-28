import { promises as fs } from 'fs';
import path from 'path';

export class GalleryFileService {
    private readonly assetsDirectory: string;

    constructor() {
        this.assetsDirectory = path.join(process.cwd(), 'public', 'assets');
    }

    async ensureAssetsDirectory(): Promise<void> {
        try {
            await fs.access(this.assetsDirectory);
        } catch (error) {
            console.warn(`Assets directory not found at ${this.assetsDirectory}. Creating directory...`);
            await fs.mkdir(this.assetsDirectory, { recursive: true });
        }
    }

    async getGalleryDirectories(): Promise<string[]> {
        const dirs = await fs.readdir(this.assetsDirectory, { withFileTypes: true });
        return dirs
            .filter(dir => dir.isDirectory())
            .map(dir => dir.name);
    }

    async getGalleryFiles(galleryId: string): Promise<string[]> {
        const galleryPath = path.join(this.assetsDirectory, galleryId);
        const files = await fs.readdir(galleryPath);

        // Filter only media files
        return files.filter(file => {
            const ext = path.extname(file).toLowerCase();
            return [
                '.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg',
                '.mp4', '.webm', '.mov', '.avi'
            ].includes(ext);
        });
    }

    getAssetsPath(): string {
        return this.assetsDirectory;
    }
}