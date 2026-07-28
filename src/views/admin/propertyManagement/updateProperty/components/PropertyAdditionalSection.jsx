import React from 'react';
import { Info } from 'lucide-react';

const PropertyAdditionalSection = ({
  formData,
  setFormData
}) => {
  return (
    <div className="bg-base-100 p-6 rounded-2xl border border-base-300 shadow-sm space-y-6">
      <h3 className="text-base font-bold text-base-content flex items-center gap-2">
        <Info className="w-5 h-5 text-primary" />
        <span>Additional Details</span>
      </h3>

      {/* General Checkboxes */}
      <div className="flex flex-wrap gap-6">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            id="allow_path"
            checked={formData.additionalDetails.allow_path}
            onChange={e => setFormData({ ...formData, additionalDetails: { ...formData.additionalDetails, allow_path: e.target.checked } })}
            className="checkbox checkbox-primary rounded-lg"
          />
          <span className="text-sm font-medium text-base-content">Allow Pets</span>
        </label>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            id="construction_nearby"
            checked={formData.additionalDetails.construction_nearby}
            onChange={e => setFormData({ ...formData, additionalDetails: { ...formData.additionalDetails, construction_nearby: e.target.checked } })}
            className="checkbox checkbox-primary rounded-lg"
          />
          <span className="text-sm font-medium text-base-content">Construction Nearby</span>
        </label>
      </div>

      {/* Cleaning Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-base-content/70 mb-1">Cleaning Frequency</label>
          <input
            type="text"
            placeholder="e.g. 2x a week"
            value={formData.additionalDetails.cleaning_requency}
            onChange={e => setFormData({ ...formData, additionalDetails: { ...formData.additionalDetails, cleaning_requency: e.target.value } })}
            className="input input-bordered w-full rounded-xl bg-base-100 border-base-300 focus:outline-none focus:border-primary text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-base-content/70 mb-1">Linen Change Frequency</label>
          <input
            type="text"
            placeholder="e.g. 1x a week"
            value={formData.additionalDetails.linen_chaneg}
            onChange={e => setFormData({ ...formData, additionalDetails: { ...formData.additionalDetails, linen_chaneg: e.target.value } })}
            className="input input-bordered w-full rounded-xl bg-base-100 border-base-300 focus:outline-none focus:border-primary text-sm"
          />
        </div>
      </div>

      {/* Parking Options */}
      <div className="space-y-2 pt-2">
        <span className="text-xs font-bold uppercase tracking-wider text-base-content/70">Parking</span>
        <div className="flex flex-wrap gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              id="car_parking"
              checked={formData.additionalDetails.parking.car_parking}
              onChange={e => setFormData({ ...formData, additionalDetails: { ...formData.additionalDetails, parking: { ...formData.additionalDetails.parking, car_parking: e.target.checked } } })}
              className="checkbox checkbox-primary rounded-lg"
            />
            <span className="text-sm text-base-content">Car Parking</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              id="bike_parking"
              checked={formData.additionalDetails.parking.bike_parking}
              onChange={e => setFormData({ ...formData, additionalDetails: { ...formData.additionalDetails, parking: { ...formData.additionalDetails.parking, bike_parking: e.target.checked } } })}
              className="checkbox checkbox-primary rounded-lg"
            />
            <span className="text-sm text-base-content">Motorcycle Parking</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              id="both_car_and_bike"
              checked={formData.additionalDetails.parking.both_car_and_bike}
              onChange={e => setFormData({ ...formData, additionalDetails: { ...formData.additionalDetails, parking: { ...formData.additionalDetails.parking, both_car_and_bike: e.target.checked } } })}
              className="checkbox checkbox-primary rounded-lg"
            />
            <span className="text-sm text-base-content">Car & Motorcycle</span>
          </label>
        </div>
      </div>

      {/* View Options */}
      <div className="space-y-2 pt-2">
        <span className="text-xs font-bold uppercase tracking-wider text-base-content/70">Views</span>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {Object.keys(formData.additionalDetails.view).map((viewKey) => (
            <label key={viewKey} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                id={viewKey}
                checked={formData.additionalDetails.view[viewKey]}
                onChange={e => setFormData({
                  ...formData,
                  additionalDetails: {
                    ...formData.additionalDetails,
                    view: {
                      ...formData.additionalDetails.view,
                      [viewKey]: e.target.checked
                    }
                  }
                })}
                className="checkbox checkbox-primary rounded-lg"
              />
              <span className="text-xs font-medium text-base-content capitalize">
                {viewKey.replace(/_/g, ' ')}
              </span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PropertyAdditionalSection;
