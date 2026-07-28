import React from 'react';
import { Home, Award } from 'lucide-react';

export const CatalogHeader = ({ propertiesCount, filteredCount, totalData }) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-base-100 p-6 rounded-2xl border border-base-300 shadow-sm">
      <div>
        <div className="flex items-center gap-3 mb-1">
          <Home className="w-6 h-6 text-primary" />
          <h2 className="text-xl font-bold text-base-content flex items-center gap-2">
            <span>Available Property Catalog</span>
            <span className="badge badge-primary font-bold text-xs">
              {propertiesCount} Items
            </span>
          </h2>
        </div>
        <p className="text-xs text-base-content/70">
          Showing <span className="font-bold text-base-content">{filteredCount}</span> of{' '}
          <span className="font-bold text-primary">{totalData || propertiesCount}</span> total verified properties from backend database
        </p>
      </div>

      <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full border border-primary/20 self-start md:self-auto">
        <Award className="w-4 h-4 text-primary" />
        <span className="font-bold text-primary text-xs">
          {totalData || propertiesCount} Total Properties Available
        </span>
      </div>
    </div>
  );
};
