import React from 'react';
import { Search } from 'lucide-react';

export default function ServiceFilter({
    searchTerm,
    setSearchTerm,
    filterType,
    setFilterType,
    availableTypes,
    totalServicesCount,
}) {
    return (
        <div className="bg-base-100 p-4 sm:p-6 rounded-2xl border border-base-300 shadow-sm space-y-4">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                {/* Search Input */}
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-base-content/50" />
                    <input
                        type="text"
                        placeholder="Search by service name or description..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="input input-bordered w-full pl-10 rounded-xl bg-base-100 border-base-300 focus:outline-none focus:border-primary text-sm"
                    />
                </div>

                {/* Category Filter Pills */}
                <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto scrollbar-none">
                    <button
                        onClick={() => setFilterType('all')}
                        className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${filterType === 'all'
                            ? 'bg-primary text-white shadow-md'
                            : 'bg-base-200 text-base-content/70 hover:bg-base-300'
                            }`}
                    >
                        All Services ({totalServicesCount})
                    </button>
                    {availableTypes.map((type) => (
                        <button
                            key={type}
                            onClick={() => setFilterType(type)}
                            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${filterType === type
                                ? 'bg-primary text-white shadow-md'
                                : 'bg-base-200 text-base-content/70 hover:bg-base-300'
                                }`}
                        >
                            {type}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
