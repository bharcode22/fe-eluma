import React from 'react';

const ServiceSkeleton = () => {
    return (
        <div className="min-h-screen bg-gradient-to-b from-base-100 to-base-200 py-8 px-4 md:px-8 space-y-8 animate-pulse">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* Hero Header Skeleton */}
                <div className="text-center space-y-3 max-w-2xl mx-auto py-4">
                    <div className="h-6 bg-base-300 rounded-full w-32 mx-auto" />
                    <div className="h-10 bg-base-300 rounded-2xl w-3/4 mx-auto" />
                    <div className="h-4 bg-base-300 rounded-lg w-1/2 mx-auto" />
                </div>

                {/* Search & Filter Bar Skeleton */}
                <div className="bg-base-100 p-6 rounded-3xl border border-base-300 shadow-sm space-y-4">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="h-12 bg-base-300 rounded-2xl flex-1" />
                        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="h-10 bg-base-300 rounded-xl w-28 shrink-0" />
                            ))}
                        </div>
                    </div>
                </div>

                {/* 6 Cards Grid Skeleton */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, i) => (
                        <div
                            key={i}
                            className="bg-base-100 rounded-3xl border border-base-300 shadow-md overflow-hidden flex flex-col"
                        >
                            {/* Image Placeholder */}
                            <div className="h-52 bg-base-300 relative w-full" />

                            {/* Card Body */}
                            <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                                <div className="space-y-3">
                                    <div className="h-4 bg-base-300 rounded-full w-24" />
                                    <div className="h-6 bg-base-300 rounded-xl w-4/5" />
                                    <div className="space-y-2 pt-1">
                                        <div className="h-3 bg-base-300 rounded-lg w-full" />
                                        <div className="h-3 bg-base-300 rounded-lg w-2/3" />
                                    </div>
                                </div>

                                {/* Price & Action Buttons */}
                                <div className="pt-4 border-t border-base-200 space-y-3">
                                    <div className="h-6 bg-base-300 rounded-lg w-1/3" />
                                    <div className="flex gap-2">
                                        <div className="h-10 bg-base-300 rounded-xl flex-1" />
                                        <div className="h-10 bg-base-300 rounded-xl flex-1" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer Banner Skeleton */}
                <div className="h-28 bg-base-300 rounded-3xl w-full" />
            </div>
        </div>
    );
};

export default ServiceSkeleton;
