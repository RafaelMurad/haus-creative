import { useState, useEffect, useRef, useCallback } from 'react';

interface LazyLoadOptions {
    rootMargin?: string;
    threshold?: number;
    placeholderSrc?: string;
    lowResSrc?: string;
}

interface LazyLoadState {
    isLoaded: boolean;
    isInView: boolean;
    isLoading: boolean;
    error: string | null;
    currentSrc: string;
}

export function useImageLazyLoad(
    src: string,
    options: LazyLoadOptions = {}
) {
    const {
        rootMargin = '50px',
        threshold = 0.1,
        placeholderSrc = '',
        lowResSrc
    } = options;

    const [state, setState] = useState<LazyLoadState>({
        isLoaded: false,
        isInView: false,
        isLoading: false,
        error: null,
        currentSrc: placeholderSrc
    });

    const imgRef = useRef<HTMLImageElement>(null);
    const observerRef = useRef<IntersectionObserver | null>(null);

    // Load image function
    const loadImage = useCallback((imageSrc: string): Promise<void> => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve();
            img.onerror = () => reject(new Error(`Failed to load image: ${imageSrc}`));
            img.src = imageSrc;
        });
    }, []);

    // Progressive loading: placeholder -> low-res -> full-res
    const loadImageProgressive = useCallback(async () => {
        if (!state.isInView || state.isLoaded) return;

        setState(prev => ({ ...prev, isLoading: true, error: null }));

        try {
            // Load low-res first if available
            if (lowResSrc && lowResSrc !== state.currentSrc) {
                await loadImage(lowResSrc);
                setState(prev => ({ ...prev, currentSrc: lowResSrc }));
            }

            // Load full resolution
            await loadImage(src);
            setState(prev => ({
                ...prev,
                currentSrc: src,
                isLoaded: true,
                isLoading: false
            }));
        } catch (error) {
            setState(prev => ({
                ...prev,
                error: error instanceof Error ? error.message : 'Unknown error',
                isLoading: false
            }));
        }
    }, [src, lowResSrc, state.isInView, state.isLoaded, state.currentSrc, loadImage]);

    // Set up intersection observer
    useEffect(() => {
        const element = imgRef.current;
        if (!element) return;

        observerRef.current = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setState(prev => ({ ...prev, isInView: true }));
                    observerRef.current?.unobserve(element);
                }
            },
            {
                rootMargin,
                threshold
            }
        );

        observerRef.current.observe(element);

        return () => {
            observerRef.current?.disconnect();
        };
    }, [rootMargin, threshold]);

    // Trigger loading when in view
    useEffect(() => {
        if (state.isInView) {
            loadImageProgressive();
        }
    }, [state.isInView, loadImageProgressive]);

    // Retry function for failed loads
    const retry = useCallback(() => {
        setState(prev => ({
            ...prev,
            error: null,
            isLoaded: false,
            currentSrc: placeholderSrc
        }));
        loadImageProgressive();
    }, [loadImageProgressive, placeholderSrc]);

    return {
        imgRef,
        src: state.currentSrc,
        isLoaded: state.isLoaded,
        isLoading: state.isLoading,
        isInView: state.isInView,
        error: state.error,
        retry
    };
}
