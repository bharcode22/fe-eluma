import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import Api from '../../../service/api.js';
import { useLanguage } from "../../../context/LanguageContext.jsx";
import { translateNodes } from "../../../utils/translator.js";
import { useCurrency } from "../../../context/CurrencyContext.jsx";
import NavbarUsers from "../../../components/NavbarUser.jsx";
import Calender from "../../../assets/svg/calender.svg";
import Bedroom from "../../../assets/svg/bedroom.svg";
import Duration from "../../../assets/svg/duration.svg";
import Add from "../../../assets/svg/add.svg";

function LandingPageDetailProperty() {
  const { id } = useParams();
  const baseUrl = Api.defaults.baseURL;
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sanitizedHTML, setSanitizedHTML] = useState('');
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);

  const divRef = useRef(null);
  const { lang } = useLanguage();
  const { currency, exchangeRates, convertPrice, getCurrencySymbol } = useCurrency();

  useEffect(() => {
    if (divRef.current) {
      translateNodes(divRef.current, lang);
    }
  }, [lang]);

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
    <div ref={divRef} className="p-6 max-w-5xl mx-auto space-y-6">
      {/* <NavbarUsers /> */}

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
        <div className="space-y-3 mt-3">
          {property.availability.map((a) => (
            <div key={a.id} className="flex items-center gap-2 p-3 bg-secondary/80 rounded-lg shadow-md">
              <img src={Calender} alt="calendar icon" className="w-6 h-6 text-primary" />
              <p className="text-lg">
                Tersedia dari <strong className="text-primary">{new Date(a.available_from).toLocaleDateString()}</strong> hingga{' '}
                <strong className="text-primary">{new Date(a.available_to).toLocaleDateString()}</strong>
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Harga */}
      <div className='bg-secondary/65 shadow-2xl px-5 py-5 rounded-2xl'>
        <h2 className="text-xl font-semibold">Harga</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
          <div className="flex items-center gap-2 p-3 bg-secondary/80 rounded-lg shadow-md">
            <img src={Bedroom} alt="bedroom icon" className="w-6 h-6 text-primary" />
            <p className="text-lg">number of bedrooms: <strong className="text-primary">{property.number_of_bedrooms}</strong></p>
          </div>
          <div className="flex items-center gap-2 p-3 bg-secondary/80 rounded-lg shadow-md">
            <img src={Bedroom} alt="bathroom icon" className="w-6 h-6 text-primary" />
            <p className="text-lg">number of bathrooms: <strong className="text-primary">{property.number_of_bathrooms}</strong></p>
          </div>
          <div className="flex items-center gap-2 p-3 bg-secondary/80 rounded-lg shadow-md">
            <img src={Duration} alt="minimum stay icon" className="w-6 h-6 text-primary" />
            <p className="text-lg">minimum stay: <strong className="text-primary">{property.minimum_stay}</strong></p>
          </div>
        </div>
        <div className="mt-5 space-y-2">
          <p className="text-2xl font-bold text-primary">price: {getCurrencySymbol()}{convertPrice(property.price, currency, exchangeRates)}</p>
          <p className="text-xl text-primary">monthly price: {getCurrencySymbol()}{convertPrice(property.monthly_price, currency, exchangeRates)}</p>
          <p className="text-xl text-primary">yearly price: {getCurrencySymbol()}{convertPrice(property.yearly_price, currency, exchangeRates)}</p>
        </div>
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

      {/* Additional Details */}
      <div className='bg-secondary/65 shadow-2xl px-5 py-5 rounded-2xl'>
        <h2 className="text-xl font-semibold">Detail Tambahan</h2>
        {property.additionalDetails.map((detail) => (
          <div key={detail.id} className="space-y-2 mt-3">
            {detail.allow_path && (
              <div className="flex items-center gap-2 p-3 bg-secondary/80 rounded-lg shadow-md">
                <img src={Add} alt="pet icon" className="w-6 h-6 text-primary" />
                <p className="text-lg">Izinkan Hewan Peliharaan</p>
              </div>
            )}
            {detail.construction_nearby && (
              <div className="flex items-center gap-2 p-3 bg-secondary/80 rounded-lg shadow-md">
                <img src={Add} alt="construction icon" className="w-6 h-6 text-primary" />
                <p className="text-lg">Konstruksi di Dekatnya</p>
              </div>
            )}
            {detail.cleaning_requency && (
              <div className="flex items-center gap-2 p-3 bg-secondary/80 rounded-lg shadow-md">
                <img src={Add} alt="cleaning icon" className="w-6 h-6 text-primary" />
                <p className="text-lg">Frekuensi Pembersihan: <strong className="text-primary">{detail.cleaning_requency}</strong></p>
              </div>
            )}
            {detail.linen_chaneg && (
              <div className="flex items-center gap-2 p-3 bg-secondary/80 rounded-lg shadow-md">
                <img src={Add} alt="linen change icon" className="w-6 h-6 text-primary" />
                <p className="text-lg">Penggantian Linen: <strong className="text-primary">{detail.linen_chaneg}</strong></p>
              </div>
            )}

            {/* Parking Details */}
            {detail.parking && (
              <div className="p-3 bg-secondary/80 rounded-lg shadow-md">
                <h3 className="font-semibold mt-2 flex items-center gap-2">
                  <img src={Add} alt="parking icon" className="w-6 h-6 text-primary" />
                  Parkir:
                </h3>
                <div className="ml-8 space-y-1">
                  {detail.parking.car_parking && <p className="text-lg">Parkir Mobil</p>}
                  {detail.parking.bike_parking && <p className="text-lg">Parkir Motor</p>}
                  {detail.parking.both_car_and_bike && <p className="text-lg">Parkir Mobil & Motor</p>}
                </div>
              </div>
            )}

            {/* View Details */}
            {detail.view && (
              <div className="p-3 bg-secondary/80 rounded-lg shadow-md">
                <h3 className="font-semibold mt-2 flex items-center gap-2">
                  <img src={Add} alt="view icon" className="w-6 h-6 text-primary" />
                  Pemandangan:
                </h3>
                <div className="ml-8 space-y-1">
                  {detail.view.ocean_view && <p className="text-lg">Pemandangan Laut</p>}
                  {detail.view.sunset_view && <p className="text-lg">Pemandangan Matahari Terbenam</p>}
                  {detail.view.garden_view && <p className="text-lg">Pemandangan Taman</p>}
                  {detail.view.beach_view && <p className="text-lg">Pemandangan Pantai</p>}
                  {detail.view.jungle_view && <p className="text-lg">Pemandangan Hutan</p>}
                  {detail.view.montain_view && <p className="text-lg">Pemandangan Gunung</p>}
                  {detail.view.pool_view && <p className="text-lg">Pemandangan Kolam Renang</p>}
                  {detail.view.rice_field && <p className="text-lg">Pemandangan Sawah</p>}
                  {detail.view.sunrise_view && <p className="text-lg">Pemandangan Matahari Terbit</p>}
                  {detail.view.volcano_view && <p className="text-lg">Pemandangan Gunung Berapi</p>}
                </div>
              </div>
            )}
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
