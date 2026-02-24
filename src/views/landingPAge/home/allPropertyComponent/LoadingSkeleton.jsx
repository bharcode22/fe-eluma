
export const LoadingSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
    {[...Array(8)].map((_, i) => (
      <div key={i} className="bg-base-100 rounded-2xl shadow-lg overflow-hidden animate-pulse">
        <div className="h-64 bg-base-300" />
        <div className="p-6 space-y-4">
          <div className="h-4 bg-base-300 rounded w-3/4" />
          <div className="h-4 bg-base-300 rounded w-1/2" />
          <div className="space-y-2">
            <div className="h-3 bg-base-300 rounded" />
            <div className="h-3 bg-base-300 rounded" />
          </div>
          <div className="h-10 bg-base-300 rounded" />
        </div>
      </div>
    ))}
  </div>
);