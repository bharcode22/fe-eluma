import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import api from '../../../service/api.js';
const baseUrl = api.defaults.baseURL;

export default function UserList() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const token = Cookies.get('token');

    const fetchUsers = async () => {
        try {
            if (!token) {
                setError('Token not found. Please log in first.');
                setLoading(false);
                return;
            }

            const response = await axios.get(`${baseUrl}/users-management?page=${currentPage}&limit=8&search=${searchQuery}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setUsers(response.data.data);
            setTotalPages(response.data.totalPages);
        } catch (err) {
            setError(err.response?.data?.message || err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
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
            <h1 className="text-3xl font-bold text-center text-primary mb-6">All User List</h1>

            <div className="mb-5 flex justify-between items-center">
                <input
                    type="text"
                    className="input input-primary w-[50%] rounded-lg bg-secondary/20 backdrop-blur-lg shadow-lg"
                    placeholder="Search users..."
                    value={searchQuery}
                    onChange={handleSearch}
                />
            </div>

            <div className="overflow-x-auto">
                <table className="table bg-secondary/30">
                    <thead className="bg-primary text-white sticky top-0 z-10">
                        <tr>
                            <th>No</th>
                            <th>Username</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Status</th>
                            <th>Properties</th>
                            <th>Registered At</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user, index) => (
                            <tr key={user.id} className="hover:bg-primary/40">
                                <th className="font-normal">{index + 1 + (currentPage - 1) * 3}</th>
                                <td className="font-normal">{user.username || '-'}</td>
                                <td className="font-normal">{user.name || '-'}</td>
                                <td className="font-normal">{user.email || '-'}</td>
                                <td className="font-normal">{user.role || '-'}</td>
                                <td className="font-normal">{user.status || '-'}</td>
                                <td className="font-normal">{user._count.properties || '0'}</td>
                                <td className="font-normal">{new Date(user.created_at).toLocaleDateString()}</td>
                                <td className="px-4 py-2 mt-3 flex justify-center items-center gap-2">
                                    <button
                                        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
                                        onClick={() => window.location.href = `/admin/users-management/detail/${user.id}`}
                                    >
                                        Detail
                                    </button>
                                    <button
                                        className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/80 transition"
                                        onClick={() => window.location.href = `/admin/users-management/update/${user.id}`}
                                    >
                                        Edit
                                    </button>
                                </td>
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
