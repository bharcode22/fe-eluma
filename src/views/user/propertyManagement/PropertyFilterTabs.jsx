import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Globe, Lock, Heart, Layers } from 'lucide-react';

const PropertyFilterTabs = ({ filter, setFilter, counts = {} }) => {
  const location = useLocation();
  const navigate = useNavigate();

  // Tab definitions with keys, labels, icons, and corresponding route paths
  const tabs = [
    {
      key: 'public',
      label: 'Public Properties',
      icon: Globe,
      path: '/user/home',
      countKey: 'public'
    },
    {
      key: 'private',
      label: 'Private Properties',
      icon: Lock,
      path: '/user/private/property',
      countKey: 'private'
    },
    {
      key: 'liked',
      label: 'Saved & Liked',
      icon: Heart,
      path: '/user/saved/property',
      countKey: 'liked'
    },
  ];

  // Determine current active key: use state `filter` if provided, otherwise derive from URL path
  const getCurrentKey = () => {
    if (filter) return filter;
    const path = location.pathname;
    if (path.includes('/user/private')) return 'private';
    if (path.includes('/user/saved')) return 'liked';
    return 'public';
  };

  const activeKey = getCurrentKey();

  const handleTabClick = (tab) => {
    // If setFilter prop is provided, call state setter
    if (setFilter) {
      setFilter(tab.key);
    } else {
      // Otherwise navigate to route path
      navigate(tab.path);
    }
  };

  return (
    <div className="bg-base-200/80 p-1.5 rounded-2xl border border-base-300 shadow-sm flex flex-wrap gap-1">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeKey === tab.key;
        const countVal = counts[tab.countKey];

        return (
          <button
            key={tab.key}
            type="button"
            onClick={() => handleTabClick(tab)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex-1 justify-center sm:justify-start ${isActive
              ? 'bg-primary text-white shadow-md scale-[1.02]'
              : 'text-base-content/70 hover:text-base-content hover:bg-base-300/50'
              }`}
          >
            <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-primary'}`} />
            <span>{tab.label}</span>
            {countVal !== undefined && countVal !== null && (
              <span
                className={`ml-1.5 px-2 py-0.5 rounded-full text-[10px] font-extrabold ${isActive
                  ? 'bg-white/20 text-white'
                  : 'bg-base-300 text-base-content/70'
                  }`}
              >
                {countVal}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default PropertyFilterTabs;
