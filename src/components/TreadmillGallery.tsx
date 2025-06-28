"use client";

import { useRef, useEffect, useState, memo } from "react";
import { Suspense } from "react";
import { GalleryConfig } from "../types";
import MediaItem from "./MediaItem";

interface TreadmillGalleryProps {
  gallery: GalleryConfig;
}

export default memo(function TreadmillGallery({
  gallery,
}: TreadmillGalleryProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [gsapInstance, setGsapInstance] = useState<any>(null);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    let isMounted = true;

    const loadGsap = async () => {
      try {
        const gsapModule = await import("gsap");
        if (isMounted) {
          setGsapInstance(gsapModule.gsap || gsapModule.default || gsapModule);
        }
      } catch (error) {
        console.warn("Failed to load GSAP:", error);
      }
    };

    loadGsap();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!trackRef.current || !gsapInstance) return;

    let currentTimeline: any = null;

    const ctx = gsapInstance.context(() => {
      const getWindowDimensions = () => {
        const baseImageWidth = isMobile ? 280 : 720;
        const imageWidth =
          gallery.id === "gallery11"
            ? Math.round(baseImageWidth * 0.8)
            : baseImageWidth;

        return {
          width: window.innerWidth,
          imageWidth,
        };
      };

      const calculateCenterPosition = (
        imageIndex: number,
        width: number,
        imageWidth: number
      ): number => {
        const gap = isMobile ? width * 0.8 : width;
        const imagePosition = imageIndex * (imageWidth + gap);
        const centerPosition = (width - imageWidth) / 2;
        return centerPosition - imagePosition;
      };

      const createTimeline = () => {
        const { width, imageWidth } = getWindowDimensions();
        const totalItems = gallery.items.length;

        const centerPositions = Array.from({ length: totalItems }, (_, i) =>
          calculateCenterPosition(i + 1, width, imageWidth)
        );

        const tl = gsapInstance.timeline({ repeat: -1 });
        tl.to({}, { duration: isMobile ? 1.5 : 2 });

        for (let i = 0; i < totalItems; i++) {
          const targetPosition = centerPositions[i];

          tl.to(trackRef.current, {
            x: targetPosition,
            duration: isMobile ? 1.2 : 1.8,
            ease: "power1.inOut",
            force3D: true,
          });

          if (i < totalItems - 1) {
            tl.to({}, { duration: isMobile ? 1.5 : 2 });
          }
        }

        tl.set(trackRef.current, {
          x: 0,
          force3D: true,
        });

        return tl;
      };

      const handleResize = () => {
        if (currentTimeline) {
          currentTimeline.kill();
        }

        gsapInstance.set(trackRef.current, {
          x: 0,
          force3D: true,
        });

        currentTimeline = createTimeline();
      };

      currentTimeline = createTimeline();

      let resizeTimeout: NodeJS.Timeout;
      const debouncedResize = () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(handleResize, 150);
      };

      window.addEventListener("resize", debouncedResize);

      return () => {
        window.removeEventListener("resize", debouncedResize);
        if (resizeTimeout) {
          clearTimeout(resizeTimeout);
        }
        if (currentTimeline) {
          currentTimeline.kill();
        }
      };
    }, trackRef);

    return () => ctx.revert();
  }, [gsapInstance, gallery.items, gallery.id, isMobile]);

  const imageWidth = isMobile ? 280 : 720;
  const adjustedWidth =
    gallery.id === "gallery11" ? Math.round(imageWidth * 0.8) : imageWidth;

  return (
    <div
      className="treadmill-container"
      style={{
        width: "100vw",
        height: "100dvh", // Dynamic viewport height for mobile
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-start",
        pointerEvents: "none",
      }}
    >
      <div
        ref={trackRef}
        className="treadmill-track"
        style={{
          display: "flex",
          alignItems: "center",
          transform: `translateX(calc((100vw - ${adjustedWidth}px) / 2))`,
          willChange: "transform",
          gap: isMobile ? "80vw" : "100vw",
          pointerEvents: "none",
        }}
      >
        {[...gallery.items, ...gallery.items].map((item, index) => (
          <div
            key={`${item.id}-${index}`}
            style={{
              flexShrink: 0,
              width: `${adjustedWidth}px`,
              height: isMobile ? "80vh" : "96vh",
              maxHeight: isMobile ? "600px" : "960px",
              pointerEvents: "none",
            }}
          >
            <MediaItem
              item={item}
              className="w-full h-full object-cover border-none outline-none pointer-events-none"
              priority={index < 6}
              isActive={true}
            />
          </div>
        ))}
      </div>
    </div>
  );
});
