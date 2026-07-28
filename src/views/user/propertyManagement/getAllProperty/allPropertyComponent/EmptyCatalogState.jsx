import React from 'react';
import { Search, Filter } from 'lucide-react';

export const EmptyCatalogState = ({ onResetFilters }) => {
  return (
    <div className="bg-base-100 rounded-3xl border border-base-300 p-12 text-center space-y-4 shadow-sm">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-warning/10 text-warning">
        <Search className="w-8 h-8" />
      </div>
      <h3 className="text-xl font-bold text-base-content">No Properties Found</h3>
      <p className="text-sm text-base-content/70 max-w-sm mx-auto">
        Try adjusting your search criteria in the banner or clearing active filters.
      </p>
      <button
        type="button"
        onClick={onResetFilters}
        className="btn btn-outline gap-2 rounded-xl"
      >
        <Filter className="w-4 h-4" />
        Reset All Filters
      </button>
    </div>
  );
};
