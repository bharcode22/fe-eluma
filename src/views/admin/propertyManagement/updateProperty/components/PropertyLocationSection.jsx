import React from 'react';
import { MapPin } from 'lucide-react';

const PropertyLocationSection = ({
  formData,
  setFormData,
  generalAreas,
  errors
}) => {
  return (
    <div className="bg-base-100 p-6 rounded-2xl border border-base-300 shadow-sm space-y-4">
      <h3 className="text-base font-bold text-base-content flex items-center gap-2">
        <MapPin className="w-5 h-5 text-primary" />
        <span>Location & Map</span>
      </h3>

      <div className="space-y-1.5">
        <label className="block text-xs font-semibold text-base-content/70">
          General Area <span className="text-error">*</span>
        </label>
        <select
          value={formData.location.general_area}
          onChange={(e) =>
            setFormData(prev => ({
              ...prev,
              location: {
                ...prev.location,
                general_area: e.target.value,
              },
            }))
          }
          className="select select-bordered w-full rounded-xl bg-base-100 border-base-300 focus:outline-none focus:border-primary text-sm"
        >
          <option value="">Select General Area</option>
          {generalAreas.map((area, idx) => (
            <option key={idx} value={area.area}>
              {area.area}
            </option>
          ))}
        </select>
        {errors.general_area && <p className="text-error text-xs font-semibold mt-1">{errors.general_area}</p>}
      </div>

      <div className="space-y-1.5">
        <label className="block text-xs font-semibold text-base-content/70">Google Maps Embed / URL</label>
        <input
          type="text"
          placeholder="Paste Google Maps URL"
          value={formData.location.map_url}
          onChange={(e) =>
            setFormData(prev => ({
              ...prev,
              location: {
                ...prev.location,
                map_url: e.target.value,
              },
            }))
          }
          className="input input-bordered w-full rounded-xl bg-base-100 border-base-300 focus:outline-none focus:border-primary text-sm"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-base-content/70">Latitude</label>
          <input
            type="text"
            placeholder="Latitude (e.g. -8.650000)"
            value={formData.location.latitude}
            onChange={(e) =>
              setFormData(prev => ({
                ...prev,
                location: {
                  ...prev.location,
                  latitude: e.target.value,
                },
              }))
            }
            className="input input-bordered w-full rounded-xl bg-base-100 border-base-300 focus:outline-none focus:border-primary text-sm"
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-base-content/70">Longitude</label>
          <input
            type="text"
            placeholder="Longitude (e.g. 115.130000)"
            value={formData.location.longitude}
            onChange={(e) =>
              setFormData(prev => ({
                ...prev,
                location: {
                  ...prev.location,
                  longitude: e.target.value,
                },
              }))
            }
            className="input input-bordered w-full rounded-xl bg-base-100 border-base-300 focus:outline-none focus:border-primary text-sm"
          />
        </div>
      </div>
    </div>
  );
};

export default PropertyLocationSection;
