import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import api from '../../../service/api.js';

const baseUrl = api.defaults.baseURL;

function ServicePage() {
    const [services, setServices] = useState([]);
    const [initialLoading, setInitialLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchServiceAdmin = async () => {
            try {
                const token = Cookies.get('token');
                const res = await axios.get(
                    `${baseUrl}/service`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                setServices(res.data.data || []);

            } catch (err) {
                console.error(err);
                setError('Gagal memuat data service');
            } finally {
                setInitialLoading(false);
            }
        };

        fetchServiceAdmin();
    }, []);

    if (initialLoading) {
        return (
            <div className="text-center py-10">
                <p>Loading data service...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-10 text-red-500">
                <p>{error}</p>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-6">
            <h2 className="text-2xl font-bold mb-6">
                Data Service
            </h2>

            {services.length === 0 ? (
                <p className="text-gray-500">Tidak ada service</p>
            ) : (
                <div className="overflow-x-auto rounded-lg border border-gray-200">
                    <table className="min-w-full bg-secondary/30">
                        <thead className="bg-secondary/60">
                            <tr>
                                <th className="p-4 text-left font-semibold">No</th>
                                <th className="p-4 text-left font-semibold">Service Name</th>
                                <th className="p-4 text-left font-semibold">Status</th>
                                <th className="p-4 text-left font-semibold">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {services.map((item, index) => (
                                <tr key={item.id} className="border-t hover:bg-secondary/40 transition-colors">
                                    <td className="p-4 align-middle">{index + 1}</td>
                                    <td className="p-4 align-middle">{item.service_name}</td>
                                    <td className="p-4 align-middle">
                                        <span className={`px-3 py-1 rounded-full text-sm ${item.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                            {item.status}
                                        </span>
                                    </td>
                                    <td className="p-4 align-middle">
                                        <div className="flex flex-wrap gap-2">
                                            <button
                                                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition text-sm"
                                                onClick={() => window.location.href = `/admin/update/service/${item.id}`}
                                            >
                                                Edit
                                            </button>

                                            <button
                                                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition text-sm"
                                                onClick={() => console.log('Delete service:', item.id)}
                                            >
                                                Delete
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
    )
}

export default ServicePage;