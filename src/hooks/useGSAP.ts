import { useEffect, useRef, useState, useCallback } from 'react';

interface UseGSAPReturn {
    isLoaded: boolean;
    isLoading: boolean;
    error: string | null;
    gsapInstance: any;
    createAnimation: (element: HTMLElement | HTMLElement[], fromProps: Record<string, any>, toProps: Record<string, any>) => Promise<any>;
    killAnimations: () => void;
}

/**
 * Simplified GSAP loading hook - loads only when needed
 */
export default function useGSAP(): UseGSAPReturn {
    const [isLoaded, setIsLoaded] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [gsapInstance, setGsapInstance] = useState<any>(null);
    const animationsRef = useRef<any[]>([]);

    useEffect(() => {
        if (isLoaded || isLoading) return;

        const loadGSAP = async () => {
            setIsLoading(true);
            setError(null);

            try {
                // Dynamic import of GSAP
                const gsapModule = await import('gsap');
                const gsap = gsapModule.gsap || gsapModule.default;

                if (!gsap) {
                    throw new Error('GSAP module not found');
                }

                // Set the gsap instance directly
                setGsapInstance(gsap);
                setIsLoaded(true);
                console.log('GSAP loaded successfully');
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : 'Failed to load GSAP';
                setError(errorMessage);
                console.error('Error loading GSAP:', err);
            } finally {
                setIsLoading(false);
            }
        };

        loadGSAP();
    }, []);

    const createAnimation = useCallback(async (
        element: HTMLElement | HTMLElement[],
        fromProps: Record<string, any>,
        toProps: Record<string, any>
    ) => {
        if (!gsapInstance) {
            throw new Error('GSAP not loaded yet');
        }

        const animation = gsapInstance.fromTo(element, fromProps, toProps);
        animationsRef.current.push(animation);
        return animation;
    }, [gsapInstance]);

    const killAnimations = useCallback(() => {
        animationsRef.current.forEach(animation => {
            if (animation && typeof animation.kill === 'function') {
                animation.kill();
            }
        });
        animationsRef.current = [];
    }, []);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            killAnimations();
        };
    }, [killAnimations]);

    return {
        isLoaded,
        isLoading,
        error,
        gsapInstance,
        createAnimation,
        killAnimations
    };
}
