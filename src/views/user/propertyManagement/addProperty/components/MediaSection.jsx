import React from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Image as ImageIcon, CloudUpload, Star, Trash2 } from 'lucide-react';

const MediaSection = ({ images, setImages }) => {
  const handleImagesChange = (e) => {
    const files = Array.from(e.target.files);
    setImages((prev) => [...prev, ...files]);
  };

  const handleRemoveImage = (idx) => {
    setImages((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files).filter((file) =>
      file.type.startsWith('image/')
    );
    setImages((prev) => [...prev, ...files]);
  };

  const handleReorderImages = (result) => {
    if (!result.destination) return;
    const reordered = Array.from(images);
    const [removed] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, removed);
    setImages(reordered);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3 pb-3 border-b border-base-200">
        <ImageIcon className="w-5 h-5 text-primary" />
        <h2 className="text-lg font-bold text-base-content">Property Photos</h2>
      </div>

      <div
        className="flex flex-col items-center justify-center p-8 rounded-2xl border-2 border-dashed border-base-300 bg-base-100 hover:border-primary transition-all cursor-pointer text-center group"
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => document.getElementById('images-input').click()}
      >
        <div className="p-4 bg-primary/10 rounded-full text-primary group-hover:scale-110 transition-transform mb-3">
          <CloudUpload className="w-8 h-8" />
        </div>
        <input
          id="images-input"
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          onChange={handleImagesChange}
        />
        <p className="text-sm font-semibold text-base-content">
          <span className="text-primary hover:underline">Click to upload</span> or drag and drop
        </p>
        <p className="text-xs text-base-content/50 mt-1">PNG, JPG, WEBP up to 10MB each</p>
      </div>

      {images.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-base-content/70">
            <span className="font-semibold">{images.length} Image(s) Uploaded</span>
            <span>Drag & drop to reorder. First image is Main Photo.</span>
          </div>

          <DragDropContext onDragEnd={handleReorderImages}>
            <Droppable droppableId="images-droppable" direction="horizontal">
              {(provided) => (
                <div
                  className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4"
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  {images.map((img, idx) => (
                    <Draggable key={idx} draggableId={`img-${idx}`} index={idx}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`relative aspect-square rounded-xl overflow-hidden bg-base-200 border ${
                            idx === 0 ? 'border-primary ring-2 ring-primary/30' : 'border-base-300'
                          } cursor-move shadow-sm transition-transform duration-200 ${
                            snapshot.isDragging ? 'scale-105 rotate-2 shadow-xl z-50' : ''
                          }`}
                        >
                          {idx === 0 && (
                            <div className="absolute top-2 left-2 bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-full z-10 flex items-center gap-1 shadow-sm">
                              <Star className="w-3 h-3 fill-current" />
                              Main
                            </div>
                          )}

                          <img
                            alt={`Upload ${idx + 1}`}
                            src={typeof img === 'string' ? img : URL.createObjectURL(img)}
                            className="w-full h-full object-cover"
                          />

                          <button
                            type="button"
                            onClick={() => handleRemoveImage(idx)}
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
