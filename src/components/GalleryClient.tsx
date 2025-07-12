'use client'

import { useState, useEffect } from 'react';
import { GalleryConfig } from '../types';
import Gallery from './Gallery';

interface ApiResponse {
  success: boolean;
  data: GalleryConfig[];
  count: number;
  error?: string;
}

export default function GalleryClient() {
  const [galleries, setGalleries] = useState<GalleryConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGalleries = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch('/api/galleries');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result: ApiResponse = await response.json();

        if (result.success) {
          setGalleries(result.data);
          console.log(`Successfully loaded ${result.count} galleries`);
        } else {
          throw new Error(result.error || 'Failed to load galleries');
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
        setError(errorMessage);
        console.error('Error fetching galleries:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchGalleries();
  }, []);

  // Loading state
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center">
        <div className="w-8 h-8 border-4 border-gray-300 border-t-black rounded-full animate-spin mb-4"></div>
        <h2 className="text-xl font-semibold mb-2">Loading Galleries...</h2>
        <p className="text-gray-600">
          Preparing your gallery experience
        </p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center">
        <div className="text-red-500 text-6xl mb-4">⚠️</div>
        <h2 className="text-xl font-semibold mb-2 text-red-600">Error Loading Galleries</h2>
        <p className="text-gray-600 mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-2 bg-black text-white rounded hover:bg-gray-800 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  // Empty state
  if (galleries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center">
        <h2 className="text-xl font-semibold mb-2">No galleries found</h2>
        <p className="mb-4">
          Please create folders in the <code className="bg-gray-100 px-2 py-1 rounded">/public/assets/</code> directory to
          automatically generate galleries.
        </p>
        <p className="text-sm opacity-75">
          Example: <code className="bg-gray-100 px-2 py-1 rounded">/public/assets/gallery1/</code>
        </p>
      </div>
    );
  }

  // Success state - render galleries
  return <Gallery galleries={galleries} />;
}
