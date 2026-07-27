import React from 'react';
import { sections } from './constants';

const SectionNavigation = ({ activeSection, setActiveSection }) => {
  return (
    <div className="bg-base-100 p-4 rounded-2xl border border-base-300 shadow-sm overflow-x-auto">
      <div className="flex items-center gap-2 scrollbar-none">
        {sections.map((section) => (
          <button
            key={section.id}
            type="button"
            onClick={() => setActiveSection(section.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
              activeSection === section.id
                ? 'bg-primary text-white shadow-md'
                : 'bg-base-200 text-base-content/70 hover:bg-base-300'
            }`}
          >
            <section.icon className="w-4 h-4" />
            <span>{section.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default SectionNavigation;
