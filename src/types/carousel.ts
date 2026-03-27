import type { SimpleAnimationType } from "@/utils/animationConfigs";

/**
 * Per-project carousel configuration.
 *
 * Controls how gallery images are presented in the homepage
 * carousel sections (full-viewport auto-advancing galleries).
 */
export interface CarouselConfig {
  /** CSS animation type for slide transitions. */
  animation: SimpleAnimationType;

  /** Auto-advance interval in milliseconds. Undefined = no auto-advance (e.g. video galleries). */
  autoAdvanceTime?: number;

  /**
   * Which media[] indices to show on the homepage carousel.
   * - undefined or empty → show ALL media items
   * - [0, 2, 5] → show only those indices
   */
  homepageIndices?: number[];
}
