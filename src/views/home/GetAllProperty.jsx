import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import location from '../../assets/svg/location.svg';
import bedroom from '../../assets/svg/bedroom.svg';
import guest from '../../assets/svg/guest.svg';
import calender from '../../assets/svg/calender.svg';
import duration from '../../assets/svg/duration.svg';
import love from '../../assets/svg/love.svg';
import LoginModal from '../../../src/views/auth/LoginModal';
import RegisterModal from '../../../src/views/auth/RegisterModal';
import api from '../../service/api.js';
import PropertyFilter from './PropertyFilter.jsx'; 
const baseUrl = api.defaults.baseURL;

function GetAllProperty() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalData, setTotalData] = useState(0);
  const [carouselIndexes, setCarouselIndexes] = useState({});
  const [ setIsMenuOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [priceView, setPriceView] = useState('monthly');
  const [filteredProperties, setFilteredProperties] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${baseUrl}/property`);
        setProperties(response.data.data);
        setTotalData(response.data.totalData);
        setFilteredProperties(response.data.data); // Set all data as default

        // Initialize carousel index for each property
        const initialIndexes = {};
        response.data.data.forEach((property) => {
          initialIndexes[property.id] = 0;
        });
        setCarouselIndexes(initialIndexes);

      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handlePrev = (propertyId, totalImages) => {
    setCarouselIndexes((prevIndexes) => ({
      ...prevIndexes,
      [propertyId]:
        prevIndexes[propertyId] === 0
          ? totalImages - 1
          : prevIndexes[propertyId] - 1,
    }));
  };

  const handleNext = (propertyId, totalImages) => {
    setCarouselIndexes((prevIndexes) => ({
      ...prevIndexes,
      [propertyId]: (prevIndexes[propertyId] + 1) % totalImages,
    }));
  };

    const handleOpenLogin = () => {
        setIsRegisterModalOpen(false);
        setIsLoginModalOpen(true);
    };

    const handleOpenRegister = () => {
        setIsLoginModalOpen(false);
        setIsRegisterModalOpen(true);
    };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="mt-4 text-primary">Loading</p>
        </div>
      </div>
    );

  if (error)
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
            <span>{error}</span>
          </div>
        </div>
      </div>
    );

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-accent mb-2">
          Property List ({totalData} properties)
        </h1>
        <p className="text-gray-600">Discover our amazing properties</p>
      </div>

      <div className='mb-10'>
        <PropertyFilter properties={properties} onFilter={setFilteredProperties} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* {properties.map((property) => { */}
        {filteredProperties.map((property) => {
          const currentIndex = carouselIndexes[property.id] || 0;

          return (
            <div key={property.id} className="bg-white/90 backdrop-blur-2xl rounded-3xl shadow-2xl overflow-hidden">
              {/* Carousel */}
							<div className="relative w-full h-64 overflow-hidden">
								<div className="flex transition-transform duration-700 ease-in-out h-full" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
									{property.images.map((image) => (
                    <img key={image.id} src={`${baseUrl}/propertyImages/${image.imageName}`} alt={image.imageName} className="w-full h-64 object-cover flex-shrink-0" />
									))}
								</div>

                <button 
                  onClick={() => {
                      setIsLoginModalOpen(true);
                      setIsMenuOpen(false);
                    }}
                  >
                  <img src={love} className="absolute top-3 right-3 w-7 h-7 px-1 py-1 rounded-full backdrop-blur-lg bg-accent/20 hover:bg-accent/50 shadow-2xl" />
                </button>

								{/* Navigation Buttons */}
								<div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between z-10">
									<button
										onClick={() => handlePrev(property.id, property.images.length)}
										className="btn btn-circle backdrop-blur-xs bg-accent/70 hover:bg-accent/50"
									>
										❮
									</button>
									<button
										onClick={() => handleNext(property.id, property.images.length)}
										className="btn btn-circle backdrop-blur-xs bg-accent/70 hover:bg-accent/50"
									>
										❯
									</button>
								</div>
							</div>

              {/* Property Info */}
              <div className="p-4">
                <h2 className="text-xl font-bold mb-2 text-primary">{property.property_tittle}</h2>
								<hr className="border-t-2 border-accent pr-10" />

                <div className="flex items-center justify-between mb-4">
                  <div className='mt-5'>

                    <div className="flex items-center gap-3 mb-2">
											<img src={location} alt="Location" className='w-5 h-5' />
                      <p className="text-primary font-bold">{property.location[0]?.general_area}</p>
										</div>

										<div className="flex items-center gap-3 mb-2">
											<img src={bedroom} alt="Location" className='w-5 h-5' />
                      <p className="text-primary font-bold">{property.number_of_bedrooms} kamar tidur</p>
										</div>

										<div className="flex items-center gap-3 mb-2">
											<img src={guest} alt="Location" className='w-5 h-5' />
                      <p className="text-primary font-bold">Max Guests: {property.maximum_guest}</p>
										</div>

                    <div className="flex items-center gap-3 mb-2">
                      <img src={calender} alt="Location" className='w-5 h-5' />
                      <p className="text-primary font-bold">
                        Tersedia dari: {new Date(property.availability[0]?.available_from).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 mb-2">
                      <img src={duration} alt="Location" className='w-5 h-5' />
                      <p className="text-primary font-bold">Masa tinggal minimum {property.minimum_stay} bulan</p>
                    </div>

                  </div>
                </div>

                <div className="flex flex-row md:flex-row lg:justify-between items-center md:items-center md:justify-center gap-4 text-800 p-4 bg-secondary/65 rounded-2xl shadow-2xl">
                  {/* Price Display */}
                  <div className="px- md:w-auto border-2 border-accent p-4 flex gap-2 rounded-lg items-center shadow-lg justify-start">
                    <p className="md:text-xl text-sm font-bold text-primary">
                      ${priceView === 'monthly' ? property.monthly_price : property.yearly_price} mil
                    </p>
                    <p className="md:text-xl text-sm font-bold text-primary">
                      / {priceView === 'monthly' ? 'Bulan' : 'Tahun'}
                    </p>
                  </div>

                  {/* Toggle Button */}
                  <div className="md:w-auto flex justify-start md:justify-end">
                    <div className="shadow-lg">
                      <button
                        onClick={() => setPriceView('monthly')}
                        className={`px-2 py-1 rounded-l-lg border border-accent ${
                          priceView === 'monthly' ? 'bg-accent text-white' : 'bg-white text-accent'
                        }`}
                      >
                        Bulan
                      </button>
                      <button
                        onClick={() => setPriceView('yearly')}
                        className={`px-2 py-1 rounded-r-lg border border-accent ${
                          priceView === 'yearly' ? 'bg-accent text-white' : 'bg-white text-accent'
                        }`}
                      >
                        Tahun
                      </button>
                    </div>
                  </div>
                </div>

								<div className='flex justify-end text-accent mt-5'>
									<Link to={`/detail/${property.id}`} className="font-bold">
                  <div className='flex gap-3'>
                    <p>Detail</p>
                    <p>❯</p>
                  </div>
									</Link>
								</div>
              </div>
            </div>
          );
        })}
      </div>
      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
        onRegisterClick={handleOpenRegister}
        />

      <RegisterModal 
        isOpen={isRegisterModalOpen} 
        onClose={() => setIsRegisterModalOpen(false)}
        onLoginClick={handleOpenLogin}
      />

    </div>
  );
}

export default GetAllProperty;
