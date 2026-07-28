import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { Link } from 'react-router-dom';
import {
  Heart,
  MapPin,
  Bed,
  Bath,
  Clock,
  Eye,
  ChevronLeft,
  ChevronRight,
  Loader2,
  AlertCircle,
  Building
} from 'lucide-react';
import { useLanguage } from '../../../../context/LanguageContext';
import { useCurrency } from '../../../../context/CurrencyContext';
import api from '../../../../service/api.js';

const baseUrl = api.defaults.baseURL;

const GetSavedProperty = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [carouselIndexes, setCarouselIndexes] = useState({});
  const [priceView, setPriceView] = useState('monthly');
  const token = Cookies.get('token');

  const { currency, exchangeRates, convertPrice, getCurrencySymbol } = useCurrency();

  const fetchSavedProperties = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${baseUrl}/favorite-properties`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = response.data?.data || response.data || [];
      const propList = Array.isArray(data) ? data : [];
      setProperties(propList);

      const initialIndexes = {};
      propList.forEach((prop) => {
        initialIndexes[prop.id] = 0;
      });
      setCarouselIndexes(initialIndexes);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to load saved properties');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFavorite = async (propertyId, e) => {
    if (e) e.stopPropagation();
    try {
      await axios.post(
        `${baseUrl}/favorite-properties/${propertyId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Remove from list immediately for responsive UI
      setProperties((prev) => prev.filter((p) => p.id !== propertyId));
    } catch (err) {
      console.error('Failed to remove favorite:', err);
    }
  };

  useEffect(() => {
    if (!token) {
      setError('Authentication required. Please login first.');
      setLoading(false);
      return;
    }
    fetchSavedProperties();
  }, []);

  const handlePrev = (propertyId, totalImages, e) => {
    if (e) e.stopPropagation();
    setCarouselIndexes((prev) => ({
      ...prev,
      [propertyId]: prev[propertyId] === 0 ? totalImages - 1 : prev[propertyId] - 1,
    }));
  };

  const handleNext = (propertyId, totalImages, e) => {
    if (e) e.stopPropagation();
    setCarouselIndexes((prev) => ({
      ...prev,
      [propertyId]: (prev[propertyId] + 1) % totalImages,
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-base-100 to-base-200 py-12 px-4 flex justify-center items-center">
        <div className="text-center space-y-3">
          <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto" />
          <p className="text-sm font-medium text-base-content/70">Loading saved properties...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-base-100 to-base-200 py-12 px-4 flex justify-center items-center">
        <div className="bg-base-100 rounded-2xl border border-error/30 p-8 text-center max-w-md shadow-xl space-y-4">
          <div className="w-14 h-14 bg-error/10 text-error rounded-full flex items-center justify-center mx-auto">
            <AlertCircle className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-error">Failed to Load Saved Properties</h3>
            <p className="text-base-content/70 text-sm mt-1">{error}</p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="btn btn-primary gap-2 shadow-md"
          >
            <Loader2 className="w-4 h-4" />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-base-100 to-base-200 py-8 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="bg-base-100 p-6 md:p-8 rounded-2xl border border-base-300 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3.5 bg-error/10 text-error rounded-2xl">
              <Heart className="w-8 h-8 fill-current" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-base-content flex items-center gap-2">
                Saved Properties
              </h1>
              <p className="text-base-content/70 text-xs sm:text-sm mt-0.5">
                Properties you have bookmarked for easy access
              </p>
            </div>
          </div>
          <div className="px-4 py-2 bg-base-200 rounded-xl border border-base-300 text-xs font-semibold text-base-content/70 self-start md:self-auto">
            Total Saved: <span className="text-primary font-bold text-sm">{properties.length}</span>
          </div>
        </div>

        {/* Empty State */}
        {properties.length === 0 ? (
          <div className="bg-base-100 rounded-2xl border border-base-300 p-12 text-center space-y-4 max-w-md mx-auto shadow-sm">
            <div className="w-16 h-16 bg-error/10 text-error rounded-full flex items-center justify-center mx-auto">
              <Heart className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-base-content">No Saved Properties Yet</h3>
              <p className="text-xs sm:text-sm text-base-content/60 mt-1">
                Explore our properties and click the heart icon to save your favorites here.
              </p>
            </div>
            <Link to="/user/all/property" className="btn btn-primary gap-2 shadow-md">
              <Building className="w-4 h-4" />
              <span>Explore Properties</span>
            </Link>
          </div>
        ) : (
          /* Grid of Saved Properties */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => {
              const images = property.images || [];
              const currentIndex = carouselIndexes[property.id] || 0;

              return (
                <div
                  key={property.id}
                  className="group bg-base-100 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-base-300 hover:border-primary/40 flex flex-col"
                >
                  {/* Image Carousel */}
                  <div className="relative h-60 overflow-hidden bg-base-200">
                    {images.length > 0 ? (
                      <div
                        className="flex h-full transition-transform duration-500 ease-out"
                        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                      >
                        {images.map((img) => (
                          <div key={img.id} className="w-full flex-shrink-0 relative h-full">
                            <img
                              src={`${baseUrl}/propertyImages/${img.imageName}`}
                              alt={img.imageName}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-base-content/40">
                        <Building className="w-10 h-10" />
                      </div>
                    )}

                    {/* Unlike Heart Button */}
                    <button
                      onClick={(e) => handleToggleFavorite(property.id, e)}
                      className="absolute top-3 right-3 p-2 bg-error/90 hover:bg-error text-white rounded-full shadow-lg backdrop-blur-md transition-all hover:scale-110 z-20"
                      title="Remove from saved"
                    >
                      <Heart className="w-4 h-4 fill-current text-white" />
                    </button>

                    {/* Carousel Nav Arrows */}
                    {images.length > 1 && (
                      <>
                        <button
                          onClick={(e) => handlePrev(property.id, images.length, e)}
                          className="absolute left-3 top-1/2 -translate-y-1/2 z-20 p-2 bg-black/40 backdrop-blur-sm rounded-full hover:bg-black/60 transition-all opacity-0 group-hover:opacity-100 text-white"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => handleNext(property.id, images.length, e)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 z-20 p-2 bg-black/40 backdrop-blur-sm rounded-full hover:bg-black/60 transition-all opacity-0 group-hover:opacity-100 text-white"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>

                  {/* Property Details */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h3 className="font-bold text-base md:text-lg text-base-content truncate">
                          {property.property_tittle || property.property_code || 'Property'}
                        </h3>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-base-content/70">
                        <MapPin className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                        <span className="truncate">
                          {property.location?.[0]?.general_area || 'Bali'}
                        </span>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-2 text-xs py-2 border-y border-base-200">
                      <div className="flex items-center gap-1.5 text-base-content/80 font-medium">
                        <Bed className="w-4 h-4 text-primary" />
                        <span>{property.number_of_bedrooms || 0} Beds</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-base-content/80 font-medium">
                        <Bath className="w-4 h-4 text-secondary" />
                        <span>{property.number_of_bathrooms || 0} Baths</span>
                      </div>
                    </div>

                    {/* Pricing */}
                    <div className="space-y-3 pt-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-lg font-extrabold text-primary">
                            {getCurrencySymbol()}
                            {convertPrice(
                              priceView === 'monthly' ? property.monthly_price : property.yearly_price,
                              currency,
                              exchangeRates
                            ).toLocaleString()}
                          </div>
                          <div className="text-[11px] text-base-content/60 font-light">
                            {priceView === 'monthly' ? '/ month' : '/ year'}
                          </div>
                        </div>

                        {/* Price Toggle */}
                        <div className="flex bg-base-200 rounded-lg p-0.5 border border-base-300">
                          <button
                            onClick={() => setPriceView('monthly')}
                            className={`px-2 py-1 rounded-md text-[11px] font-semibold transition-all ${priceView === 'monthly'
                              ? 'bg-primary text-white shadow-xs'
                              : 'text-base-content/70 hover:text-base-content'
                              }`}
                          >
                            Monthly
                          </button>
                          <button
                            onClick={() => setPriceView('yearly')}
                            className={`px-2 py-1 rounded-md text-[11px] font-semibold transition-all ${priceView === 'yearly'
                              ? 'bg-primary text-white shadow-xs'
                              : 'text-base-content/70 hover:text-base-content'
                              }`}
                          >
                            Yearly
                          </button>
                        </div>
                      </div>

                      {/* Action Button */}
                      <Link
                        to={`/detail/${property.id}`}
                        className="btn btn-primary btn-sm w-full rounded-xl gap-2 font-bold shadow-sm"
                      >
                        <Eye className="w-4 h-4" />
                        <span>View Detail</span>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default GetSavedProperty;
