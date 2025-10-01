import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
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
                setError('Token not found. Please log in first.');
                setLoading(false);
                return;
            }

            const response = await axios.get(`${baseUrl}/property-owner?page=${currentPage}&limit=8&search=${searchQuery}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setOwners(response.data.data);
            setTotalPages(response.data.totalPages);
        } catch (err) {
            setError(err.response?.data?.message || err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOwners();
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
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold text-center text-primary mb-6">Property Owner List</h1>

            <div className="mb-5 flex justify-between items-center">
                <input
                    type="text"
                    className="input input-primary w-[50%] rounded-lg bg-secondary/20 backdrop-blur-lg shadow-lg"
                    placeholder="Search owners..."
                    value={searchQuery}
                    onChange={handleSearch}
                />
            </div>

            <div className="overflow-x-auto">
                <table className="table bg-secondary/30">
                    <thead className="bg-primary text-white sticky top-0 z-10">
                        <tr>
                            <th>No</th>
                            <th>Full Name</th>
                            <th>Name</th>
                            <th>Phone</th>
                            <th>WhatsApp</th>
                            <th>Email</th>
                            <th>Created At</th>
                        </tr>
                    </thead>
                    <tbody>
                        {owners.map((owner, index) => (
                            <tr key={owner.id} className="hover:bg-primary/40">
                                <th className="font-normal">{index + 1 + (currentPage - 1) * 8}</th>
                                <td className="font-normal">{owner.fullname || '-'}</td>
                                <td className="font-normal">{owner.name || '-'}</td>
                                <td className="font-normal">{owner.phone || '-'}</td>
                                <td className="font-normal">{owner.watsapp || '-'}</td>
                                <td className="font-normal">{owner.email || '-'}</td>
                                <td className="font-normal">{new Date(owner.created_at).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="flex justify-center items-center mt-4">
                <button
                    className="px-4 py-2 mx-2 bg-primary text-white rounded-md"
                    disabled={currentPage === 1}
                    onClick={() => handlePageChange(currentPage - 1)}
                >
                    Previous
                </button>
                <span className="text-primary font-bold">Page {currentPage} of {totalPages}</span>
                <button
                    className="px-4 py-2 mx-2 bg-primary text-white rounded-md"
                    disabled={currentPage === totalPages}
                    onClick={() => handlePageChange(currentPage + 1)}
                >
                    Next
                </button>
            </div>
        </div>
    );
}