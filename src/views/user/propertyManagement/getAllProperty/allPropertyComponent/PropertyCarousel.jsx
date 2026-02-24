import React, { memo } from 'react';
import { Heart, ChevronLeft, ChevronRight } from 'lucide-react';
import api from '../../../../../service/api.js';

const baseUrl = api.defaults.baseURL;

const PropertyCarousel = memo(({ images, currentIndex, onPrev, onNext, isFavorite, onFavorite, propertyType }) => {
  return (
    <div className="relative h-64 overflow-hidden">
      <div
        className="flex h-full w-full transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)`, willChange: 'transform' }}
      >
        {images.map((image) => (
          <div key={image.id} className="w-full flex-shrink-0 relative">
            <img
              src={`${baseUrl}/propertyImages/${image.imageName}`}
              alt={image.imageName}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
          </div>
        ))}
      </div>
      {/* Favorite Button */}
      <button
        onClick={onFavorite}
        className="absolute top-4 right-4 z-20 p-2 bg-black/40 backdrop-blur-sm rounded-full hover:bg-black/60 transition-colors"
        tabIndex={0}
        type="button"
      >
        <Heart className={`w-5 h-5 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-white'}`} />
      </button>
      {/* Image Counter */}
      {images.length > 1 && (
        <div className="absolute bottom-4 left-4 z-20 px-3 py-1 bg-black/60 backdrop-blur-sm rounded-full text-white text-sm">
          {currentIndex + 1} / {images.length}
        </div>
      )}
      {/* Carousel Navigation */}
      {images.length > 1 && (
        <>
          <button
            onClick={onPrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 bg-black/40 backdrop-blur-sm rounded-full hover:bg-black/60 transition-all opacity-0 group-hover:opacity-100"
            tabIndex={0}
            type="button"
          >
            <ChevronLeft className="w-5 h-5 text-white" />
          </button>
          <button
            onClick={onNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 bg-black/40 backdrop-blur-sm rounded-full hover:bg-black/60 transition-all opacity-0 group-hover:opacity-100"
            tabIndex={0}
            type="button"
          >
            <ChevronRight className="w-5 h-5 text-white" />
          </button>
        </>
      )}
      {/* Property Type Badge */}
      <div className="absolute top-4 left-4 z-20">
        <span className="px-3 py-1 bg-primary/90 backdrop-blur-sm text-white text-sm font-medium rounded-full">
          {propertyType || 'Property'}
        </span>
      </div>
    </div>
  );
});

export default PropertyCarousel;
