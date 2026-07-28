import React from 'react';
import { X, Sparkles, Loader2, Image as ImageIcon, Trash2, UploadCloud } from 'lucide-react';

const ServiceFormModal = ({
    showModal,
    isEditing,
    formState,
    setFormState,
    serviceTypes,
    existingImages,
    onDeleteExistingImage,
    selectedFiles,
    setSelectedFiles,
    submitting,
    baseUrl,
    onClose,
    onSubmit
}) => {
    if (!showModal) return null;

    const handleRemoveSelectedFile = (index) => {
        setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />
            <div className="relative w-full max-w-lg bg-base-100 rounded-2xl shadow-2xl overflow-hidden border border-base-300 z-10 max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-base-200">
                    <h3 className="text-xl font-bold text-base-content">
                        {isEditing ? 'Edit Service' : 'Add New Service'}
                    </h3>
                    <button
                        onClick={onClose}
                        className="btn btn-circle btn-xs btn-ghost text-base-content/70"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Form Body */}
                <form onSubmit={onSubmit} className="p-6 space-y-5 overflow-y-auto flex-1">
                    {/* Service Name */}
                    <div className="space-y-1.5">
                        <label className="block text-xs font-bold text-base-content">
                            Service Name <span className="text-error">*</span>
                        </label>
                        <input
                            type="text"
                            value={formState.service_name}
                            onChange={(e) => setFormState({ ...formState, service_name: e.target.value })}
                            className="input input-bordered w-full rounded-xl bg-base-100 border-base-300 focus:outline-none focus:border-primary text-sm"
                            placeholder="e.g. Daily House Cleaning"
                            required
                        />
                    </div>

                    {/* Service Type Dropdown */}
                    <div className="space-y-1.5">
                        <label className="block text-xs font-bold text-base-content">
                            Service Type
                        </label>
                        <select
                            value={formState.type_id || ''}
                            onChange={(e) => {
                                const selectedId = e.target.value;
                                const foundType = serviceTypes.find(t => t.id === selectedId);
                                setFormState({
                                    ...formState,
                                    type_id: selectedId,
                                    service_type: foundType ? (foundType.service_type || '') : formState.service_type
                                });
                            }}
                            className="select select-bordered w-full rounded-xl bg-base-100 border-base-300 focus:outline-none focus:border-primary text-sm"
                        >
                            <option value="">Select Service Type</option>
                            {serviceTypes.map((type) => (
                                <option key={type.id} value={type.id}>
                                    {type.service_type}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Status Dropdown */}
                    <div className="space-y-1.5">
                        <label className="block text-xs font-bold text-base-content">
                            Status
                        </label>
                        <select
                            value={formState.status}
                            onChange={(e) => setFormState({ ...formState, status: e.target.value })}
                            className="select select-bordered w-full rounded-xl bg-base-100 border-base-300 focus:outline-none focus:border-primary text-sm"
                        >
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
                    </div>

                    {/* Description */}
                    <div className="space-y-1.5">
                        <label className="block text-xs font-bold text-base-content">
                            Description
                        </label>
                        <textarea
                            value={formState.description}
                            onChange={(e) => setFormState({ ...formState, description: e.target.value })}
                            className="textarea textarea-bordered w-full rounded-xl bg-base-100 border-base-300 focus:outline-none focus:border-primary text-sm h-24"
                            placeholder="Describe the service details..."
                        />
                    </div>

                    {/* Existing Images Management (Editing Mode) */}
                    {isEditing && existingImages && existingImages.length > 0 && (
                        <div className="space-y-2 pt-2 border-t border-base-200">
                            <label className="block text-xs font-bold text-base-content">
                                Current Service Images ({existingImages.length})
                            </label>
                            <div className="grid grid-cols-4 gap-3">
                                {existingImages.map((img) => (
                                    <div key={img.id} className="relative group rounded-xl overflow-hidden border border-base-300 aspect-square bg-base-200">
                                        <img
                                            src={`${baseUrl}${img.imagesUrl}`}
                                            alt="Service Thumbnail"
                                            className="w-full h-full object-cover"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => onDeleteExistingImage(img.id)}
                                            className="absolute top-1 right-1 p-1 bg-error/90 hover:bg-error text-white rounded-lg opacity-90 group-hover:opacity-100 transition-opacity shadow-sm"
                                            title="Delete image"
                                        >
                                            <X className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Upload New Service Images */}
                    <div className="space-y-2 pt-2 border-t border-base-200">
                        <label className="block text-xs font-bold text-base-content flex items-center gap-1.5">
                            <UploadCloud className="w-4 h-4 text-primary" />
                            <span>{isEditing ? 'Add New Images' : 'Upload Service Images'}</span>
                        </label>

                        <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={(e) => setSelectedFiles(Array.from(e.target.files))}
                            className="file-input file-input-bordered file-input-primary w-full rounded-xl text-xs"
                        />

                        {/* Selected Files Preview List */}
                        {selectedFiles.length > 0 && (
                            <div className="space-y-2 pt-1">
                                <p className="text-xs font-semibold text-primary">
                                    {selectedFiles.length} new image(s) selected:
                                </p>
                                <div className="grid grid-cols-4 gap-2">
                                    {selectedFiles.map((file, idx) => {
                                        const previewUrl = URL.createObjectURL(file);
                                        return (
                                            <div key={idx} className="relative group rounded-xl overflow-hidden border border-primary/30 aspect-square bg-base-200">
                                                <img
                                                    src={previewUrl}
                                                    alt={file.name}
                                                    className="w-full h-full object-cover"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveSelectedFile(idx)}
                                                    className="absolute top-1 right-1 p-1 bg-error/90 text-white rounded-lg shadow-sm hover:scale-105 transition-transform"
                                                    title="Remove selected file"
                                                >
                                                    <X className="w-3 h-3" />
                                                </button>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4 border-t border-base-200">
                        <button
                            type="button"
                            onClick={onClose}
                            className="btn btn-outline flex-1 rounded-xl"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="btn btn-primary flex-1 shadow-lg rounded-xl gap-2 text-white"
                        >
                            {submitting ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    <span>Saving...</span>
                                </>
                            ) : (
                                <>
                                    <Sparkles className="w-4 h-4" />
                                    <span>{isEditing ? 'Update Service' : 'Save Service'}</span>
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ServiceFormModal;
