import React from 'react';
import { Calendar } from 'lucide-react';

const PropertyAvailabilitySection = ({
  formData,
  handleAvailabilityChange,
  formatDateTimeForInput,
  errors
}) => {
  return (
    <div className="bg-base-100 p-6 rounded-2xl border border-base-300 shadow-sm space-y-4">
      <h3 className="text-base font-bold text-base-content flex items-center gap-2">
        <Calendar className="w-5 h-5 text-primary" />
        <span>Availability Period</span>
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="available_from" className="block text-xs font-semibold text-base-content/70 mb-1">Available From</label>
          <input
            id="available_from"
            type="datetime-local"
            value={formatDateTimeForInput(formData.availability[0]?.available_from)}
            onChange={(e) => handleAvailabilityChange('available_from', e.target.value)}
            className="input input-bordered w-full rounded-xl bg-base-100 border-base-300 focus:outline-none focus:border-primary text-sm"
          />
        </div>
        <div>
          <label htmlFor="available_to" className="block text-xs font-semibold text-base-content/70 mb-1">Available To</label>
          <input
            id="available_to"
            type="datetime-local"
            value={formatDateTimeForInput(formData.availability[0]?.available_to)}
            onChange={(e) => handleAvailabilityChange('available_to', e.target.value)}
            className="input input-bordered w-full rounded-xl bg-base-100 border-base-300 focus:outline-none focus:border-primary text-sm"
          />
        </div>
      </div>
      {errors.availability && <p className="text-error text-xs font-semibold mt-1">{errors.availability}</p>}
    </div>
  );
};

export default PropertyAvailabilitySection;
