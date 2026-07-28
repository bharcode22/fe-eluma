import React from 'react';

export default function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-base-100 to-base-200 p-4 md:p-8 animate-pulse">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Page Header Skeleton */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-base-100 p-6 rounded-2xl border border-base-300 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-base-300 rounded-2xl shrink-0" />
            <div className="space-y-2">
              <div className="h-7 bg-base-300 rounded-xl w-48" />
              <div className="h-4 bg-base-300 rounded-lg w-64" />
            </div>
          </div>
        </div>

        {/* Stats Cards Skeleton (4 Grid Items) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-base-100 p-6 rounded-2xl border border-base-300 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div className="h-4 bg-base-300 rounded-md w-24" />
                <div className="w-10 h-10 bg-base-300 rounded-xl" />
              </div>
              <div className="h-8 bg-base-300 rounded-xl w-16" />
            </div>
          ))}
        </div>

        {/* Quick Action Skeleton */}
        <div className="bg-base-100 p-6 rounded-2xl border border-base-300 shadow-sm space-y-4">
          <div className="h-6 bg-base-300 rounded-lg w-36" />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-12 bg-base-300 rounded-xl w-full" />
            ))}
          </div>
        </div>

        {/* Latest Properties Table / Grid Skeleton */}
        <div className="bg-base-100 p-6 rounded-2xl border border-base-300 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="h-6 bg-base-300 rounded-lg w-44" />
            <div className="h-4 bg-base-300 rounded-md w-20" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-base-200/50 rounded-2xl p-4 border border-base-300 space-y-4">
                <div className="h-44 bg-base-300 rounded-xl w-full" />
                <div className="space-y-2">
                  <div className="h-5 bg-base-300 rounded-lg w-3/4" />
                  <div className="h-4 bg-base-300 rounded-md w-1/2" />
                </div>
                <div className="h-9 bg-base-300 rounded-xl w-full" />
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
