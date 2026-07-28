import React from 'react';
import { Search, Sparkles, Wrench, Layers } from 'lucide-react';

const ServiceHeroBanner = ({
  searchTerm,
  setSearchTerm,
  filterType,
  setFilterType,
  availableTypes,
  totalServicesCount,
  filteredCount
}) => {
  return (
    <div className="bg-gradient-to-br from-primary/10 via-base-100 to-base-200 p-6 md:p-10 rounded-3xl border border-primary/20 shadow-sm space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold border border-primary/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Professional Services Catalog</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-base-content tracking-tight">
            Explore Quality Services
          </h1>
          <p className="text-sm md:text-base text-base-content/70">
            Find and connect directly with verified service providers for your property needs.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-base-100 p-4 rounded-2xl border border-base-300 shadow-sm self-start md:self-auto">
          <div className="p-3 bg-primary/10 text-primary rounded-xl">
            <Wrench className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-base-content">{totalServicesCount}</div>
            <div className="text-xs text-base-content/60 font-medium">Total Services</div>
          </div>
        </div>
      </div>

      {/* Search & Filter Controls */}
      <div className="flex flex-col md:flex-row gap-4 pt-2">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-base-content/40" />
          <input
            type="text"
            placeholder="Search service name, category, or keyword..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input input-bordered w-full pl-12 rounded-2xl bg-base-100 border-base-300 focus:outline-none focus:border-primary text-sm shadow-sm"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
          <button
            type="button"
            onClick={() => setFilterType('all')}
            className={`btn btn-sm rounded-xl font-bold transition-all shrink-0 ${
              filterType === 'all'
                ? 'btn-primary text-white shadow-md'
                : 'btn-outline border-base-300 text-base-content/70 hover:bg-base-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>All Categories ({filteredCount})</span>
          </button>
          {availableTypes.map((type, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setFilterType(type)}
              className={`btn btn-sm rounded-xl font-medium transition-all shrink-0 capitalize ${
                filterType.toLowerCase() === type.toLowerCase()
                  ? 'btn-primary text-white shadow-md'
                  : 'btn-outline border-base-300 text-base-content/70 hover:bg-base-200'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ServiceHeroBanner;
