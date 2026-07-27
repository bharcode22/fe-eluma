import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import NavbarAdmin from '../../../components/NavbarAdmin.jsx';
import { AuthContext } from '../../../context/AuthContext.jsx';
import api from '../../../service/api.js';
import {
  User,
  Mail,
  ShieldCheck,
  Key,
  Save,
  Loader2,
  CheckCircle,
  AlertCircle,
  Calendar,
  Edit3,
  Sparkles,
  Lock,
  ChevronLeft,
  ShieldAlert,
  UserCheck
} from 'lucide-react';
import { Link } from 'react-router-dom';

const baseUrl = api.defaults.baseURL;

export default function AdminProfile() {
  const { user: authUser, login } = useContext(AuthContext);
  const token = Cookies.get('token');

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');

  // Edit Form state
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const fetchProfile = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${baseUrl}/users/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = res.data?.data;
      setProfile(data);
      if (data) {
        setName(data.name || '');
        setUsername(data.username || '');
        setEmail(data.email || '');
      }
    } catch (err) {
      console.error('Failed to fetch admin profile:', err);
      setError(err.response?.data?.message || 'Failed to load admin profile.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchProfile();
    } else {
      setLoading(false);
      setError('You must be logged in as admin to view this profile.');
    }
  }, [token]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg('');

    if (password && password !== confirmPassword) {
      setError('Password and Confirm Password do not match.');
      return;
    }

    setUpdating(true);
    try {
      const payload = {
        name,
        username,
        email,
        ...(password.trim() !== '' ? { password } : {})
      };

      const res = await axios.patch(`${baseUrl}/users/profile`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const updatedAdmin = res.data?.data;
      setProfile(updatedAdmin);
      setSuccessMsg('Admin profile updated successfully!');
      setPassword('');
      setConfirmPassword('');
      setIsEditing(false);

      // Refresh AuthContext if login function exists
      if (login && updatedAdmin) {
        login(token, updatedAdmin);
      }
    } catch (err) {
      console.error('Failed to update admin profile:', err);
      setError(err.response?.data?.message || 'Failed to update admin profile.');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-base-200/50">
      <div>
        <NavbarAdmin />
      </div>

      <div className="flex-1 min-w-0 p-6 sm:p-8 space-y-6 max-w-5xl mx-auto">

        {/* Back Navigation */}
        <div>
          <Link
            to="/admin/dashboard"
            className="btn btn-ghost btn-sm gap-2 text-base-content/70 hover:bg-base-200 rounded-xl"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back to Admin Dashboard</span>
          </Link>
        </div>

        {/* Profile Container */}
        <div className="bg-base-100 rounded-3xl border border-base-300 shadow-xl overflow-hidden">

          {/* Banner Cover */}
          <div className="bg-gradient-to-r from-primary/20 via-primary/10 to-secondary/20 h-36 relative p-6">
            <div className="absolute top-4 right-4 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-base-100/90 backdrop-blur-md border border-base-300 text-xs font-extrabold text-primary shadow-sm">
              <ShieldCheck className="w-4 h-4 text-primary" />
              <span>Super Admin Profile</span>
            </div>
          </div>

          {/* Header Info & Avatar */}
          <div className="px-6 sm:px-10 pb-6 -mt-16 flex flex-col sm:flex-row items-center sm:items-end justify-between gap-4 border-b border-base-200">
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-5 text-center sm:text-left">
              <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-primary to-secondary text-white font-extrabold text-3xl flex items-center justify-center shadow-xl border-4 border-base-100">
                {profile?.name ? profile.name.charAt(0).toUpperCase() : 'A'}
              </div>
              <div className="space-y-1">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-base-content tracking-tight">
                  {profile?.name || 'Administrator'}
                </h1>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-xs text-base-content/70">
                  <span className="font-semibold">@{profile?.username || 'admin'}</span>
                  <span>•</span>
                  <span className="badge badge-primary font-bold text-[10px] uppercase tracking-wider gap-1">
                    <ShieldCheck className="w-3 h-3" />
                    {profile?.role || 'Admin'}
                  </span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsEditing(!isEditing)}
              className={`btn btn-sm rounded-xl gap-2 text-xs font-bold shadow-sm ${
                isEditing ? 'btn-outline border-base-300 text-base-content' : 'btn-primary text-white'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>{isEditing ? 'Cancel Edit' : 'Edit Admin Profile'}</span>
            </button>
          </div>

          {/* Content Body */}
          <div className="p-6 sm:p-10 space-y-6">

            {/* Alert Messages */}
            {successMsg && (
              <div className="p-4 rounded-2xl bg-success/10 border border-success/30 text-success text-xs font-semibold flex items-center gap-2.5">
                <CheckCircle className="w-5 h-5 flex-shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            {error && (
              <div className="p-4 rounded-2xl bg-error/10 border border-error/30 text-error text-xs font-semibold flex items-center gap-2.5">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {loading ? (
              <div className="p-12 text-center space-y-3">
                <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
                <p className="text-xs text-base-content/60 font-medium">Loading admin profile details...</p>
              </div>
            ) : isEditing ? (
              /* Edit Admin Profile Form */
              <form onSubmit={handleUpdateProfile} className="space-y-6">
                <div className="text-sm font-bold text-base-content border-b border-base-200 pb-2 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <span>Update Admin Personal Information</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-base-content/70">
                      Full Name *
                    </label>
                    <div className="relative flex items-center">
                      <User className="w-4 h-4 text-base-content/40 absolute left-3.5 pointer-events-none" />
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="input input-bordered w-full pl-10 rounded-xl bg-base-200/50 text-xs focus:border-primary"
                        placeholder="Enter full name"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-base-content/70">
                      Username *
                    </label>
                    <div className="relative flex items-center">
                      <UserCheck className="w-4 h-4 text-base-content/40 absolute left-3.5 pointer-events-none" />
                      <input
                        type="text"
                        required
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="input input-bordered w-full pl-10 rounded-xl bg-base-200/50 text-xs focus:border-primary"
                        placeholder="Enter username"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-base-content/70">
                    Email Address *
                  </label>
                  <div className="relative flex items-center">
                    <Mail className="w-4 h-4 text-base-content/40 absolute left-3.5 pointer-events-none" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="input input-bordered w-full pl-10 rounded-xl bg-base-200/50 text-xs focus:border-primary"
                      placeholder="Enter admin email address"
                    />
                  </div>
                </div>

                {/* Password Update Section */}
                <div className="pt-4 border-t border-base-200 space-y-4">
                  <div className="text-xs font-bold text-base-content uppercase tracking-wider flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-primary" />
                    <span>Security Password Change (Optional)</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-base-content/70">
                        New Password
                      </label>
                      <div className="relative flex items-center">
                        <Key className="w-4 h-4 text-base-content/40 absolute left-3.5 pointer-events-none" />
                        <input
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="input input-bordered w-full pl-10 rounded-xl bg-base-200/50 text-xs focus:border-primary"
                          placeholder="Leave blank to keep current password"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-base-content/70">
                        Confirm New Password
                      </label>
                      <div className="relative flex items-center">
                        <Key className="w-4 h-4 text-base-content/40 absolute left-3.5 pointer-events-none" />
                        <input
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="input input-bordered w-full pl-10 rounded-xl bg-base-200/50 text-xs focus:border-primary"
                          placeholder="Confirm new password"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-base-200">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="btn btn-ghost btn-sm rounded-xl text-xs"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={updating}
                    className="btn btn-primary btn-sm rounded-xl text-white font-bold gap-2 text-xs shadow-md"
                  >
                    {updating ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-3.5 h-3.5" />
                        <span>Save Admin Profile</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            ) : (
              /* Admin Profile View Cards */
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-base-200/50 rounded-2xl border border-base-300 flex items-center gap-3">
                  <div className="p-3 bg-primary/10 text-primary rounded-xl">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs text-base-content/60 font-medium">Admin Name</div>
                    <div className="text-sm font-bold text-base-content">{profile?.name || '-'}</div>
                  </div>
                </div>

                <div className="p-4 bg-base-200/50 rounded-2xl border border-base-300 flex items-center gap-3">
                  <div className="p-3 bg-secondary/10 text-secondary rounded-xl">
                    <UserCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs text-base-content/60 font-medium">Username</div>
                    <div className="text-sm font-bold text-base-content">@{profile?.username || '-'}</div>
                  </div>
                </div>

                <div className="p-4 bg-base-200/50 rounded-2xl border border-base-300 flex items-center gap-3">
                  <div className="p-3 bg-accent/10 text-accent rounded-xl">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs text-base-content/60 font-medium">Email Address</div>
                    <div className="text-sm font-bold text-base-content">{profile?.email || '-'}</div>
                  </div>
                </div>

                <div className="p-4 bg-base-200/50 rounded-2xl border border-base-300 flex items-center gap-3">
                  <div className="p-3 bg-success/10 text-success rounded-xl">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs text-base-content/60 font-medium">Access Privileges</div>
                    <div className="text-sm font-bold text-base-content capitalize">{profile?.role || 'Admin'} Administrator</div>
                  </div>
                </div>

                {profile?.created_at && (
                  <div className="sm:col-span-2 p-4 bg-base-200/50 rounded-2xl border border-base-300 flex items-center gap-3">
                    <div className="p-3 bg-warning/10 text-warning rounded-xl">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs text-base-content/60 font-medium">Admin Registration Date</div>
                      <div className="text-sm font-bold text-base-content">
                        {new Date(profile.created_at).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}
