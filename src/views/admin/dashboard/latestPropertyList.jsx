import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
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
                    setError('Token tidak ditemukan. Harap login terlebih dahulu.');
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
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    <p className="mt-4 text-primary">Loading</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="alert alert-error text-center p-4">
                    <span>{error}</span>
                </div>
            </div>
        );
    }

    return (
        <div>
            {/* Latest Property List */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Latest Property List</h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Property Code</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Number of Bathrooms</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Number of Bedrooms</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Maximum Guest</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Monthly Price</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Yearly Price</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {properties.map((property) => (
                                <tr key={property.property_code}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{property.property_code}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{property.number_of_bedrooms}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{property.number_of_bathrooms}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{property.maximum_guest}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Rp {property.monthly_price.toLocaleString()}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Rp {property.yearly_price.toLocaleString()}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(property.created_at).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${property.isPublic ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                            {property.isPublic ? 'Publik' : 'Privat'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
