import GalleryClient from '../components/GalleryClient'
import GalleryErrorBoundary from '../components/GalleryErrorBoundary'

export default function Home() {
  return (
    <main>
      <GalleryErrorBoundary>
        <GalleryClient />
      </GalleryErrorBoundary>
    </main>
  )
}