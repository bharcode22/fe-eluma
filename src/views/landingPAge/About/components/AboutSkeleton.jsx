import React from 'react';

const AboutSkeleton = () => {
  return (
    <div className="space-y-16 py-12 px-4 md:px-8 animate-pulse max-w-7xl mx-auto">
      {/* Hero Section Skeleton */}
      <div className="text-center space-y-4 max-w-3xl mx-auto py-8">
        <div className="h-6 bg-base-300 rounded-full w-32 mx-auto" />
        <div className="h-12 bg-base-300 rounded-2xl w-4/5 mx-auto" />
        <div className="h-4 bg-base-300 rounded-lg w-2/3 mx-auto" />
      </div>

      {/* Stats Cards Skeleton (4 Columns) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-base-100 p-6 rounded-3xl border border-base-300 shadow-sm space-y-3">
            <div className="h-10 bg-base-300 rounded-2xl w-10" />
            <div className="h-8 bg-base-300 rounded-xl w-24" />
            <div className="h-4 bg-base-300 rounded-lg w-32" />
          </div>
        ))}
      </div>

      {/* Story / Mission Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center pt-6">
        <div className="h-80 bg-base-300 rounded-3xl w-full" />
        <div className="space-y-4">
          <div className="h-6 bg-base-300 rounded-full w-28" />
          <div className="h-9 bg-base-300 rounded-xl w-3/4" />
          <div className="space-y-2 pt-2">
            <div className="h-4 bg-base-300 rounded-lg w-full" />
            <div className="h-4 bg-base-300 rounded-lg w-5/6" />
            <div className="h-4 bg-base-300 rounded-lg w-4/5" />
          </div>
        </div>
      </div>

      {/* Core Values Skeleton */}
      <div className="space-y-8 pt-6">
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <div className="h-8 bg-base-300 rounded-xl w-48 mx-auto" />
          <div className="h-4 bg-base-300 rounded-lg w-64 mx-auto" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-base-100 p-6 rounded-3xl border border-base-300 shadow-sm space-y-3">
              <div className="h-10 bg-base-300 rounded-xl w-10" />
              <div className="h-6 bg-base-300 rounded-lg w-3/4" />
              <div className="h-3 bg-base-300 rounded-md w-full" />
              <div className="h-3 bg-base-300 rounded-md w-2/3" />
            </div>
          ))}
        </div>
      </div>

      {/* Team Skeleton Cards */}
      <div className="space-y-8 pt-6">
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <div className="h-8 bg-base-300 rounded-xl w-48 mx-auto" />
          <div className="h-4 bg-base-300 rounded-lg w-64 mx-auto" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-base-100 rounded-3xl border border-base-300 shadow-sm overflow-hidden space-y-4 p-4">
              <div className="h-64 bg-base-300 rounded-2xl w-full" />
              <div className="h-6 bg-base-300 rounded-lg w-2/3" />
              <div className="h-4 bg-base-300 rounded-md w-1/2" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AboutSkeleton;
