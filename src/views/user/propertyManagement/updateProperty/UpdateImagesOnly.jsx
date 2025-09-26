import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { useParams, useNavigate } from 'react-router-dom';
import Api from "../../../../service/api.js";
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const API_URL = Api.defaults.baseURL;

function UpdateImagesOnly() {
  const { id: propertyId } = useParams();
  const navigate = useNavigate();
  const [images, setImages] = useState([]);       // URLs string
  const [newImages, setNewImages] = useState([]); // File[]
  const [message, setMessage] = useState('');

  // Fetch existing images
  useEffect(() => {
    const token = Cookies.get('token');
    if (!token) {
      setMessage('Token tidak tersedia. Harap login terlebih dahulu.');
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

  const handleRemoveImage = (index) => {
    setImages((prev) => prev.filter((_, idx) => idx !== index));
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
    const filename = url.split('/').pop().split('?')[0]; // amankan nama file tanpa query string
    return new File([blob], filename, { type: blob.type });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = Cookies.get('token');
    if (!token) {
      setMessage('Token tidak tersedia. Harap login terlebih dahulu.');
      return;
    }

    if (images.length === 0 && newImages.length === 0) {
      setMessage('Minimal satu gambar diperlukan.');
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
      // Redirect setelah update berhasil
      navigate(`/user/update/property/${propertyId}`);
    } catch (err) {
      setMessage('Terjadi kesalahan saat mengupdate gambar.');
    }
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8 bg-white shadow-lg rounded-lg mt-8 mb-8">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Update Images Only</h1>
      {message && <p className="text-red-500 text-center mb-4">{message}</p>}

      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label htmlFor="images" className="block text-lg font-medium text-gray-700 mb-3 text-center">
            Unggah Gambar<span className="text-red-500 ml-1">*</span>
            <span className="block text-sm text-gray-500 mt-1">(Minimal satu gambar diperlukan, maksimal 10MB per file)</span>
          </label>

          <div
            className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-amber-500 transition-colors duration-200 ease-in-out cursor-pointer"
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            onClick={() => document.getElementById('images').click()}
          >
            <div className="space-y-1 text-center">
              <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <input
                id="images"
                name="images"
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
              <p className="text-sm text-gray-600">
                <span className="font-medium text-amber-600 hover:text-amber-500">Unggah file</span> atau seret dan lepas
              </p>
              <p className="text-xs text-gray-500">PNG, JPG, GIF hingga 10MB</p>
            </div>
          </div>

          {/* Existing Images */}
          {images.length > 0 && (
            <DragDropContext onDragEnd={handleReorderImages}>
              <Droppable droppableId="images-droppable" direction="horizontal">
                {(provided) => (
                  <div
                    className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-6"
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
                            className={`relative aspect-square rounded-lg overflow-hidden shadow-md transition-all duration-200 ease-in-out ${
                              idx === 0
                                ? 'border-4 border-amber-500 ring-2 ring-amber-300' // Highlight main image
                                : 'border border-gray-200'
                            } ${snapshot.isDragging ? 'scale-105 rotate-2 shadow-lg' : ''}`}
                            style={{
                              ...provided.draggableProps.style,
                              zIndex: snapshot.isDragging ? 5000 : 'auto',
                            }}
                          >
                            {idx === 0 && (
                              <div className="absolute top-2 left-2 bg-amber-500 text-white text-xs font-semibold px-3 py-1 rounded-full z-10">
                                Gambar Utama
                              </div>
                            )}
                            <img
                              alt={`Uploaded image ${idx + 1}`}
                              src={img}
                              className="w-full h-full object-cover"
                            />
                            <button
                              type="button"
                              onClick={() => handleRemoveImage(idx)}
                              className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1.5 hover:bg-red-700 transition-colors duration-200 z-10"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                              </svg>
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
          )}

          {/* Preview new images */}
          {newImages.length > 0 && (
            <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {newImages.map((file, idx) => (
                <div key={idx} className="relative aspect-square rounded-lg overflow-hidden shadow-md border border-gray-200">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`New upload ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        <button
          type="submit"
          className="w-full mt-8 px-6 py-3 bg-amber-500 text-white font-semibold rounded-lg shadow-md hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-opacity-75 transition-colors duration-200"
        >
          Update Images
        </button>
      </form>
    </div>
  );
}

export default UpdateImagesOnly;
