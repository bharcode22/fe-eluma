import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
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
  Award
} from 'lucide-react';

import Cookies from 'js-cookie';
import api from '../../../../service/api.js';
import UserBanner from './components/UserBanner.jsx';
import { useLanguage } from '../../../../context/LanguageContext';
import { useCurrency } from '../../../../context/CurrencyContext';
import { translateNodes } from '../../../../utils/translator';
import { LoadingSkeleton } from './allPropertyComponent/LoadingSkeleton.jsx';
import { PropertyCard } from './allPropertyComponent/PropertyCard.jsx';

const baseUrl = api.defaults.baseURL;

function GetAllPropertyByUsers() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalData, setTotalData] = useState(0);
  const [carouselIndexes, setCarouselIndexes] = useState({});
  const [priceView, setPriceView] = useState('monthly');
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

  const [userFilters, setUserFilters] = useState({
    searchLocation: '',
    propertyType: '',
    priceRange: ''
  });

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
        const token = Cookies.get('token');
        const [propertyRes, favRes] = await Promise.allSettled([
          axios.get(`${baseUrl}/property?page=${currentPage}&limit=${itemsPerPage}`),
          token
            ? axios.get(`${baseUrl}/favorite-properties`, {
              headers: { Authorization: `Bearer ${token}` },
            })
            : Promise.resolve(null),
        ]);

        if (propertyRes.status === 'fulfilled') {
          const response = propertyRes.value;
          const props = response.data.data?.properties || [];
          setProperties(props);
          setTotalData(response.data.totalData || 0);

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
        } else {
          throw propertyRes.reason;
        }

        if (favRes.status === 'fulfilled' && favRes.value) {
          const favData = favRes.value.data?.data || favRes.value.data || [];
          const favSet = new Set((Array.isArray(favData) ? favData : []).map((item) => item.id));
          setFavorites(favSet);
        }
      } catch (error) {
        setError(error.message || 'Failed to fetch properties');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [currentPage, itemsPerPage]);

  // Compute filtered properties
  const filteredProperties = useMemo(() => {
    if (!userFilters) return properties;
    const { searchLocation, propertyType, priceRange } = userFilters;

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
  }, [properties, userFilters]);

  const toggleFavorite = useCallback(async (propertyId, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const token = Cookies.get('token');
    if (!token) return;

    setFavorites((prev) => {
      const newFavs = new Set(prev);
      if (newFavs.has(propertyId)) {
        newFavs.delete(propertyId);
      } else {
        newFavs.add(propertyId);
      }
      return newFavs;
    });

    try {
      await axios.post(
        `${baseUrl}/favorite-properties/${propertyId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      console.error('Failed to toggle favorite:', err);
      // Revert state if request fails
      setFavorites((prev) => {
        const newFavs = new Set(prev);
        if (newFavs.has(propertyId)) {
          newFavs.delete(propertyId);
        } else {
          newFavs.add(propertyId);
        }
        return newFavs;
      });
    }
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
    window.scrollTo({ top: 300, behavior: 'smooth' });
  }, []);

  if (loading) {
    return <LoadingSkeleton divRef={divRef} />;
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[60vh] p-4">
        <div className="text-center space-y-4 max-w-md bg-base-100 p-8 rounded-3xl border border-base-300 shadow-xl">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-error/10 text-error">
            <AlertCircle className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-error">Failed to Load Catalog</h3>
            <p className="text-sm text-base-content/70">{error}</p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="btn btn-primary gap-2 rounded-xl text-white w-full"
          >
            <Loader2 className="w-4 h-4 animate-spin" />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div ref={divRef} className="min-h-screen bg-gradient-to-b from-base-100 to-base-200 py-6">
      <div className="container mx-auto px-4 space-y-6">

        {/* Dedicated User Hero Banner */}
        <UserBanner
          filters={userFilters}
          setFilters={setUserFilters}
          onClearFilters={() => setUserFilters({ searchLocation: '', propertyType: '', priceRange: '' })}
        />

        {/* Properties Header Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-base-100 p-6 rounded-2xl border border-base-300 shadow-sm">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <Home className="w-6 h-6 text-primary" />
              <h2 className="text-xl font-bold text-base-content flex items-center gap-2">
                <span>Available Property Catalog</span>
                <span className="badge badge-primary font-bold text-xs">
                  {properties.length} Items
                </span>
              </h2>
            </div>
            <p className="text-xs text-base-content/70">
              Showing <span className="font-bold text-base-content">{filteredProperties.length}</span> of <span className="font-bold text-primary">{totalData || properties.length}</span> total verified properties from backend database
            </p>
          </div>

          <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full border border-primary/20 self-start md:self-auto">
            <Award className="w-4 h-4 text-primary" />
            <span className="font-bold text-primary text-xs">
              {totalData || properties.length} Total Properties Available
            </span>
          </div>
        </div>

        {/* Properties Grid */}
        {filteredProperties.length === 0 ? (
          <div className="bg-base-100 rounded-3xl border border-base-300 p-12 text-center space-y-4 shadow-sm">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-warning/10 text-warning">
              <Search className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-base-content">No Properties Found</h3>
            <p className="text-sm text-base-content/70 max-w-sm mx-auto">
              Try adjusting your search criteria in the banner or clearing active filters.
            </p>
            <button
              onClick={() => setUserFilters({ searchLocation: '', propertyType: '', priceRange: '' })}
              className="btn btn-outline gap-2 rounded-xl"
            >
              <Filter className="w-4 h-4" />
              Reset All Filters
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProperties.map((property) => {
                const currentIndex = carouselIndexes[property.id] || 0;
                const isFavorite = favorites.has(property.id);

                const handlePrevClick = (e) => {
                  if (e) {
                    e.preventDefault();
                    e.stopPropagation();
                  }
                  setCarouselIndexes((prev) => ({
                    ...prev,
                    [property.id]: prev[property.id] === 0 ? (property.images?.length || 1) - 1 : prev[property.id] - 1,
                  }));
                };

                const handleNextClick = (e) => {
                  if (e) {
                    e.preventDefault();
                    e.stopPropagation();
                  }
                  setCarouselIndexes((prev) => ({
                    ...prev,
                    [property.id]: ((prev[property.id] || 0) + 1) % (property.images?.length || 1),
                  }));
                };

                return (
                  <PropertyCard
                    key={property.id}
                    property={property}
                    currentIndex={currentIndex}
                    isFavorite={isFavorite}
                    onPrev={handlePrevClick}
                    onNext={handleNextClick}
                    onFavorite={(e) => toggleFavorite(property.id, e)}
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
    </div>
  );
}

export default GetAllPropertyByUsers;