import React from 'react';
import { User } from 'lucide-react';

const PropertyOwnerSection = ({
  formData,
  setFormData
}) => {
  return (
    <div className="bg-base-100 p-6 rounded-2xl border border-base-300 shadow-sm space-y-4">
      <h3 className="text-base font-bold text-base-content flex items-center gap-2">
        <User className="w-5 h-5 text-primary" />
        <span>Property Owner Information</span>
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-base-content/70 mb-1">Fullname</label>
          <input
            type="text"
            placeholder="Full name"
            value={formData.propertiesOwner.fullname}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                propertiesOwner: {
                  ...prev.propertiesOwner,
                  fullname: e.target.value,
                },
              }))
            }
            className="input input-bordered w-full rounded-xl bg-base-100 border-base-300 focus:outline-none focus:border-primary text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-base-content/70 mb-1">Display Name</label>
          <input
            type="text"
            placeholder="Display name"
            value={formData.propertiesOwner.name}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                propertiesOwner: {
                  ...prev.propertiesOwner,
                  name: e.target.value,
                },
              }))
            }
            className="input input-bordered w-full rounded-xl bg-base-100 border-base-300 focus:outline-none focus:border-primary text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-base-content/70 mb-1">Phone Number</label>
          <input
            type="number"
            placeholder="Phone number"
            value={formData.propertiesOwner.phone}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                propertiesOwner: {
                  ...prev.propertiesOwner,
                  phone: e.target.value,
                },
              }))
            }
            className="input input-bordered w-full rounded-xl bg-base-100 border-base-300 focus:outline-none focus:border-primary text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-base-content/70 mb-1">WhatsApp Number</label>
          <input
            type="number"
            placeholder="WhatsApp number"
            value={formData.propertiesOwner.watsapp}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                propertiesOwner: {
                  ...prev.propertiesOwner,
                  watsapp: e.target.value,
                },
              }))
            }
            className="input input-bordered w-full rounded-xl bg-base-100 border-base-300 focus:outline-none focus:border-primary text-sm"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-xs font-semibold text-base-content/70 mb-1">Email Address</label>
          <input
            type="email"
            placeholder="Email address"
            value={formData.propertiesOwner.email}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                propertiesOwner: {
                  ...prev.propertiesOwner,
                  email: e.target.value,
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

export default PropertyOwnerSection;
