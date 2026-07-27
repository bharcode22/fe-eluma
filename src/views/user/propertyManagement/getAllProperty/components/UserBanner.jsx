import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {
  Search,
  MapPin,
  Building2,
  DollarSign,
  Sparkles,
  PlusCircle,
  UserCheck,
  Filter,
  X
} from 'lucide-react';
import api from '../../../../../service/api.js';

const baseUrl = api.defaults.baseURL;

function UserBanner({ filters, setFilters, onClearFilters }) {
  const [searchLocation, setSearchLocation] = useState(filters?.searchLocation || '');
  const [propertyType, setPropertyType] = useState(filters?.propertyType || '');
  const [priceRange, setPriceRange] = useState(filters?.priceRange || '');

  const [generalAreas, setGeneralAreas] = useState([]);
  const [typeOptions, setTypeOptions] = useState([]);

  useEffect(() => {
    axios.get(`${baseUrl}/general-area`)
      .then(res => {
        if (res.data.data) setGeneralAreas(res.data.data);
      })
      .catch(err => console.error('Failed to fetch general areas:', err));

    axios.get(`${baseUrl}/type-property/`)
      .then(res => {
        if (res.data.data) setTypeOptions(res.data.data);
      })
      .catch(err => console.error('Failed to fetch type property:', err));
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (setFilters) {
      setFilters({
        searchLocation,
        propertyType,
        priceRange
      });
    }
  };

  const hasActiveFilters = Boolean(
    filters?.searchLocation || filters?.propertyType || filters?.priceRange
  );

  return (
    <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-base-100 via-base-200/50 to-base-100 text-base-content shadow-xl border border-base-300 mb-8 p-6 sm:p-10">
      {/* Background Decorative Glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-secondary/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 space-y-8 max-w-5xl mx-auto">

        {/* Top Header & Quick Links Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-bold uppercase tracking-wider text-primary">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>User Portal Catalog</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-base-content leading-tight">
              Explore All <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">Available Properties</span>
            </h1>

            <p className="text-xs sm:text-sm text-base-content/70 font-light">
              Browse through our curated collection of verified villas, modern apartments, and private listings.
            </p>
          </div>

          {/* Quick User Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <Link
              to="/user/add/property"
              className="btn btn-primary btn-sm rounded-xl gap-1.5 text-white text-xs shadow-md hover:shadow-primary/30"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add Property</span>
            </Link>

            <Link
              to="/user/home"
              className="btn btn-outline btn-sm rounded-xl gap-1.5 border-base-300 text-base-content hover:bg-base-200 text-xs"
            >
              <UserCheck className="w-4 h-4 text-primary" />
              <span>My Properties</span>
            </Link>
          </div>
        </div>

        {/* Integrated Filter Bar */}
        <form
          onSubmit={handleSearchSubmit}
          className="bg-base-100 border border-base-300 rounded-2xl p-3 sm:p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 shadow-sm"
        >
          {/* Location Dropdown */}
          <div className="flex items-center gap-3 bg-base-200/60 p-2.5 rounded-xl border border-base-300 focus-within:border-primary transition-colors">
            <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
            <div className="w-full min-w-0">
              <label className="block text-[9px] uppercase font-bold text-base-content/60 tracking-wider">
                Location
              </label>
              <select
                value={searchLocation}
                onChange={(e) => setSearchLocation(e.target.value)}
                className="w-full bg-transparent text-xs font-semibold text-base-content focus:outline-none cursor-pointer"
              >
                <option value="" className="bg-base-100 text-base-content">All Locations</option>
                {generalAreas.map((item, idx) => (
                  <option key={item.id || item.area || idx} value={item.area} className="bg-base-100 text-base-content">
                    {item.area}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Property Type Dropdown */}
          <div className="flex items-center gap-3 bg-base-200/60 p-2.5 rounded-xl border border-base-300 focus-within:border-primary transition-colors">
            <Building2 className="w-4 h-4 text-primary flex-shrink-0" />
            <div className="w-full min-w-0">
              <label className="block text-[9px] uppercase font-bold text-base-content/60 tracking-wider">
                Property Type
              </label>
              <select
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
                className="w-full bg-transparent text-xs font-semibold text-base-content focus:outline-none cursor-pointer"
              >
                <option value="" className="bg-base-100 text-base-content">All Types</option>
                {typeOptions.map((type) => (
                  <option key={type.id} value={type.id} className="bg-base-100 text-base-content">
                    {type.type_name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Price Range Dropdown */}
          <div className="flex items-center gap-3 bg-base-200/60 p-2.5 rounded-xl border border-base-300 focus-within:border-primary transition-colors">
            <DollarSign className="w-4 h-4 text-primary flex-shrink-0" />
            <div className="w-full min-w-0">
              <label className="block text-[9px] uppercase font-bold text-base-content/60 tracking-wider">
                Price Budget
              </label>
              <select
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
                className="w-full bg-transparent text-xs font-semibold text-base-content focus:outline-none cursor-pointer"
              >
                <option value="" className="bg-base-100 text-base-content">Any Budget</option>
                <option value="under_100k" className="bg-base-100 text-base-content">Under Rp100M</option>
                <option value="100k_500k" className="bg-base-100 text-base-content">Rp100M - Rp500M</option>
                <option value="500k_1m" className="bg-base-100 text-base-content">Rp500M - Rp1B</option>
                <option value="above_1m" className="bg-base-100 text-base-content">Above Rp1B</option>
              </select>
            </div>
          </div>

          {/* Search Button */}
          <button
            type="submit"
            className="btn btn-primary rounded-xl h-full min-h-[44px] gap-2 text-white font-bold text-xs shadow-lg hover:shadow-primary/30"
          >
            <Search className="w-4 h-4" />
            <span>Search Properties</span>
          </button>
        </form>

        {/* Clear Filters Indicator */}
        {hasActiveFilters && (
          <div className="flex items-center justify-between gap-2 p-3 rounded-xl bg-primary/5 border border-primary/20 text-xs text-base-content">
            <div className="flex items-center gap-2">
              <Filter className="w-3.5 h-3.5 text-primary" />
              <span>Active filters applied to catalog</span>
            </div>
            <button
              type="button"
              onClick={() => {
                setSearchLocation('');
                setPropertyType('');
                setPriceRange('');
                if (onClearFilters) onClearFilters();
              }}
              className="btn btn-ghost btn-xs text-primary hover:bg-primary/10 gap-1 rounded-lg"
            >
              <X className="w-3.5 h-3.5" />
              <span>Reset Filters</span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
}

export default UserBanner;
