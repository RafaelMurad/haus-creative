'use client'

import { useState, useEffect } from 'react'
import galleryData from '../data/galleryData'

const Gallery = () => {
  const [currentGallery, setCurrentGallery] = useState(0)
  const [currentImage, setCurrentImage] = useState(0)
  const [nextImage, setNextImage] = useState(1)
  const [isTransitioning, setIsTransitioning] = useState(false)
  
  // Second gallery state
  const [secondGalleryImages, setSecondGalleryImages] = useState([
    { 
      imageUrl: galleryData[1].items[0].imageUrl,
      size: 'w-[500px] h-[600px]'
    },
    { 
      imageUrl: galleryData[1].items[1].imageUrl,
      size: 'w-[400px] h-[500px]'
    }
  ])

  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true)
      setNextImage((currentImage + 1) % galleryData[currentGallery].items.length)
      
      setTimeout(() => {
        setCurrentImage(nextImage)
        setIsTransitioning(false)
      }, 300)
    }, 3000)

    return () => clearInterval(interval)
  }, [currentImage, nextImage, currentGallery])

  // Effect for second gallery
  useEffect(() => {
    const updateSecondGallery = () => {
      const randomIndex1 = Math.floor(Math.random() * galleryData[1].items.length)
      let randomIndex2
      do {
        randomIndex2 = Math.floor(Math.random() * galleryData[1].items.length)
      } while (randomIndex2 === randomIndex1)

      // Fixed base sizes with subtle variations
      const sizes = [
        ['w-[450px] h-[550px]', 'w-[400px] h-[500px]'],
        ['w-[400px] h-[500px]', 'w-[450px] h-[550px]'],
        ['w-[420px] h-[520px]', 'w-[420px] h-[520px]']
      ]
      
      const randomSizePair = sizes[Math.floor(Math.random() * sizes.length)]

      setSecondGalleryImages([
        { 
          imageUrl: galleryData[1].items[randomIndex1].imageUrl,
          size: randomSizePair[0]
        },
        { 
          imageUrl: galleryData[1].items[randomIndex2].imageUrl,
          size: randomSizePair[1]
        }
      ])
    }

    const interval = setInterval(updateSecondGallery, 2500)
    return () => clearInterval(interval)
  }, [])

  return (
    <>
      <div className="relative h-screen w-full overflow-hidden">
        <div className="absolute inset-0 bg-black/30 z-10"></div>
        
        {/* Current Image */}
        <div className={`absolute inset-0 transition-all duration-300 ${
          isTransitioning ? 'opacity-0 scale-[1.01]' : 'opacity-100 scale-100'
        }`}>
          <img 
            src={galleryData[currentGallery].items[currentImage].imageUrl} 
            alt="Gallery"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Next Image */}
        <div className={`absolute inset-0 transition-all duration-300 ${
          isTransitioning ? 'opacity-100 scale-100' : 'opacity-0 scale-[1.01]'
        }`}>
          <img 
            src={galleryData[currentGallery].items[nextImage].imageUrl} 
            alt="Gallery"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Hero Content */}
        <div className="relative z-20 h-full flex items-center">
          <div className="max-w-7xl mx-auto px-4 md:px-8 w-full">
            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-light leading-tight mb-6 text-white">
                Visual storytelling with purpose and precision
              </h1>
              <p className="text-lg md:text-xl font-light mb-8 text-white/90 max-w-xl">
                We craft compelling brand narratives through thoughtful design and creative direction.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Second Gallery Section - Centralized */}
      <div className="w-full bg-white py-24">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex justify-center items-center gap-8">
            {secondGalleryImages.map((image, index) => (
              <div 
                key={index} 
                className={`${image.size} transition-all duration-700 ease-in-out`}
              >
                <div className="w-full h-full overflow-hidden rounded-lg">
                  <img 
                    src={image.imageUrl} 
                    alt={`Gallery ${index + 1}`}
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-[1.02]"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

export default Gallery