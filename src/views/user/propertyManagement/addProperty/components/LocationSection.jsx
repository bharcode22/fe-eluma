import React from 'react';
import { MapPin, Navigation } from 'lucide-react';

const LocationSection = ({ formState, setFormState, generalAreas }) => {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3 pb-3 border-b border-base-200">
        <MapPin className="w-5 h-5 text-primary" />
        <h2 className="text-lg font-bold text-base-content">Location Information</h2>
      </div>

      <div className="space-y-4">
        <div className="space-y-1.5">
          <label className="flex items-center gap-2 text-xs font-bold text-base-content">
            <Navigation className="w-4 h-4 text-primary" />
            General Area
          </label>
          <select
            value={formState.location.general_area}
            onChange={(e) =>
              setFormState({
                ...formState,
                location: { ...formState.location, general_area: e.target.value }
              })
            }
            className="select select-bordered w-full rounded-xl bg-base-100 border-base-300 focus:outline-none focus:border-primary text-sm"
          >
            <option value="">Select general area</option>
            {generalAreas.map((area, idx) => (
              <option key={idx} value={area.area}>
                {area.area}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-base-content">Map URL (Optional)</label>
          <input
            type="text"
            placeholder="Google Maps or other map link"
            value={formState.location.map_url}
            onChange={(e) =>
              setFormState({
                ...formState,
                location: { ...formState.location, map_url: e.target.value }
              })
            }
            className="input input-bordered w-full rounded-xl bg-base-100 border-base-300 focus:outline-none focus:border-primary text-sm"
          />
        </div>
      </div>
    </div>
  );
};

export default LocationSection;
