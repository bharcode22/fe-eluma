import React from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Home, Building, CheckCircle, Edit2, ClipboardList } from 'lucide-react';

const BasicInfoSection = ({ formState, setFormState, typeOptions }) => {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3 pb-3 border-b border-base-200">
        <Home className="w-5 h-5 text-primary" />
        <h2 className="text-lg font-bold text-base-content">Basic Information</h2>
      </div>

      <div className="space-y-3">
        <label className="flex items-center gap-2 text-xs font-bold text-base-content">
          <Building className="w-4 h-4 text-primary" />
          Property Type <span className="text-error">*</span>
        </label>
        <div className="flex flex-wrap gap-2">
          {typeOptions.map((type) => (
            <button
              key={type.id}
              type="button"
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                formState.type_id === type.id
                  ? 'bg-primary text-white shadow-md'
                  : 'btn-outline border-base-300 text-base-content/70 hover:bg-base-200'
              }`}
              onClick={() => setFormState({ ...formState, type_id: type.id })}
            >
              <span>{type.type_name}</span>
              {formState.type_id === type.id && <CheckCircle className="w-3.5 h-3.5" />}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="flex items-center gap-2 text-xs font-bold text-base-content">
          <Edit2 className="w-4 h-4 text-primary" />
          Property Title <span className="text-error">*</span>
        </label>
        <input
          type="text"
          placeholder="Property title"
          value={formState.property_tittle}
          onChange={(e) => setFormState({ ...formState, property_tittle: e.target.value })}
          className="input input-bordered w-full rounded-xl bg-base-100 border-base-300 focus:outline-none focus:border-primary text-sm"
          required
        />
      </div>

      <div className="space-y-1.5">
        <label className="flex items-center gap-2 text-xs font-bold text-base-content">
          <ClipboardList className="w-4 h-4 text-primary" />
          Description
        </label>
        <div className="bg-base-100 rounded-xl border border-base-300 overflow-hidden">
          <ReactQuill
            value={formState.description || ''}
            onChange={(value) => setFormState((prev) => ({ ...prev, description: value }))}
            placeholder="Describe your property..."
            className="custom-quill"
            modules={{
              toolbar: [
                [{ header: [1, 2, false] }],
                ['bold', 'italic', 'underline'],
                [{ list: 'ordered' }, { list: 'bullet' }],
                ['link'],
                ['clean']
              ],
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default BasicInfoSection;
