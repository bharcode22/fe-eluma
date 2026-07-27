import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import api from '../../../service/api.js';
import {
    MapPin,
    Building2,
    Briefcase,
    Plus,
    Edit2,
    Trash2,
    Search,
    Loader2,
    CheckCircle,
    AlertCircle,
    X,
    Layers,
    Sparkles,
    RefreshCw
} from 'lucide-react';

const baseUrl = api.defaults.baseURL;

export default function AdditionalManagementPage() {
    const token = Cookies.get('token');

    const [activeTab, setActiveTab] = useState('area'); // 'area' | 'propertyType' | 'serviceType'

    // Data states
    const [generalAreas, setGeneralAreas] = useState([]);
    const [propertyTypes, setPropertyTypes] = useState([]);
    const [serviceTypes, setServiceTypes] = useState([]);

    // Loaders & Errors
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [error, setError] = useState(null);
    const [successMsg, setSuccessMsg] = useState('');

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null); // null for create, item for edit
    const [inputValue, setInputValue] = useState('');
    const [submitting, setSubmitting] = useState(false);

    // Delete Confirm State
    const [deleteConfirmItem, setDeleteConfirmItem] = useState(null);
    const [deleting, setDeleting] = useState(false);

    // Fetch all master data
    const fetchAllMasterData = async () => {
        setLoading(true);
        setError(null);
        try {
            const [areaRes, typeRes, serviceTypeRes] = await Promise.all([
                axios.get(`${baseUrl}/general-area`),
                axios.get(`${baseUrl}/type-property/`),
                axios.get(`${baseUrl}/service/types`)
            ]);

            setGeneralAreas(areaRes.data?.data || []);
            setPropertyTypes(typeRes.data?.data || []);
            setServiceTypes(serviceTypeRes.data?.data || []);
        } catch (err) {
            console.error('Failed to load master data:', err);
            setError('Failed to fetch master data from server.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllMasterData();
    }, []);

    // Modal Open Handlers
    const handleOpenCreateModal = () => {
        setEditingItem(null);
        setInputValue('');
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (item) => {
        setEditingItem(item);
        if (activeTab === 'area') {
            setInputValue(item.area || '');
        } else if (activeTab === 'propertyType') {
            setInputValue(item.type_name || '');
        } else if (activeTab === 'serviceType') {
            setInputValue(item.service_type || '');
        }
        setIsModalOpen(true);
    };

    // Submit Handler (Create & Update)
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!inputValue.trim()) return;

        setSubmitting(true);
        setError(null);
        setSuccessMsg('');

        try {
            const headers = { Authorization: `Bearer ${token}` };

            if (activeTab === 'area') {
                if (editingItem) {
                    await axios.patch(`${baseUrl}/general-area/${editingItem.id}`, { area: inputValue }, { headers });
                    setSuccessMsg('General Area updated successfully!');
                } else {
                    await axios.post(`${baseUrl}/general-area`, { area: inputValue }, { headers });
                    setSuccessMsg('General Area created successfully!');
                }
            } else if (activeTab === 'propertyType') {
                if (editingItem) {
                    await axios.patch(`${baseUrl}/type-property/${editingItem.id}`, { type_name: inputValue }, { headers });
                    setSuccessMsg('Property Type updated successfully!');
                } else {
                    await axios.post(`${baseUrl}/type-property`, { type_name: inputValue }, { headers });
                    setSuccessMsg('Property Type created successfully!');
                }
            } else if (activeTab === 'serviceType') {
                if (editingItem) {
                    await axios.patch(`${baseUrl}/service/types/${editingItem.id}`, { service_type: inputValue }, { headers });
                    setSuccessMsg('Service Type updated successfully!');
                } else {
                    await axios.post(`${baseUrl}/service/types`, { service_type: inputValue }, { headers });
                    setSuccessMsg('Service Type created successfully!');
                }
            }

            setIsModalOpen(false);
            setInputValue('');
            setEditingItem(null);
            fetchAllMasterData();
        } catch (err) {
            console.error('Operation failed:', err);
            setError(err.response?.data?.message || 'Failed to save item.');
        } finally {
            setSubmitting(false);
        }
    };

    // Delete Handler
    const handleConfirmDelete = async () => {
        if (!deleteConfirmItem) return;
        setDeleting(true);
        setError(null);
        setSuccessMsg('');

        try {
            const headers = { Authorization: `Bearer ${token}` };

            if (activeTab === 'area') {
                await axios.delete(`${baseUrl}/general-area/${deleteConfirmItem.id}`, { headers });
                setSuccessMsg('General Area deleted successfully!');
            } else if (activeTab === 'propertyType') {
                await axios.delete(`${baseUrl}/type-property/${deleteConfirmItem.id}`, { headers });
                setSuccessMsg('Property Type deleted successfully!');
            } else if (activeTab === 'serviceType') {
                await axios.delete(`${baseUrl}/service/types/${deleteConfirmItem.id}`, { headers });
                setSuccessMsg('Service Type deleted successfully!');
            }

            setDeleteConfirmItem(null);
            fetchAllMasterData();
        } catch (err) {
            console.error('Delete failed:', err);
            setError(err.response?.data?.message || 'Failed to delete item.');
        } finally {
            setDeleting(false);
        }
    };

    // Filtered List based on Search Query
    const getFilteredList = () => {
        let list = [];
        if (activeTab === 'area') list = generalAreas;
        else if (activeTab === 'propertyType') list = propertyTypes;
        else if (activeTab === 'serviceType') list = serviceTypes;

        if (!searchQuery.trim()) return list;

        const q = searchQuery.toLowerCase();
        return list.filter((item) => {
            const val = item.area || item.type_name || item.service_type || '';
            return val.toLowerCase().includes(q);
        });
    };

    const filteredList = getFilteredList();

    const getTabLabel = () => {
        if (activeTab === 'area') return 'General Area';
        if (activeTab === 'propertyType') return 'Property Type';
        if (activeTab === 'serviceType') return 'Service Type';
        return '';
    };

    return (
        <div className="p-6 sm:p-8 space-y-6 max-w-7xl mx-auto w-full">

            {/* Page Header Bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-base-100 p-6 sm:p-8 rounded-3xl border border-base-300 shadow-sm">
                <div className="space-y-1.5">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider">
                        <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                        <span>Admin System Master Data</span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-base-content tracking-tight">
                        Additional Management
                    </h1>
                    <p className="text-xs sm:text-sm text-base-content/70">
                        Manage locations (General Area), Property Types, and Service Categories.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={handleOpenCreateModal}
                    className="btn btn-primary rounded-xl text-white font-bold gap-2 text-xs shadow-md hover:shadow-primary/30"
                >
                    <Plus className="w-4 h-4" />
                    <span>Add New {getTabLabel()}</span>
                </button>
            </div>

            {/* Status Alerts */}
            {successMsg && (
                <div className="p-4 rounded-2xl bg-success/10 border border-success/30 text-success text-xs font-semibold flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 flex-shrink-0" />
                        <span>{successMsg}</span>
                    </div>
                    <button onClick={() => setSuccessMsg('')} className="btn btn-ghost btn-xs text-success">
                        <X className="w-4 h-4" />
                    </button>
                </div>
            )}

            {error && (
                <div className="p-4 rounded-2xl bg-error/10 border border-error/30 text-error text-xs font-semibold flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                        <AlertCircle className="w-5 h-5 flex-shrink-0" />
                        <span>{error}</span>
                    </div>
                    <button onClick={() => setError('')} className="btn btn-ghost btn-xs text-error">
                        <X className="w-4 h-4" />
                    </button>
                </div>
            )}

            {/* Master Data Tabs Navigation */}
            <div className="tabs tabs-boxed bg-base-100 p-2 rounded-2xl border border-base-300 shadow-sm flex flex-wrap gap-2">
                <button
                    className={`tab tab-lg flex-1 font-bold rounded-xl gap-2 transition-all ${activeTab === 'area' ? 'tab-active bg-primary text-white shadow-md' : 'text-base-content/70'
                        }`}
                    onClick={() => { setActiveTab('area'); setSearchQuery(''); }}
                >
                    <MapPin className="w-4 h-4" />
                    <span>General Area ({generalAreas.length})</span>
                </button>

                <button
                    className={`tab tab-lg flex-1 font-bold rounded-xl gap-2 transition-all ${activeTab === 'propertyType' ? 'tab-active bg-primary text-white shadow-md' : 'text-base-content/70'
                        }`}
                    onClick={() => { setActiveTab('propertyType'); setSearchQuery(''); }}
                >
                    <Building2 className="w-4 h-4" />
                    <span>Property Types ({propertyTypes.length})</span>
                </button>

                <button
                    className={`tab tab-lg flex-1 font-bold rounded-xl gap-2 transition-all ${activeTab === 'serviceType' ? 'tab-active bg-primary text-white shadow-md' : 'text-base-content/70'
                        }`}
                    onClick={() => { setActiveTab('serviceType'); setSearchQuery(''); }}
                >
                    <Briefcase className="w-4 h-4" />
                    <span>Service Types ({serviceTypes.length})</span>
                </button>
            </div>

            {/* Search & Actions Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-base-100 p-4 rounded-2xl border border-base-300 shadow-sm">
                <div className="relative w-full sm:w-80">
                    <Search className="w-4 h-4 text-base-content/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                        type="text"
                        placeholder={`Search ${getTabLabel()}...`}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="input input-sm input-bordered w-full pl-10 rounded-xl text-xs bg-base-200/50 focus:border-primary"
                    />
                </div>

                <button
                    type="button"
                    onClick={fetchAllMasterData}
                    className="btn btn-sm btn-ghost gap-1.5 text-xs text-base-content/70 hover:bg-base-200 rounded-xl"
                    title="Refresh Data"
                >
                    <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                    <span>Refresh</span>
                </button>
            </div>

            {/* Master Data List Table / Cards */}
            <div className="bg-base-100 rounded-3xl border border-base-300 shadow-sm overflow-hidden">
                {loading ? (
                    <div className="p-16 text-center space-y-3">
                        <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
                        <p className="text-xs text-base-content/60 font-medium">Loading {getTabLabel()} records...</p>
                    </div>
                ) : filteredList.length === 0 ? (
                    <div className="p-16 text-center space-y-3">
                        <Layers className="w-10 h-10 text-base-content/30 mx-auto" />
                        <h3 className="text-lg font-bold text-base-content">No {getTabLabel()} Records Found</h3>
                        <p className="text-xs text-base-content/60 max-w-xs mx-auto">
                            {searchQuery ? 'No items match your search query.' : `Click "Add New ${getTabLabel()}" to create your first record.`}
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="table w-full">
                            <thead>
                                <tr className="bg-base-200/60 text-xs text-base-content/70 border-b border-base-300">
                                    <th className="w-16">#</th>
                                    <th>Name / Title</th>
                                    <th className="w-32 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-base-200 text-xs sm:text-sm">
                                {filteredList.map((item, idx) => {
                                    const itemName = item.area || item.type_name || item.service_type || 'Unnamed';

                                    return (
                                        <tr key={item.id || idx} className="hover:bg-base-200/40 transition-colors">
                                            <td className="font-bold text-base-content/50">{idx + 1}</td>
                                            <td className="font-semibold text-base-content flex items-center gap-2">
                                                {activeTab === 'area' && <MapPin className="w-4 h-4 text-primary" />}
                                                {activeTab === 'propertyType' && <Building2 className="w-4 h-4 text-secondary" />}
                                                {activeTab === 'serviceType' && <Briefcase className="w-4 h-4 text-accent" />}
                                                <span>{itemName}</span>
                                            </td>
                                            <td className="text-right">
                                                <div className="flex items-center justify-end gap-1.5">
                                                    <button
                                                        type="button"
                                                        onClick={() => handleOpenEditModal(item)}
                                                        className="btn btn-ghost btn-xs text-info hover:bg-info/10 rounded-lg gap-1"
                                                        title="Edit Record"
                                                    >
                                                        <Edit2 className="w-3.5 h-3.5" />
                                                        <span className="hidden sm:inline">Edit</span>
                                                    </button>

                                                    <button
                                                        type="button"
                                                        onClick={() => setDeleteConfirmItem(item)}
                                                        className="btn btn-ghost btn-xs text-error hover:bg-error/10 rounded-lg gap-1"
                                                        title="Delete Record"
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                        <span className="hidden sm:inline">Delete</span>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Create / Edit Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
                    <div className="bg-base-100 rounded-3xl border border-base-300 shadow-2xl max-w-md w-full p-6 space-y-6 animate-in fade-in zoom-in duration-200">
                        <div className="flex items-center justify-between border-b border-base-200 pb-4">
                            <div className="flex items-center gap-2">
                                <Sparkles className="w-5 h-5 text-primary" />
                                <h3 className="text-lg font-bold text-base-content">
                                    {editingItem ? `Edit ${getTabLabel()}` : `Add New ${getTabLabel()}`}
                                </h3>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="btn btn-ghost btn-xs rounded-full">
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-1.5">
                                <label className="block text-xs font-bold text-base-content/70">
                                    {getTabLabel()} Name *
                                </label>
                                <input
                                    type="text"
                                    required
                                    autoFocus
                                    placeholder={`Enter ${getTabLabel().toLowerCase()} name...`}
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    className="input input-bordered w-full rounded-xl bg-base-200/50 text-xs focus:border-primary"
                                />
                            </div>

                            <div className="flex items-center justify-end gap-2 pt-4 border-t border-base-200">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="btn btn-ghost btn-sm rounded-xl text-xs"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="btn btn-primary btn-sm rounded-xl text-white font-bold gap-2 text-xs shadow-md"
                                >
                                    {submitting ? (
                                        <>
                                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                            <span>Saving...</span>
                                        </>
                                    ) : (
                                        <span>{editingItem ? 'Update Record' : 'Create Record'}</span>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deleteConfirmItem && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
                    <div className="bg-base-100 rounded-3xl border border-base-300 shadow-2xl max-w-md w-full p-6 space-y-6 text-center">
                        <div className="w-12 h-12 rounded-full bg-error/10 text-error flex items-center justify-center mx-auto">
                            <Trash2 className="w-6 h-6" />
                        </div>

                        <div className="space-y-2">
                            <h3 className="text-lg font-bold text-base-content">
                                Confirm Delete Record
                            </h3>
                            <p className="text-xs text-base-content/70">
                                Are you sure you want to delete{' '}
                                <strong className="text-base-content">
                                    "{deleteConfirmItem.area || deleteConfirmItem.type_name || deleteConfirmItem.service_type}"
                                </strong>
                                ? This action cannot be undone.
                            </p>
                        </div>

                        <div className="flex items-center justify-center gap-3 pt-2">
                            <button
                                type="button"
                                onClick={() => setDeleteConfirmItem(null)}
                                className="btn btn-ghost btn-sm rounded-xl text-xs"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                disabled={deleting}
                                onClick={handleConfirmDelete}
                                className="btn btn-error btn-sm rounded-xl text-white font-bold gap-2 text-xs shadow-md"
                            >
                                {deleting ? (
                                    <>
                                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                        <span>Deleting...</span>
                                    </>
                                ) : (
                                    <span>Delete Record</span>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}
