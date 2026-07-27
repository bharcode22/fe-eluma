import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import { ArrowLeft, Phone, Plus, Loader2, AlertCircle } from 'lucide-react';
import api from '../../../../service/api.js';

const baseUrl = api.defaults.baseURL;

function AddContact() {
    const navigate = useNavigate();
    const [number, setNumber] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const token = Cookies.get('token');

            await axios.post(`${baseUrl}/contact`,
                {
                    number: number,
                },
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
            setError(err.response?.data?.message || 'Gagal menambahkan contact');
        } finally {
            setLoading(false);
        }
    };

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
                            Add New Contact
                        </h1>
                        <p className="text-base-content/70 text-sm mt-0.5">
                            Create a new customer support phone number for your platform
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
                            <p className="text-xs text-base-content/60">Include international country code for WhatsApp compatibility.</p>
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
                                        <Plus className="w-4 h-4" />
                                        <span>Save Contact</span>
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

export default AddContact;
