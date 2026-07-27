import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import {
    UserCog,
    Search,
    Phone,
    Mail,
    Calendar,
    ChevronLeft,
    ChevronRight,
    Loader2,
    AlertCircle,
    User as UserIcon,
    MessageSquare
} from 'lucide-react';
import api from '../../../service/api.js';

const baseUrl = api.defaults.baseURL;

export default function OwnerList() {
    const [owners, setOwners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const token = Cookies.get('token');

    const fetchOwners = async () => {
        try {
            if (!token) {
                setError('Token tidak ditemukan. Harap login terlebih dahulu.');
                setLoading(false);
                return;
            }

            const response = await axios.get(`${baseUrl}/property-owner?page=${currentPage}&limit=10&search=${searchQuery}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setOwners(response.data.data || []);
            setTotalPages(response.data.totalPages || 1);
        } catch (err) {
            setError(err.response?.data?.message || err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOwners();
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

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-base-100 to-base-200 p-4 md:p-8 flex justify-center items-center">
                <div className="text-center space-y-3">
                    <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto" />
                    <p className="text-base-content/70 font-medium">Loading property owners data...</p>
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
                        <h3 className="text-lg font-bold text-error">Failed to Load Owners</h3>
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

                {/* Page Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-base-100 p-6 rounded-2xl border border-base-300 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="p-3.5 bg-primary/10 rounded-2xl text-primary">
                            <UserCog className="w-8 h-8" />
                        </div>
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-base-content">
                                Property Owners
                            </h1>
                            <p className="text-base-content/70 text-sm mt-0.5">
                                View and manage registered property owner details and contacts
                            </p>
                        </div>
                    </div>
                </div>

                {/* Main Card Container */}
                <div className="bg-base-100 rounded-2xl border border-base-300 shadow-sm p-6 space-y-6">

                    {/* Search Bar & Pagination Stats */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="relative w-full sm:w-80">
                            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-base-content/50" />
                            <input
                                type="text"
                                className="input input-bordered w-full pl-10 rounded-xl bg-base-100 border-base-300 focus:outline-none focus:border-primary text-sm"
                                placeholder="Search by name, email, or phone..."
                                value={searchQuery}
                                onChange={handleSearch}
                            />
                        </div>

                        <div className="text-xs text-base-content/60 font-medium">
                            Showing page <span className="font-bold text-primary">{currentPage}</span> of <span className="font-bold text-primary">{totalPages}</span>
                        </div>
                    </div>

                    {/* Owners Table */}
                    {owners.length === 0 ? (
                        <div className="text-center py-16 space-y-3">
                            <UserCog className="w-12 h-12 text-base-content/30 mx-auto" />
                            <h3 className="text-lg font-bold text-base-content">No Owners Found</h3>
                            <p className="text-sm text-base-content/60">Try adjusting your search criteria.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-base-300 bg-base-200/60 text-xs font-semibold uppercase tracking-wider text-base-content/70">
                                        <th className="px-4 py-3.5 rounded-l-xl">#</th>
                                        <th className="px-4 py-3.5">Owner Info</th>
                                        <th className="px-4 py-3.5">Phone Number</th>
                                        <th className="px-4 py-3.5">WhatsApp</th>
                                        <th className="px-4 py-3.5">Email Address</th>
                                        <th className="px-4 py-3.5 text-center rounded-r-xl">Registered At</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-base-200 text-sm">
                                    {owners.map((owner, index) => (
                                        <tr key={owner.id} className="hover:bg-base-200/40 transition-colors">
                                            <td className="px-4 py-4 text-base-content/60 font-medium">
                                                {index + 1 + (currentPage - 1) * 10}
                                            </td>

                                            <td className="px-4 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-xs font-bold shadow-sm">
                                                        {owner.fullname ? owner.fullname.charAt(0).toUpperCase() : (owner.name ? owner.name.charAt(0).toUpperCase() : <UserIcon className="w-4 h-4" />)}
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="font-semibold text-base-content text-sm">
                                                            {owner.fullname || owner.name || '-'}
                                                        </span>
                                                        {owner.name && owner.fullname !== owner.name && (
                                                            <span className="text-xs text-base-content/60">
                                                                Alias: {owner.name}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="px-4 py-4 text-base-content/80 text-xs">
                                                <div className="inline-flex items-center gap-1.5">
                                                    <Phone className="w-3.5 h-3.5 text-primary" />
                                                    <span>{owner.phone || '-'}</span>
                                                </div>
                                            </td>

                                            <td className="px-4 py-4 text-base-content/80 text-xs">
                                                <div className="inline-flex items-center gap-1.5">
                                                    <MessageSquare className="w-3.5 h-3.5 text-success" />
                                                    <span>{owner.watsapp || '-'}</span>
                                                </div>
                                            </td>

                                            <td className="px-4 py-4 text-base-content/80 text-xs">
                                                <div className="inline-flex items-center gap-1.5">
                                                    <Mail className="w-3.5 h-3.5 text-info" />
                                                    <span>{owner.email || '-'}</span>
                                                </div>
                                            </td>

                                            <td className="px-4 py-4 text-center text-xs text-base-content/60">
                                                <div className="inline-flex items-center gap-1">
                                                    <Calendar className="w-3.5 h-3.5" />
                                                    <span>{new Date(owner.created_at).toLocaleDateString()}</span>
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
            </div>
        </div>
    );
}