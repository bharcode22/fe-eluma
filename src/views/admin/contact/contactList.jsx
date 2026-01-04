import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import api from '../../../service/api.js';
const baseUrl = api.defaults.baseURL;

function contactList() {
    const [contacts, setcontacts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [dataToDelete, setdataToDelete] = useState(null);
    const token = Cookies.get('token');

    const fetchContact = async () => {
        try {
            if (!token) {
                setError('Token not found. Please log in first.');
                setLoading(false);
                return;
            }

            const response = await axios.get(`${baseUrl}/contact/all`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setcontacts(response.data.data);
        } catch (err) {
            setError(err.response?.data?.message || err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchContact();
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

    const DeleteData = (contactId) => {
        setdataToDelete(contactId);
        setShowDeleteConfirm(true);
    };

    const handleDeleteData = async () => {
        try {
            await axios.delete(`${baseUrl}/contact/${dataToDelete}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            fetchContact();
            setShowDeleteConfirm(false);
            setdataToDelete(null);
        } catch (err) {
            setError(err.response?.data?.message || err.message);
            setShowDeleteConfirm(false);
            setdataToDelete(null);
        }
    };

    const handleCancelDelete = () => {
        setShowDeleteConfirm(false);
        setdataToDelete(null);
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold text-center text-primary mb-6">Contact List</h1>

            <div className="mb-5 flex justify-between items-center">
                <a className="btn btn-primary rounded-lg shadow-lg" href="/admin/add/contact" >
                        Add Contact
                </a>
            </div>

            <div className="overflow-x-auto">
                <table className="table bg-secondary/30">
                    <thead className="bg-primary text-white sticky top-0 z-10">
                        <tr>
                            <th>No</th>
                            <th>Number</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {contacts.map((contact, index) => (
                            <tr key={contact.id} className="hover:bg-primary/40">
                                <th className="font-normal">{index + 1 }</th>
                                <td className="font-normal">{contact.number || '-'}</td>
                                <td className="font-normal">{contact.status || '-'}</td>
                                <td className="px-4 py-2 mt-3 flex justify-center items-center gap-2">
                                    <button
                                        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
                                        onClick={() => window.location.href = `/admin/update/contact/${contact.id}`}
                                    >
                                        Edit
                                    </button>

                                    <button
                                        className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
                                        onClick={() => DeleteData(contact.id)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
                {showDeleteConfirm && (
                    <div className="fixed inset-0 bg-slate-800/15 backdrop-blur-sm flex items-center justify-center z-50">
                        <div className="bg-secondary/50 backdrop-blur-2xl rounded-lg p-6 w-full max-w-md text-center">
                            <h3 className="text-lg font-bold mb-4">Konfirmasi Hapus</h3>
                            <p className="mb-6">Apakah Anda yakin ingin menghapus contact ini?</p>
                            <div className="flex justify-center gap-4">
                                <button
                                    onClick={handleCancelDelete}
                                    className="btn bg-gray-300 hover:bg-gray-400 text-gray-800"
                                >
                                    Batal
                                </button>
                                <button
                                    onClick={handleDeleteData}
                                    className="btn bg-error hover:bg-red-700 text-white"
                                >
                                    Hapus
                                </button>
                            </div>
                        </div>
                    </div>
                )}
        </div>
    )
}

export default contactList
