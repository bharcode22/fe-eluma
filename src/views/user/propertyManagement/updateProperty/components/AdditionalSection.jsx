import React from 'react';
import { Plus, PawPrint, Construction, Sparkles, Package, Eye, Car } from 'lucide-react';
import { viewIcons } from './constants';

const AdditionalSection = ({ formState, setFormState }) => {
  const additional = formState?.additionalDetails || {};
  const parking = additional.parking || {};
  const view = additional.view || {};

  const allowPetsValue = additional.allow_pets ?? additional.allow_path ?? false;

  const updateAdditional = (key, value) => {
    setFormState({
      ...formState,
      additionalDetails: {
        ...additional,
        [key]: value
      }
    });
  };

  const updateParking = (key, value) => {
    setFormState({
      ...formState,
      additionalDetails: {
        ...additional,
        parking: {
          ...parking,
          [key]: value
        }
      }
    });
  };

  const updateView = (key, value) => {
    setFormState({
      ...formState,
      additionalDetails: {
        ...additional,
        view: {
          ...view,
          [key]: value
        }
      }
    });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3 pb-3 border-b border-base-200">
        <Plus className="w-5 h-5 text-primary" />
        <h2 className="text-lg font-bold text-base-content">Additional Details</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Allow Pets */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-2 text-xs font-bold text-base-content">
            <PawPrint className="w-4 h-4 text-primary" />
            Allow Pets
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              className="checkbox checkbox-primary rounded-lg"
              checked={!!allowPetsValue}
              onChange={(e) => {
                const isChecked = e.target.checked;
                setFormState({
                  ...formState,
                  additionalDetails: {
                    ...additional,
                    allow_pets: isChecked,
                    allow_path: isChecked
                  }
                });
              }}
            />
            <span className="text-xs font-medium text-base-content">Allow pets in property</span>
          </label>
        </div>

        {/* Construction Nearby */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-2 text-xs font-bold text-base-content">
            <Construction className="w-4 h-4 text-primary" />
            Construction Nearby
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              className="checkbox checkbox-primary rounded-lg"
              checked={!!additional.construction_nearby}
              onChange={(e) => updateAdditional('construction_nearby', e.target.checked)}
            />
            <span className="text-xs font-medium text-base-content">Yes, construction nearby</span>
          </label>
        </div>

        {/* Cleaning Frequency */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-2 text-xs font-bold text-base-content">
            <Sparkles className="w-4 h-4 text-primary" />
            Cleaning Frequency
          </label>
          <input
            type="text"
            placeholder="e.g. Weekly, Monthly"
            value={additional.cleaning_requency || ''}
            onChange={(e) => updateAdditional('cleaning_requency', e.target.value)}
            className="input input-bordered w-full rounded-xl bg-base-100 border-base-300 focus:outline-none focus:border-primary text-sm"
          />
        </div>

        {/* Linen Change */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-2 text-xs font-bold text-base-content">
            <Package className="w-4 h-4 text-primary" />
            Linen Change
          </label>
          <input
            type="text"
            placeholder="e.g. Every 3 days"
            value={additional.linen_chaneg || ''}
            onChange={(e) => updateAdditional('linen_chaneg', e.target.value)}
            className="input input-bordered w-full rounded-xl bg-base-100 border-base-300 focus:outline-none focus:border-primary text-sm"
          />
        </div>
      </div>

      {/* Parking Options */}
      <div className="pt-4 border-t border-base-200">
        <div className="flex items-center gap-2 mb-3">
          <Car className="w-4 h-4 text-primary" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-base-content/70">
            Parking Options
          </h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <label className="flex items-center gap-2 p-3 rounded-xl border border-base-300 hover:bg-base-200 cursor-pointer">
            <input
              type="checkbox"
              className="checkbox checkbox-primary checkbox-sm rounded-md"
              checked={!!parking.car_parking}
              onChange={(e) => updateParking('car_parking', e.target.checked)}
            />
            <span className="text-xs font-medium text-base-content">Car Parking</span>
          </label>

          <label className="flex items-center gap-2 p-3 rounded-xl border border-base-300 hover:bg-base-200 cursor-pointer">
            <input
              type="checkbox"
              className="checkbox checkbox-primary checkbox-sm rounded-md"
              checked={!!parking.bike_parking}
              onChange={(e) => updateParking('bike_parking', e.target.checked)}
            />
            <span className="text-xs font-medium text-base-content">Bike Parking</span>
          </label>

          <label className="flex items-center gap-2 p-3 rounded-xl border border-base-300 hover:bg-base-200 cursor-pointer">
            <input
              type="checkbox"
              className="checkbox checkbox-primary checkbox-sm rounded-md"
              checked={!!parking.both_car_and_bike}
              onChange={(e) => updateParking('both_car_and_bike', e.target.checked)}
            />
            <span className="text-xs font-medium text-base-content">Car & Bike</span>
          </label>
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
              onClick={() => updateView(key, !view[key])}
              className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${view[key]
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
