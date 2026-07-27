import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { useParams, useNavigate } from 'react-router-dom';
import Api from "../../../../service/api.js";
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import {
  ArrowLeft,
  Image as ImageIcon,
  UploadCloud,
  X,
  AlertCircle,
  Loader2,
  Sparkles,
  Star
} from 'lucide-react';

const API_URL = Api.defaults.baseURL;

function UpdateImagesOnly() {
  const { id: propertyId } = useParams();
  const navigate = useNavigate();
  const [images, setImages] = useState([]);       // URLs string
  const [newImages, setNewImages] = useState([]); // File[]
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Fetch existing images
  useEffect(() => {
    const token = Cookies.get('token');
    if (!token) {
      setMessage('Token tidak tersedia. Harap login terlebih dahulu.');
      setLoading(false);
      return;
    }

    Api.get(`/property/${propertyId}/images`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (res.data.images && res.data.images.length > 0) {
          const formattedImages = res.data.images.map((img) =>
            img.imagesUrl.startsWith('http')
              ? img.imagesUrl
              : `${API_URL}${img.imagesUrl}`
          );
          setImages(formattedImages);
        } else {
          setImages([]);
        }
      })
      .catch(() => {
        setMessage('Terjadi kesalahan saat memuat gambar.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [propertyId]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setNewImages((prev) => [...prev, ...files]);
  };

  const handleReorderImages = (result) => {
    if (!result.destination) return;
    const reordered = Array.from(images);
    const [removed] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, removed);
    setImages(reordered);
  };

  const handleRemoveExistingImage = (index) => {
    setImages((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleRemoveNewImage = (index) => {
    setNewImages((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files).filter((file) =>
      file.type.startsWith('image/')
    );
    setNewImages((prev) => [...prev, ...files]);
  };

  // Convert image URL to File object for formData upload
  async function urlToFile(url) {
    const response = await fetch(url);
    const blob = await response.blob();
    const filename = url.split('/').pop().split('?')[0];
    return new File([blob], filename, { type: blob.type });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage('');

    const token = Cookies.get('token');
    if (!token) {
      setMessage('Token tidak tersedia. Harap login terlebih dahulu.');
      setSubmitting(false);
      return;
    }

    if (images.length === 0 && newImages.length === 0) {
      setMessage('Minimal satu gambar diperlukan.');
      setSubmitting(false);
      return;
    }

    const formData = new FormData();

    // Append gambar lama (url) sebagai File ke formData
    for (let imgUrl of images) {
      if (!imgUrl.startsWith('blob:')) {
        try {
          const file = await urlToFile(imgUrl);
          formData.append('images', file);
        } catch {
          setMessage('Gagal mengambil file gambar lama.');
          setSubmitting(false);
          return;
        }
      }
    }

    // Append gambar baru (File) ke formData
    newImages.forEach((file) => {
      formData.append('images', file);
    });

    try {
      const res = await Api.put(
        `/property/update/property/${propertyId}/images`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (res.data.images && res.data.images.length > 0) {
        const formattedImages = res.data.images.map((img) =>
          img.imagesUrl.startsWith('http')
            ? img.imagesUrl
            : `${API_URL}${img.imagesUrl}`
        );
        setImages(formattedImages);
      } else {
        setImages([]);
      }
      setNewImages([]);
      setMessage('');
      navigate(`/user/update/property/${propertyId}`);
    } catch (err) {
      setMessage('Terjadi kesalahan saat mengupdate gambar.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-base-100 to-base-200 py-8 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto space-y-6">

        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-base-100 p-6 rounded-2xl border border-base-300 shadow-sm">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => navigate(`/user/update/property/${propertyId}`)}
              className="btn btn-circle btn-ghost btn-sm text-base-content/70 hover:bg-base-200"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-base-content flex items-center gap-2">
                <ImageIcon className="w-7 h-7 text-primary" />
                Update Property Images
              </h1>
              <p className="text-base-content/70 text-xs sm:text-sm mt-0.5">
                Manage and reorder property photos (Drag & drop to set main image)
              </p>
            </div>
          </div>
        </div>

        {/* Global Alert Banner */}
        {message && (
          <div className="p-4 bg-error/10 border border-error/30 text-error rounded-2xl flex items-center gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span className="text-sm font-medium">{message}</span>
          </div>
        )}

        {/* Main Content Card */}
        <div className="bg-base-100 rounded-2xl border border-base-300 shadow-sm p-6 space-y-6">

          {loading ? (
            <div className="text-center py-12 space-y-3">
              <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
              <p className="text-xs text-base-content/60 font-medium">Loading property images...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">

              {/* Upload Zone */}
              <div>
                <label className="block text-xs font-bold text-base-content mb-2">
                  Upload New Images <span className="text-error">*</span>
                  <span className="block text-xs font-normal text-base-content/60 mt-0.5">
                    (PNG, JPG, WEBP up to 10MB per file)
                  </span>
                </label>

                <div
                  className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-base-300 rounded-2xl hover:border-primary bg-base-100 transition-all cursor-pointer text-center group"
                  onDrop={handleDrop}
                  onDragOver={(e) => e.preventDefault()}
                  onClick={() => document.getElementById('user-images-upload-input').click()}
                >
                  <div className="p-4 bg-primary/10 rounded-full text-primary group-hover:scale-110 transition-transform mb-3">
                    <UploadCloud className="w-8 h-8" />
                  </div>
                  <input
                    id="user-images-upload-input"
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                  <p className="text-sm font-semibold text-base-content">
                    <span className="text-primary hover:underline">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-base-content/50 mt-1">
                    Drag & drop images below to reorder. The first image is the main property photo.
                  </p>
                </div>
              </div>

              {/* Existing Images Drag & Drop Gallery */}
              {images.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-base-content/70">
                    Existing Property Images ({images.length})
                  </h3>

                  <DragDropContext onDragEnd={handleReorderImages}>
                    <Droppable droppableId="images-droppable" direction="horizontal">
                      {(provided) => (
                        <div
                          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                        >
                          {images.map((img, idx) => (
                            <Draggable key={img} draggableId={img} index={idx}>
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className={`relative aspect-square select-none rounded-xl overflow-hidden bg-base-200 border ${idx === 0 ? 'border-primary ring-2 ring-primary/30' : 'border-base-300'
                                    } cursor-move shadow-sm transition-transform duration-200 ${snapshot.isDragging ? 'scale-105 rotate-2 shadow-xl z-50' : ''
                                    }`}
                                  style={{
                                    ...provided.draggableProps.style,
                                  }}
                                >
                                  {idx === 0 && (
                                    <div className="absolute top-2 left-2 bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-full z-10 flex items-center gap-1 shadow-sm">
                                      <Star className="w-3 h-3 fill-current" />
                                      Main
                                    </div>
                                  )}

                                  <img
                                    alt={`Property image ${idx + 1}`}
                                    src={img}
                                    className="w-full h-full object-cover"
                                  />

                                  <button
                                    type="button"
                                    onClick={() => handleRemoveExistingImage(idx)}
                                    className="absolute top-2 right-2 p-1.5 rounded-full bg-error/90 text-white hover:bg-error transition-colors z-10 shadow-sm"
                                    title="Remove Image"
                                  >
                                    <X className="w-3.5 h-3.5" />
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

              {/* Newly Selected Images Preview */}
              {newImages.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-base-200">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-base-content/70">
                    Newly Selected Images ({newImages.length})
                  </h3>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {newImages.map((file, idx) => (
                      <div key={idx} className="relative aspect-square rounded-xl overflow-hidden bg-base-200 border border-base-300 shadow-sm">
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`New upload ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveNewImage(idx)}
                          className="absolute top-2 right-2 p-1.5 rounded-full bg-error/90 text-white hover:bg-error transition-colors z-10 shadow-sm"
                          title="Remove New Image"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Submit Controls */}
              <div className="flex gap-4 pt-4 border-t border-base-200">
                <button
                  type="button"
                  onClick={() => navigate(`/user/update/property/${propertyId}`)}
                  className="btn btn-outline flex-1 rounded-xl text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn btn-primary flex-1 shadow-lg hover:shadow-xl rounded-xl gap-2 text-white text-xs"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Updating Images...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Save Image Changes</span>
                    </>
                  )}
                </button>
              </div>

            </form>
          )}

        </div>

      </div>
    </div>
  );
}

export default UpdateImagesOnly;
