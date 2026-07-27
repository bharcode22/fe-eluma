import React from 'react';
import PropertyCard from './PropertyCard';

const LikedProperties = ({ properties, ...props }) => {
  if (properties.length === 0) {
    return (
      <div className="text-center py-16 space-y-4">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-info/10">
          <props.Home className="w-8 h-8 text-info" />
        </div>
        <h3 className="text-xl font-semibold text-base-content">No Liked Properties</h3>
        <p className="text-base-content/70">You haven't liked any properties yet.</p>
        {props.handleAddProperty && (
          <button onClick={props.handleAddProperty} className="btn btn-primary gap-2">
            <props.Plus className="w-4 h-4" />
            Add Property
          </button>
        )}
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {properties.map((property) => (
        <PropertyCard key={property.id} property={property} {...props} />
      ))}
    </div>
  );
};

export default LikedProperties;
