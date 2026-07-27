import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import {
    ArrowLeft,
    Building,
    Eye,
    Loader2,
    AlertCircle,
    Package,
    Layers
} from 'lucide-react';
import api from '../../../../service/api.js';

const baseUrl = api.defaults.baseURL;

function DetailUser() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [properties, setProperties] = useState([]);
    const [initialLoading, setInitialLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPropertyUsers = async () => {
            try {
                const token = Cookies.get('token');

                const res = await axios.get(
                    `${baseUrl}/users-management/propery/${id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                setProperties(res.data?.data || []);
            } catch (err) {
                console.error(err);
                setError('Gagal memuat data property user');
            } finally {
                setInitialLoading(false);
            }
        };

        fetchPropertyUsers();
    }, [id]);

    if (initialLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-base-100 to-base-200 p-4 md:p-8 flex justify-center items-center">
                <div className="text-center space-y-3">
                    <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto" />
                    <p className="text-base-content/70 font-medium">Loading user properties...</p>
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
                        onClick={() => navigate('/admin/users-management')}
                        className="btn btn-primary gap-2 shadow-md"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to User List
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-base-100 to-base-200 p-4 md:p-8">
            <div className="max-w-7xl mx-auto space-y-6">

                {/* Back Button & Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-base-100 p-6 rounded-2xl border border-base-300 shadow-sm">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/admin/users-management')}
                            className="btn btn-square btn-ghost rounded-xl border border-base-300 hover:bg-base-200"
                            title="Back"
                        >
                            <ArrowLeft className="w-5 h-5 text-base-content" />
                        </button>
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="text-2xl md:text-3xl font-bold text-base-content">
                                    User's Properties
                                </h1>
                                <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-bold bg-primary/10 text-primary rounded-full border border-primary/20">
                                    {properties.length} Total Properties
                                </span>
                            </div>
                            <p className="text-base-content/70 text-sm mt-0.5">
                                Properties created and managed by this user account
                            </p>
                        </div>
                    </div>
                </div>

                {/* Main Content Card */}
                <div className="bg-base-100 rounded-2xl border border-base-300 shadow-sm p-6 space-y-6">

                    {properties.length === 0 ? (
                        <div className="text-center py-16 space-y-3">
                            <Package className="w-12 h-12 text-base-content/30 mx-auto" />
                            <h3 className="text-lg font-bold text-base-content">No Properties Found</h3>
                            <p className="text-sm text-base-content/60">This user has not listed any properties yet.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-base-300 bg-base-200/60 text-xs font-semibold uppercase tracking-wider text-base-content/70">
                                        <th className="px-4 py-3.5 rounded-l-xl">#</th>
                                        <th className="px-4 py-3.5">Property Title</th>
                                        <th className="px-4 py-3.5 text-center">Code</th>
                                        <th className="px-4 py-3.5 text-center">Type</th>
                                        <th className="px-4 py-3.5 text-center rounded-r-xl">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-base-200 text-sm">
                                    {properties.map((item, index) => (
                                        <tr key={item.id} className="hover:bg-base-200/40 transition-colors">
                                            <td className="px-4 py-4 text-base-content/60 font-medium">
                                                {index + 1}
                                            </td>

                                            <td className="px-4 py-4 font-semibold text-base-content">
                                                {item.property_tittle || '-'}
                                            </td>

                                            <td className="px-4 py-4 text-center">
                                                <span className="inline-block px-2.5 py-1 rounded-lg bg-primary/10 text-primary font-mono text-xs font-bold border border-primary/20">
                                                    {item.property_code || '-'}
                                                </span>
                                            </td>

                                            <td className="px-4 py-4 text-center">
                                                <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold bg-base-200 text-base-content/80 rounded-full capitalize">
                                                    <Layers className="w-3 h-3 text-primary" />
                                                    {item.propertyType || '-'}
                                                </span>
                                            </td>

                                            <td className="px-4 py-4">
                                                <div className="flex justify-center items-center">
                                                    <button
                                                        onClick={() => navigate(`/admin/detail-property-management/${item.id}`)}
                                                        className="btn btn-square btn-xs btn-ghost text-info hover:bg-info/10 rounded-lg"
                                                        title="Detail"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}

export default DetailUser;
