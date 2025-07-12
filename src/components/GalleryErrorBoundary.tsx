'use client'

import React from 'react';
import ErrorBoundary from './ErrorBoundary';

interface GalleryErrorBoundaryProps {
  children: React.ReactNode;
}

export default function GalleryErrorBoundary({ children }: GalleryErrorBoundaryProps) {
  const handleGalleryError = (error: Error) => {
    // Log gallery-specific errors
    console.error('Gallery Error:', {
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent
    });
  };

  const galleryErrorFallback = (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="max-w-lg w-full text-center">
        <div className="text-gray-400 text-8xl mb-6">🖼️</div>
        
        <h2 className="text-2xl font-bold text-gray-900 mb-3">
          Gallery Loading Error
        </h2>
        
        <p className="text-gray-600 mb-6">
          We're having trouble loading the gallery. This could be due to:
        </p>

        <ul className="text-left text-gray-600 mb-8 space-y-2">
          <li className="flex items-start">
            <span className="text-red-500 mr-2">•</span>
            Network connectivity issues
          </li>
          <li className="flex items-start">
            <span className="text-red-500 mr-2">•</span>
            Missing gallery assets
          </li>
          <li className="flex items-start">
            <span className="text-red-500 mr-2">•</span>
            Configuration problems
          </li>
        </ul>

        <div className="space-y-3">
          <button
            onClick={() => window.location.reload()}
            className="w-full px-6 py-3 bg-black text-white rounded hover:bg-gray-800 transition-colors"
          >
            Reload Gallery
          </button>
          
          <a
            href="/about"
            className="block w-full px-6 py-3 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors"
          >
            Visit About Page
          </a>
        </div>

        <p className="mt-6 text-sm text-gray-500">
          If this problem persists, please contact support.
        </p>
      </div>
    </div>
  );

  return (
    <ErrorBoundary 
      fallback={galleryErrorFallback}
      onError={handleGalleryError}
    >
      {children}
    </ErrorBoundary>
  );
}
