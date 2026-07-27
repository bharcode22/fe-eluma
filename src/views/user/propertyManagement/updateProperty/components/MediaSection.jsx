import React from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Image as ImageIcon, CloudUpload, Star, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MediaSection = ({
  id,
  baseUrl,
  existingImages,
  images,
  setImages
}) => {
  const navigate = useNavigate();

  const handleImagesChange = (e) => {
    const files = Array.from(e.target.files);
    setImages((prev) => [...prev, ...files]);
  };

  const handleRemoveNewImage = (idx) => {
    setImages((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files).filter((file) =>
      file.type.startsWith('image/')
    );
    setImages((prev) => [...prev, ...files]);
  };

  const handleReorderNewImages = (result) => {
    if (!result.destination) return;
    const reordered = Array.from(images);
    const [removed] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, removed);
    setImages(reordered);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-base-200">
        <div className="flex items-center gap-3">
          <ImageIcon className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-bold text-base-content">Property Photos</h2>
        </div>
        <button
          type="button"
          onClick={() => navigate(`/user/update/image/property/${id}`)}
          className="btn btn-outline btn-xs rounded-lg text-primary"
        >
          Manage Existing Images
        </button>
      </div>

      {/* Existing Images Display */}
      {existingImages.length > 0 && (
        <div className="space-y-2">
          <span className="text-xs font-bold text-base-content/70">Current Saved Photos</span>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {existingImages.map((imgObj, idx) => (
              <div
                key={imgObj.id || idx}
                className="relative aspect-square rounded-xl overflow-hidden bg-base-200 border border-base-300 shadow-sm"
              >
                {idx === 0 && (
                  <div className="absolute top-2 left-2 bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-full z-10 flex items-center gap-1 shadow-sm">
                    <Star className="w-3 h-3 fill-current" />
                    Main
                  </div>
                )}
                <img
                  src={
                    imgObj.imagesUrl.startsWith('http')
                      ? imgObj.imagesUrl
                      : `${baseUrl}${imgObj.imagesUrl}`
                  }
                  alt={`Saved ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upload Zone for Adding New Images */}
      <div className="space-y-3 pt-4 border-t border-base-200">
        <span className="text-xs font-bold text-base-content/70">Add New Images</span>
        <div
          className="flex flex-col items-center justify-center p-8 rounded-2xl border-2 border-dashed border-base-300 bg-base-100 hover:border-primary transition-all cursor-pointer text-center group"
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => document.getElementById('new-images-input').click()}
        >
          <div className="p-4 bg-primary/10 rounded-full text-primary group-hover:scale-110 transition-transform mb-3">
            <CloudUpload className="w-8 h-8" />
          </div>
          <input
            id="new-images-input"
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={handleImagesChange}
          />
          <p className="text-sm font-semibold text-base-content">
            <span className="text-primary hover:underline">Click to upload</span> or drag and drop new files
          </p>
          <p className="text-xs text-base-content/50 mt-1">PNG, JPG, WEBP up to 10MB each</p>
        </div>
      </div>

      {images.length > 0 && (
        <div className="space-y-3">
          <span className="text-xs font-bold text-base-content/70">
            {images.length} New Image(s) Selected
          </span>
          <DragDropContext onDragEnd={handleReorderNewImages}>
            <Droppable droppableId="new-images-droppable" direction="horizontal">
              {(provided) => (
                <div
                  className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4"
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  {images.map((img, idx) => (
                    <Draggable key={idx} draggableId={`new-img-${idx}`} index={idx}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`relative aspect-square rounded-xl overflow-hidden bg-base-200 border border-base-300 cursor-move shadow-sm transition-transform duration-200 ${
                            snapshot.isDragging ? 'scale-105 rotate-2 shadow-xl z-50' : ''
                          }`}
                        >
                          <img
                            alt={`New upload ${idx + 1}`}
                            src={URL.createObjectURL(img)}
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveNewImage(idx)}
                            className="absolute top-2 right-2 p-1.5 rounded-full bg-error/90 text-white hover:bg-error transition-colors z-10 shadow-sm"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
      )}
    </div>
  );
};

export default MediaSection;
