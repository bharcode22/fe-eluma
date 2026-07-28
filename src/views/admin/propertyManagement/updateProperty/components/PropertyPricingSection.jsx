import React from 'react';
import { DollarSign } from 'lucide-react';

const PropertyPricingSection = ({
  formData,
  setFormData,
  errors
}) => {
  return (
    <div className="bg-base-100 p-6 rounded-2xl border border-base-300 shadow-sm space-y-4">
      <h3 className="text-base font-bold text-base-content flex items-center gap-2">
        <DollarSign className="w-5 h-5 text-primary" />
        <span>Pricing</span>
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label htmlFor="price" className="block text-xs font-semibold text-base-content/70 mb-1">
            Price per Day (IDR) <span className="text-error">*</span>
          </label>
          <input
            type="number"
            id="price"
            placeholder="Daily price"
            value={formData.price}
            onChange={e => setFormData({ ...formData, price: e.target.value })}
            className="input input-bordered w-full rounded-xl bg-base-100 border-base-300 focus:outline-none focus:border-primary text-sm"
            min="0"
          />
          {errors.price && <p className="text-error text-xs font-semibold mt-1">{errors.price}</p>}
        </div>
        <div>
          <label htmlFor="monthly_price" className="block text-xs font-semibold text-base-content/70 mb-1">Monthly Price (IDR)</label>
          <input
            type="number"
            id="monthly_price"
            placeholder="Monthly price"
            value={formData.monthly_price}
            onChange={e => setFormData({ ...formData, monthly_price: e.target.value })}
            className="input input-bordered w-full rounded-xl bg-base-100 border-base-300 focus:outline-none focus:border-primary text-sm"
            min="0"
          />
        </div>
        <div>
          <label htmlFor="yearly_price" className="block text-xs font-semibold text-base-content/70 mb-1">Yearly Price (IDR)</label>
          <input
            type="number"
            id="yearly_price"
            placeholder="Yearly price"
            value={formData.yearly_price}
            onChange={e => setFormData({ ...formData, yearly_price: e.target.value })}
            className="input input-bordered w-full rounded-xl bg-base-100 border-base-300 focus:outline-none focus:border-primary text-sm"
            min="0"
          />
        </div>
      </div>
    </div>
  );
};

export default PropertyPricingSection;
