import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Image as ImageIcon, X, ChevronLeft, ChevronRight } from 'lucide-react';

const PropertyImagesGallery = ({
  images,
  propertyId,
  baseUrl
}) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);

  if (!images || images.length === 0) return null;

  return (
    <div className="bg-base-100 p-6 rounded-2xl border border-base-300 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-base-content flex items-center gap-2">
          <ImageIcon className="w-5 h-5 text-primary" />
          <span>Current Property Images</span>
        </h2>
        <Link
          to={`/admin/update-images-only/${propertyId}`}
          className="btn btn-outline btn-primary btn-sm gap-2 rounded-xl"
        >
          <ImageIcon className="w-4 h-4" />
          <span>Edit Images Only</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-2">
        {images.map((img, index) => {
          const imgUrl = img.imagesUrl || img.imageName || img;
          const fullUrl = imgUrl.startsWith('http') ? imgUrl : `${baseUrl}${imgUrl.startsWith('/') ? '' : '/propertyImages/'}${imgUrl}`;

          return (
            <div key={img.id || index} className="relative group overflow-hidden rounded-xl border border-base-300 shadow-sm bg-base-200">
              <img
                src={fullUrl}
                alt={img.imageName || `Image ${index + 1}`}
                onClick={() => setSelectedImageIndex(index)}
                className="w-full h-48 object-cover cursor-pointer group-hover:scale-105 transition-transform duration-300"
              />
            </div>
          );
        })}
      </div>

      {/* Image Modal Viewer */}
      {selectedImageIndex !== null && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="relative w-full max-w-4xl bg-base-100 rounded-2xl shadow-2xl overflow-hidden border border-base-300">
            <button
              type="button"
              onClick={() => setSelectedImageIndex(null)}
              className="absolute top-4 right-4 z-50 btn btn-circle btn-sm bg-base-100/80 hover:bg-base-100 border border-base-300 text-base-content"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="relative flex items-center justify-center p-4">
              {(() => {
                const curImg = images[selectedImageIndex];
                const curUrl = typeof curImg === 'string' ? curImg : (curImg?.imagesUrl || curImg?.imageName || '');
                const fullCurUrl = curUrl.startsWith('http') ? curUrl : `${baseUrl}${curUrl.startsWith('/') ? '' : '/propertyImages/'}${curUrl}`;

                return (
                  <img
                    src={fullCurUrl}
                    alt="Selected"
                    className="max-h-[75vh] w-auto object-contain rounded-xl"
                  />
                );
              })()}

              {images.length > 1 && (
                <div className="absolute left-4 right-4 top-1/2 -translate-y-1/2 flex justify-between pointer-events-none">
                  <button
                    type="button"
                    onClick={() =>
                      setSelectedImageIndex(
                        selectedImageIndex === 0
                          ? images.length - 1
                          : selectedImageIndex - 1
                      )
                    }
                    className="btn btn-circle btn-sm bg-base-100/90 hover:bg-base-100 border border-base-300 pointer-events-auto shadow-md"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setSelectedImageIndex(
                        selectedImageIndex === images.length - 1
                          ? 0
                          : selectedImageIndex + 1
                      )
                    }
                    className="btn btn-circle btn-sm bg-base-100/90 hover:bg-base-100 border border-base-300 pointer-events-auto shadow-md"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyImagesGallery;
