import React from 'react';

const LoadingSkeleton = () => (
  <div className="space-y-6 animate-pulse">
    {/* Page Header Skeleton */}
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
      <div className="space-y-2">
        <div className="h-8 bg-base-300 rounded-xl w-64" />
        <div className="h-4 bg-base-300 rounded-lg w-48" />
      </div>
      <div className="h-10 bg-base-300 rounded-xl w-40" />
    </div>

    {/* Stats Cards Skeleton */}
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      {[...Array(4)].map((_, idx) => (
        <div key={idx} className="bg-base-100 rounded-xl p-4 border border-base-300 space-y-2">
          <div className="h-7 bg-base-300 rounded-lg w-12" />
          <div className="h-4 bg-base-300 rounded-md w-24" />
        </div>
      ))}
    </div>

    {/* Property Cards Grid Skeleton (6 items) */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="bg-base-100 rounded-2xl border border-base-300 shadow-md overflow-hidden flex flex-col"
        >
          {/* Property Image Placeholder */}
          <div className="h-56 bg-base-300 relative w-full" />

          {/* Card Body */}
          <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="h-5 bg-base-300 rounded-lg w-4/5" />
              <div className="h-4 bg-base-300 rounded-md w-1/2" />
            </div>

            {/* Features Row */}
            <div className="grid grid-cols-3 gap-2 py-2 border-y border-base-200">
              <div className="h-4 bg-base-300 rounded-md" />
              <div className="h-4 bg-base-300 rounded-md" />
              <div className="h-4 bg-base-300 rounded-md" />
            </div>

            {/* Price & Action Buttons */}
            <div className="pt-2 space-y-3">
              <div className="flex items-center justify-between">
                <div className="h-6 bg-base-300 rounded-lg w-1/3" />
                <div className="h-6 bg-base-300 rounded-full w-16" />
              </div>
              <div className="flex gap-2">
                <div className="h-9 bg-base-300 rounded-xl flex-1" />
                <div className="h-9 bg-base-300 rounded-xl flex-1" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default LoadingSkeleton;
