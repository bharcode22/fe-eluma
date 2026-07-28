import React from 'react';
import { Building } from 'lucide-react';

const PropertyDetailsSection = ({
  formData,
  setFormData
}) => {
  return (
    <div className="bg-base-100 p-6 rounded-2xl border border-base-300 shadow-sm space-y-4">
      <h3 className="text-base font-bold text-base-content flex items-center gap-2">
        <Building className="w-5 h-5 text-primary" />
        <span>Property Details</span>
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="number_of_bedrooms" className="block text-xs font-semibold text-base-content/70 mb-1">Number of Bedrooms</label>
          <input
            type="number"
            id="number_of_bedrooms"
            placeholder="e.g. 3"
            value={formData.number_of_bedrooms}
            onChange={e => setFormData({ ...formData, number_of_bedrooms: e.target.value })}
            className="input input-bordered w-full rounded-xl bg-base-100 border-base-300 focus:outline-none focus:border-primary text-sm"
            min="0"
          />
        </div>
        <div>
          <label htmlFor="number_of_bathrooms" className="block text-xs font-semibold text-base-content/70 mb-1">Number of Bathrooms</label>
          <input
            type="number"
            id="number_of_bathrooms"
            placeholder="e.g. 2"
            value={formData.number_of_bathrooms}
            onChange={e => setFormData({ ...formData, number_of_bathrooms: e.target.value })}
            className="input input-bordered w-full rounded-xl bg-base-100 border-base-300 focus:outline-none focus:border-primary text-sm"
            min="0"
          />
        </div>
        <div>
          <label htmlFor="maximum_guest" className="block text-xs font-semibold text-base-content/70 mb-1">Maximum Guests</label>
          <input
            type="number"
            id="maximum_guest"
            placeholder="e.g. 6"
            value={formData.maximum_guest}
            onChange={e => setFormData({ ...formData, maximum_guest: e.target.value })}
            className="input input-bordered w-full rounded-xl bg-base-100 border-base-300 focus:outline-none focus:border-primary text-sm"
            min="0"
          />
        </div>
        <div>
          <label htmlFor="minimum_stay" className="block text-xs font-semibold text-base-content/70 mb-1">Minimum Stay (Months)</label>
          <input
            type="number"
            id="minimum_stay"
            placeholder="e.g. 1"
            value={formData.minimum_stay}
            onChange={e => setFormData({ ...formData, minimum_stay: e.target.value })}
            className="input input-bordered w-full rounded-xl bg-base-100 border-base-300 focus:outline-none focus:border-primary text-sm"
            min="0"
          />
        </div>
      </div>
    </div>
  );
};

export default PropertyDetailsSection;
