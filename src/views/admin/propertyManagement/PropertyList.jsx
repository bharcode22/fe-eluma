import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
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

    useEffect(() => {
        const fetchProperties = async () => {
            try {
                const token = Cookies.get('token');
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
                    setProperties(response.data.data);
                    setTotalPages(response.data.meta.totalPages);
                }
            } catch (err) {
                setError(err.response?.data?.message || err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProperties();
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
            fetchData();
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
            <h1 className="text-3xl font-bold text-center text-primary mb-6">All Property List</h1>

            <div className="mb-5 flex justify-between items-center">
                <input
                    type="text"
                    className="input input-primary w-[50%] rounded-lg bg-secondary/20 backdrop-blur-lg shadow-lg"
                    placeholder="Search properties..."
                    value={searchQuery}
                    onChange={handleSearch}
                />
                <button
                    className="btn btn-primary rounded-lg shadow-lg"
                    onClick={() => console.log('Add Property button clicked')}
                >
                    Add Property
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="table bg-secondary/30">
                    <thead className="bg-primary text-white sticky top-0 z-10">
                        <tr>
                            <th>No</th>
                            <th className=''>Property Title</th>
                            <th className='text-center'>Property Code</th>
                            <th className='text-center'>Room Info</th>
                            <th className='text-center'>Status</th>
                            <th className='text-center'>Listed At</th>
                            <th className='text-center'>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {properties.map((property, index) => (
                            <tr key={property.id} className="hover:bg-primary/40">
                                <th className="font-normal">{index + 1 + (currentPage - 1) * 8}</th>
                                <td className="font-normal">{property.property_tittle || '-'}</td>
                                <td className="font-normal text-center bg-secondary/50 rounded-md px-4 py-2 mt-3 flex items-center justify-center">
                                    {property.property_code || '-'}
                                </td>
                                <td className="font-normal text-center">
                                    <div className='flex justify-center gap-x-4'>
                                        <p>Bedrooms: {property.number_of_bedrooms || '-'}</p>
                                        <p>Bathrooms: {property.number_of_bathrooms || '-'}</p>
                                    </div>
                                </td>
                                <td className="text-center">
                                    <span
                                        className={`inline-flex items-center justify-center text-sm font-medium rounded-md px-4 py-2 
                                        ${property.isPublic 
                                            ? 'bg-green-100 text-green-800 border border-green-300' 
                                            : 'bg-red-100 text-red-800 border border-red-300'
                                        }`}
                                    >
                                        {property.isPublic ? 'Public' : 'Private'}
                                    </span>
                                </td>
                                <td className="font-normal text-center">{new Date(property.created_at).toLocaleDateString()}</td>
                                <td className="px-4 py-2 mt-3 flex justify-center items-center gap-2">
                                    <button
                                        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
                                        onClick={() => window.location.href = `/detail/${property.id}`}
                                    >
                                        Detail
                                    </button>
                                    <button
                                        className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/80 transition"
                                        onClick={() => window.location.href = `/admin/update-property-management/${property.id}`}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
                                        onClick={() => DeleteData(property.id)}
                                    >
                                        Delete
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
            {showDeleteConfirm && (
                <div className="fixed inset-0 bg-slate-800/15 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-secondary/50 backdrop-blur-2xl rounded-lg p-6 w-full max-w-md text-center">
                        <h3 className="text-lg font-bold mb-4">Konfirmasi Hapus</h3>
                        <p className="mb-6">Apakah Anda yakin ingin menghapus properti ini?</p>
                        <div className="flex justify-center gap-4">
                            <button
                                onClick={handleCancelDelete}
                                className="btn bg-gray-300 hover:bg-gray-400 text-gray-800"
                            >
                                Batal
                            </button>
                            <button
                                onClick={handleConfirmDelete}
                                className="btn bg-error hover:bg-red-700 text-white"
                            >
                                Hapus
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}