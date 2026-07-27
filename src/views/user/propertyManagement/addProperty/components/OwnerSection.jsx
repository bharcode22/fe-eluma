import React from 'react';
import { User, Phone, MessageCircle, Mail } from 'lucide-react';

const OwnerSection = ({ formState, setFormState }) => {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3 pb-3 border-b border-base-200">
        <User className="w-5 h-5 text-primary" />
        <h2 className="text-lg font-bold text-base-content">Owner Contact Information</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="flex items-center gap-2 text-xs font-bold text-base-content">
            <User className="w-4 h-4 text-primary" />
            Full Name
          </label>
          <input
            type="text"
            placeholder="Owner's full name"
            value={formState.propertiesOwner.fullname}
            onChange={(e) =>
              setFormState({
                ...formState,
                propertiesOwner: { ...formState.propertiesOwner, fullname: e.target.value }
              })
            }
            className="input input-bordered w-full rounded-xl bg-base-100 border-base-300 focus:outline-none focus:border-primary text-sm"
          />
        </div>

        <div className="space-y-1.5">
          <label className="flex items-center gap-2 text-xs font-bold text-base-content">
            <User className="w-4 h-4 text-primary" />
            Display Name
          </label>
          <input
            type="text"
            placeholder="Display name"
            value={formState.propertiesOwner.name}
            onChange={(e) =>
              setFormState({
                ...formState,
                propertiesOwner: { ...formState.propertiesOwner, name: e.target.value }
              })
            }
            className="input input-bordered w-full rounded-xl bg-base-100 border-base-300 focus:outline-none focus:border-primary text-sm"
          />
        </div>

        <div className="space-y-1.5">
          <label className="flex items-center gap-2 text-xs font-bold text-base-content">
            <Phone className="w-4 h-4 text-primary" />
            Phone Number
          </label>
          <input
            type="number"
            placeholder="Phone number"
            value={formState.propertiesOwner.phone}
            onChange={(e) =>
              setFormState({
                ...formState,
                propertiesOwner: { ...formState.propertiesOwner, phone: e.target.value }
              })
            }
            className="input input-bordered w-full rounded-xl bg-base-100 border-base-300 focus:outline-none focus:border-primary text-sm"
          />
        </div>

        <div className="space-y-1.5">
          <label className="flex items-center gap-2 text-xs font-bold text-base-content">
            <MessageCircle className="w-4 h-4 text-primary" />
            WhatsApp
          </label>
          <input
            type="number"
            placeholder="WhatsApp number"
            value={formState.propertiesOwner.watsapp}
            onChange={(e) =>
              setFormState({
                ...formState,
                propertiesOwner: { ...formState.propertiesOwner, watsapp: e.target.value }
              })
            }
            className="input input-bordered w-full rounded-xl bg-base-100 border-base-300 focus:outline-none focus:border-primary text-sm"
          />
        </div>

        <div className="space-y-1.5 md:col-span-2">
          <label className="flex items-center gap-2 text-xs font-bold text-base-content">
            <Mail className="w-4 h-4 text-primary" />
            Email Address
          </label>
          <input
            type="email"
            placeholder="Email address"
            value={formState.propertiesOwner.email}
            onChange={(e) =>
              setFormState({
                ...formState,
                propertiesOwner: { ...formState.propertiesOwner, email: e.target.value }
              })
            }
            className="input input-bordered w-full rounded-xl bg-base-100 border-base-300 focus:outline-none focus:border-primary text-sm"
          />
        </div>
      </div>
    </div>
  );
};

export default OwnerSection;
