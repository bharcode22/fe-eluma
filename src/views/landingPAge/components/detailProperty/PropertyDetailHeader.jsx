import React from 'react';
import { Home, MapPin, ExternalLink } from 'lucide-react';

const PropertyDetailHeader = ({
  property,
  locationData,
  displayMonthlyPrice,
  displayYearlyPrice,
  yearlyPriceVal,
  currencySymbol
}) => {
  return (
    <div className="bg-base-100 rounded-3xl p-6 sm:p-8 shadow-sm border border-base-300 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
      <div className="space-y-3 max-w-2xl">
        <div className="flex flex-wrap items-center gap-2">
          <span className="badge badge-primary font-bold text-xs px-3 py-1.5 rounded-lg">
            CODE: {property.property_code || 'N/A'}
          </span>
          {property.isPublic && (
            <span className="badge badge-success text-white font-bold text-xs px-3 py-1.5 rounded-lg">
              Verified & Active
            </span>
          )}
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold text-base-content tracking-tight leading-tight">
          {property.property_tittle || 'Untitled Property'}
        </h1>

        <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-base-content/70">
          <div className="flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-primary" />
            <span>{locationData.general_area || 'Location not specified'}</span>
          </div>
          {locationData.map_url && (
            <a
              href={locationData.map_url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-xs btn-outline rounded-lg gap-1 text-primary hover:bg-primary hover:text-white"
            >
              <ExternalLink className="w-3 h-3" />
              <span>View Map</span>
            </a>
          )}
        </div>
      </div>

      {/* Pricing Display */}
      <div className="bg-base-200/60 p-5 rounded-2xl border border-base-300/60 w-full sm:w-auto text-left lg:text-right space-y-1">
        <div className="text-xs uppercase font-bold text-base-content/50 tracking-wider">
          Monthly Rate
        </div>
        <div className="text-3xl sm:text-4xl font-black text-primary">
          {currencySymbol}{Number(displayMonthlyPrice).toLocaleString()}
          <span className="text-xs font-normal text-base-content/60 ml-1">/ month</span>
        </div>
        {yearlyPriceVal > 0 && (
          <div className="text-xs text-base-content/70 pt-1 border-t border-base-300/40">
            Yearly Rate: <span className="font-bold text-base-content">{currencySymbol}{Number(displayYearlyPrice).toLocaleString()}</span> / year
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertyDetailHeader;
