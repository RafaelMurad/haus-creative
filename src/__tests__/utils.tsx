import React, { ReactElement } from "react";
import { render, RenderOptions } from "@testing-library/react";
import "@testing-library/jest-dom";

// Mock data for tests
export const mockGalleryItem = {
  id: "test-item-1",
  title: "Test Project",
  description: "A test project description",
  type: "image" as const,
  url: "/assets/test/image.jpg",
  thumbUrl: "/assets/test/thumb.jpg",
  category: "test",
};

export const mockVideoItem = {
  id: "test-video-1",
  title: "Test Video",
  description: "A test video description",
  type: "video" as const,
  url: "/assets/test/video.mp4",
  thumbUrl: "/assets/test/video-thumb.jpg",
  category: "test",
};

export const mockGalleryConfig = {
  id: "test-gallery",
  title: "Test Gallery",
  description: "A test gallery description",
  layout: "grid" as const,
  animation: {
    effect: "fade" as const,
    duration: 0.6,
    ease: "power2.inOut" as const,
  },
  items: [mockGalleryItem],
};

export const mockGalleries = [
  {
    ...mockGalleryConfig,
    id: "gallery-1",
    title: "Gallery One",
    description: "First gallery description",
    items: [
      { ...mockGalleryItem, id: "g1-item-1", title: "Project One" },
    ],
  },
  {
    ...mockGalleryConfig,
    id: "gallery-2",
    title: "Gallery Two",
    description: "Second gallery description",
    items: [
      { ...mockVideoItem, id: "g2-item-1", title: "Video Project" },
    ],
  },
];

// Custom render function with providers if needed
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">
) => render(ui, { wrapper: AllTheProviders, ...options });

export * from "@testing-library/react";
export { customRender as render };
