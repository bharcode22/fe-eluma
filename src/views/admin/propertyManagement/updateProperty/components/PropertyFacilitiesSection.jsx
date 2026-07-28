import React from 'react';
import { CheckCircle2 } from 'lucide-react';

const PropertyFacilitiesSection = ({
  formData,
  setFormData
}) => {
  return (
    <div className="bg-base-100 p-6 rounded-2xl border border-base-300 shadow-sm space-y-4">
      <h3 className="text-base font-bold text-base-content flex items-center gap-2">
        <CheckCircle2 className="w-5 h-5 text-primary" />
        <span>Facilities & Amenities</span>
      </h3>
      <div className="flex flex-wrap gap-2">
        {Object.keys(formData.facilities).map((key) => (
          <button
            key={key}
            type="button"
            className={`btn btn-xs sm:btn-sm rounded-xl transition-all capitalize ${
              formData.facilities[key]
                ? 'btn-primary shadow-sm text-white'
                : 'btn-outline border-base-300 text-base-content/70 hover:bg-base-200'
            }`}
            onClick={() =>
              setFormData((prev) => ({
                ...prev,
                facilities: {
                  ...prev.facilities,
                  [key]: !prev.facilities[key],
                },
              }))
            }
          >
            {key.replace(/_/g, ' ')}
          </button>
        ))}
      </div>
    </div>
  );
};

export default PropertyFacilitiesSection;
