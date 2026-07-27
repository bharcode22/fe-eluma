import React from 'react';
import { Plus, PawPrint, Construction, Sparkles, Package, Eye } from 'lucide-react';
import { viewIcons } from './constants';

const AdditionalSection = ({ formState, setFormState }) => {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3 pb-3 border-b border-base-200">
        <Plus className="w-5 h-5 text-primary" />
        <h2 className="text-lg font-bold text-base-content">Additional Details</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="flex items-center gap-2 text-xs font-bold text-base-content">
            <PawPrint className="w-4 h-4 text-primary" />
            Allow Pets
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              className="checkbox checkbox-primary rounded-lg"
              checked={formState.additionalDetails.allow_pets}
              onChange={(e) =>
                setFormState({
                  ...formState,
                  additionalDetails: {
                    ...formState.additionalDetails,
                    allow_pets: e.target.checked
                  }
                })
              }
            />
            <span className="text-xs font-medium text-base-content">Allow pets in property</span>
          </label>
        </div>

        <div className="space-y-1.5">
          <label className="flex items-center gap-2 text-xs font-bold text-base-content">
            <Construction className="w-4 h-4 text-primary" />
            Construction Nearby
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              className="checkbox checkbox-primary rounded-lg"
              checked={formState.additionalDetails.construction_nearby}
              onChange={(e) =>
                setFormState({
                  ...formState,
                  additionalDetails: {
                    ...formState.additionalDetails,
                    construction_nearby: e.target.checked
                  }
                })
              }
            />
            <span className="text-xs font-medium text-base-content">Yes, construction nearby</span>
          </label>
        </div>

        <div className="space-y-1.5">
          <label className="flex items-center gap-2 text-xs font-bold text-base-content">
            <Sparkles className="w-4 h-4 text-primary" />
            Cleaning Frequency
          </label>
          <input
            type="text"
            placeholder="e.g. Weekly, Monthly"
            value={formState.additionalDetails.cleaning_requency}
            onChange={(e) =>
              setFormState({
                ...formState,
                additionalDetails: {
                  ...formState.additionalDetails,
                  cleaning_requency: e.target.value
                }
              })
            }
            className="input input-bordered w-full rounded-xl bg-base-100 border-base-300 focus:outline-none focus:border-primary text-sm"
          />
        </div>

        <div className="space-y-1.5">
          <label className="flex items-center gap-2 text-xs font-bold text-base-content">
            <Package className="w-4 h-4 text-primary" />
            Linen Change
          </label>
          <input
            type="text"
            placeholder="e.g. Every 3 days"
            value={formState.additionalDetails.linen_chaneg}
            onChange={(e) =>
              setFormState({
                ...formState,
                additionalDetails: {
                  ...formState.additionalDetails,
                  linen_chaneg: e.target.value
                }
              })
            }
            className="input input-bordered w-full rounded-xl bg-base-100 border-base-300 focus:outline-none focus:border-primary text-sm"
          />
        </div>
      </div>

      {/* View Options */}
      <div className="pt-4 border-t border-base-200">
        <div className="flex items-center gap-2 mb-3">
          <Eye className="w-4 h-4 text-primary" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-base-content/70">
            Property Views
          </h3>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {Object.entries(viewIcons).map(([key, Icon]) => (
            <button
              key={key}
              type="button"
              onClick={() =>
                setFormState({
                  ...formState,
                  additionalDetails: {
                    ...formState.additionalDetails,
                    view: {
                      ...formState.additionalDetails.view,
                      [key]: !formState.additionalDetails.view[key]
                    }
                  }
                })
              }
              className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${
                formState.additionalDetails.view[key]
                  ? 'border-primary bg-primary/10 text-primary shadow-sm font-semibold'
                  : 'border-base-300 hover:border-base-400 text-base-content/70 hover:bg-base-200'
              }`}
            >
              <Icon className="w-5 h-5 mb-1" />
              <span className="text-xs text-center capitalize">
                {key.replace(/_/g, ' ')}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdditionalSection;
