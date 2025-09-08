import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Api from '../../../service/api.js';

function LandingPageDetailProperty() {
  const { id } = useParams();
  const baseUrl = Api.defaults.baseURL;
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sanitizedHTML, setSanitizedHTML] = useState('');
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const res = await Api.get(`/property/${id}`);
        setProperty(res.data.data[0]);
      } catch (error) {
        console.error('Gagal memuat data properti:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id]);

  useEffect(() => {
    let isMounted = true;
  
    const sanitize = async () => {
      if (property && property.description) {
        try {
          const module = await import("dompurify");
          const clean = module.default.sanitize(property.description);
          if (isMounted) setSanitizedHTML(clean);
        } catch (err) {
          console.error("Gagal import DOMPurify:", err);
        }
      }
    };
  
    sanitize();
    return () => {
      isMounted = false;
    };
  }, [property]);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="mt-4 text-primary">Loading</p>
        </div>
      </div>
    );

  if (!property)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="alert alert-error">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="stroke-current flex-shrink-0 h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>{!property}</span>
          </div>
        </div>
      </div>
    );

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">

			{/* judul */}
      <div className='flex gap-2'>
        <h1 className="text-3xl">Code: </h1>
        <h1 className="text-3xl font-bold">{property.property_code}</h1>
      </div>

      {/* Grid Gambar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {property.images.map((img, index) => (
          <img
            key={img.id}
            src={`${baseUrl}${img.imagesUrl}`}
            alt={img.imageName}
            onClick={() => setSelectedImageIndex(index)}
            className="w-full h-64 object-cover rounded-md cursor-pointer hover:scale-105 transition-transform duration-200"
          />
        ))}
      </div>

      {/* Modal Daisy Carousel */}
      {selectedImageIndex !== null && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-70 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="relative w-full max-w-4xl mx-auto">
            
            {/* Tombol tutup */}
            <button
              onClick={() => setSelectedImageIndex(null)}
              className="absolute top-2 right-2 z-50 bg-white text-black rounded-full p-2 hover:bg-gray-300"
            >
              ✕
            </button>

            {/* Carousel DaisyUI */}
            <div className="carousel w-full rounded-lg overflow-hidden">
              {property.images.map((img, index) => (
                <div
                  key={img.id}
                  id={`slide${index}`}
                  className={`carousel-item relative w-full transition-opacity duration-300 ${
                    index === selectedImageIndex ? 'opacity-100' : 'hidden opacity-0'
                  }`}
                >
                  <img
                    src={`${baseUrl}${img.imagesUrl}`}
                    alt={img.imageName}
                    className="w-full max-h-[80vh] object-contain"
                  />

                  {/* Navigasi tombol */}
                  <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
                    <button
                      onClick={() =>
                        setSelectedImageIndex(
                          selectedImageIndex === 0
                            ? property.images.length - 1
                            : selectedImageIndex - 1
                        )
                      }
                      className="btn btn-circle"
                    >
                      ❮
                    </button>
                    <button
                      onClick={() =>
                        setSelectedImageIndex(
                          selectedImageIndex === property.images.length - 1
                            ? 0
                            : selectedImageIndex + 1
                        )
                      }
                      className="btn btn-circle"
                    >
                      ❯
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* deskripsi */}
      <div className="bg-secondary/65 shadow-2xl px-5 py-5 rounded-2xl">
        <h2 className="text-xl font-semibold mb-2">Deskripsi</h2>
        <div
          className="prose prose-sm max-w-none text-white"
          dangerouslySetInnerHTML={{ __html: sanitizedHTML }}
        />
      </div>

      {/* Fasilitas */}
      <div className='bg-secondary/65 shadow-2xl px-5 py-5 rounded-2xl'>
        <h2 className="text-xl font-semibold">Fasilitas</h2>
        <div className="flex flex-wrap gap-2">
					{Object.entries(property.facilities[0])
						.filter(([key]) => typeof property.facilities[0][key] === 'boolean' && property.facilities[0][key])
						.map(([key]) => (
							<span key={key} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
								{key.replace(/_/g, ' ')}
							</span>
						))}
        </div>
      </div>

      {/* Ketersediaan */}
      <div className='bg-secondary/65 shadow-2xl px-5 py-5 rounded-2xl'>
        <h2 className="text-xl font-semibold">Ketersediaan</h2>
        {property.availability.map((a) => (
          <p key={a.id}>
            Tersedia dari <strong>{new Date(a.available_from).toLocaleDateString()}</strong> hingga{' '}
            <strong>{new Date(a.available_to).toLocaleDateString()}</strong>
          </p>
        ))}
      </div>

      {/* Harga */}
      <div className='bg-secondary/65 shadow-2xl px-5 py-5 rounded-2xl'>
        <h2 className="text-xl font-semibold">Harga</h2>
        <p className="">number of bedrooms: {property.number_of_bedrooms}</p>
        <p className="">number of bathrooms: {property.number_of_bathrooms}</p>
        <p className="">minimum stay: {property.minimum_stay}</p>
        <p className="">price: {property.price}</p>
        <p className="">monthly price: {property.monthly_price}</p>
        <p className="">yearly price: {property.yearly_price}</p>
      </div>

      {/* Pemilik */}
      <div className='bg-secondary/65 shadow-2xl px-5 py-5 rounded-2xl'>
        <h2 className="text-xl font-semibold">Pemilik Properti</h2>
        {property.propertiesOwner.map((owner) => (
          <div key={owner.id}>
            <p>Nama: {owner.fullname}</p>
            <p>Phone: {owner.phone}</p>
            <p>Email: {owner.email}</p>
          </div>
        ))}
      </div>

      {/* Lokasi */}
      {/* <div className='bg-secondary/65 shadow-2xl px-5 py-5 rounded-2xl'>
        <h2 className="text-xl font-semibold">Lokasi</h2>
        {property.location.map((loc) => (
          <div key={loc.id}>
            <p>{loc.general_area}</p>
            <a href={loc.map_url} className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">
              Lihat di Google Maps
            </a>
          </div>
        ))}
      </div> */}
    </div>
  );
}

export default LandingPageDetailProperty;
