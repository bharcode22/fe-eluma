import React from 'react';
import { AlertCircle, Loader2 } from 'lucide-react';

export const CatalogErrorState = ({ error, onRetry }) => {
  return (
    <div className="flex justify-center items-center min-h-[60vh] p-4">
      <div className="text-center space-y-4 max-w-md bg-base-100 p-8 rounded-3xl border border-base-300 shadow-xl">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-error/10 text-error">
          <AlertCircle className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-error">Failed to Load Catalog</h3>
          <p className="text-sm text-base-content/70">{error}</p>
        </div>
        <button
          type="button"
          onClick={onRetry || (() => window.location.reload())}
          className="btn btn-primary gap-2 rounded-xl text-white w-full"
        >
          <Loader2 className="w-4 h-4 animate-spin" />
          Try Again
        </button>
      </div>
    </div>
  );
};
