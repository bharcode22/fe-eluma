import React from 'react';

export const LoadingSkeleton = ({ divRef }) => (
  <div ref={divRef} className="min-h-screen bg-gradient-to-b from-base-100 to-base-200 py-8">
    <div className="container mx-auto px-4 space-y-6">

      {/* Header Bar Skeleton */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-base-100 p-6 rounded-2xl border border-base-300 shadow-sm animate-pulse">
        <div className="space-y-2 w-full md:w-1/2">
          <div className="h-6 bg-base-300 rounded-lg w-3/4" />
          <div className="h-4 bg-base-300 rounded-lg w-1/2" />
        </div>
        <div className="h-8 bg-base-300 rounded-full w-48" />
      </div>

      {/* Property Cards Grid Skeleton (6 items) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="bg-base-100 rounded-2xl border border-base-300 shadow-lg overflow-hidden animate-pulse flex flex-col"
          >
            {/* Image Placeholder */}
            <div className="h-64 bg-base-300 relative w-full" />

            {/* Body Content */}
            <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="h-5 bg-base-300 rounded-lg w-3/4" />
                <div className="h-4 bg-base-300 rounded-lg w-1/2" />
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-3 py-2 border-y border-base-200">
                <div className="h-4 bg-base-300 rounded-lg" />
                <div className="h-4 bg-base-300 rounded-lg" />
              </div>

              {/* Pricing & Button */}
              <div className="pt-2 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="h-6 bg-base-300 rounded-lg w-1/3" />
                  <div className="h-6 bg-base-300 rounded-lg w-1/4" />
                </div>
                <div className="h-10 bg-base-300 rounded-xl w-full" />
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  </div>
);