import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import api from '../../../../service/api.js';
import {
    User,
    Mail,
    Shield,
    CheckCircle,
    AlertCircle,
    Loader2,
    ChevronLeft,
    Save,
    Sparkles,
    UserCheck,
    Activity
} from 'lucide-react';

const baseUrl = api.defaults.baseURL;

function UpdateUser() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [userObj, setUserObj] = useState(null);
    const [role, setRole] = useState('user');
    const [status, setStatus] = useState('active');
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [error, setError] = useState(null);
    const [successMsg, setSuccessMsg] = useState('');

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const token = Cookies.get('token');
                const res = await axios.get(`${baseUrl}/users-management/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const userData = res.data?.data;
                if (userData) {
                    setUserObj(userData);
                    setRole(userData.role ?? 'user');
                    setStatus(userData.status ?? 'active');
                }
            } catch (err) {
                console.error(err);
                setError(err.response?.data?.message || 'Failed to fetch user details.');
            } finally {
                setInitialLoading(false);
            }
        };

        fetchUser();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccessMsg('');

        try {
            const token = Cookies.get('token');
            await axios.patch(
                `${baseUrl}/users-management/${id}`,
                { role, status },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setSuccessMsg('User role and status updated successfully!');
            setTimeout(() => {
                navigate('/admin/users-management');
            }, 1200);
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Failed to update user.');
        } finally {
            setLoading(false);
        }
    };

    if (initialLoading) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <div className="text-center space-y-3">
                    <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
                    <p className="text-xs text-base-content/60 font-medium">Loading user details...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-2xl mx-auto p-4 sm:p-8 space-y-6">

            {/* Top Back Navigation */}
            <div>
                <Link
                    to="/admin/users-management"
                    className="btn btn-ghost btn-sm gap-2 text-base-content/70 hover:bg-base-200 rounded-xl"
                >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Back to Users Management</span>
                </Link>
            </div>

            {/* Main Card Container */}
            <div className="bg-base-100 rounded-3xl border border-base-300 shadow-xl overflow-hidden">

                {/* Header Bar */}
                <div className="bg-gradient-to-r from-primary/10 via-secondary/5 to-transparent p-6 sm:p-8 border-b border-base-200 flex items-center justify-between gap-4">
                    <div className="space-y-1">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider">
                            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                            <span>Admin Control Panel</span>
                        </div>
                        <h2 className="text-2xl font-extrabold text-base-content tracking-tight">
                            Update User Role & Access
                        </h2>
                        <p className="text-xs text-base-content/70">
                            Modify account permissions and status for this user.
                        </p>
                    </div>

                    <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-bold text-xl shadow-sm">
                        {userObj?.name ? userObj.name.charAt(0).toUpperCase() : <User className="w-6 h-6" />}
                    </div>
                </div>

                {/* User Info Overview Box */}
                {userObj && (
                    <div className="p-6 bg-base-200/50 border-b border-base-200 grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-primary/10 text-primary rounded-xl">
                                <UserCheck className="w-4 h-4" />
                            </div>
                            <div className="overflow-hidden">
                                <div className="text-[10px] text-base-content/50 uppercase font-bold tracking-wider">Full Name</div>
                                <div className="text-xs font-bold text-base-content truncate">{userObj.name || '-'}</div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-accent/10 text-accent rounded-xl">
                                <User className="w-4 h-4" />
                            </div>
                            <div className="overflow-hidden">
                                <div className="text-[10px] text-base-content/50 uppercase font-bold tracking-wider">Username</div>
                                <div className="text-xs font-bold text-base-content truncate">@{userObj.username || '-'}</div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-secondary/10 text-secondary rounded-xl">
                                <Mail className="w-4 h-4" />
                            </div>
                            <div className="overflow-hidden">
                                <div className="text-[10px] text-base-content/50 uppercase font-bold tracking-wider">Email Address</div>
                                <div className="text-xs font-bold text-base-content truncate">{userObj.email || '-'}</div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Form Body */}
                <div className="p-6 sm:p-8 space-y-6">

                    {/* Notifications */}
                    {successMsg && (
                        <div className="p-4 rounded-2xl bg-success/10 border border-success/30 text-success text-xs font-semibold flex items-center gap-2">
                            <CheckCircle className="w-5 h-5 flex-shrink-0" />
                            <span>{successMsg}</span>
                        </div>
                    )}

                    {error && (
                        <div className="p-4 rounded-2xl bg-error/10 border border-error/30 text-error text-xs font-semibold flex items-center gap-2">
                            <AlertCircle className="w-5 h-5 flex-shrink-0" />
                            <span>{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">

                        {/* Role Select */}
                        <div className="space-y-2">
                            <label className="block text-xs font-bold text-base-content/80 uppercase tracking-wider">
                                User System Role *
                            </label>
                            <div className="relative flex items-center">
                                <Shield className="w-4 h-4 text-primary absolute left-3.5 pointer-events-none" />
                                <select
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                    className="select select-bordered w-full pl-10 rounded-xl bg-base-100 text-xs text-base-content focus:border-primary font-semibold"
                                    required
                                >
                                    <option value="user">User (Standard Access)</option>
                                    <option value="admin">Admin (Full Administrative Privileges)</option>
                                </select>
                            </div>
                        </div>

                        {/* Status Select */}
                        <div className="space-y-2">
                            <label className="block text-xs font-bold text-base-content/80 uppercase tracking-wider">
                                Account Status *
                            </label>
                            <div className="relative flex items-center">
                                <Activity className="w-4 h-4 text-primary absolute left-3.5 pointer-events-none" />
                                <select
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}
                                    className="select select-bordered w-full pl-10 rounded-xl bg-base-100 text-xs text-base-content focus:border-primary font-semibold"
                                    required
                                >
                                    <option value="active">Active (Can Sign In & Use Services)</option>
                                    <option value="inactive">Inactive / Suspended (Restricted Access)</option>
                                </select>
                            </div>
                        </div>

                        {/* Submit & Cancel Buttons */}
                        <div className="flex items-center justify-end gap-3 pt-6 border-t border-base-200">
                            <button
                                type="button"
                                onClick={() => navigate('/admin/users-management')}
                                className="btn btn-ghost btn-sm rounded-xl text-xs"
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                disabled={loading}
                                className="btn btn-primary btn-sm rounded-xl text-white font-bold gap-2 text-xs shadow-md"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                        <span>Updating...</span>
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-3.5 h-3.5" />
                                        <span>Update User Account</span>
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

export default UpdateUser;
