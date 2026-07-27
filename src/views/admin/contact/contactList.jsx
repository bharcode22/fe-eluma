import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { Link, useNavigate } from 'react-router-dom';
import {
    Mail,
    Phone,
    Plus,
    Edit,
    Trash2,
    Loader2,
    AlertCircle,
    AlertTriangle,
    X,
    MessageSquare
} from 'lucide-react';
import api from '../../../service/api.js';

const baseUrl = api.defaults.baseURL;

function ContactList() {
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [dataToDelete, setDataToDelete] = useState(null);

    const token = Cookies.get('token');
    const navigate = useNavigate();

    const fetchContact = async () => {
        try {
            if (!token) {
                setError('Token tidak ditemukan. Harap login terlebih dahulu.');
                setLoading(false);
                return;
            }

            const response = await axios.get(`${baseUrl}/contact/all`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setContacts(response.data.data || []);
        } catch (err) {
            setError(err.response?.data?.message || err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchContact();
        // eslint-disable-next-line
    }, []);

    const DeleteData = (contactId) => {
        setDataToDelete(contactId);
        setShowDeleteConfirm(true);
    };

    const handleDeleteData = async () => {
        try {
            await axios.delete(`${baseUrl}/contact/${dataToDelete}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            fetchContact();
            setShowDeleteConfirm(false);
            setDataToDelete(null);
        } catch (err) {
            setError(err.response?.data?.message || err.message);
            setShowDeleteConfirm(false);
            setDataToDelete(null);
        }
    };

    const handleCancelDelete = () => {
        setShowDeleteConfirm(false);
        setDataToDelete(null);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-base-100 to-base-200 p-4 md:p-8 flex justify-center items-center">
                <div className="text-center space-y-3">
                    <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto" />
                    <p className="text-base-content/70 font-medium">Loading contact numbers...</p>
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
                        <h3 className="text-lg font-bold text-error">Failed to Load Contacts</h3>
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
                            <Mail className="w-8 h-8" />
                        </div>
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-base-content">
                                Contact Management
                            </h1>
                            <p className="text-base-content/70 text-sm mt-0.5">
                                Manage contact numbers and customer support channels
                            </p>
                        </div>
                    </div>

                    <Link
                        to="/admin/add/contact"
                        className="btn btn-primary gap-2 shadow-md hover:shadow-lg self-start md:self-auto"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Add New Contact</span>
                    </Link>
                </div>

                {/* Main Card Container */}
                <div className="bg-base-100 rounded-2xl border border-base-300 shadow-sm p-6 space-y-6">

                    {contacts.length === 0 ? (
                        <div className="text-center py-16 space-y-3">
                            <MessageSquare className="w-12 h-12 text-base-content/30 mx-auto" />
                            <h3 className="text-lg font-bold text-base-content">No Contacts Found</h3>
                            <p className="text-sm text-base-content/60">Add a contact number to display support info to users.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-base-300 bg-base-200/60 text-xs font-semibold uppercase tracking-wider text-base-content/70">
                                        <th className="px-4 py-3.5 rounded-l-xl">#</th>
                                        <th className="px-4 py-3.5">Contact Number</th>
                                        <th className="px-4 py-3.5 text-center">Status</th>
                                        <th className="px-4 py-3.5 text-center rounded-r-xl">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-base-200 text-sm">
                                    {contacts.map((contact, index) => (
                                        <tr key={contact.id} className="hover:bg-base-200/40 transition-colors">
                                            <td className="px-4 py-4 text-base-content/60 font-medium">
                                                {index + 1}
                                            </td>

                                            <td className="px-4 py-4">
                                                <div className="inline-flex items-center gap-2 text-sm font-semibold text-base-content">
                                                    <div className="p-1.5 bg-primary/10 rounded-lg text-primary">
                                                        <Phone className="w-4 h-4" />
                                                    </div>
                                                    <span>{contact.number || '-'}</span>
                                                </div>
                                            </td>

                                            <td className="px-4 py-4 text-center">
                                                <span className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-full ${contact.status === 'active' || !contact.status ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'
                                                    }`}>
                                                    {contact.status || 'Active'}
                                                </span>
                                            </td>

                                            <td className="px-4 py-4">
                                                <div className="flex justify-center items-center gap-1.5">
                                                    <button
                                                        onClick={() => navigate(`/admin/update/contact/${contact.id}`)}
                                                        className="btn btn-square btn-xs btn-ghost text-primary hover:bg-primary/10 rounded-lg"
                                                        title="Edit"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => DeleteData(contact.id)}
                                                        className="btn btn-square btn-xs btn-ghost text-error hover:bg-error/10 rounded-lg"
                                                        title="Delete"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
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

                {/* Delete Confirmation Modal */}
                {showDeleteConfirm && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <div
                            className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
                            onClick={handleCancelDelete}
                        />
                        <div className="relative w-full max-w-md bg-base-100 rounded-2xl shadow-2xl overflow-hidden border border-base-300">
                            <div className="p-6 text-center space-y-4">
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-error/10 text-error">
                                    <AlertTriangle className="w-8 h-8" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-base-content">Delete Contact</h3>
                                    <p className="text-sm text-base-content/70 mt-2">
                                        Are you sure you want to delete this contact number?
                                    </p>
                                </div>
                                <div className="flex gap-3 pt-2">
                                    <button
                                        onClick={handleCancelDelete}
                                        className="btn btn-outline flex-1 gap-2 rounded-xl"
                                    >
                                        <X className="w-4 h-4" />
                                        <span>Cancel</span>
                                    </button>
                                    <button
                                        onClick={handleDeleteData}
                                        className="btn btn-error flex-1 gap-2 rounded-xl text-white"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                        <span>Delete</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}

export default ContactList;
