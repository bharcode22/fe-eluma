import React from 'react';

export const ContactHotlineSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
    {[...Array(3)].map((_, i) => (
      <div
        key={i}
        className="bg-base-100 rounded-3xl p-6 border border-base-300 shadow-sm space-y-4"
      >
        <div className="flex items-center justify-between">
          <div className="h-12 w-12 bg-base-300 rounded-2xl" />
          <div className="h-5 bg-base-300 rounded-full w-16" />
        </div>
        <div className="space-y-2">
          <div className="h-4 bg-base-300 rounded-md w-24" />
          <div className="h-7 bg-base-300 rounded-xl w-4/5" />
        </div>
        <div className="flex gap-2 pt-2">
          <div className="h-10 bg-base-300 rounded-xl flex-1" />
          <div className="h-10 bg-base-300 rounded-xl flex-1" />
        </div>
      </div>
    ))}
  </div>
);

export const ContactPageSkeleton = () => (
  <div className="max-w-7xl mx-auto space-y-12 animate-pulse">
    {/* Hero Section Skeleton */}
    <div className="text-center space-y-3 max-w-2xl mx-auto">
      <div className="h-6 bg-base-300 rounded-full w-32 mx-auto" />
      <div className="h-10 bg-base-300 rounded-2xl w-3/4 mx-auto" />
      <div className="h-4 bg-base-300 rounded-lg w-1/2 mx-auto" />
    </div>

    {/* Hotlines Skeleton Grid */}
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="h-8 bg-base-300 rounded-xl w-48" />
        <div className="h-6 bg-base-300 rounded-full w-28" />
      </div>
      <ContactHotlineSkeleton />
    </div>

    {/* Contact Form & Info Grid Skeleton */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-4">
      {/* Contact Info Cards (1 col) */}
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-base-100 p-6 rounded-3xl border border-base-300 space-y-3">
            <div className="h-10 w-10 bg-base-300 rounded-2xl" />
            <div className="h-5 bg-base-300 rounded-lg w-1/2" />
            <div className="h-4 bg-base-300 rounded-md w-3/4" />
          </div>
        ))}
      </div>

      {/* Message Form Box (2 cols) */}
      <div className="lg:col-span-2 bg-base-100 p-8 rounded-3xl border border-base-300 space-y-6">
        <div className="space-y-2">
          <div className="h-7 bg-base-300 rounded-xl w-48" />
          <div className="h-4 bg-base-300 rounded-lg w-2/3" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="h-12 bg-base-300 rounded-2xl" />
          <div className="h-12 bg-base-300 rounded-2xl" />
        </div>
        <div className="h-12 bg-base-300 rounded-2xl w-full" />
        <div className="h-32 bg-base-300 rounded-2xl w-full" />
        <div className="h-12 bg-base-300 rounded-2xl w-full" />
      </div>
    </div>
  </div>
);
