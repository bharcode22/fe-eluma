import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { Link, useNavigate } from 'react-router-dom';
import {
    Home,
    Search,
    Plus,
    Eye,
    Edit,
    Trash2,
    Globe,
    Lock,
    Calendar,
    ChevronLeft,
    ChevronRight,
    AlertTriangle,
    X,
    Loader2,
    AlertCircle,
    User,
    Package
} from 'lucide-react';
import api from '../../../service/api.js';

const baseUrl = api.defaults.baseURL;

export default function PropertyList() {
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [propertyToDelete, setPropertyToDelete] = useState(null);

    const token = Cookies.get('token');
    const navigate = useNavigate();

    const fetchProperties = async () => {
        try {
            if (!token) {
                setError('Token tidak ditemukan. Harap login terlebih dahulu.');
                setLoading(false);
                return;
            }

            const response = await axios.get(`${baseUrl}/property-management?page=${currentPage}&limit=10&search=${searchQuery}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.data.meta) {
                setProperties(response.data.data || []);
                setTotalPages(response.data.meta.totalPages || 1);
            }
        } catch (err) {
            setError(err.response?.data?.message || err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProperties();
        // eslint-disable-next-line
    }, [currentPage, searchQuery]);

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const handleSearch = (event) => {
        setSearchQuery(event.target.value);
        setCurrentPage(1);
    };

    const DeleteData = (propertyId) => {
        setPropertyToDelete(propertyId);
        setShowDeleteConfirm(true);
    };

    const handleConfirmDelete = async () => {
        try {
            await axios.delete(`${baseUrl}/property/${propertyToDelete}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            fetchProperties();
            setShowDeleteConfirm(false);
            setPropertyToDelete(null);
        } catch (err) {
            setError(err.response?.data?.message || err.message);
            setShowDeleteConfirm(false);
            setPropertyToDelete(null);
        }
    };

    const handleCancelDelete = () => {
        setShowDeleteConfirm(false);
        setPropertyToDelete(null);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-base-100 to-base-200 p-4 md:p-8 flex justify-center items-center">
                <div className="text-center space-y-3">
                    <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto" />
                    <p className="text-base-content/70 font-medium">Loading property data...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-base-100 to-base-200 p-4 md:p-8 flex justify-center items-center">
                <div className="bg-base-100 rounded-2xl border border-error/30 p-8 text-center max-w-md shadow-xl space-y-4">
                    <div className="w-14 h-14 bg-error/10 text-error rounded-full flex items-center justify-center mx-auto">
                        <AlertCircle className="w-8 h-8" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-error">Failed to Load Properties</h3>
                        <p className="text-base-content/70 text-sm mt-1">{error}</p>
                    </div>
                    <button
                        onClick={() => window.location.reload()}
                        className="btn btn-primary gap-2 shadow-md"
                    >
                        <Loader2 className="w-4 h-4" />
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-base-100 to-base-200 p-4 md:p-8">
            <div className="max-w-7xl mx-auto space-y-6">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-base-100 p-6 rounded-2xl border border-base-300 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="p-3.5 bg-primary/10 rounded-2xl text-primary">
                            <Home className="w-8 h-8" />
                        </div>
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-base-content">
                                Property Management
                            </h1>
                            <p className="text-base-content/70 text-sm mt-0.5">
                                Manage and monitor all property listings across the platform
                            </p>
                        </div>
                    </div>

                    <Link
                        to="/admin/add-property-management"
                        className="btn btn-primary gap-2 shadow-md hover:shadow-lg self-start md:self-auto"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Add New Property</span>
                    </Link>
                </div>

                {/* Main Card Container */}
                <div className="bg-base-100 rounded-2xl border border-base-300 shadow-sm p-6 space-y-6">

                    {/* Search Bar & Filter */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="relative w-full sm:w-80">
                            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-base-content/50" />
                            <input
                                type="text"
                                className="input input-bordered w-full pl-10 rounded-xl bg-base-100 border-base-300 focus:outline-none focus:border-primary text-sm"
                                placeholder="Search by title, code, or user..."
                                value={searchQuery}
                                onChange={handleSearch}
                            />
                        </div>

                        <div className="text-xs text-base-content/60 font-medium">
                            Showing page <span className="font-bold text-primary">{currentPage}</span> of <span className="font-bold text-primary">{totalPages}</span>
                        </div>
                    </div>

                    {/* Property Table */}
                    {properties.length === 0 ? (
                        <div className="text-center py-16 space-y-3">
                            <Package className="w-12 h-12 text-base-content/30 mx-auto" />
                            <h3 className="text-lg font-bold text-base-content">No Properties Found</h3>
                            <p className="text-sm text-base-content/60">Try adjusting your search query or add a new property.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-base-300 bg-base-200/60 text-xs font-semibold uppercase tracking-wider text-base-content/70">
                                        <th className="px-4 py-3.5 rounded-l-xl">#</th>
                                        <th className="px-4 py-3.5">Property Title</th>
                                        <th className="px-4 py-3.5 text-center">Code</th>
                                        <th className="px-4 py-3.5">User Info</th>
                                        <th className="px-4 py-3.5 text-center">Status</th>
                                        <th className="px-4 py-3.5 text-center">Listed At</th>
                                        <th className="px-4 py-3.5 text-center rounded-r-xl">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-base-200 text-sm">
                                    {properties.map((property, index) => (
                                        <tr key={property.id} className="hover:bg-base-200/40 transition-colors">
                                            <td className="px-4 py-4 text-base-content/60 font-medium">
                                                {index + 1 + (currentPage - 1) * 10}
                                            </td>

                                            <td className="px-4 py-4 font-semibold text-base-content max-w-xs truncate">
                                                {property.property_tittle || '-'}
                                            </td>

                                            <td className="px-4 py-4 text-center">
                                                <span className="inline-block px-2.5 py-1 rounded-lg bg-primary/10 text-primary font-mono text-xs font-bold border border-primary/20">
                                                    {property.property_code || '-'}
                                                </span>
                                            </td>

                                            <td className="px-4 py-4">
                                                <div className="flex items-center gap-2.5">
                                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-xs font-bold shadow-sm">
                                                        {property.user?.name ? property.user.name.charAt(0).toUpperCase() : <User className="w-4 h-4" />}
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="font-semibold text-base-content text-xs">
                                                            {property.user?.username || property.user?.name || '-'}
                                                        </span>
                                                        <span className="text-xs text-base-content/60">
                                                            {property.user?.email || '-'}
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="px-4 py-4 text-center">
                                                {property.isPublic ? (
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold bg-success/10 text-success rounded-full">
                                                        <Globe className="w-3 h-3" />
                                                        Public
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold bg-warning/10 text-warning rounded-full">
                                                        <Lock className="w-3 h-3" />
                                                        Private
                                                    </span>
                                                )}
                                            </td>

                                            <td className="px-4 py-4 text-center text-xs text-base-content/70">
                                                <div className="inline-flex items-center gap-1">
                                                    <Calendar className="w-3.5 h-3.5" />
                                                    <span>{new Date(property.created_at).toLocaleDateString()}</span>
                                                </div>
                                            </td>

                                            <td className="px-4 py-4">
                                                <div className="flex justify-center items-center gap-1.5">
                                                    <button
                                                        onClick={() => navigate(`/admin/detail-property-management/${property.id}`)}
                                                        className="btn btn-square btn-xs btn-ghost text-info hover:bg-info/10 rounded-lg"
                                                        title="Detail"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => navigate(`/admin/update-property-management/${property.id}`)}
                                                        className="btn btn-square btn-xs btn-ghost text-primary hover:bg-primary/10 rounded-lg"
                                                        title="Edit"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => DeleteData(property.id)}
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

                {/* Delete Confirmation Modal */}
                {showDeleteConfirm && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <div
                            className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
                            onClick={handleCancelDelete}
                        />
                        <div className="relative w-full max-w-md bg-base-100 rounded-2xl shadow-2xl overflow-hidden border border-base-300">
                            <div className="p-6 text-center space-y-4">
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-error/10 text-error">
                                    <AlertTriangle className="w-8 h-8" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-base-content">Delete Property</h3>
                                    <p className="text-sm text-base-content/70 mt-2">
                                        Are you sure you want to delete this property? This action cannot be undone.
                                    </p>
                                </div>
                                <div className="flex gap-3 pt-2">
                                    <button
                                        onClick={handleCancelDelete}
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