import GalleryClient from "../components/GalleryClient";
import GalleryErrorBoundary from "../components/GalleryErrorBoundary";

export default function Home() {
  return (
    <main role="main" aria-label="Main content">
      <GalleryErrorBoundary>
        <GalleryClient />
      </GalleryErrorBoundary>
    </main>
  );
}
