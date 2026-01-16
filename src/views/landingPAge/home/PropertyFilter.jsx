import React, { useState, useEffect } from 'react';
import * as Slider from '@radix-ui/react-slider';
import {
  Filter,
  MapPin,
  Bed,
  DollarSign,
  Calendar,
  X,
  Search,
  ChevronDown,
  Home,
  Building,
  TrendingUp,
  RefreshCw,
  Check,
  Sparkles
} from 'lucide-react';

function PropertyFilter({ properties, onFilter }) {
  // Extract unique values
  const locations = [
    ...new Set(
      properties.flatMap((p) =>
        (p.location && p.location.length > 0)
          ? p.location.map((l) => l.general_area).filter(Boolean)
          : []
      )
    ),
  ].sort();

  const bedrooms = [...new Set(properties.map((p) => p.number_of_bedrooms || 0))].sort((a, b) => a - b);
  const propertyTypes = [...new Set(properties.map((p) => p.property_type || 'Unknown'))].sort();

  // States
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedBedrooms, setSelectedBedrooms] = useState('');
  const [selectedPropertyType, setSelectedPropertyType] = useState('');
  const [monthlyPriceRange, setMonthlyPriceRange] = useState([0, 0]);
  const [yearlyPriceRange, setYearlyPriceRange] = useState([0, 0]);
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState([]);

  // Initialize price ranges
  useEffect(() => {
    if (properties.length > 0) {
      const monthlyPrices = properties.map((p) => p.monthly_price || 0);
      const yearlyPrices = properties.map((p) => p.yearly_price || 0);

      const minMonthly = Math.min(...monthlyPrices);
      const maxMonthly = Math.max(...monthlyPrices);
      const minYearly = Math.min(...yearlyPrices);
      const maxYearly = Math.max(...yearlyPrices);

      setMonthlyPriceRange([minMonthly, maxMonthly]);
      setYearlyPriceRange([minYearly, maxYearly]);
    }
  }, [properties]);

  // Update active filters
  useEffect(() => {
    const filters = [];
    if (selectedLocation) filters.push(`Location: ${selectedLocation}`);
    if (selectedBedrooms) filters.push(`${selectedBedrooms} Bedrooms`);
    if (selectedPropertyType) filters.push(`Type: ${selectedPropertyType}`);
    if (monthlyPriceRange[0] > 0 || monthlyPriceRange[1] < Infinity) {
      filters.push(`Monthly: Rp${(monthlyPriceRange[0] / 1_000_000).toFixed(1)}m - Rp${(monthlyPriceRange[1] / 1_000_000).toFixed(1)}m`);
    }
    if (yearlyPriceRange[0] > 0 || yearlyPriceRange[1] < Infinity) {
      filters.push(`Yearly: Rp${(yearlyPriceRange[0] / 1_000_000).toFixed(1)}m - Rp${(yearlyPriceRange[1] / 1_000_000).toFixed(1)}m`);
    }
    setActiveFilters(filters);
  }, [selectedLocation, selectedBedrooms, selectedPropertyType, monthlyPriceRange, yearlyPriceRange]);

  const handleFilter = (e) => {
    e?.preventDefault();
    let filtered = properties;

    // Location filter
    if (selectedLocation) {
      filtered = filtered.filter((p) =>
        p.location && p.location.some((l) => l.general_area === selectedLocation)
      );
    }

    // Bedrooms filter
    if (selectedBedrooms) {
      filtered = filtered.filter((p) => p.number_of_bedrooms === Number(selectedBedrooms));
    }

    // Property type filter
    if (selectedPropertyType) {
      filtered = filtered.filter((p) => p.property_type === selectedPropertyType);
    }

    // Price filters
    filtered = filtered.filter((p) => {
      const monthlyPrice = p.monthly_price || 0;
      const yearlyPrice = p.yearly_price || 0;

      const monthlyMatch = monthlyPrice >= monthlyPriceRange[0] && monthlyPrice <= monthlyPriceRange[1];
      const yearlyMatch = yearlyPrice >= yearlyPriceRange[0] && yearlyPrice <= yearlyPriceRange[1];

      return monthlyMatch && yearlyMatch;
    });

    onFilter(filtered);
  };

  const handleReset = () => {
    setSelectedLocation('');
    setSelectedBedrooms('');
    setSelectedPropertyType('');

    if (properties.length > 0) {
      const monthlyPrices = properties.map((p) => p.monthly_price || 0);
      const yearlyPrices = properties.map((p) => p.yearly_price || 0);
      setMonthlyPriceRange([Math.min(...monthlyPrices), Math.max(...monthlyPrices)]);
      setYearlyPriceRange([Math.min(...yearlyPrices), Math.max(...yearlyPrices)]);
    }

    onFilter(properties);
  };

  const removeFilter = (filterIndex) => {
    const filterText = activeFilters[filterIndex];

    if (filterText.startsWith('Location:')) {
      setSelectedLocation('');
    } else if (filterText.includes('Bedrooms')) {
      setSelectedBedrooms('');
    } else if (filterText.startsWith('Type:')) {
      setSelectedPropertyType('');
    } else if (filterText.startsWith('Monthly:')) {
      const monthlyPrices = properties.map((p) => p.monthly_price || 0);
      setMonthlyPriceRange([Math.min(...monthlyPrices), Math.max(...monthlyPrices)]);
    } else if (filterText.startsWith('Yearly:')) {
      const yearlyPrices = properties.map((p) => p.yearly_price || 0);
      setYearlyPriceRange([Math.min(...yearlyPrices), Math.max(...yearlyPrices)]);
    }
  };

  const formatPrice = (price) => {
    if (price >= 1_000_000_000) {
      return `Rp${(price / 1_000_000_000).toFixed(1)}B`;
    } else if (price >= 1_000_000) {
      return `Rp${(price / 1_000_000).toFixed(1)}M`;
    } else if (price >= 1_000) {
      return `Rp${(price / 1_000).toFixed(1)}K`;
    }
    return `Rp${price}`;
  };

  return (
    <div className="bg-gradient-to-br from-base-100 to-base-200 rounded-2xl shadow-xl border border-base-300 mb-8 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-6 border-b border-base-300">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Filter className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-base-content">Property Search</h3>
              <p className="text-sm text-base-content/70">Find your perfect property with advanced filters</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleReset}
            className="btn btn-ghost btn-sm gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Reset All
          </button>
        </div>
      </div>

      {/* Main Filter Form */}
      <form onSubmit={handleFilter} className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {/* Location Filter */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-base-content">
              <MapPin className="w-4 h-4 text-primary" />
              Location
            </label>
            <div className="relative">
              <select
                className="select select-bordered w-full pl-10 bg-base-100 focus:border-primary focus:ring-2 focus:ring-primary/20"
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
              >
                <option value="">All Locations</option>
                {locations.map((loc) => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-3 w-4 h-4 text-base-content/50 pointer-events-none" />
            </div>
          </div>

          {/* Bedrooms Filter */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-base-content">
              <Bed className="w-4 h-4 text-secondary" />
              Bedrooms
            </label>
            <div className="relative">
              <select
                className="select select-bordered w-full pl-10 bg-base-100 focus:border-secondary focus:ring-2 focus:ring-secondary/20"
                value={selectedBedrooms}
                onChange={(e) => setSelectedBedrooms(e.target.value)}
              >
                <option value="">Any</option>
                {bedrooms.map((bed) => (
                  <option key={bed} value={bed}>
                    {bed} {bed === 1 ? 'Bedroom' : 'Bedrooms'}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-3 w-4 h-4 text-base-content/50 pointer-events-none" />
            </div>
          </div>

          {/* Property Type Filter */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-base-content">
              <Home className="w-4 h-4 text-accent" />
              Property Type
            </label>
            <div className="relative">
              <select
                className="select select-bordered w-full pl-10 bg-base-100 focus:border-accent focus:ring-2 focus:ring-accent/20"
                value={selectedPropertyType}
                onChange={(e) => setSelectedPropertyType(e.target.value)}
              >
                <option value="">All Types</option>
                {propertyTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-3 w-4 h-4 text-base-content/50 pointer-events-none" />
            </div>
          </div>

          {/* Search Button */}
          <div className="flex items-end">
            <button
              type="submit"
              className="btn btn-primary w-full gap-2 h-[42px]"
            >
              <Search className="w-4 h-4" />
              Search Properties
            </button>
          </div>
        </div>

        {/* Advanced Filters Toggle */}
        <button
          type="button"
          onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
          className="flex items-center gap-2 text-sm font-medium text-primary mb-4 hover:text-primary/80 transition-colors"
        >
          <Sparkles className={`w-4 h-4 transition-transform ${isAdvancedOpen ? 'rotate-180' : ''}`} />
          {isAdvancedOpen ? 'Hide' : 'Show'} Advanced Filters
          <span className="badge badge-primary badge-sm ml-2">
            {activeFilters.length} active
          </span>
        </button>

        {/* Advanced Filters */}
        {isAdvancedOpen && (
          <div className="space-y-6 p-4 bg-base-200/50 rounded-xl border border-base-300">
            {/* Price Range Filters */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Monthly Price Range */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 text-sm font-medium text-base-content">
                    <DollarSign className="w-4 h-4 text-success" />
                    Monthly Price Range
                  </label>
                  <span className="text-sm text-base-content/70">
                    {formatPrice(monthlyPriceRange[0])} - {formatPrice(monthlyPriceRange[1])}
                  </span>
                </div>
                <Slider.Root
                  className="relative flex items-center select-none touch-none w-full h-5"
                  min={properties.length > 0 ? Math.min(...properties.map(p => p.monthly_price || 0)) : 0}
                  max={properties.length > 0 ? Math.max(...properties.map(p => p.monthly_price || 0)) : 10000000}
                  step={100000}
                  value={monthlyPriceRange}
                  onValueChange={setMonthlyPriceRange}
                  minStepsBetweenThumbs={1}
                >
                  <Slider.Track className="bg-base-300 relative grow rounded-full h-2">
                    <Slider.Range className="absolute bg-gradient-to-r from-success/50 to-success rounded-full h-full" />
                  </Slider.Track>
                  <Slider.Thumb
                    className="block w-5 h-5 bg-white border-2 border-success shadow-lg rounded-full hover:scale-110 focus:outline-none focus:ring-2 focus:ring-success/50 transition-transform"
                    aria-label="Minimum Monthly Price"
                  />
                  <Slider.Thumb
                    className="block w-5 h-5 bg-white border-2 border-success shadow-lg rounded-full hover:scale-110 focus:outline-none focus:ring-2 focus:ring-success/50 transition-transform"
                    aria-label="Maximum Monthly Price"
                  />
                </Slider.Root>
                <div className="flex justify-between text-xs text-base-content/60">
                  <span>Min: {formatPrice(Math.min(...properties.map(p => p.monthly_price || 0)))}</span>
                  <span>Avg: {formatPrice(Math.round(properties.reduce((sum, p) => sum + (p.monthly_price || 0), 0) / properties.length))}</span>
                  <span>Max: {formatPrice(Math.max(...properties.map(p => p.monthly_price || 0)))}</span>
                </div>
              </div>

              {/* Yearly Price Range */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 text-sm font-medium text-base-content">
                    <Calendar className="w-4 h-4 text-warning" />
                    Yearly Price Range
                  </label>
                  <span className="text-sm text-base-content/70">
                    {formatPrice(yearlyPriceRange[0])} - {formatPrice(yearlyPriceRange[1])}
                  </span>
                </div>
                <Slider.Root
                  className="relative flex items-center select-none touch-none w-full h-5"
                  min={properties.length > 0 ? Math.min(...properties.map(p => p.yearly_price || 0)) : 0}
                  max={properties.length > 0 ? Math.max(...properties.map(p => p.yearly_price || 0)) : 200000000}
                  step={1000000}
                  value={yearlyPriceRange}
                  onValueChange={setYearlyPriceRange}
                  minStepsBetweenThumbs={1}
                >
                  <Slider.Track className="bg-base-300 relative grow rounded-full h-2">
                    <Slider.Range className="absolute bg-gradient-to-r from-warning/50 to-warning rounded-full h-full" />
                  </Slider.Track>
                  <Slider.Thumb
                    className="block w-5 h-5 bg-white border-2 border-warning shadow-lg rounded-full hover:scale-110 focus:outline-none focus:ring-2 focus:ring-warning/50 transition-transform"
                    aria-label="Minimum Yearly Price"
                  />
                  <Slider.Thumb
                    className="block w-5 h-5 bg-white border-2 border-warning shadow-lg rounded-full hover:scale-110 focus:outline-none focus:ring-2 focus:ring-warning/50 transition-transform"
                    aria-label="Maximum Yearly Price"
                  />
                </Slider.Root>
                <div className="flex justify-between text-xs text-base-content/60">
                  <span>Min: {formatPrice(Math.min(...properties.map(p => p.yearly_price || 0)))}</span>
                  <span>Avg: {formatPrice(Math.round(properties.reduce((sum, p) => sum + (p.yearly_price || 0), 0) / properties.length))}</span>
                  <span>Max: {formatPrice(Math.max(...properties.map(p => p.yearly_price || 0)))}</span>
                </div>
              </div>
            </div>

            {/* Stats Summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-base-300">
              <div className="text-center p-3 bg-base-100 rounded-lg">
                <div className="text-2xl font-bold text-primary">{properties.length}</div>
                <div className="text-xs text-base-content/70">Total Properties</div>
              </div>
              <div className="text-center p-3 bg-base-100 rounded-lg">
                <div className="text-2xl font-bold text-secondary">{locations.length}</div>
                <div className="text-xs text-base-content/70">Locations</div>
              </div>
              <div className="text-center p-3 bg-base-100 rounded-lg">
                <div className="text-2xl font-bold text-accent">{bedrooms.length}</div>
                <div className="text-xs text-base-content/70">Bedroom Options</div>
              </div>
              <div className="text-center p-3 bg-base-100 rounded-lg">
                <div className="text-2xl font-bold text-success">
                  {formatPrice(Math.round(properties.reduce((sum, p) => sum + (p.monthly_price || 0), 0) / properties.length))}
                </div>
                <div className="text-xs text-base-content/70">Avg. Monthly</div>
              </div>
            </div>
          </div>
        )}

        {/* Active Filters */}
        {activeFilters.length > 0 && (
          <div className="mt-6 pt-4 border-t border-base-300">
            <div className="flex items-center gap-2 mb-3">
              <Check className="w-4 h-4 text-success" />
              <span className="text-sm font-medium text-base-content">Active Filters:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {activeFilters.map((filter, index) => (
                <div
                  key={index}
                  className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm"
                >
                  <span>{filter}</span>
                  <button
                    type="button"
                    onClick={() => removeFilter(index)}
                    className="hover:bg-primary/20 rounded-full p-0.5 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={handleReset}
                className="text-sm text-error hover:text-error/80 transition-colors"
              >
                Clear All
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}

export default PropertyFilter;