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
    <div>
      <h1 className="text-xl font-semibold mb-4">Update Images Only</h1>
      {message && <p className="text-red-500">{message}</p>}

      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label htmlFor="images" className="block text-sm font-medium text-gray-700 mb-2">
            Unggah Gambar<span className="text-red-500 ml-1">*</span>
            <span className="text-sm text-gray-500 ml-2">(Minimal satu gambar diperlukan)</span>
          </label>

          <div
            className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-amber-500 transition-colors"
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
          >
            <div className="space-y-1 text-center">
              <input
                id="images"
                name="images"
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
              <label
                htmlFor="images"
                className="cursor-pointer bg-white rounded-md font-medium text-amber-600 hover:text-amber-500 px-2"
              >
                Unggah file atau seret dan lepas
              </label>
              <p className="text-xs text-gray-500">PNG, JPG, GIF maksimal 10MB per file</p>
            </div>
          </div>

          {/* Existing Images */}
          {images.length > 0 && (
            <DragDropContext onDragEnd={handleReorderImages}>
              <Droppable droppableId="images-droppable" direction="horizontal">
                {(provided) => (
                  <div
                    className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-4 mt-4"
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
                            className={`relative aspect-square select-none border ${
                              idx === 0
                                ? 'border-amber-400 ring-2 ring-amber-400 shadow-lg'
                                : 'border-gray-200'
                            } bg-white`}
                            style={{
                              ...provided.draggableProps.style,
                              opacity: snapshot.isDragging ? 0.8 : 1,
                              zIndex: snapshot.isDragging ? 50 : 1,
                            }}
                          >
                            {idx === 0 && (
                              <div className="absolute top-2 left-2 bg-amber-500 text-white text-xs px-2 py-1 rounded-full">
                                Main Image
                              </div>
                            )}
                            <img
                              alt={`Uploaded image ${idx + 1}`}
                              src={img}
                              className="rounded-md object-cover w-full h-full"
                            />
                            <button
                              type="button"
                              onClick={() => handleRemoveImage(idx)}
                              className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                            >
                              ✕
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
            <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
              {newImages.map((file, idx) => (
                <div key={idx} className="relative aspect-square border border-gray-200 rounded-md">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`New upload ${idx + 1}`}
                    className="w-full h-full object-cover rounded-md"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        <button
          type="submit"
          className="mt-4 px-4 py-2 bg-amber-500 text-white rounded-md hover:bg-amber-600"
        >
          Update Images
        </button>
      </form>
    </div>
  );
}

export default UpdateImagesOnly;
