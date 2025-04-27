import React, { useState, useEffect } from 'react';

// Gallery data with 12 different sections
const galleries = [
  {
    id: 'main',
    images: [
      'https://images.pexels.com/photos/3785147/pexels-photo-3785147.jpeg',
      'https://images.pexels.com/photos/2584269/pexels-photo-2584269.jpeg',
      'https://images.pexels.com/photos/2119713/pexels-photo-2119713.jpeg',
      'https://images.pexels.com/photos/4202325/pexels-photo-4202325.jpeg'
    ],
    effect: 'fade' // Current effect: fade transition
  },
  // Add more galleries here with different effects:
  // Example structure for adding new galleries:
  /*
  {
    id: 'gallery2',
    images: [
      'image-url-1',
      'image-url-2',
      'image-url-3',
      'image-url-4'
    ],
    effect: 'slide' // Other effects: slide, scale, rotate, blur, etc.
  }
  */
];

const Gallery = () => {
  const [currentGallery, setCurrentGallery] = useState(0);
  const [currentImage, setCurrentImage] = useState(0);
  const [nextImage, setNextImage] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setNextImage((currentImage + 1) % galleries[currentGallery].images.length);
      
      setTimeout(() => {
        setCurrentImage(nextImage);
        setIsTransitioning(false);
      }, 500);
    }, 3000);

    return () => clearInterval(interval);
  }, [currentImage, nextImage, currentGallery]);

  // Function to handle gallery transitions
  const transitionToNextGallery = () => {
    setCurrentGallery((prev) => (prev + 1) % galleries.length);
    setCurrentImage(0);
    setNextImage(1);
  };

  // Comment: To add new transition effects, create new CSS classes in index.css
  // and update the getTransitionClass function below
  const getTransitionClass = (effect) => {
    switch (effect) {
      case 'fade':
        return isTransitioning ? 'opacity-0' : 'opacity-100';
      // Add more effects here:
      // case 'slide':
      //   return isTransitioning ? '-translate-x-full' : 'translate-x-0';
      default:
        return '';
    }
  };

  return (
    <div className="relative h-screen w-full overflow-hidden">
      <div className="absolute inset-0 bg-black/30 z-10"></div>
      
      {/* Current Image */}
      <div className={`absolute inset-0 transition-all duration-500 ${
        getTransitionClass(galleries[currentGallery].effect)
      }`}>
        <img 
          src={galleries[currentGallery].images[currentImage]} 
          alt="Gallery"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Next Image */}
      <div className={`absolute inset-0 transition-all duration-500 ${
        getTransitionClass(galleries[currentGallery].effect) === 'opacity-0' ? 'opacity-100' : 'opacity-0'
      }`}>
        <img 
          src={galleries[currentGallery].images[nextImage]} 
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
  );
};

export default Gallery;