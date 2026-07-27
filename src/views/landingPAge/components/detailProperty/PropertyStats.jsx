import React from 'react';
import { Bed, Bath, Users, Clock } from 'lucide-react';

const PropertyStats = ({ property }) => (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
    <div className="bg-base-100 p-4 rounded-2xl border border-base-300 shadow-sm flex items-center gap-3">
      <div className="p-3 bg-primary/10 text-primary rounded-xl">
        <Bed className="w-6 h-6" />
      </div>
      <div>
        <div className="text-xs text-base-content/60 font-medium">Bedrooms</div>
        <div className="text-lg font-bold text-base-content">{property.number_of_bedrooms ?? '-'}</div>
      </div>
    </div>

    <div className="bg-base-100 p-4 rounded-2xl border border-base-300 shadow-sm flex items-center gap-3">
      <div className="p-3 bg-secondary/10 text-secondary rounded-xl">
        <Bath className="w-6 h-6" />
      </div>
      <div>
        <div className="text-xs text-base-content/60 font-medium">Bathrooms</div>
        <div className="text-lg font-bold text-base-content">{property.number_of_bathrooms ?? '-'}</div>
      </div>
    </div>

    <div className="bg-base-100 p-4 rounded-2xl border border-base-300 shadow-sm flex items-center gap-3">
      <div className="p-3 bg-accent/10 text-accent rounded-xl">
        <Users className="w-6 h-6" />
      </div>
      <div>
        <div className="text-xs text-base-content/60 font-medium">Max Guests</div>
        <div className="text-lg font-bold text-base-content">{property.maximum_guest ?? '-'}</div>
      </div>
    </div>

    <div className="bg-base-100 p-4 rounded-2xl border border-base-300 shadow-sm flex items-center gap-3">
      <div className="p-3 bg-info/10 text-info rounded-xl">
        <Clock className="w-6 h-6" />
      </div>
      <div>
        <div className="text-xs text-base-content/60 font-medium">Min Stay</div>
        <div className="text-lg font-bold text-base-content">{property.minimum_stay ? `${property.minimum_stay} Month(s)` : '-'}</div>
      </div>
    </div>
  </div>
);

export default PropertyStats;
