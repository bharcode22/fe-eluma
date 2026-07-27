import React, { useEffect, useState, useRef, useContext } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { AuthContext } from '../../context/AuthContext.jsx';
import NavbarUsers from '../../components/NavbarUser.jsx';
import FooterLandingPage from '../../components/FooterLandingPage.jsx';
import { useLanguage } from '../../context/LanguageContext.jsx';
import { translateNodes } from '../../utils/translator.js';
import api from '../../service/api.js';
import {
  User,
  Mail,
  Shield,
  Key,
  Save,
  Loader2,
  CheckCircle,
  AlertCircle,
  Calendar,
  Edit3,
  Sparkles,
  Lock,
  ChevronLeft
} from 'lucide-react';
import { Link } from 'react-router-dom';

const baseUrl = api.defaults.baseURL;

function UserProfile() {
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

  const divRef = useRef(null);
  const { lang } = useLanguage();

  useEffect(() => {
    if (divRef.current) {
      translateNodes(divRef.current, lang);
    }
  }, [lang]);

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
      console.error('Failed to fetch profile:', err);
      setError(err.response?.data?.message || 'Failed to load user profile.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchProfile();
    } else {
      setLoading(false);
      setError('You must be logged in to view your profile.');
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

      const updatedUser = res.data?.data;
      setProfile(updatedUser);
      setSuccessMsg('Profile updated successfully!');
      setPassword('');
      setConfirmPassword('');
      setIsEditing(false);

      // Refresh AuthContext user if login function exists
      if (login && updatedUser) {
        login(token, updatedUser);
      }
    } catch (err) {
      console.error('Failed to update profile:', err);
      setError(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div ref={divRef} className="min-h-screen bg-gradient-to-b from-base-100 via-base-200/50 to-base-100 flex flex-col">
      <NavbarUsers />

      <main className="flex-grow max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 w-full">

        {/* Back Navigation */}
        <div>
          <Link
            to="/user/home"
            className="btn btn-ghost btn-sm gap-2 text-base-content/70 hover:bg-base-200 rounded-xl"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </Link>
        </div>

        {/* Profile Card Container */}
        <div className="bg-base-100 rounded-3xl border border-base-300 shadow-xl overflow-hidden">

          {/* Banner Cover Glow */}
          <div className="bg-gradient-to-r from-primary/20 via-secondary/15 to-accent/20 h-36 relative">
            <div className="absolute top-4 right-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-base-100/80 backdrop-blur-md border border-base-300 text-xs font-bold text-primary">
              <Sparkles className="w-3.5 h-3.5" />
              <span>User Account Profile</span>
            </div>
          </div>

          {/* Header Info & Avatar */}
          <div className="px-6 sm:px-10 pb-6 -mt-16 flex flex-col sm:flex-row items-center sm:items-end justify-between gap-4 border-b border-base-200">
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-5 text-center sm:text-left">
              <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-primary to-secondary text-white font-extrabold text-3xl flex items-center justify-center shadow-xl border-4 border-base-100">
                {profile?.name ? profile.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="space-y-1">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-base-content tracking-tight">
                  {profile?.name || 'User Name'}
                </h1>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-xs text-base-content/70">
                  <span className="font-medium">@{profile?.username || 'username'}</span>
                  <span>•</span>
                  <span className="badge badge-primary font-bold text-[10px] uppercase tracking-wider">
                    {profile?.role || 'User'}
                  </span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsEditing(!isEditing)}
              className={`btn btn-sm rounded-xl gap-2 text-xs font-bold shadow-sm ${isEditing ? 'btn-outline border-base-300 text-base-content' : 'btn-primary text-white'
                }`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>{isEditing ? 'Cancel Edit' : 'Edit Profile'}</span>
            </button>
          </div>

          {/* Alert Messages */}
          <div className="p-6 sm:p-10 space-y-6">
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
                <p className="text-xs text-base-content/60 font-medium">Loading user profile...</p>
              </div>
            ) : isEditing ? (
              /* Edit Profile Form */
              <form onSubmit={handleUpdateProfile} className="space-y-6">
                <div className="text-sm font-bold text-base-content border-b border-base-200 pb-2">
                  Update Account Details
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-base-content/70">
                      Full Name *
                    </label>
                    <div className="relative flex items-center">
                      <User className="w-4 h-4 text-base-content/40 absolute left-3.5" />
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
                      <User className="w-4 h-4 text-base-content/40 absolute left-3.5" />
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
                    <Mail className="w-4 h-4 text-base-content/40 absolute left-3.5" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="input input-bordered w-full pl-10 rounded-xl bg-base-200/50 text-xs focus:border-primary"
                      placeholder="Enter email address"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-base-200 space-y-4">
                  <div className="text-xs font-bold text-base-content uppercase tracking-wider flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-primary" />
                    <span>Change Password (Optional)</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-base-content/70">
                        New Password
                      </label>
                      <div className="relative flex items-center">
                        <Key className="w-4 h-4 text-base-content/40 absolute left-3.5" />
                        <input
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="input input-bordered w-full pl-10 rounded-xl bg-base-200/50 text-xs focus:border-primary"
                          placeholder="Leave blank to keep unchanged"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-base-content/70">
                        Confirm New Password
                      </label>
                      <div className="relative flex items-center">
                        <Key className="w-4 h-4 text-base-content/40 absolute left-3.5" />
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
                        <span>Save Changes</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            ) : (
              /* Profile Information View Cards */
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-base-200/50 rounded-2xl border border-base-300 flex items-center gap-3">
                  <div className="p-3 bg-primary/10 text-primary rounded-xl">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs text-base-content/60 font-medium">Full Name</div>
                    <div className="text-sm font-bold text-base-content">{profile?.name || '-'}</div>
                  </div>
                </div>

                <div className="p-4 bg-base-200/50 rounded-2xl border border-base-300 flex items-center gap-3">
                  <div className="p-3 bg-secondary/10 text-secondary rounded-xl">
                    <User className="w-5 h-5" />
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
                  <div className="p-3 bg-info/10 text-info rounded-xl">
                    <Shield className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs text-base-content/60 font-medium">Account Role</div>
                    <div className="text-sm font-bold text-base-content capitalize">{profile?.role || 'User'}</div>
                  </div>
                </div>

                {profile?.createdAt && (
                  <div className="sm:col-span-2 p-4 bg-base-200/50 rounded-2xl border border-base-300 flex items-center gap-3">
                    <div className="p-3 bg-warning/10 text-warning rounded-xl">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs text-base-content/60 font-medium">Member Since</div>
                      <div className="text-sm font-bold text-base-content">
                        {new Date(profile.createdAt).toLocaleDateString('en-US', {
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

      </main>

      <FooterLandingPage />
    </div>
  );
}

export default UserProfile;
