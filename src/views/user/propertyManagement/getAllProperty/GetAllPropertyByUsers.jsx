import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import api from '../../../../service/api.js';

import UserBanner from './components/UserBanner.jsx';
import { useLanguage } from '../../../../context/LanguageContext';
import { useCurrency } from '../../../../context/CurrencyContext';
import { translateNodes } from '../../../../utils/translator';

import { LoadingSkeleton } from './allPropertyComponent/LoadingSkeleton.jsx';
import { PropertyCard } from './allPropertyComponent/PropertyCard.jsx';
import { CatalogHeader } from './allPropertyComponent/CatalogHeader.jsx';
import { EmptyCatalogState } from './allPropertyComponent/EmptyCatalogState.jsx';
import { CatalogPagination } from './allPropertyComponent/CatalogPagination.jsx';
import { CatalogErrorState } from './allPropertyComponent/CatalogErrorState.jsx';

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
    } catch (err) {
      setError(err?.message || 'Failed to fetch properties');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentPage, itemsPerPage]);

  // Compute filtered properties
  const filteredProperties = useMemo(() => {
    if (!userFilters) return properties;
    const { searchLocation, propertyType, priceRange } = userFilters;

    return properties.filter((p) => {
      // 1. Search Location (Checks location general_area, title, description)
      if (searchLocation) {
        const term = searchLocation.toLowerCase();
        const area = (p.location?.[0]?.general_area || '').toLowerCase();
        const title = (p.property_tittle || '').toLowerCase();
        const code = (p.property_code || '').toLowerCase();
        if (!area.includes(term) && !title.includes(term) && !code.includes(term)) {
          return false;
        }
      }

      // 2. Property Type
      if (propertyType) {
        const typeName = (p.property_type || '').toLowerCase();
        const typeId = p.type_id || '';
        if (typeName !== propertyType.toLowerCase() && typeId !== propertyType) {
          return false;
        }
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

  // Toggle Favorite Action
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
      // Revert state on failure
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

  const handleResetFilters = () => {
    setUserFilters({ searchLocation: '', propertyType: '', priceRange: '' });
  };

  if (loading) {
    return <LoadingSkeleton divRef={divRef} />;
  }

  if (error) {
    return <CatalogErrorState error={error} onRetry={fetchData} />;
  }

  return (
    <div ref={divRef} className="min-h-screen bg-gradient-to-b from-base-100 to-base-200 py-6">
      <div className="container mx-auto px-4 space-y-6">

        {/* Dedicated User Hero Banner */}
        <UserBanner
          filters={userFilters}
          setFilters={setUserFilters}
          onClearFilters={handleResetFilters}
        />

        {/* Properties Header Bar */}
        <CatalogHeader
          propertiesCount={properties.length}
          filteredCount={filteredProperties.length}
          totalData={totalData}
        />

        {/* Properties Grid */}
        {filteredProperties.length === 0 ? (
          <EmptyCatalogState onResetFilters={handleResetFilters} />
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

            {/* Pagination Component */}
            <CatalogPagination
              paginationInfo={paginationInfo}
              currentPage={currentPage}
              pageNumbers={pageNumbers}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </div>
    </div>
  );
}

export default GetAllPropertyByUsers;