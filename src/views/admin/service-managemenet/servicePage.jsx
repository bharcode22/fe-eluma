import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import {
  Settings,
  Plus,
  Search,
  Edit,
  Trash2,
  Image as ImageIcon,
  ChevronLeft,
  ChevronRight,
  Loader2,
  AlertCircle,
  AlertTriangle,
  X,
  Sparkles,
  Layers,
  UploadCloud
} from 'lucide-react';
import api from '../../../service/api.js';

const baseUrl = api.defaults.baseURL;

function ServicePage() {
    const [services, setServices] = useState([]);
    const [serviceTypes, setServiceTypes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // Modal States
    const [showFormModal, setShowFormModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedServiceId, setSelectedServiceId] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    // Form Data
    const [formState, setFormState] = useState({
        service_name: '',
        service_type: '',
        description: '',
        status: 'active',
        type_id: ''
    });
    const [selectedFiles, setSelectedFiles] = useState([]);

    // Delete Modal State
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [serviceToDelete, setServiceToDelete] = useState(null);

    const token = Cookies.get('token');

    const fetchServiceTypes = async () => {
        try {
            const res = await axios.get(`${baseUrl}/service/types`);
            setServiceTypes(res.data.data || []);
        } catch (err) {
            console.error('Failed to fetch service types:', err);
        }
    };

    const fetchServices = async () => {
        try {
            if (!token) {
                setError('Token tidak ditemukan. Harap login terlebih dahulu.');
                setLoading(false);
                return;
            }

            const response = await axios.get(
                `${baseUrl}/service?page=${currentPage}&limit=10&search=${searchQuery}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setServices(response.data.data || []);
            if (response.data.meta) {
                setTotalPages(response.data.meta.totalPages || 1);
            }
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Gagal memuat data service');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchServices();
        fetchServiceTypes();
        // eslint-disable-next-line
    }, [currentPage, searchQuery]);

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1);
    };

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    // Open Form for Adding
    const handleOpenAddModal = () => {
        setIsEditing(false);
        setSelectedServiceId(null);
        setFormState({
            service_name: '',
            service_type: '',
            description: '',
            status: 'active',
            type_id: ''
        });
        setSelectedFiles([]);
        setShowFormModal(true);
    };

    // Open Form for Editing
    const handleOpenEditModal = (service) => {
        setIsEditing(true);
        setSelectedServiceId(service.id);
        setFormState({
            service_name: service.service_name || '',
            service_type: service.service_type || '',
            description: service.description || '',
            status: service.status || 'active',
            type_id: service.type_id || ''
        });
        setSelectedFiles([]);
        setShowFormModal(true);
    };

    // Submit Add or Edit Form
    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);

        const formDataToSend = new FormData();
        formDataToSend.append('service_name', formState.service_name);
        formDataToSend.append('service_type', formState.service_type);
        formDataToSend.append('description', formState.description);
        formDataToSend.append('status', formState.status);
        if (formState.type_id) {
            formDataToSend.append('type_id', formState.type_id);
        }

        selectedFiles.forEach((file) => {
            formDataToSend.append('images', file);
        });

        try {
            if (isEditing) {
                await axios.patch(`${baseUrl}/service/${selectedServiceId}`, formDataToSend, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data',
                    },
                });
            } else {
                await axios.post(`${baseUrl}/service`, formDataToSend, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data',
                    },
                });
            }

            setShowFormModal(false);
            fetchServices();
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Gagal menyimpan service');
        } finally {
            setSubmitting(false);
        }
    };

    // Open Delete Modal
    const handleOpenDeleteModal = (id) => {
        setServiceToDelete(id);
        setShowDeleteConfirm(true);
    };

    // Confirm Delete
    const handleConfirmDelete = async () => {
        try {
            await axios.delete(`${baseUrl}/service/${serviceToDelete}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setShowDeleteConfirm(false);
            setServiceToDelete(null);
            fetchServices();
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Gagal menghapus service');
            setShowDeleteConfirm(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-base-100 to-base-200 p-4 md:p-8 flex justify-center items-center">
                <div className="text-center space-y-3">
                    <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto" />
                    <p className="text-base-content/70 font-medium">Loading service data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-base-100 to-base-200 p-4 md:p-8">
            <div className="max-w-7xl mx-auto space-y-6">

                {/* Page Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-base-100 p-6 rounded-2xl border border-base-300 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="p-3.5 bg-primary/10 rounded-2xl text-primary">
                            <Settings className="w-8 h-8" />
                        </div>
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-base-content">
                                Service Management
                            </h1>
                            <p className="text-base-content/70 text-sm mt-0.5">
                                Create, update, and manage services offered on the platform
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={handleOpenAddModal}
                        className="btn btn-primary gap-2 shadow-md hover:shadow-lg self-start md:self-auto"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Add New Service</span>
                    </button>
                </div>

                {/* Global Error Banner */}
                {error && (
                    <div className="p-4 bg-error/10 border border-error/30 text-error rounded-2xl flex items-center gap-3">
                        <AlertCircle className="w-5 h-5 flex-shrink-0" />
                        <span className="text-sm font-medium">{error}</span>
                    </div>
                )}

                {/* Main Content Card Container */}
                <div className="bg-base-100 rounded-2xl border border-base-300 shadow-sm p-6 space-y-6">

                    {/* Search Bar & Pagination Info */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="relative w-full sm:w-80">
                            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-base-content/50" />
                            <input
                                type="text"
                                className="input input-bordered w-full pl-10 rounded-xl bg-base-100 border-base-300 focus:outline-none focus:border-primary text-sm"
                                placeholder="Search by name or type..."
                                value={searchQuery}
                                onChange={handleSearch}
                            />
                        </div>

                        <div className="text-xs text-base-content/60 font-medium">
                            Showing page <span className="font-bold text-primary">{currentPage}</span> of <span className="font-bold text-primary">{totalPages}</span>
                        </div>
                    </div>

                    {/* Service Table */}
                    {services.length === 0 ? (
                        <div className="text-center py-16 space-y-3">
                            <Settings className="w-12 h-12 text-base-content/30 mx-auto" />
                            <h3 className="text-lg font-bold text-base-content">No Services Found</h3>
                            <p className="text-sm text-base-content/60">Add a new service to display it here.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-base-300 bg-base-200/60 text-xs font-semibold uppercase tracking-wider text-base-content/70">
                                        <th className="px-4 py-3.5 rounded-l-xl">#</th>
                                        <th className="px-4 py-3.5">Image</th>
                                        <th className="px-4 py-3.5">Service Name</th>
                                        <th className="px-4 py-3.5">Service Type</th>
                                        <th className="px-4 py-3.5 text-center">Status</th>
                                        <th className="px-4 py-3.5 text-center rounded-r-xl">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-base-200 text-sm">
                                    {services.map((item, index) => (
                                        <tr key={item.id} className="hover:bg-base-200/40 transition-colors">
                                            <td className="px-4 py-4 text-base-content/60 font-medium">
                                                {index + 1 + (currentPage - 1) * 10}
                                            </td>

                                            <td className="px-4 py-4">
                                                <div className="w-12 h-12 rounded-xl bg-base-200 border border-base-300 overflow-hidden flex items-center justify-center shadow-sm">
                                                    {item.imagesService && item.imagesService.length > 0 ? (
                                                        <img
                                                            src={`${baseUrl}${item.imagesService[0].imagesUrl}`}
                                                            alt={item.service_name}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <ImageIcon className="w-5 h-5 text-base-content/40" />
                                                    )}
                                                </div>
                                            </td>

                                            <td className="px-4 py-4 font-semibold text-base-content">
                                                {item.service_name || '-'}
                                            </td>

                                            <td className="px-4 py-4 text-base-content/80 text-xs">
                                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-base-200 font-medium">
                                                    <Layers className="w-3 h-3 text-primary" />
                                                    {item.serviceType?.service_type || item.service_type || '-'}
                                                </span>
                                            </td>

                                            <td className="px-4 py-4 text-center">
                                                <span className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-full ${
                                                    item.status === 'active' || !item.status ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'
                                                }`}>
                                                    {item.status || 'Active'}
                                                </span>
                                            </td>

                                            <td className="px-4 py-4">
                                                <div className="flex justify-center items-center gap-1.5">
                                                    <button
                                                        onClick={() => handleOpenEditModal(item)}
                                                        className="btn btn-square btn-xs btn-ghost text-primary hover:bg-primary/10 rounded-lg"
                                                        title="Edit"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleOpenDeleteModal(item.id)}
                                                        className="btn btn-square btn-xs btn-ghost text-error hover:bg-error/10 rounded-lg"
                                                        title="Delete"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-base-200">
                            <span className="text-xs text-base-content/60">
                                Page {currentPage} of {totalPages}
                            </span>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className="btn btn-sm btn-outline gap-1 rounded-xl disabled:opacity-40"
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                    <span>Previous</span>
                                </button>
                                <button
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className="btn btn-sm btn-outline gap-1 rounded-xl disabled:opacity-40"
                                >
                                    <span>Next</span>
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    )}

                </div>

                {/* Add / Edit Service Modal */}
                {showFormModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <div
                            className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
                            onClick={() => setShowFormModal(false)}
                        />
                        <div className="relative w-full max-w-lg bg-base-100 rounded-2xl shadow-2xl overflow-hidden border border-base-300 z-10">
                            <div className="flex items-center justify-between p-6 border-b border-base-200">
                                <h3 className="text-xl font-bold text-base-content">
                                    {isEditing ? 'Edit Service' : 'Add New Service'}
                                </h3>
                                <button
                                    onClick={() => setShowFormModal(false)}
                                    className="btn btn-circle btn-xs btn-ghost text-base-content/70"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>

                            <form onSubmit={handleFormSubmit} className="p-6 space-y-4">
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

                                <div className="space-y-1.5">
                                    <label className="block text-xs font-bold text-base-content">
                                        Upload Service Images
                                    </label>
                                    <input
                                        type="file"
                                        multiple
                                        accept="image/*"
                                        onChange={(e) => setSelectedFiles(Array.from(e.target.files))}
                                        className="file-input file-input-bordered file-input-primary w-full rounded-xl text-xs"
                                    />
                                    {selectedFiles.length > 0 && (
                                        <p className="text-xs text-primary font-medium mt-1">
                                            {selectedFiles.length} file(s) selected
                                        </p>
                                    )}
                                </div>

                                <div className="flex gap-3 pt-4 border-t border-base-200">
                                    <button
                                        type="button"
                                        onClick={() => setShowFormModal(false)}
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
                )}

                {/* Delete Confirmation Modal */}
                {showDeleteConfirm && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <div
                            className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
                            onClick={() => setShowDeleteConfirm(false)}
                        />
                        <div className="relative w-full max-w-md bg-base-100 rounded-2xl shadow-2xl overflow-hidden border border-base-300 z-10">
                            <div className="p-6 text-center space-y-4">
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-error/10 text-error">
                                    <AlertTriangle className="w-8 h-8" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-base-content">Delete Service</h3>
                                    <p className="text-sm text-base-content/70 mt-2">
                                        Are you sure you want to delete this service?
                                    </p>
                                </div>
                                <div className="flex gap-3 pt-2">
                                    <button
                                        onClick={() => setShowDeleteConfirm(false)}
                                        className="btn btn-outline flex-1 gap-2 rounded-xl"
                                    >
                                        <X className="w-4 h-4" />
                                        <span>Cancel</span>
                                    </button>
                                    <button
                                        onClick={handleConfirmDelete}
                                        className="btn btn-error flex-1 gap-2 rounded-xl text-white"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                        <span>Delete</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}

export default ServicePage;