import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import api from '../../../../service/api.js';

const baseUrl = api.defaults.baseURL;

function DetailUser() {
    const { id } = useParams();

    const [totalData, setTotalData] = useState([]);
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
                setTotalData(res.data || []);
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
            <div className="text-center py-10">
                <p>Loading data property...</p>
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
        <div className="">
            <h2 className="text-2xl font-bold mb-4">
                Property User
            </h2>
            <h2 className="text-2xl font-bold mb-4">
                totalData: {properties.length}
            </h2>

            {properties.length === 0 ? (
                <p>Tidak ada property</p>
            ) : (
                <table className="table bg-secondary/30">
                    <thead className="bg-secondary/60">
                        <tr>
                        <th className="p-3 text-left">No</th>
                        <th className="p-3 text-left">Property Title</th>
                        <th className="p-3 text-left">Property Code</th>
                        <th className="p-3 text-left">Type</th>
                        </tr>
                    </thead>
                    <tbody>
                        {properties.map((item, index) => (
                        <tr key={item.id} className="border-t hover:bg-secondary/40">
                            <td className="p-3">{index + 1}</td>
                            <td className="p-3">{item.property_tittle}</td>
                            <td className="p-3">{item.property_code}</td>
                            <td className="p-3">{item.propertyType}</td>
                        </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default DetailUser;
