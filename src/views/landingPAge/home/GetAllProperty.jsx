import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import axios from 'axios';
import {
  ChevronLeft,
  ChevronRight,
  Home,
  Filter,
  Search,
  Loader2,
  AlertCircle,
  ChevronLast,
  ChevronFirst,
  Award,
  X
} from 'lucide-react';

import LoginModal from '../../../../src/views/auth/LoginModal';
import RegisterModal from '../../../../src/views/auth/RegisterModal';
import api from '../../../service/api.js';
import { useLanguage } from '../../../context/LanguageContext';
import { useCurrency } from '../../../context/CurrencyContext';
import { translateNodes } from '../../../utils/translator';
import { LoadingSkeleton } from './allPropertyComponent/LoadingSkeleton.jsx';
import { PropertyCard } from './allPropertyComponent/PropertyCard.jsx';

const baseUrl = api.defaults.baseURL;

function GetAllProperty({ bannerFilters, onClearFilters }) {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalData, setTotalData] = useState(0);
  const [carouselIndexes, setCarouselIndexes] = useState({});
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [favorites, setFavorites] = useState(new Set());

  // Language & Currency Context
  const { lang } = useLanguage();
  const { currency } = useCurrency();

  const [paginationInfo, setPaginationInfo] = useState({
    currentPage: 1,
    itemsPerPage: 6,
    totalItems: 0,
    totalPages: 1,
    hasNextPage: false,
    hasPreviousPage: false,
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const divRef = useRef(null);

  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`${baseUrl}/property`, {
          params: { page: currentPage, limit: itemsPerPage },
        });

        if (response.data && response.data.data) {
          const propertiesData = response.data.data.properties || response.data.data;
          const pagination = response.data.data.pagination;

          setProperties(propertiesData);
          setTotalData(pagination ? pagination.totalItems : propertiesData.length);

          if (pagination) {
            setPaginationInfo(pagination);
          }
        }
      } catch (err) {
        console.error('Error fetching properties:', err);
        setError(err.response?.data?.message || 'Failed to load properties. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [currentPage]);

  // Translate content on language change
  useEffect(() => {
    if (divRef.current) {
      translateNodes(divRef.current, lang);
    }
  }, [lang, properties, loading]);

  // Filter properties based on Banner Filters
  const filteredProperties = useMemo(() => {
    if (!bannerFilters) return properties;
    const { searchLocation, propertyType, priceRange } = bannerFilters;

    if (!searchLocation && !propertyType && !priceRange) {
      return properties;
    }

    return properties.filter((p) => {
      // 1. Search Location / Title
      if (searchLocation) {
        const query = searchLocation.toLowerCase().trim();
        const titleMatch = p.property_tittle?.toLowerCase().includes(query);
        const locMatch = Array.isArray(p.location)
          ? p.location.some((l) => l.general_area?.toLowerCase().includes(query))
          : p.location?.general_area?.toLowerCase().includes(query);
        if (!titleMatch && !locMatch) return false;
      }

      // 2. Property Type
      if (propertyType) {
        const pType = p.type_id || p.property_type || '';
        if (pType !== propertyType) return false;
      }

      // 3. Price Range
      if (priceRange) {
        const price = p.price || p.monthly_price || 0;
        if (priceRange === 'under_100k' && price > 100000000) return false;
        if (priceRange === '100k_500k' && (price <= 100000000 || price > 500000000)) return false;
        if (priceRange === '500k_1m' && (price <= 500000000 || price > 1000000000)) return false;
        if (priceRange === 'above_1m' && price <= 1000000000) return false;
      }

      return true;
    });
  }, [properties, bannerFilters]);

  const hasActiveFilters = Boolean(
    bannerFilters?.searchLocation || bannerFilters?.propertyType || bannerFilters?.priceRange
  );

  const toggleFavorite = useCallback((propertyId) => {
    setFavorites((prev) => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(propertyId)) {
        newFavorites.delete(propertyId);
      } else {
        newFavorites.add(propertyId);
      }
      return newFavorites;
    });
  }, []);

  const handlePrevImage = useCallback((propertyId, imagesLength, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setCarouselIndexes((prev) => ({
      ...prev,
      [propertyId]: prev[propertyId] === 0 ? imagesLength - 1 : (prev[propertyId] || 0) - 1,
    }));
  }, []);

  const handleNextImage = useCallback((propertyId, imagesLength, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setCarouselIndexes((prev) => ({
      ...prev,
      [propertyId]: ((prev[propertyId] || 0) + 1) % imagesLength,
    }));
  }, []);

  const pageNumbers = useMemo(() => {
    const pages = [];
    const total = paginationInfo.totalPages;
    let start = 1;
    let end = total;

    if (total > 5) {
      if (currentPage <= 3) {
        start = 1;
        end = 5;
      } else if (currentPage >= total - 2) {
        start = total - 4;
        end = total;
      } else {
        start = currentPage - 2;
        end = currentPage + 2;
      }
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  }, [currentPage, paginationInfo.totalPages]);

  const handlePageChange = useCallback((page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 400, behavior: 'smooth' });
  }, []);

  if (loading) {
    return <LoadingSkeleton divRef={divRef} />;
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen p-4">
        <div className="text-center space-y-4 max-w-md bg-base-100 p-8 rounded-2xl border border-base-300 shadow-xl">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-error/10 text-error">
            <AlertCircle className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-error">Failed to Load Properties</h3>
            <p className="text-sm text-base-content/70">{error}</p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="btn btn-primary gap-2 rounded-xl text-white w-full"
          >
            <Loader2 className="w-4 h-4" />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div id="all-properties-section" ref={divRef} className="min-h-screen bg-gradient-to-b from-base-100 to-base-200">
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <div className="p-2.5 bg-primary/10 rounded-2xl text-primary">
                  <Home className="w-7 h-7" />
                </div>
                <h1 className="text-3xl md:text-4xl font-extrabold text-base-content tracking-tight">
                  Discover Amazing Properties
                </h1>
              </div>
              <p className="text-sm text-base-content/70">
                Browse our curated collection of premium properties
              </p>
            </div>

            <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full border border-primary/20 self-start md:self-auto">
              <Award className="w-5 h-5 text-primary" />
              <span className="font-bold text-primary text-sm">
                {totalData} Properties Available
              </span>
            </div>
          </div>

          {/* Active Banner Filter Bar */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-base-100 rounded-2xl border border-primary/20 shadow-sm">
              <div className="flex items-center gap-2 text-xs font-semibold text-base-content">
                <Filter className="w-4 h-4 text-primary" />
                <span>Active Search Filters Applied</span>
              </div>
              <button
                type="button"
                onClick={onClearFilters}
                className="btn btn-ghost btn-xs text-error gap-1 hover:bg-error/10 rounded-lg"
              >
                <X className="w-3.5 h-3.5" />
                <span>Clear Filters</span>
              </button>
            </div>
          )}
        </div>

        {/* Properties Grid */}
        {filteredProperties.length === 0 ? (
          <div className="bg-base-100 rounded-2xl border border-base-300 p-12 text-center space-y-4 shadow-sm">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-warning/10 text-warning">
              <Search className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-base-content">No Properties Found</h3>
            <p className="text-sm text-base-content/70 max-w-sm mx-auto">
              Try adjusting your search criteria in the banner or clearing active filters.
            </p>
            {hasActiveFilters && (
              <button
                onClick={onClearFilters}
                className="btn btn-outline gap-2 rounded-xl"
              >
                <X className="w-4 h-4" />
                Clear Active Filters
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProperties.map((property) => {
                const currentIndex = carouselIndexes[property.id] || 0;
                const isFavorite = favorites.has(property.id);
                const imagesCount = property.images?.length || 0;

                return (
                  <PropertyCard
                    key={property.id}
                    property={property}
                    currentIndex={currentIndex}
                    isFavorite={isFavorite}
                    imagesCount={imagesCount}
                    currency={currency}
                    baseUrl={baseUrl}
                    onToggleFavorite={toggleFavorite}
                    onPrevImage={handlePrevImage}
                    onNextImage={handleNextImage}
                    onRequireAuth={() => setIsLoginModalOpen(true)}
                  />
                );
              })}
            </div>

            {/* Pagination */}
            {paginationInfo.totalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-base-300">
                <div className="text-xs text-base-content/70">
                  Showing Page <span className="font-bold text-base-content">{paginationInfo.currentPage}</span> of{' '}
                  <span className="font-bold text-base-content">{paginationInfo.totalPages}</span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handlePageChange(1)}
                    disabled={currentPage === 1}
                    className="btn btn-circle btn-sm btn-ghost disabled:opacity-30"
                    title="First Page"
                  >
                    <ChevronFirst className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={!paginationInfo.hasPreviousPage}
                    className="btn btn-circle btn-sm btn-ghost disabled:opacity-30"
                    title="Previous Page"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  <div className="flex items-center gap-1 mx-1">
                    {pageNumbers.map((pageNum) => (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`btn btn-sm btn-circle text-xs font-semibold ${currentPage === pageNum
                            ? 'btn-primary text-white shadow-md'
                            : 'btn-ghost text-base-content/70 hover:bg-base-200'
                          }`}
                      >
                        {pageNum}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={!paginationInfo.hasNextPage}
                    className="btn btn-circle btn-sm btn-ghost disabled:opacity-30"
                    title="Next Page"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handlePageChange(paginationInfo.totalPages)}
                    disabled={currentPage === paginationInfo.totalPages}
                    className="btn btn-circle btn-sm btn-ghost disabled:opacity-30"
                    title="Last Page"
                  >
                    <ChevronLast className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Auth Modals */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onRegisterClick={() => {
          setIsLoginModalOpen(false);
          setIsRegisterModalOpen(true);
        }}
      />

      <RegisterModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        onLoginClick={() => {
          setIsRegisterModalOpen(false);
          setIsLoginModalOpen(true);
        }}
      />
    </div>
  );
}

export default GetAllProperty;