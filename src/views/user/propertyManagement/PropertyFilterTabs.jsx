import React from 'react';

const PropertyFilterTabs = ({ filter, setFilter }) => {
  const tabs = [
    { key: 'public', label: 'Public' },
    { key: 'private', label: 'Private' },
    { key: 'liked', label: 'Liked' },
  ];

  return (
    <div className="flex bg-base-300 rounded-lg p-1">
      {tabs.map(tab => (
        <button
          key={tab.key}
          onClick={() => setFilter(tab.key)}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${filter === tab.key
            ? 'bg-primary text-primary-content'
            : 'text-base-content/70 hover:text-base-content'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default PropertyFilterTabs;
