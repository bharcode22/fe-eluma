import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { Home, Loader2, AlertCircle, Calendar, Users, Bed, Bath, Globe, Lock } from 'lucide-react';
import api from '../../../service/api.js';

const baseUrl = api.defaults.baseURL;

export default function LatestPropertyList() {
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchLatestProperties = async () => {
            try {
                const token = Cookies.get('token');
                if (!token) {
                    setError('Authentication required. Please login first.');
                    setLoading(false);
                    return;
                }

                const response = await axios.get(`${baseUrl}/dashboard/latest/property`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.data.message === 'success to get latest property data') {
                    setProperties(response.data.data);
                }
            } catch (err) {
                setError(err.response?.data?.message || err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchLatestProperties();
    }, []);

    if (loading) {
        return (
            <div className="bg-base-100 rounded-2xl border border-base-300 shadow-sm p-8 text-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-3" />
                <p className="text-base-content/70 text-sm">Loading latest property data...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-base-100 rounded-2xl border border-error/30 p-6 text-center">
                <AlertCircle className="w-8 h-8 text-error mx-auto mb-2" />
                <p className="text-error font-medium">{error}</p>
            </div>
        );
    }

    return (
        <div className="bg-base-100 rounded-2xl border border-base-300 shadow-sm p-6">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-primary/10 rounded-xl text-primary">
                    <Home className="w-5 h-5" />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-base-content">Latest Property Listings</h2>
                    <p className="text-sm text-base-content/60">Recently added properties across the platform</p>
                </div>
            </div>

            {properties.length === 0 ? (
                <div className="text-center py-12 text-base-content/60">
                    <Home className="w-12 h-12 mx-auto mb-3 text-base-content/30" />
                    <p className="text-base font-medium">No properties found yet</p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-base-300 bg-base-200/50 text-xs font-semibold uppercase tracking-wider text-base-content/70">
                                <th className="px-4 py-3.5 rounded-l-xl">Code</th>
                                <th className="px-4 py-3.5">Bedrooms</th>
                                <th className="px-4 py-3.5">Bathrooms</th>
                                <th className="px-4 py-3.5">Max Guests</th>
                                <th className="px-4 py-3.5">Monthly Price</th>
                                <th className="px-4 py-3.5">Yearly Price</th>
                                <th className="px-4 py-3.5">Created At</th>
                                <th className="px-4 py-3.5 rounded-r-xl">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-base-200 text-sm">
                            {properties.map((property) => (
                                <tr key={property.property_code} className="hover:bg-base-200/40 transition-colors">
                                    <td className="px-4 py-4 font-bold text-primary">
                                        {property.property_code}
                                    </td>
                                    <td className="px-4 py-4 text-base-content/80">
                                        <div className="flex items-center gap-1.5">
                                            <Bed className="w-4 h-4 text-primary" />
                                            <span>{property.number_of_bedrooms}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-4 text-base-content/80">
                                        <div className="flex items-center gap-1.5">
                                            <Bath className="w-4 h-4 text-primary" />
                                            <span>{property.number_of_bathrooms}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-4 text-base-content/80">
                                        <div className="flex items-center gap-1.5">
                                            <Users className="w-4 h-4 text-primary" />
                                            <span>{property.maximum_guest}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-4 font-semibold text-base-content">
                                        Rp {property.monthly_price ? property.monthly_price.toLocaleString() : 0}
                                    </td>
                                    <td className="px-4 py-4 font-semibold text-base-content">
                                        Rp {property.yearly_price ? property.yearly_price.toLocaleString() : 0}
                                    </td>
                                    <td className="px-4 py-4 text-base-content/60 text-xs">
                                        <div className="flex items-center gap-1">
                                            <Calendar className="w-3.5 h-3.5" />
                                            <span>{new Date(property.created_at).toLocaleDateString()}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-4">
                                        {property.isPublic ? (
                                            <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold bg-success/10 text-success rounded-full">
                                                <Globe className="w-3 h-3" />
                                                Publik
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold bg-warning/10 text-warning rounded-full">
                                                <Lock className="w-3 h-3" />
                                                Privat
                                            </span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
