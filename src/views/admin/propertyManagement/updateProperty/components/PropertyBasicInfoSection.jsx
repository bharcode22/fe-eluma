import React from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const PropertyBasicInfoSection = ({
  formData,
  setFormData,
  typeOptions,
  handleChange,
  errors
}) => {
  return (
    <div className="space-y-6">
      {/* Property Type Picker */}
      <div className="bg-base-100 p-6 rounded-2xl border border-base-300 shadow-sm space-y-3">
        <label className="block text-sm font-bold text-base-content">
          Select Property Type <span className="text-error">*</span>
        </label>
        <div className="flex flex-wrap gap-2">
          {typeOptions.map((type) => (
            <button
              key={type.id}
              type="button"
              className={`btn btn-sm rounded-xl transition-all ${
                formData.type_id === type.id
                  ? "btn-primary shadow-md text-white"
                  : "btn-outline border-base-300 text-base-content/80 hover:bg-base-200"
              }`}
              onClick={() => setFormData(prev => ({ ...prev, type_id: type.id }))}
            >
              {type.type_name}
            </button>
          ))}
        </div>
        {errors.type_id && <p className="text-error text-xs font-semibold mt-1">{errors.type_id}</p>}
      </div>

      {/* Property Title */}
      <div className="bg-base-100 p-6 rounded-2xl border border-base-300 shadow-sm space-y-2">
        <label htmlFor="property_tittle" className="block text-sm font-bold text-base-content">
          Property Title <span className="text-error">*</span>
        </label>
        <input
          type="text"
          name="property_tittle"
          id="property_tittle"
          placeholder="e.g. Modern Villa in Seminyak"
          value={formData.property_tittle}
          onChange={handleChange}
          className="input input-bordered w-full rounded-xl bg-base-100 border-base-300 focus:outline-none focus:border-primary text-sm"
        />
        {errors.property_tittle && <p className="text-error text-xs font-semibold mt-1">{errors.property_tittle}</p>}
      </div>

      {/* Description */}
      <div className="bg-base-100 p-6 rounded-2xl border border-base-300 shadow-sm space-y-2">
        <label className="block text-sm font-bold text-base-content">
          Description <span className="text-error">*</span>
        </label>
        <ReactQuill
          value={formData.description || ""}
          onChange={(value) => setFormData(prev => ({ ...prev, description: value }))}
          placeholder="Write property description here..."
          className="bg-base-100 rounded-xl border border-base-300 overflow-hidden"
          modules={{
            toolbar: [
              [{ header: [1, 2, false] }],
              ["bold", "italic", "underline"],
              [{ list: "ordered" }, { list: "bullet" }]
            ],
          }}
          formats={[
            "header",
            "bold",
            "italic",
            "underline",
            "list",
            "bullet",
          ]}
        />
        {errors.description && <p className="text-error text-xs font-semibold mt-1">{errors.description}</p>}
      </div>
    </div>
  );
};

export default PropertyBasicInfoSection;
