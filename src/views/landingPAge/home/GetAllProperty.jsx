import React, { useState, useEffect, useRef, memo } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
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
  Award
} from 'lucide-react';

import LoginModal from '../../../../src/views/auth/LoginModal';
import RegisterModal from '../../../../src/views/auth/RegisterModal';
import api from '../../../service/api.js';
import PropertyFilter from './PropertyFilter.jsx';
import { useLanguage } from '../../../context/LanguageContext';
import { useCurrency } from '../../../context/CurrencyContext';
import { translateNodes } from '../../../utils/translator';
import { LoadingSkeleton } from './allPropertyComponent/LoadingSkeleton.jsx';
import { PropertyCard } from './allPropertyComponent/PropertyCard.jsx';

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
  const [itemsPerPage] = useState(6);
  const [paginationInfo, setPaginationInfo] = useState({
    currentPage: 1,
    itemsPerPage: 6,
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
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(
          `${baseUrl}/property?page=${currentPage}&limit=${itemsPerPage}`
        );
        const props = response.data.data?.properties || [];
        setProperties(props);
        setTotalData(response.data.totalData || 0);
        setFilteredProperties(props);
        // Use backend pagination info if available, else fallback
        setPaginationInfo({
          currentPage: response.data.data?.pagination?.currentPage || currentPage,
          itemsPerPage: response.data.data?.pagination?.itemsPerPage || itemsPerPage,
          totalItems: response.data.data?.pagination?.totalItems || response.data.totalData || props.length,
          totalPages: response.data.data?.pagination?.totalPages || Math.ceil((response.data.totalData || props.length) / itemsPerPage),
          hasNextPage: response.data.data?.pagination?.hasNextPage ?? (currentPage < Math.ceil((response.data.totalData || props.length) / itemsPerPage)),
          hasPreviousPage: response.data.data?.pagination?.hasPreviousPage ?? (currentPage > 1),
        });
        const initialIndexes = {};
        props.forEach((property) => {
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
    // eslint-disable-next-line
  }, [currentPage, itemsPerPage]);

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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
              {filteredProperties.map((property) => {
                const currentIndex = carouselIndexes[property.id] || 0;
                const isFavorite = favorites.has(property.id);
                const handlePrevClick = (e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setCarouselIndexes((prev) => ({
                    ...prev,
                    [property.id]: prev[property.id] === 0 ? property.images.length - 1 : prev[property.id] - 1,
                  }));
                };
                const handleNextClick = (e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setCarouselIndexes((prev) => ({
                    ...prev,
                    [property.id]: (prev[property.id] + 1) % property.images.length,
                  }));
                };
                const handleFavoriteClick = (e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  toggleFavorite(property.id, e);
                };
                return (
                  <PropertyCard
                    key={property.id}
                    property={property}
                    currentIndex={currentIndex}
                    isFavorite={isFavorite}
                    onPrev={handlePrevClick}
                    onNext={handleNextClick}
                    onFavorite={handleFavoriteClick}
                    priceView={priceView}
                    setPriceView={setPriceView}
                    getCurrencySymbol={getCurrencySymbol}
                    convertPrice={convertPrice}
                    currency={currency}
                    exchangeRates={exchangeRates}
                  />
                );
              })}
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
                      {(() => {
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
                          pages.push(
                            <button
                              key={i}
                              onClick={() => setCurrentPage(i)}
                              className={`btn btn-sm btn-square ${currentPage === i ? 'btn-primary' : 'btn-ghost'}`}
                            >
                              {i}
                            </button>
                          );
                        }
                        return pages;
                      })()}
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