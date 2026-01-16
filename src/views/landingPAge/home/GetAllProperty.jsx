import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import {
  MapPin,
  Bed,
  Users,
  Calendar,
  Clock,
  Heart,
  ChevronLeft,
  ChevronRight,
  Home,
  DollarSign,
  Star,
  Filter,
  Search,
  Eye,
  Bath,
  Maximize2,
  Wifi,
  Car,
  Snowflake,
  Tv,
  Waves,
  Coffee,
  Loader2,
  AlertCircle,
  ChevronLast,
  ChevronFirst,
  Sparkles,
  CalendarDays,
  Building2,
  Award
} from 'lucide-react';
import LoginModal from '../../../../src/views/auth/LoginModal';
import RegisterModal from '../../../../src/views/auth/RegisterModal';
import api from '../../../service/api.js';
import PropertyFilter from './PropertyFilter.jsx';
import { useLanguage } from '../../../context/LanguageContext';
import { useCurrency } from '../../../context/CurrencyContext';
import { translateNodes } from '../../../utils/translator';

const baseUrl = api.defaults.baseURL;

function GetAllProperty() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalData, setTotalData] = useState(0);
  const [carouselIndexes, setCarouselIndexes] = useState({});
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [priceView, setPriceView] = useState('monthly');
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);
  const [paginationInfo, setPaginationInfo] = useState({
    currentPage: 1,
    itemsPerPage: 12,
    totalItems: 0,
    totalPages: 1,
    hasNextPage: false,
    hasPreviousPage: false,
  });
  const [favorites, setFavorites] = useState(new Set());

  const divRef = useRef(null);
  const { lang } = useLanguage();
  const { currency, exchangeRates, convertPrice, getCurrencySymbol } = useCurrency();

  useEffect(() => {
    if (divRef.current) {
      translateNodes(divRef.current, lang);
    }
  }, [lang]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${baseUrl}/property?page=${currentPage}&limit=${itemsPerPage}`
        );
        setProperties(response.data.data.properties);
        setTotalData(response.data.totalData);
        setFilteredProperties(response.data.data.properties);
        setPaginationInfo(response.data.data.pagination);

        const initialIndexes = {};
        response.data.data.properties.forEach((property) => {
          initialIndexes[property.id] = 0;
        });
        setCarouselIndexes(initialIndexes);
      } catch (error) {
        setError(error.message || 'Failed to fetch properties');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentPage, itemsPerPage]);

  const handlePrev = (propertyId, totalImages, e) => {
    e.stopPropagation();
    setCarouselIndexes((prevIndexes) => ({
      ...prevIndexes,
      [propertyId]:
        prevIndexes[propertyId] === 0
          ? totalImages - 1
          : prevIndexes[propertyId] - 1,
    }));
  };

  const handleNext = (propertyId, totalImages, e) => {
    e.stopPropagation();
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

  const toggleFavorite = (propertyId, e) => {
    e.preventDefault();
    e.stopPropagation();
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(propertyId)) {
        newFavorites.delete(propertyId);
      } else {
        newFavorites.add(propertyId);
        setIsLoginModalOpen(true); // Prompt login if not logged in
      }
      return newFavorites;
    });
  };

  const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="bg-base-100 rounded-2xl shadow-lg overflow-hidden animate-pulse">
          <div className="h-64 bg-base-300" />
          <div className="p-6 space-y-4">
            <div className="h-4 bg-base-300 rounded w-3/4" />
            <div className="h-4 bg-base-300 rounded w-1/2" />
            <div className="space-y-2">
              <div className="h-3 bg-base-300 rounded" />
              <div className="h-3 bg-base-300 rounded" />
            </div>
            <div className="h-10 bg-base-300 rounded" />
          </div>
        </div>
      ))}
    </div>
  );

  const PropertyCard = ({ property }) => {
    const currentIndex = carouselIndexes[property.id] || 0;
    const isFavorite = favorites.has(property.id);

    const propertyFacilities = property.facilities?.[0] || {};
    const facilityIcons = {
      wifi: Wifi,
      parking: Car,
      ac: Snowflake,
      tv: Tv,
      pool: Waves,
      kitchen: Coffee,
    };

    const activeFacilities = Object.entries(propertyFacilities)
      .filter(([key, value]) => value && facilityIcons[key])
      .slice(0, 4);

    return (
      <Link
        to={`/detail/${property.id}`}
        className="group bg-gradient-to-b from-base-100 to-base-200 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-base-300 hover:border-primary/30 hover:-translate-y-1"
      >
        {/* Image Carousel */}
        <div className="relative h-64 overflow-hidden">
          <div
            className="flex h-full transition-transform duration-500 ease-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {property.images.map((image) => (
              <div key={image.id} className="w-full flex-shrink-0 relative">
                <img
                  src={`${baseUrl}/propertyImages/${image.imageName}`}
                  alt={image.imageName}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
              </div>
            ))}
          </div>

          {/* Favorite Button */}
          <button
            onClick={(e) => toggleFavorite(property.id, e)}
            className="absolute top-4 right-4 z-20 p-2 bg-black/40 backdrop-blur-sm rounded-full hover:bg-black/60 transition-colors"
          >
            <Heart
              className={`w-5 h-5 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-white'}`}
            />
          </button>

          {/* Image Counter */}
          {property.images.length > 1 && (
            <div className="absolute bottom-4 left-4 z-20 px-3 py-1 bg-black/60 backdrop-blur-sm rounded-full text-white text-sm">
              {currentIndex + 1} / {property.images.length}
            </div>
          )}

          {/* Carousel Navigation */}
          {property.images.length > 1 && (
            <>
              <button
                onClick={(e) => handlePrev(property.id, property.images.length, e)}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 bg-black/40 backdrop-blur-sm rounded-full hover:bg-black/60 transition-all opacity-0 group-hover:opacity-100"
              >
                <ChevronLeft className="w-5 h-5 text-white" />
              </button>
              <button
                onClick={(e) => handleNext(property.id, property.images.length, e)}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 bg-black/40 backdrop-blur-sm rounded-full hover:bg-black/60 transition-all opacity-0 group-hover:opacity-100"
              >
                <ChevronRight className="w-5 h-5 text-white" />
              </button>
            </>
          )}

          {/* Property Type Badge */}
          <div className="absolute top-4 left-4 z-20">
            <span className="px-3 py-1 bg-primary/90 backdrop-blur-sm text-white text-sm font-medium rounded-full">
              {property.property_type || 'Property'}
            </span>
          </div>
        </div>

        {/* Property Info */}
        <div className="p-6 space-y-4">
          {/* Header */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-bold text-base-content truncate">
                {property.property_code}
              </h3>
              {property.is_featured && (
                <Sparkles className="w-5 h-5 text-warning" />
              )}
            </div>
            <div className="flex items-center gap-2 text-sm text-base-content/60">
              <MapPin className="w-4 h-4" />
              <span className="truncate">
                {property.location[0]?.general_area || 'Location not specified'}
              </span>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Bed className="w-4 h-4 text-primary" />
              </div>
              <div>
                <div className="text-sm font-medium text-base-content">
                  {property.number_of_bedrooms}
                </div>
                <div className="text-xs text-base-content/50">Bedrooms</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="p-2 bg-secondary/10 rounded-lg">
                <Bath className="w-4 h-4 text-secondary" />
              </div>
              <div>
                <div className="text-sm font-medium text-base-content">
                  {property.number_of_bathrooms || '-'}
                </div>
                <div className="text-xs text-base-content/50">Bathrooms</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="p-2 bg-accent/10 rounded-lg">
                <Users className="w-4 h-4 text-accent" />
              </div>
              <div>
                <div className="text-sm font-medium text-base-content">
                  {property.maximum_guest || '-'}
                </div>
                <div className="text-xs text-base-content/50">Max Guests</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="p-2 bg-info/10 rounded-lg">
                <Maximize2 className="w-4 h-4 text-info" />
              </div>
              <div>
                <div className="text-sm font-medium text-base-content">
                  {property.size || '-'}
                </div>
                <div className="text-xs text-base-content/50">m²</div>
              </div>
            </div>
          </div>

          {/* Facilities Icons */}
          {activeFacilities.length > 0 && (
            <div className="flex gap-2 pt-2 border-t border-base-300">
              {activeFacilities.map(([key]) => {
                const Icon = facilityIcons[key];
                return Icon ? (
                  <div
                    key={key}
                    className="p-2 bg-base-300/50 rounded-lg tooltip"
                    data-tip={key.replace(/_/g, ' ')}
                  >
                    <Icon className="w-4 h-4 text-base-content/70" />
                  </div>
                ) : null;
              })}
            </div>
          )}

          {/* Price Section */}
          <div className="pt-4 border-t border-base-300">
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm font-medium text-base-content/60">
                {priceView === 'monthly' ? 'Monthly Rate' : 'Annual Rate'}
              </div>
              <div className="flex bg-base-300 rounded-lg p-1">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    setPriceView('monthly');
                  }}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${priceView === 'monthly'
                    ? 'bg-primary text-primary-content'
                    : 'text-base-content/70 hover:text-base-content'
                    }`}
                >
                  Monthly
                </button>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    setPriceView('yearly');
                  }}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${priceView === 'yearly'
                    ? 'bg-primary text-primary-content'
                    : 'text-base-content/70 hover:text-base-content'
                    }`}
                >
                  Yearly
                </button>
              </div>
            </div>
            <div className="flex items-end justify-between">
              <div>
                <div className="text-2xl font-bold text-primary">
                  {getCurrencySymbol()}
                  {convertPrice(
                    priceView === 'monthly'
                      ? property.monthly_price
                      : property.yearly_price,
                    currency,
                    exchangeRates
                  ).toLocaleString()}
                </div>
                <div className="text-sm text-base-content/50">
                  {priceView === 'monthly' ? 'per month' : 'per year'}
                </div>
              </div>
              <div className="text-right">
                {property.minimum_stay && (
                  <div className="flex items-center gap-1 text-sm text-base-content/60">
                    <Clock className="w-4 h-4" />
                    <span>Min. {property.minimum_stay} months</span>
                  </div>
                )}
                <div className="flex items-center gap-1 text-sm text-base-content/60 mt-1">
                  <CalendarDays className="w-4 h-4" />
                  <span>
                    {property.availability?.[0]
                      ? new Date(property.availability[0].available_from).toLocaleDateString()
                      : 'Check availability'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* View Details Button */}
          <div className="pt-4 border-t border-base-300">
            <button className="w-full btn btn-outline btn-primary gap-2 group-hover:btn-primary group-hover:text-primary-content">
              <Eye className="w-4 h-4" />
              View Details
            </button>
          </div>
        </div>
      </Link>
    );
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <LoadingSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center space-y-4 max-w-md">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-error/10">
            <AlertCircle className="w-8 h-8 text-error" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-error">Failed to Load Properties</h3>
            <p className="text-base-content/70">{error}</p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="btn btn-primary gap-2"
          >
            <Loader2 className="w-4 h-4" />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div ref={divRef} className="min-h-screen bg-gradient-to-b from-base-100 to-base-200">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Home className="w-8 h-8 text-primary" />
                <h1 className="text-3xl md:text-4xl font-bold text-base-content">
                  Discover Amazing Properties
                </h1>
              </div>
              <p className="text-base-content/70">
                Browse our curated collection of premium properties
              </p>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full">
              <Award className="w-5 h-5 text-primary" />
              <span className="font-semibold text-primary">
                {totalData} Properties Available
              </span>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="mb-8">
            <PropertyFilter properties={properties} onFilter={setFilteredProperties} />
          </div>
        </div>

        {/* Properties Grid */}
        {filteredProperties.length === 0 ? (
          <div className="text-center py-16 space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-warning/10">
              <Search className="w-8 h-8 text-warning" />
            </div>
            <h3 className="text-xl font-semibold text-base-content">No Properties Found</h3>
            <p className="text-base-content/70">
              Try adjusting your filters or search criteria
            </p>
            <button
              onClick={() => setFilteredProperties(properties)}
              className="btn btn-outline gap-2"
            >
              <Filter className="w-4 h-4" />
              Clear All Filters
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>

            {/* Pagination */}
            {paginationInfo.totalPages > 1 && (
              <div className="mt-12 pt-8 border-t border-base-300">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-sm text-base-content/70">
                    Showing {((currentPage - 1) * itemsPerPage) + 1} to{' '}
                    {Math.min(currentPage * itemsPerPage, totalData)} of {totalData} properties
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCurrentPage(1)}
                      disabled={currentPage === 1}
                      className="btn btn-square btn-sm btn-ghost disabled:opacity-50"
                    >
                      <ChevronFirst className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={!paginationInfo.hasPreviousPage}
                      className="btn btn-sm btn-ghost gap-2 disabled:opacity-50"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Previous
                    </button>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: Math.min(5, paginationInfo.totalPages) }, (_, i) => {
                        let pageNum;
                        if (paginationInfo.totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (currentPage <= 3) {
                          pageNum = i + 1;
                        } else if (currentPage >= paginationInfo.totalPages - 2) {
                          pageNum = paginationInfo.totalPages - 4 + i;
                        } else {
                          pageNum = currentPage - 2 + i;
                        }
                        return (
                          <button
                            key={pageNum}
                            onClick={() => setCurrentPage(pageNum)}
                            className={`btn btn-sm btn-square ${currentPage === pageNum
                              ? 'btn-primary'
                              : 'btn-ghost'
                              }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                    </div>
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, paginationInfo.totalPages))}
                      disabled={!paginationInfo.hasNextPage}
                      className="btn btn-sm btn-ghost gap-2 disabled:opacity-50"
                    >
                      Next
                      <ChevronRight className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setCurrentPage(paginationInfo.totalPages)}
                      disabled={currentPage === paginationInfo.totalPages}
                      className="btn btn-square btn-sm btn-ghost disabled:opacity-50"
                    >
                      <ChevronLast className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modals */}
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