"use client";

import { useState, useEffect, useCallback } from 'react';

interface ImageOptimizationOptions {
  enableWebP?: boolean;
  enableAVIF?: boolean;
  quality?: number;
  enableResponsive?: boolean;
}

export function useImageOptimization({
  enableWebP = true,
  enableAVIF = true,
  quality = 80,
  enableResponsive = true
}: ImageOptimizationOptions = {}) {
  const [supportsWebP, setSupportsWebP] = useState<boolean>(false);
  const [supportsAVIF, setSupportsAVIF] = useState<boolean>(false);
  const [devicePixelRatio, setDevicePixelRatio] = useState<number>(1);

  // Check format support
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const checkWebPSupport = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 1;
      canvas.height = 1;
      return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
    };

    const checkAVIFSupport = async () => {
      if (!window.createImageBitmap) return false;
      
      const avifData = 'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgABogQEAwgMg8f8D///8WfhwB8+ErK42A=';
      
      try {
        const response = await fetch(avifData);
        const blob = await response.blob();
        await createImageBitmap(blob);
        return true;
      } catch {
        return false;
      }
    };

    setSupportsWebP(checkWebPSupport());
    checkAVIFSupport().then(setSupportsAVIF);
    setDevicePixelRatio(window.devicePixelRatio || 1);

    const handlePixelRatioChange = () => {
      setDevicePixelRatio(window.devicePixelRatio || 1);
    };

    // Listen for pixel ratio changes (rare but possible)
    const mediaQuery = window.matchMedia(`(resolution: ${window.devicePixelRatio}dppx)`);
    mediaQuery.addEventListener('change', handlePixelRatioChange);

    return () => {
      mediaQuery.removeEventListener('change', handlePixelRatioChange);
    };
  }, []);

  const optimizeImageUrl = useCallback((originalUrl: string, width?: number, height?: number) => {
    if (!originalUrl) return originalUrl;

    // For Next.js Image component, we'll let it handle optimization
    // This is more for manual image optimization
    let optimizedUrl = originalUrl;

    // Add quality parameter if supported
    const url = new URL(optimizedUrl, window.location.origin);
    
    if (quality !== 80) {
      url.searchParams.set('q', quality.toString());
    }

    // Add format preference
    if (enableAVIF && supportsAVIF) {
      url.searchParams.set('f', 'avif');
    } else if (enableWebP && supportsWebP) {
      url.searchParams.set('f', 'webp');
    }

    // Add responsive sizing
    if (enableResponsive && width) {
      const scaledWidth = Math.ceil(width * devicePixelRatio);
      url.searchParams.set('w', scaledWidth.toString());
    }

    if (enableResponsive && height) {
      const scaledHeight = Math.ceil(height * devicePixelRatio);
      url.searchParams.set('h', scaledHeight.toString());
    }

    return url.toString();
  }, [supportsWebP, supportsAVIF, quality, enableWebP, enableAVIF, enableResponsive, devicePixelRatio]);

  const generateSrcSet = useCallback((baseUrl: string, sizes: number[]) => {
    return sizes
      .map(size => {
        const optimizedUrl = optimizeImageUrl(baseUrl, size);
        return `${optimizedUrl} ${size}w`;
      })
      .join(', ');
  }, [optimizeImageUrl]);

  return {
    supportsWebP,
    supportsAVIF,
    devicePixelRatio,
    optimizeImageUrl,
    generateSrcSet
  };
}