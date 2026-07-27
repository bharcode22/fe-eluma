import React from 'react';
import { DollarSign, Calendar } from 'lucide-react';

const PricingSection = ({ formState, setFormState }) => {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3 pb-3 border-b border-base-200">
        <DollarSign className="w-5 h-5 text-primary" />
        <h2 className="text-lg font-bold text-base-content">Pricing Information</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-1.5">
          <label className="flex items-center gap-2 text-xs font-bold text-base-content">
            <DollarSign className="w-4 h-4 text-primary" />
            Base Price
          </label>
          <input
            type="number"
            placeholder="Base price"
            value={formState.price}
            onChange={(e) => setFormState({ ...formState, price: e.target.value })}
            className="input input-bordered w-full rounded-xl bg-base-100 border-base-300 focus:outline-none focus:border-primary text-sm"
          />
        </div>

        <div className="space-y-1.5">
          <label className="flex items-center gap-2 text-xs font-bold text-base-content">
            <Calendar className="w-4 h-4 text-primary" />
            Monthly Price
          </label>
          <input
            type="number"
            placeholder="Monthly price"
            value={formState.monthly_price}
            onChange={(e) => setFormState({ ...formState, monthly_price: e.target.value })}
            className="input input-bordered w-full rounded-xl bg-base-100 border-base-300 focus:outline-none focus:border-primary text-sm"
          />
        </div>

        <div className="space-y-1.5">
          <label className="flex items-center gap-2 text-xs font-bold text-base-content">
            <Calendar className="w-4 h-4 text-primary" />
            Yearly Price
          </label>
          <input
            type="number"
            placeholder="Yearly price"
            value={formState.yearly_price}
            onChange={(e) => setFormState({ ...formState, yearly_price: e.target.value })}
            className="input input-bordered w-full rounded-xl bg-base-100 border-base-300 focus:outline-none focus:border-primary text-sm"
          />
        </div>
      </div>
    </div>
  );
};

export default PricingSection;
