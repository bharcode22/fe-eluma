import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { Link, useNavigate } from 'react-router-dom';
import { Home, Plus, Package, AlertTriangle, Shield, Loader2, X, Trash2, Check, AlertCircle } from 'lucide-react';
import PropertyCard from './PropertyCard';
import LoadingSkeleton from './LoadingSkeleton';
import PropertyFilterTabs from './PropertyFilterTabs';
import PublicProperties from './PublicProperties';
import PrivateProperties from './PrivateProperties';
import LikedProperties from './LikedProperties';
import { useLanguage } from "../../../context/LanguageContext.jsx";
import { useCurrency } from "../../../context/CurrencyContext.jsx";
import { translateNodes } from "../../../utils/translator.js";
import api from '../../../service/api.js';

const baseUrl = api.defaults.baseURL;

const GetMyProperty = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [carouselIndexes, setCarouselIndexes] = useState({});
  const [priceView, setPriceView] = useState('monthly');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [propertyToDelete, setPropertyToDelete] = useState(null);
  const [propertyToToggle, setPropertyToToggle] = useState(null);
  const [activePropertyMenu, setActivePropertyMenu] = useState(null);
  const [filter, setFilter] = useState('public');
  const navigate = useNavigate();
  
  const token = Cookies.get('token');
  const divRef = useRef(null);
  const { lang } = useLanguage();
  const { currency, exchangeRates, convertPrice, getCurrencySymbol } = useCurrency();

  useEffect(() => {
    if (divRef.current) {
      translateNodes(divRef.current, lang);
    }
  }, [lang]);

  const fetchData = async (selectedFilter = filter) => {
    setLoading(true);
    setError(null);
    let url = '';
    if (selectedFilter === 'all' || selectedFilter === 'public') {
      url = `${baseUrl}/property/my/property`;
    } else if (selectedFilter === 'private') {
      url = `${baseUrl}/property/my/private`;
    } else if (selectedFilter === 'liked') {
      url = `${baseUrl}/favorite-properties`;
    }
    try {
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Untuk endpoint favorite-properties, data bisa di response.data.data atau response.data
      const data = response.data.data || response.data || [];
      setProperties(Array.isArray(data) ? data : []);
      const initialIndexes = {};
      (Array.isArray(data) ? data : []).forEach((property) => {
        initialIndexes[property.id] = 0;
      });
      setCarouselIndexes(initialIndexes);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      setProperties([]);
    } finally {
      setLoading(false);
    }
  };

  const DeleteData = (propertyId) => {
    setPropertyToDelete(propertyId);
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await axios.delete(`${baseUrl}/property/${propertyToDelete}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchData();
      setShowDeleteConfirm(false);
      setPropertyToDelete(null);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      setShowDeleteConfirm(false);
      setPropertyToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
    setPropertyToDelete(null);
  };

  const ToglePropertyStatus = async (propertyId) => {
    try {
      await axios.put(
        `${baseUrl}/property/status/${propertyId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchData();
      setPropertyToToggle(null);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      setPropertyToToggle(null);
    }
  };

  useEffect(() => {
    if (!token) {
      setError('Authentication required. Please login first.');
      setLoading(false);
      return;
    }
    fetchData(filter);
    // eslint-disable-next-line
  }, [filter]);

  const handlePrev = (propertyId, totalImages, e) => {
    e.stopPropagation();
    setCarouselIndexes((prevIndexes) => ({
      ...prevIndexes,
      [propertyId]: prevIndexes[propertyId] === 0
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

  const handleAddProperty = () => {
    navigate('/user/add/property');
  };

  const filteredProperties = properties;

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
      {/* Header: Selalu tampil */}
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Package className="w-8 h-8 text-primary" />
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-base-content">
                    My Properties
                  </h1>
                  <p className="text-base-content/70">
                    Manage all your listed properties
                  </p>
                </div>
              </div>
            </div>
            <button
              onClick={handleAddProperty}
              className="btn btn-primary gap-2 shadow-lg hover:shadow-xl"
            >
              <Plus className="w-4 h-4" />
              Add New Property
            </button>
          </div>

          {/* Stats and Filters */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-base-100 rounded-xl p-4 border border-base-300">
                <div className="text-2xl font-bold text-primary">{properties.length}</div>
                <div className="text-sm text-base-content/70">Total Properties</div>
              </div>
              <div className="bg-base-100 rounded-xl p-4 border border-base-300">
                <div className="text-2xl font-bold text-success">
                  {properties.filter(p => p.is_active).length}
                </div>
                <div className="text-sm text-base-content/70">Active</div>
              </div>
              <div className="bg-base-100 rounded-xl p-4 border border-base-300">
                <div className="text-2xl font-bold text-error">
                  {properties.filter(p => !p.is_active).length}
                </div>
                <div className="text-sm text-base-content/70">Inactive</div>
              </div>
            </div>

            {/* Filter Tabs */}
            <PropertyFilterTabs filter={filter} setFilter={setFilter} />
          </div>
        </div>
      </div>

      {/* Grid dan modal property */}
      <div className="container mx-auto px-4 py-8">
        {/* Properties Grid Modular */}
        {filter === 'public' && (
          <PublicProperties
            properties={filteredProperties}
            baseUrl={baseUrl}
            carouselIndexes={carouselIndexes}
            handlePrev={handlePrev}
            handleNext={handleNext}
            setActivePropertyMenu={setActivePropertyMenu}
            activePropertyMenu={activePropertyMenu}
            setPropertyToToggle={setPropertyToToggle}
            DeleteData={DeleteData}
            priceView={priceView}
            setPriceView={setPriceView}
            getCurrencySymbol={getCurrencySymbol}
            convertPrice={convertPrice}
            currency={currency}
            exchangeRates={exchangeRates}
            handleAddProperty={handleAddProperty}
            Home={Home}
            Plus={Plus}
          />
        )}
        {filter === 'private' && (
          <PrivateProperties
            properties={filteredProperties}
            baseUrl={baseUrl}
            carouselIndexes={carouselIndexes}
            handlePrev={handlePrev}
            handleNext={handleNext}
            setActivePropertyMenu={setActivePropertyMenu}
            activePropertyMenu={activePropertyMenu}
            setPropertyToToggle={setPropertyToToggle}
            DeleteData={DeleteData}
            priceView={priceView}
            setPriceView={setPriceView}
            getCurrencySymbol={getCurrencySymbol}
            convertPrice={convertPrice}
            currency={currency}
            exchangeRates={exchangeRates}
            handleAddProperty={handleAddProperty}
            Home={Home}
            Plus={Plus}
          />
        )}
        {filter === 'liked' && (
          <LikedProperties
            properties={filteredProperties}
            baseUrl={baseUrl}
            carouselIndexes={carouselIndexes}
            handlePrev={handlePrev}
            handleNext={handleNext}
            setActivePropertyMenu={setActivePropertyMenu}
            activePropertyMenu={activePropertyMenu}
            setPropertyToToggle={setPropertyToToggle}
            DeleteData={DeleteData}
            priceView={priceView}
            setPriceView={setPriceView}
            getCurrencySymbol={getCurrencySymbol}
            convertPrice={convertPrice}
            currency={currency}
            exchangeRates={exchangeRates}
            handleAddProperty={handleAddProperty}
            Home={Home}
            Plus={Plus}
          />
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
              onClick={handleCancelDelete}
            />
            <div className="relative w-full max-w-md bg-gradient-to-b from-base-100 to-base-200 rounded-2xl shadow-2xl overflow-hidden border border-base-300">
              <div className="p-6">
                <div className="text-center space-y-4">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-error/10">
                    <AlertTriangle className="w-8 h-8 text-error" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-base-content">Delete Property</h3>
                    <p className="text-base-content/70 mt-2">
                      Are you sure you want to delete this property? This action cannot be undone.
                    </p>
                  </div>
                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={handleCancelDelete}
                      className="btn btn-outline flex-1 gap-2"
                    >
                      <X className="w-4 h-4" />
                      Cancel
                    </button>
                    <button
                      onClick={handleConfirmDelete}
                      className="btn btn-error flex-1 gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Toggle Status Modal */}
        {propertyToToggle && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
              onClick={() => setPropertyToToggle(null)}
            />
            <div className="relative w-full max-w-md bg-gradient-to-b from-base-100 to-base-200 rounded-2xl shadow-2xl overflow-hidden border border-base-300">
              <div className="p-6">
                <div className="text-center space-y-4">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-warning/10">
                    <Shield className="w-8 h-8 text-warning" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-base-content">Change Privacy Status</h3>
                    <p className="text-base-content/70 mt-2">
                      Do you want to make this property {properties.find(p => p.id === propertyToToggle)?.is_private ? 'public' : 'private'}?
                    </p>
                  </div>
                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={() => setPropertyToToggle(null)}
                      className="btn btn-outline flex-1 gap-2"
                    >
                      <X className="w-4 h-4" />
                      Cancel
                    </button>
                    <button
                      onClick={() => ToglePropertyStatus(propertyToToggle)}
                      className="btn btn-warning flex-1 gap-2"
                    >
                      <Check className="w-4 h-4" />
                      Confirm
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GetMyProperty;