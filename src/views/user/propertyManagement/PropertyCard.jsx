import React from 'react';
import { Link } from 'react-router-dom';
import {
  MapPin,
  Bed,
  Bath,
  CheckCircle,
  XCircle,
  MoreVertical,
  Edit,
  ShieldOff,
  Shield,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Star,
  Eye,
  Clock
} from 'lucide-react';

const PropertyCard = ({
  property,
  baseUrl,
  carouselIndexes,
  handlePrev,
  handleNext,
  setActivePropertyMenu,
  activePropertyMenu,
  setPropertyToToggle,
  DeleteData,
  priceView,
  setPriceView,
  getCurrencySymbol,
  convertPrice,
  currency,
  exchangeRates
}) => {
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
        {/* <div className="absolute top-4 left-4 z-20">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${property.is_active
              ? 'bg-success/90 text-success-content'
              : 'bg-error/90 text-error-content'
            }`}>
            {property.is_active ? (
              <><CheckCircle className="w-3 h-3 inline mr-1" />Active</>
            ) : (
              <><XCircle className="w-3 h-3 inline mr-1" />Inactive</>
            )}
          </span>
        </div> */}

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
                    <><ShieldOff className="w-4 h-4" /><span>Make Public</span></>
                  ) : (
                    <><Shield className="w-4 h-4" /><span>Make Private</span></>
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

export default PropertyCard;
