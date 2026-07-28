import React from 'react';
import { ArrowLeft, AlertCircle, Check } from 'lucide-react';

const PropertyUpdateHeader = ({
  propertyCode,
  message,
  success,
  onBack
}) => {
  return (
    <div className="space-y-4">
      {/* Back Button & Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-base-100 p-6 rounded-2xl border border-base-300 shadow-sm">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={onBack}
            className="btn btn-square btn-ghost rounded-xl border border-base-300 hover:bg-base-200"
            title="Back"
          >
            <ArrowLeft className="w-5 h-5 text-base-content" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-primary/10 text-primary font-mono text-xs font-bold border border-primary/20">
                {propertyCode}
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-base-content mt-1">
              Update Property
            </h1>
          </div>
        </div>
      </div>

      {/* Messages */}
      {message && (
        <div className="p-4 bg-error/10 border border-error/30 text-error rounded-2xl flex items-center gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span className="text-sm font-medium">{message}</span>
        </div>
      )}
      {success && (
        <div className="p-4 bg-success/10 border border-success/30 text-success rounded-2xl flex items-center gap-3">
          <Check className="w-5 h-5 flex-shrink-0" />
          <span className="text-sm font-medium">{success}</span>
        </div>
      )}
    </div>
  );
};

export default PropertyUpdateHeader;
