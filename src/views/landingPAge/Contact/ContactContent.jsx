import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Phone,
    MessageSquare,
    Mail,
    MapPin,
    Clock,
    Send,
    Loader2,
    CheckCircle,
    AlertCircle,
    Copy,
    Sparkles,
    Building2,
    ExternalLink
} from 'lucide-react';
import api from '../../../service/api';
import { ContactHotlineSkeleton } from './components/ContactSkeleton.jsx';

const baseUrl = api.defaults.baseURL;

function ContactContent() {
    const [contacts, setContacts] = useState([]);
    const [fetching, setFetching] = useState(true);
    const [fetchError, setFetchError] = useState(null);
    const [copiedId, setCopiedId] = useState(null);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
    });
    const [sending, setSending] = useState(false);
    const [formFeedback, setFormFeedback] = useState('');

    useEffect(() => {
        const fetchContacts = async () => {
            setFetching(true);
            setFetchError(null);
            try {
                const res = await axios.get(`${baseUrl}/contact`);
                const data = res.data?.data;
                if (Array.isArray(data)) {
                    setContacts(data);
                } else if (data) {
                    setContacts([data]);
                }
            } catch (err) {
                console.error('Failed to fetch contact data:', err);
                setFetchError('Unable to load contact information from server.');
            } finally {
                setFetching(false);
            }
        };

        fetchContacts();
    }, []);

    const handleCopyNumber = (num, id) => {
        navigator.clipboard.writeText(num);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        setSending(true);
        setFormFeedback('');

        // Simulate inquiry submission
        setTimeout(() => {
            setSending(false);
            setFormFeedback('Thank you! Your message has been sent successfully. Our team will contact you shortly.');
            setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
        }, 1200);
    };

    const cleanPhoneNumber = (rawNum) => {
        if (!rawNum) return '';
        let cleaned = rawNum.replace(/\D/g, '');
        if (cleaned.startsWith('0')) {
            cleaned = '62' + cleaned.slice(1);
        }
        return cleaned;
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-base-100 via-base-200/50 to-base-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto space-y-16">

                {/* 1. Header Section */}
                <div className="text-center space-y-4 max-w-3xl mx-auto">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary shadow-sm">
                        <Sparkles className="w-4 h-4 text-amber-500" />
                        <span className="text-xs sm:text-sm font-bold uppercase tracking-wider">
                            Get In Touch With Eluma
                        </span>
                    </div>

                    <h1 className="text-4xl sm:text-5xl font-extrabold text-base-content tracking-tight leading-tight">
                        We’re Here to Help You Find Your <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">Dream Property</span>
                    </h1>

                    <p className="text-base sm:text-lg text-base-content/70 font-light">
                        Have questions about a villa, investment opportunities, or property management? Reach out to our expert team anytime.
                    </p>
                </div>

                {/* 2. Direct Contact Numbers (Fetched from Database) */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-primary/10 rounded-2xl text-primary">
                                <Phone className="w-6 h-6" />
                            </div>
                            <div>
                                <h2 className="text-xl sm:text-2xl font-bold text-base-content">
                                    Direct Support Contacts
                                </h2>
                                <p className="text-xs text-base-content/60">
                                    Verified hotline numbers fetched live from our database
                                </p>
                            </div>
                        </div>

                        {contacts.length > 0 && (
                            <span className="badge badge-primary badge-outline font-semibold text-xs py-2 px-3">
                                {contacts.length} Active Hotlines
                            </span>
                        )}
                    </div>

                    {fetching ? (
                        <ContactHotlineSkeleton />
                    ) : fetchError ? (
                        <div className="p-4 rounded-2xl bg-error/10 border border-error/20 text-error flex items-center gap-3">
                            <AlertCircle className="w-5 h-5 flex-shrink-0" />
                            <span className="text-sm font-medium">{fetchError}</span>
                        </div>
                    ) : contacts.length === 0 ? (
                        <div className="bg-base-100 rounded-3xl p-8 text-center text-base-content/60 border border-base-300">
                            No active contact numbers found in the database.
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {contacts.map((item, idx) => {
                                const cleaned = cleanPhoneNumber(item.number);
                                const isCopied = copiedId === item.id;

                                return (
                                    <div
                                        key={item.id || idx}
                                        className="bg-base-100 rounded-3xl p-6 border border-base-300 shadow-sm hover:shadow-md hover:border-primary/30 transition-all duration-300 space-y-4 relative group"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="p-3 bg-success/10 text-success rounded-2xl">
                                                <MessageSquare className="w-6 h-6" />
                                            </div>
                                            <span className="badge badge-success badge-sm gap-1 text-[10px] uppercase font-bold tracking-wider">
                                                <span className="w-1.5 h-1.5 rounded-full bg-success animate-ping" />
                                                Online
                                            </span>
                                        </div>

                                        <div>
                                            <div className="text-xs font-semibold text-base-content/50 uppercase tracking-wider">
                                                Hotline #{idx + 1}
                                            </div>
                                            <div className="text-xl font-extrabold text-base-content tracking-tight mt-0.5">
                                                {item.number || 'No Number Provided'}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-base-200">
                                            {/* WhatsApp Link */}
                                            <a
                                                href={`https://wa.me/${cleaned}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="btn btn-sm btn-success text-white rounded-xl gap-1 text-xs shadow-sm hover:shadow-md"
                                                title="Chat on WhatsApp"
                                            >
                                                <MessageSquare className="w-3.5 h-3.5" />
                                                <span>WA</span>
                                            </a>

                                            {/* Phone Call Link */}
                                            <a
                                                href={`tel:${item.number}`}
                                                className="btn btn-sm btn-primary rounded-xl gap-1 text-xs text-white shadow-sm hover:shadow-md"
                                                title="Direct Call"
                                            >
                                                <Phone className="w-3.5 h-3.5" />
                                                <span>Call</span>
                                            </a>

                                            {/* Copy Number */}
                                            <button
                                                type="button"
                                                onClick={() => handleCopyNumber(item.number, item.id)}
                                                className={`btn btn-sm rounded-xl gap-1 text-xs border ${isCopied
                                                    ? 'btn-success text-white'
                                                    : 'btn-outline border-base-300 hover:bg-base-200'
                                                    }`}
                                                title="Copy Number"
                                            >
                                                {isCopied ? (
                                                    <>
                                                        <CheckCircle className="w-3.5 h-3.5" />
                                                        <span>Copied</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Copy className="w-3.5 h-3.5" />
                                                        <span>Copy</span>
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* 3. Main Grid (Form + Office Info) */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

                    {/* Left Column: Contact Form */}
                    <div className="lg:col-span-2 bg-base-100 rounded-3xl p-8 sm:p-10 border border-base-300 shadow-sm space-y-6">
                        <div className="space-y-2">
                            <h3 className="text-2xl font-bold text-base-content">
                                Send Us a Message
                            </h3>
                            <p className="text-xs sm:text-sm text-base-content/70">
                                Fill out the form below and our property advisory team will get back to you within 24 hours.
                            </p>
                        </div>

                        {formFeedback && (
                            <div className="p-4 rounded-2xl bg-success/10 border border-success/20 text-success flex items-center gap-3 text-sm">
                                <CheckCircle className="w-5 h-5 flex-shrink-0" />
                                <span>{formFeedback}</span>
                            </div>
                        )}

                        <form onSubmit={handleFormSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-base-content/70">
                                        Full Name <span className="text-error">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="e.g. John Doe"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="input input-bordered w-full rounded-2xl bg-base-100 border-base-300 focus:outline-none focus:border-primary text-sm"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-base-content/70">
                                        Email Address <span className="text-error">*</span>
                                    </label>
                                    <input
                                        type="email"
                                        required
                                        placeholder="john@example.com"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="input input-bordered w-full rounded-2xl bg-base-100 border-base-300 focus:outline-none focus:border-primary text-sm"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-base-content/70">
                                        Phone Number
                                    </label>
                                    <input
                                        type="tel"
                                        placeholder="+62 812 3456 789"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        className="input input-bordered w-full rounded-2xl bg-base-100 border-base-300 focus:outline-none focus:border-primary text-sm"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-base-content/70">
                                        Subject / Inquiry Type
                                    </label>
                                    <select
                                        value={formData.subject}
                                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                        className="select select-bordered w-full rounded-2xl bg-base-100 border-base-300 focus:outline-none focus:border-primary text-sm cursor-pointer"
                                    >
                                        <option value="">Select Topic...</option>
                                        <option value="property_buy">Buying Property</option>
                                        <option value="property_rent">Renting Villa / Apartment</option>
                                        <option value="list_property">Listing My Property</option>
                                        <option value="general">General Support</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-base-content/70">
                                    Message <span className="text-error">*</span>
                                </label>
                                <textarea
                                    required
                                    rows={4}
                                    placeholder="Tell us more about your property needs or questions..."
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    className="textarea textarea-bordered w-full rounded-2xl bg-base-100 border-base-300 focus:outline-none focus:border-primary text-sm"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={sending}
                                className="btn btn-primary w-full rounded-2xl text-white font-bold gap-2 text-sm shadow-md hover:shadow-lg"
                            >
                                {sending ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        <span>Sending Message...</span>
                                    </>
                                ) : (
                                    <>
                                        <Send className="w-4 h-4" />
                                        <span>Send Message</span>
                                    </>
                                )}
                            </button>
                        </form>
                    </div>

                    {/* Right Column: Office Info */}
                    <div className="space-y-6">

                        {/* Office Info Card */}
                        <div className="bg-base-100 rounded-3xl p-8 border border-base-300 shadow-sm space-y-6">
                            <h3 className="text-xl font-bold text-base-content border-b border-base-200 pb-4">
                                Office Information
                            </h3>

                            <div className="space-y-5">
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-primary/10 text-primary rounded-2xl flex-shrink-0">
                                        <MapPin className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <div className="text-xs font-bold text-base-content uppercase tracking-wider">
                                            Head Office
                                        </div>
                                        <div className="text-sm text-base-content/80 mt-1 leading-relaxed">
                                            Eluma Headquarters<br />
                                            Seminyak Sunset Road No. 88<br />
                                            Badung, Bali 80361 - Indonesia
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-secondary/10 text-secondary rounded-2xl flex-shrink-0">
                                        <Mail className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <div className="text-xs font-bold text-base-content uppercase tracking-wider">
                                            Email Inquiry
                                        </div>
                                        <a
                                            href="mailto:support@elumaproperty.com"
                                            className="text-sm font-semibold text-primary hover:underline mt-1 block"
                                        >
                                            support@elumaproperty.com
                                        </a>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-accent/10 text-accent rounded-2xl flex-shrink-0">
                                        <Clock className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <div className="text-xs font-bold text-base-content uppercase tracking-wider">
                                            Working Hours
                                        </div>
                                        <div className="text-sm text-base-content/80 mt-1 space-y-0.5">
                                            <p>Mon - Fri: 08:00 AM - 06:00 PM</p>
                                            <p>Saturday: 09:00 AM - 03:00 PM</p>
                                            <p className="text-xs text-base-content/50">Sunday: Closed (Online Support Available)</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Quick Consultation Callout */}
                        <div className="bg-gradient-to-br from-primary to-secondary text-primary-content rounded-3xl p-6 shadow-xl space-y-3">
                            <div className="flex items-center gap-2">
                                <Building2 className="w-5 h-5 text-white" />
                                <span className="text-xs font-bold uppercase tracking-wider text-white/90">
                                    Instant Support
                                </span>
                            </div>
                            <h4 className="text-lg font-bold text-white">
                                Need Immediate Villa Consultation?
                            </h4>
                            <p className="text-xs text-white/80 leading-relaxed">
                                Connect with our senior property advisors directly via WhatsApp for real-time villa availability and price negotiations.
                            </p>
                        </div>

                    </div>

                </div>

            </div>
        </div>
    );
}

export default ContactContent;
