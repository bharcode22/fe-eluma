import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import { ArrowLeft, Phone, Sparkles, Loader2, AlertCircle, Check } from 'lucide-react';
import api from '../../../../service/api.js';

const baseUrl = api.defaults.baseURL;

function UpdateContact() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [number, setNumber] = useState('');
    const [status, setStatus] = useState('');
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchContact = async () => {
            try {
                const token = Cookies.get('token');

                const res = await axios.get(`${baseUrl}/contact/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const contact = res.data.data;

                if (contact && contact.length > 0) {
                    setNumber(contact[0].number ?? '');
                    setStatus(contact[0].status ?? 'active');
                }
            } catch (err) {
                console.error(err);
                setError('Gagal memuat data contact');
            } finally {
                setInitialLoading(false);
            }
        };

        fetchContact();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const token = Cookies.get('token');

            await axios.patch(
                `${baseUrl}/contact/${id}`,
                { number, status },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            navigate('/admin/contact');
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Gagal update contact');
        } finally {
            setLoading(false);
        }
    };

    if (initialLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-base-100 to-base-200 p-4 md:p-8 flex justify-center items-center">
                <div className="text-center space-y-3">
                    <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto" />
                    <p className="text-base-content/70 font-medium">Loading contact data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-base-100 to-base-200 p-4 md:p-8">
            <div className="max-w-2xl mx-auto space-y-6">

                {/* Back Button & Header */}
                <div className="flex items-center gap-4 bg-base-100 p-6 rounded-2xl border border-base-300 shadow-sm">
                    <button
                        onClick={() => navigate('/admin/contact')}
                        className="btn btn-square btn-ghost rounded-xl border border-base-300 hover:bg-base-200"
                        title="Back"
                    >
                        <ArrowLeft className="w-5 h-5 text-base-content" />
                    </button>
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-base-content">
                            Update Contact
                        </h1>
                        <p className="text-base-content/70 text-sm mt-0.5">
                            Modify contact phone number and operational status
                        </p>
                    </div>
                </div>

                {/* Form Card */}
                <div className="bg-base-100 rounded-2xl border border-base-300 shadow-sm p-6 md:p-8 space-y-6">
                    {error && (
                        <div className="p-4 bg-error/10 border border-error/30 text-error rounded-2xl flex items-center gap-3">
                            <AlertCircle className="w-5 h-5 flex-shrink-0" />
                            <span className="text-sm font-medium">{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label htmlFor="phone_number" className="block text-sm font-bold text-base-content">
                                Phone / WhatsApp Number <span className="text-error">*</span>
                            </label>
                            <div className="relative">
                                <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-base-content/50" />
                                <input
                                    id="phone_number"
                                    type="text"
                                    value={number}
                                    onChange={(e) => setNumber(e.target.value)}
                                    className="input input-bordered w-full pl-10 rounded-xl bg-base-100 border-base-300 focus:outline-none focus:border-primary text-sm"
                                    placeholder="e.g. +6281234567890"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="contact_status" className="block text-sm font-bold text-base-content">
                                Status
                            </label>
                            <select
                                id="contact_status"
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                className="select select-bordered w-full rounded-xl bg-base-100 border-base-300 focus:outline-none focus:border-primary text-sm"
                            >
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </select>
                        </div>

                        <div className="flex gap-3 pt-4 border-t border-base-200">
                            <button
                                type="button"
                                onClick={() => navigate('/admin/contact')}
                                className="btn btn-outline flex-1 rounded-xl"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="btn btn-primary flex-1 shadow-lg hover:shadow-xl rounded-xl gap-2 text-white"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        <span>Saving...</span>
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="w-4 h-4" />
                                        <span>Update Contact</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>

            </div>
        </div>
    );
}

export default UpdateContact;
