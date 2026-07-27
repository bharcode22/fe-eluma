import React from 'react';
import { Grid3x3, CheckSquare, Square } from 'lucide-react';
import { facilityIcons } from './constants';

const FacilitiesSection = ({ formState, setFormState }) => {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3 pb-3 border-b border-base-200">
        <Grid3x3 className="w-5 h-5 text-primary" />
        <h2 className="text-lg font-bold text-base-content">Facilities & Amenities</h2>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {Object.entries(facilityIcons).map(([key, Icon]) => (
          <button
            key={key}
            type="button"
            onClick={() =>
              setFormState({
                ...formState,
                facilities: {
                  ...formState.facilities,
                  [key]: !formState.facilities[key],
                },
              })
            }
            className={`flex flex-col items-center justify-center p-3.5 rounded-xl border transition-all ${
              formState.facilities[key]
                ? 'border-primary bg-primary/10 text-primary shadow-sm font-semibold'
                : 'border-base-300 hover:border-base-400 text-base-content/70 hover:bg-base-200'
            }`}
          >
            <Icon className="w-5 h-5 mb-1.5" />
            <span className="text-xs text-center capitalize">
              {key.replace(/_/g, ' ')}
            </span>
            <div className="mt-2">
              {formState.facilities[key] ? (
                <CheckSquare className="w-4 h-4 text-primary" />
              ) : (
                <Square className="w-4 h-4 text-base-300" />
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default FacilitiesSection;
