import React from "react";
import { useImageLazyLoad } from "../hooks/useImageLazyLoad";

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  placeholderSrc?: string;
  lowResSrc?: string;
  rootMargin?: string;
  threshold?: number;
  onLoad?: () => void;
  onError?: (error: string) => void;
  style?: React.CSSProperties;
}

export function LazyImage({
  src,
  alt,
  className = "",
  placeholderSrc = "",
  lowResSrc,
  rootMargin = "50px",
  threshold = 0.1,
  onLoad,
  onError,
  style = {},
}: LazyImageProps) {
  const {
    imgRef,
    src: currentSrc,
    isLoaded,
    isLoading,
    error,
    retry,
  } = useImageLazyLoad(src, {
    placeholderSrc,
    lowResSrc,
    rootMargin,
    threshold,
  });

  // Notify parent components of load/error events
  React.useEffect(() => {
    if (isLoaded && onLoad) {
      onLoad();
    }
  }, [isLoaded, onLoad]);

  React.useEffect(() => {
    if (error && onError) {
      onError(error);
    }
  }, [error, onError]);

  const imageStyle: React.CSSProperties = {
    ...style,
    transition: "opacity 0.3s ease-in-out",
    opacity: isLoaded ? 1 : 0.7,
    filter: isLoaded ? "none" : "blur(2px)",
    objectFit: "cover",
  };

  if (error) {
    return (
      <div
        className={`lazy-image-error ${className}`}
        style={{
          ...style,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#f5f5f5",
          color: "#666",
          flexDirection: "column",
          gap: "8px",
        }}
      >
        <span>Failed to load image</span>
        <button
          onClick={retry}
          style={{
            padding: "4px 8px",
            fontSize: "12px",
            background: "#007acc",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div
      className={`lazy-image-container ${className}`}
      style={{ position: "relative" }}
    >
      <img
        ref={imgRef}
        src={currentSrc || placeholderSrc}
        alt={alt}
        style={imageStyle}
        loading="lazy"
      />

      {isLoading && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            opacity: 0.7,
          }}
        >
          <div
            style={{
              width: "20px",
              height: "20px",
              border: "2px solid #f3f3f3",
              borderTop: "2px solid #007acc",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
            }}
          />
        </div>
      )}

      <style jsx>{`
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
