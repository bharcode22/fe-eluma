import React from 'react';
import { Search } from 'lucide-react';

const ServiceTableFilter = ({ searchQuery, onSearchChange, currentPage, totalPages }) => {
    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-base-content/50" />
                <input
                    type="text"
                    className="input input-bordered w-full pl-10 rounded-xl bg-base-100 border-base-300 focus:outline-none focus:border-primary text-sm"
                    placeholder="Search by name or type..."
                    value={searchQuery}
                    onChange={onSearchChange}
                />
            </div>

            <div className="text-xs text-base-content/60 font-medium">
                Showing page <span className="font-bold text-primary">{currentPage}</span> of <span className="font-bold text-primary">{totalPages}</span>
            </div>
        </div>
    );
};

export default ServiceTableFilter;
