import React, { memo } from 'react';
import {
  MapPin,
  Bed,
  Bath,
  Users,
  Maximize2,
  Wifi,
  Car,
  Snowflake,
  Tv,
  Waves,
  Coffee,
  Clock,
  CalendarDays,
  Eye,
  Sparkles,
} from 'lucide-react';

const PropertyInfo = memo(({ property, priceView, setPriceView, getCurrencySymbol, convertPrice, currency, exchangeRates }) => {
  const facilityIcons = {
    wifi: Wifi,
    parking: Car,
    ac: Snowflake,
    tv: Tv,
    pool: Waves,
    kitchen: Coffee,
  };
  const propertyFacilities = property.facilities?.[0] || {};
  const activeFacilities = Object.entries(propertyFacilities)
    .filter(([key, value]) => value && facilityIcons[key])
    .slice(0, 4);
  return (
    <>
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
              onClick={(e) => { e.preventDefault(); setPriceView('monthly'); }}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${priceView === 'monthly' ? 'bg-primary text-primary-content' : 'text-base-content/70 hover:text-base-content'}`}
              type="button"
            >
              Monthly
            </button>
            <button
              onClick={(e) => { e.preventDefault(); setPriceView('yearly'); }}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${priceView === 'yearly' ? 'bg-primary text-primary-content' : 'text-base-content/70 hover:text-base-content'}`}
              type="button"
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
                priceView === 'monthly' ? property.monthly_price : property.yearly_price,
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
        <span className="w-full btn btn-outline btn-primary gap-2 group-hover:btn-primary group-hover:text-primary-content">
          <Eye className="w-4 h-4" />
          View Details
        </span>
      </div>
    </>
  );
});

export default PropertyInfo;
