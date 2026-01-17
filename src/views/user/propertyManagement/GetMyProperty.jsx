import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { Link, useNavigate } from 'react-router-dom';
import {
  MapPin,
  Bed,
  Users,
  Calendar,
  Clock,
  Home,
  DollarSign,
  Eye,
  Edit,
  Trash2,
  Shield,
  ShieldOff,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Loader2,
  Search,
  Plus,
  Filter,
  TrendingUp,
  Building2,
  Bath,
  Maximize2,
  Star,
  Sparkles,
  Package,
  Info,
  AlertCircle,
  CalendarDays,
  Check,
  X,
  MoreHorizontal
} from 'lucide-react';
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
  const [filter, setFilter] = useState('all'); // all, active, inactive
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

  const fetchData = async () => {
    try {
      const response = await axios.get(`${baseUrl}/property/my/property`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProperties(response.data.data || []);

      const initialIndexes = {};
      response.data.data.forEach((property) => {
        initialIndexes[property.id] = 0;
      });
      setCarouselIndexes(initialIndexes);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
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

    fetchData();
  }, []);

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

  const filteredProperties = properties.filter(property => {
    if (filter === 'active') return property.is_active === true;
    if (filter === 'inactive') return property.is_active === false;
    return true;
  });

  const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
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

    return (
      <div className="group bg-gradient-to-b from-base-100 to-base-200 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-base-300 hover:border-primary/30">
        {/* Header with Status */}
        <div className="relative h-64 overflow-hidden">
          {/* Carousel */}
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

          {/* Status Badge */}
          <div className="absolute top-4 left-4 z-20">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${property.is_active
                ? 'bg-success/90 text-success-content'
                : 'bg-error/90 text-error-content'
              }`}>
              {property.is_active ? (
                <>
                  <CheckCircle className="w-3 h-3 inline mr-1" />
                  Active
                </>
              ) : (
                <>
                  <XCircle className="w-3 h-3 inline mr-1" />
                  Inactive
                </>
              )}
            </span>
          </div>

          {/* Property Menu */}
          <div className="absolute top-4 right-4 z-20">
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActivePropertyMenu(activePropertyMenu === property.id ? null : property.id);
                }}
                className="p-2 bg-black/40 backdrop-blur-sm rounded-full hover:bg-black/60 transition-colors"
              >
                <MoreVertical className="w-5 h-5 text-white" />
              </button>

              {activePropertyMenu === property.id && (
                <div className="absolute right-0 top-full mt-1 w-48 bg-base-100 border border-base-300 rounded-lg shadow-xl z-50">
                  <Link
                    to={`/user/update/property/${property.id}`}
                    className="flex items-center gap-2 px-4 py-3 hover:bg-base-200 transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Edit className="w-4 h-4" />
                    <span>Edit Property</span>
                  </Link>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setPropertyToToggle(property.id);
                      setActivePropertyMenu(null);
                    }}
                    className="flex items-center gap-2 w-full px-4 py-3 text-left hover:bg-base-200 transition-colors"
                  >
                    {property.is_private ? (
                      <>
                        <ShieldOff className="w-4 h-4" />
                        <span>Make Public</span>
                      </>
                    ) : (
                      <>
                        <Shield className="w-4 h-4" />
                        <span>Make Private</span>
                      </>
                    )}
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      DeleteData(property.id);
                      setActivePropertyMenu(null);
                    }}
                    className="flex items-center gap-2 w-full px-4 py-3 text-left hover:bg-error/10 text-error transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete Property</span>
                  </button>
                </div>
              )}
            </div>
          </div>

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

          {/* Image Counter */}
          {property.images.length > 1 && (
            <div className="absolute bottom-4 left-4 z-20 px-3 py-1 bg-black/60 backdrop-blur-sm rounded-full text-white text-xs">
              {currentIndex + 1} / {property.images.length}
            </div>
          )}
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
                <Star className="w-5 h-5 text-warning fill-current" />
              )}
            </div>
            <div className="flex items-center gap-2 text-sm text-base-content/60">
              <MapPin className="w-4 h-4" />
              <span className="truncate">
                {property.location?.[0]?.general_area || 'Location not specified'}
              </span>
            </div>
          </div>

          {/* Stats */}
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
          </div>

          {/* Price Section */}
          <div className="pt-4 border-t border-base-300">
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm font-medium text-base-content/60">
                {priceView === 'monthly' ? 'Monthly Rate' : 'Annual Rate'}
              </div>
              <div className="flex bg-base-300 rounded-lg p-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
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
                    e.stopPropagation();
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
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-base-300">
            <div className="flex gap-3">
              <Link
                to={`/detail/${property.id}`}
                className="flex-1 btn btn-outline btn-primary gap-2 hover:btn-primary hover:text-primary-content transition-all"
              >
                <Eye className="w-4 h-4" />
                View Details
              </Link>
              <Link
                to={`/user/update/property/${property.id}`}
                className="btn btn-outline gap-2"
              >
                <Edit className="w-4 h-4" />
                Edit
              </Link>
            </div>
          </div>
        </div>
      </div>
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
              <div className="bg-base-100 rounded-xl p-4 border border-base-300">
                <div className="text-2xl font-bold text-warning">
                  {properties.filter(p => p.is_featured).length}
                </div>
                <div className="text-sm text-base-content/70">Featured</div>
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex bg-base-300 rounded-lg p-1">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${filter === 'all'
                    ? 'bg-primary text-primary-content'
                    : 'text-base-content/70 hover:text-base-content'
                  }`}
              >
                All Properties
              </button>
              <button
                onClick={() => setFilter('active')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${filter === 'active'
                    ? 'bg-primary text-primary-content'
                    : 'text-base-content/70 hover:text-base-content'
                  }`}
              >
                Public
              </button>
              <button
                onClick={() => setFilter('inactive')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${filter === 'inactive'
                    ? 'bg-primary text-primary-content'
                    : 'text-base-content/70 hover:text-base-content'
                  }`}
              >
                Private
              </button>
            </div>
          </div>
        </div>

        {/* Properties Grid */}
        {filteredProperties.length === 0 ? (
          <div className="text-center py-16 space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-info/10">
              <Home className="w-8 h-8 text-info" />
            </div>
            <h3 className="text-xl font-semibold text-base-content">No Properties Found</h3>
            <p className="text-base-content/70">
              {filter === 'all'
                ? "You haven't listed any properties yet."
                : `No ${filter} properties found.`
              }
            </p>
            <button
              onClick={handleAddProperty}
              className="btn btn-primary gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Your First Property
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
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