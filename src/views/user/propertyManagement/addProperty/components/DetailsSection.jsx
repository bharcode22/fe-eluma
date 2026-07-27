import React from 'react';
import { ClipboardList, Bed, Bath, Users, Clock, Calendar } from 'lucide-react';

const DetailsSection = ({ formState, setFormState }) => {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3 pb-3 border-b border-base-200">
        <ClipboardList className="w-5 h-5 text-primary" />
        <h2 className="text-lg font-bold text-base-content">Property Details</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="flex items-center gap-2 text-xs font-bold text-base-content">
            <Bed className="w-4 h-4 text-primary" />
            Bedrooms
          </label>
          <input
            type="number"
            placeholder="e.g. 3"
            value={formState.number_of_bedrooms}
            onChange={(e) => setFormState({ ...formState, number_of_bedrooms: e.target.value })}
            className="input input-bordered w-full rounded-xl bg-base-100 border-base-300 focus:outline-none focus:border-primary text-sm"
          />
        </div>

        <div className="space-y-1.5">
          <label className="flex items-center gap-2 text-xs font-bold text-base-content">
            <Bath className="w-4 h-4 text-primary" />
            Bathrooms
          </label>
          <input
            type="number"
            placeholder="e.g. 2"
            value={formState.number_of_bathrooms}
            onChange={(e) => setFormState({ ...formState, number_of_bathrooms: e.target.value })}
            className="input input-bordered w-full rounded-xl bg-base-100 border-base-300 focus:outline-none focus:border-primary text-sm"
          />
        </div>

        <div className="space-y-1.5">
          <label className="flex items-center gap-2 text-xs font-bold text-base-content">
            <Users className="w-4 h-4 text-primary" />
            Maximum Guests
          </label>
          <input
            type="number"
            placeholder="e.g. 6"
            value={formState.maximum_guest}
            onChange={(e) => setFormState({ ...formState, maximum_guest: e.target.value })}
            className="input input-bordered w-full rounded-xl bg-base-100 border-base-300 focus:outline-none focus:border-primary text-sm"
          />
        </div>

        <div className="space-y-1.5">
          <label className="flex items-center gap-2 text-xs font-bold text-base-content">
            <Clock className="w-4 h-4 text-primary" />
            Minimum Stay (Months)
          </label>
          <input
            type="number"
            placeholder="e.g. 1"
            value={formState.minimum_stay}
            onChange={(e) => setFormState({ ...formState, minimum_stay: e.target.value })}
            className="input input-bordered w-full rounded-xl bg-base-100 border-base-300 focus:outline-none focus:border-primary text-sm"
          />
        </div>
      </div>

      <div className="space-y-3 pt-4 border-t border-base-200">
        <div className="flex items-center gap-2 text-xs font-bold text-base-content">
          <Calendar className="w-4 h-4 text-primary" />
          <span>Availability Period</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs text-base-content/70">Available From</label>
            <input
              type="datetime-local"
              value={formState.availability?.available_from || ''}
              onChange={(e) =>
                setFormState({
                  ...formState,
                  availability: { ...formState.availability, available_from: e.target.value }
                })
              }
              className="input input-bordered w-full rounded-xl bg-base-100 border-base-300 focus:outline-none focus:border-primary text-sm"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs text-base-content/70">Available To</label>
            <input
              type="datetime-local"
              value={formState.availability?.available_to || ''}
              onChange={(e) =>
                setFormState({
                  ...formState,
                  availability: { ...formState.availability, available_to: e.target.value }
                })
              }
              className="input input-bordered w-full rounded-xl bg-base-100 border-base-300 focus:outline-none focus:border-primary text-sm"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailsSection;
