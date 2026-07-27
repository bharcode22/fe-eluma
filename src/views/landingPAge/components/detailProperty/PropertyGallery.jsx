import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Eye } from 'lucide-react';

const ImageGalleryGrid = ({ images, baseUrl, onImageClick }) => {
  if (!images || images.length === 0) {
    return (
      <div className="bg-base-200/50 rounded-2xl p-12 text-center text-base-content/50">
        No images available for this property.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
      {images.map((img, index) => (
        <div
          key={img.id || index}
          className={`relative overflow-hidden rounded-2xl cursor-pointer group shadow-sm ${index === 0 ? 'sm:col-span-2 sm:row-span-2' : ''}`}
          onClick={() => onImageClick(index)}
        >
          <img
            src={`${baseUrl}${img.imagesUrl}`}
            alt={img.imageName || 'Property Image'}
            className="w-full h-full object-cover aspect-square group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="absolute bottom-0 left-0 right-0 p-3 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <p className="text-white text-xs font-medium truncate">{img.imageName || `Photo #${index + 1}`}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

const ImageCarouselModal = ({ images, baseUrl, selectedIndex, onClose, onNavigate }) => {
  if (selectedIndex === null || !images || images.length === 0) return null;

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-[100] flex flex-col justify-between p-4">
      <button
        onClick={onClose}
        className="fixed top-6 right-6 z-[110] bg-white/20 text-white rounded-full p-3 hover:bg-error transition-all backdrop-blur-md shadow-lg"
      >
        <X size={24} />
      </button>

      <div className="h-full w-full max-w-6xl mx-auto flex flex-col justify-center">
        <div className="relative flex-1 flex items-center justify-center">
          <img
            src={`${baseUrl}${images[selectedIndex].imagesUrl}`}
            alt={images[selectedIndex].imageName || 'Carousel Image'}
            className="w-full max-h-[75vh] object-contain rounded-2xl"
          />

          <button
            onClick={() => onNavigate('prev')}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white rounded-full p-3 backdrop-blur-md transition-all"
          >
            <ChevronLeft size={28} />
          </button>
          <button
            onClick={() => onNavigate('next')}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white rounded-full p-3 backdrop-blur-md transition-all"
          >
            <ChevronRight size={28} />
          </button>
        </div>

        <div className="flex gap-2 justify-center overflow-x-auto py-4">
          {images.map((img, index) => (
            <button
              key={img.id || index}
              onClick={() => {
                const event = new CustomEvent('carouselNavigate', { detail: index });
                window.dispatchEvent(event);
              }}
              className={`flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${index === selectedIndex ? 'border-primary scale-110' : 'border-transparent opacity-60'}`}
            >
              <img
                src={`${baseUrl}${img.imagesUrl}`}
                alt={img.imageName}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

const PropertyGallery = ({ images, baseUrl }) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);

  const handleImageClick = (index) => setSelectedImageIndex(index);
  const handleCloseCarousel = () => setSelectedImageIndex(null);

  const handleCarouselNavigate = (direction) => {
    if (!images || images.length === 0) return;
    if (direction === 'prev') {
      setSelectedImageIndex(
        selectedImageIndex === 0 ? images.length - 1 : selectedImageIndex - 1
      );
    } else {
      setSelectedImageIndex(
        selectedImageIndex === images.length - 1 ? 0 : selectedImageIndex + 1
      );
    }
  };

  useEffect(() => {
    const handleThumbnailClick = (event) => {
      setSelectedImageIndex(event.detail);
    };

    window.addEventListener('carouselNavigate', handleThumbnailClick);
    return () => window.removeEventListener('carouselNavigate', handleThumbnailClick);
  }, []);

  return (
    <div className="bg-base-100 border border-base-300 shadow-sm rounded-3xl overflow-hidden">
      <div className="bg-gradient-to-r from-primary/10 via-secondary/5 to-transparent px-6 py-4 border-b border-base-200 flex items-center gap-3">
        <Eye className="w-6 h-6 text-primary" />
        <h2 className="text-xl font-bold text-base-content">Property Gallery</h2>
      </div>
      <div className="p-6">
        <ImageGalleryGrid
          images={images}
          baseUrl={baseUrl}
          onImageClick={handleImageClick}
        />
        <ImageCarouselModal
          images={images}
          baseUrl={baseUrl}
          selectedIndex={selectedImageIndex}
          onClose={handleCloseCarousel}
          onNavigate={handleCarouselNavigate}
        />
      </div>
    </div>
  );
};

export default PropertyGallery;
