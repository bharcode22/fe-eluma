import React, { useEffect, useState } from 'react';
import Api from '../../../service/api.js';
import {
  Phone,
  MessageCircle,
  Clock,
  Loader2,
  AlertCircle,
  CheckCircle,
  Copy,
  Send,
  Sparkles,
  ShieldCheck,
  User
} from 'lucide-react';

const ContactUs = ({ id }) => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState(null);

  // Quick Inquiry Form State
  const [inquirerName, setInquirerName] = useState('');
  const [inquirerPhone, setInquirerPhone] = useState('');
  const [inquirerMsg, setInquirerMsg] = useState('');
  const [sending, setSending] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);

  useEffect(() => {
    const fetchContacts = async () => {
      setLoading(true);
      try {
        const res = await Api.get('/contact');
        const data = res.data?.data;
        if (Array.isArray(data)) {
          setContacts(data);
        } else if (data) {
          setContacts([data]);
        }
      } catch (error) {
        console.error('Failed to load contact data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchContacts();
  }, []);

  const cleanPhoneNumber = (rawNum) => {
    if (!rawNum) return '';
    let cleaned = rawNum.replace(/\D/g, '');
    if (cleaned.startsWith('0')) {
      cleaned = '62' + cleaned.slice(1);
    }
    return cleaned;
  };

  const handleCopyNumber = (num, id) => {
    navigator.clipboard.writeText(num);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleInquirySubmit = (e) => {
    e.preventDefault();
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setSentSuccess(true);
      setInquirerName('');
      setInquirerPhone('');
      setInquirerMsg('');
      setTimeout(() => setSentSuccess(false), 4000);
    }, 1000);
  };

  return (
    <div className="bg-base-100 rounded-3xl p-6 border border-base-300 shadow-sm space-y-6">

      {/* Header Banner */}
      <div className="space-y-1 pb-4 border-b border-base-200">
        <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>Property Support & Advisory</span>
        </div>
        <h3 className="text-xl font-extrabold text-base-content tracking-tight">
          Interested in this Villa?
        </h3>
        <p className="text-xs text-base-content/70">
          Connect directly with our support team or send a quick inquiry.
        </p>
      </div>

      {/* Active Hotlines from Database */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-base-content/60">
            Available Hotlines
          </span>
          <span className="badge badge-success badge-sm gap-1 text-[10px] uppercase font-bold tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-success animate-ping" />
            Live Support
          </span>
        </div>

        {loading ? (
          <div className="p-6 text-center space-y-2 bg-base-200/50 rounded-2xl border border-base-200">
            <Loader2 className="w-6 h-6 animate-spin text-primary mx-auto" />
            <p className="text-xs text-base-content/60 font-medium">Fetching active contacts...</p>
          </div>
        ) : contacts.length === 0 ? (
          <div className="p-4 text-center text-xs text-base-content/60 bg-base-200/50 rounded-2xl border border-base-200">
            No contacts available right now.
          </div>
        ) : (
          <div className="space-y-3">
            {contacts.map((contact, idx) => {
              const cleaned = cleanPhoneNumber(contact.number);
              const isCopied = copiedId === contact.id;

              return (
                <div
                  key={contact.id || idx}
                  className="p-4 bg-gradient-to-br from-base-100 to-base-200/60 rounded-2xl border border-base-300 space-y-3 shadow-xs hover:border-primary/30 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-primary/10 text-primary rounded-xl">
                        <Phone className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-base-content">
                          {contact.number || 'Support Line'}
                        </div>
                        <div className="text-[10px] text-base-content/50">
                          {contact.name ? `Agent: ${contact.name}` : 'Property Advisor'}
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleCopyNumber(contact.number, contact.id)}
                      className={`btn btn-xs rounded-lg gap-1 border ${isCopied ? 'btn-success text-white' : 'btn-outline border-base-300'
                        }`}
                      title="Copy Number"
                    >
                      {isCopied ? <CheckCircle className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <a
                      href={`https://wa.me/${cleaned}?text=Hello,%20I%20am%20interested%20in%20property%20ID%20${id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-sm btn-success text-white rounded-xl gap-1.5 text-xs shadow-sm hover:shadow-md"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>WhatsApp</span>
                    </a>

                    <a
                      href={`tel:${contact.number}`}
                      className="btn btn-sm btn-outline rounded-xl gap-1.5 text-xs text-base-content hover:bg-base-200"
                    >
                      <Phone className="w-3.5 h-3.5 text-primary" />
                      <span>Call Agent</span>
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Trust Footer */}
      <div className="pt-3 border-t border-base-200 flex items-center justify-center gap-2 text-[11px] text-base-content/60 font-medium">
        <ShieldCheck className="w-4 h-4 text-success" />
        <span>Verified Listing & Direct Agent Support</span>
      </div>

    </div>
  );
};

export default ContactUs;
