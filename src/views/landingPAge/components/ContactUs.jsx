import React, { useEffect, useState } from 'react';
import Api from '../../../service/api.js';
import { useCurrency } from "../../../context/CurrencyContext.jsx";
import {
  Phone,
  MessageCircle,
  Bed,
  Bath,
  Calendar,
  DollarSign,
  Users,
  Home,
  Shield,
  Clock,
  Mail,
  MapPin,
  Star,
  ChevronRight,
  ExternalLink,
  Loader2,
  AlertCircle,
  CheckCircle,
  Building2,
  PhoneCall
} from 'lucide-react';

const ContactUs = ({ id }) => {
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const { currency, exchangeRates, convertPrice, getCurrencySymbol } = useCurrency();
  const [contacts, setContacts] = useState([]);
  const [contactLoading, setContactLoading] = useState(true);
  const [activeContact, setActiveContact] = useState(null);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const res = await Api.get(`/property/${id}`);
        setProperty(res.data.data[0]);
      } catch (error) {
        console.error('Failed to load property data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id]);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const res = await Api.get('/contact');
        setContacts(res.data.data);
        if (res.data.data.length > 0) {
          setActiveContact(res.data.data[0]);
        }
      } catch (error) {
        console.error('Failed to load contact data:', error);
      } finally {
        setContactLoading(false);
      }
    };

    fetchContacts();
  }, []);

  const formatPhoneNumber = (phone) => {
    return phone.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'text-success bg-success/10';
      case 'inactive':
        return 'text-error bg-error/10';
      case 'busy':
        return 'text-warning bg-warning/10';
      default:
        return 'text-info bg-info/10';
    }
  };

  const StatCard = ({ icon: Icon, label, value, subtext, className = '' }) => (
    <div className={`p-4 bg-gradient-to-br from-base-100 to-base-200 rounded-xl border border-base-300 ${className}`}>
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 bg-primary/10 rounded-lg">
          <Icon className="w-5 h-5 text-primary" />
        </div>
        <span className="text-sm font-medium text-base-content/60">{label}</span>
      </div>
      <div className="text-2xl font-bold text-base-content">{value}</div>
      {subtext && <div className="text-xs text-base-content/50 mt-1">{subtext}</div>}
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto" />
          <p className="text-base-content/70">Loading property details...</p>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="text-center space-y-4 p-8">
        <AlertCircle className="w-16 h-16 text-error mx-auto" />
        <h3 className="text-xl font-semibold text-error">Property Not Found</h3>
        <p className="text-base-content/70">The property you're looking for is not available.</p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-base-100 to-base-200 rounded-2xl shadow-xl border border-base-300 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-6 border-b border-base-300">
        <div className="flex items-center gap-3 mb-2">
          <MessageCircle className="w-6 h-6 text-primary" />
          <h3 className="text-2xl font-bold text-base-content">Contact Property Agent</h3>
        </div>
        <p className="text-base-content/70">Get in touch with our agents for more information</p>
      </div>

      <div className="p-6 space-y-6">
        {/* Price Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-success" />
            <h4 className="text-lg font-semibold text-base-content">Pricing Information</h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-gradient-to-br from-success/5 to-success/10 rounded-xl border border-success/20">
              <div className="flex items-center gap-3 mb-2">
                <Calendar className="w-5 h-5 text-success" />
                <span className="text-sm font-medium text-base-content/60">Monthly Rate</span>
              </div>
              <div className="text-2xl font-bold text-success">
                {getCurrencySymbol()}{convertPrice(property.monthly_price, currency, exchangeRates).toLocaleString()}
              </div>
              <div className="text-xs text-base-content/50 mt-1">Per month</div>
            </div>

            <div className="p-4 bg-gradient-to-br from-warning/5 to-warning/10 rounded-xl border border-warning/20">
              <div className="flex items-center gap-3 mb-2">
                <Calendar className="w-5 h-5 text-warning" />
                <span className="text-sm font-medium text-base-content/60">Yearly Rate</span>
              </div>
              <div className="text-2xl font-bold text-warning">
                {getCurrencySymbol()}{convertPrice(property.yearly_price, currency, exchangeRates).toLocaleString()}
              </div>
              <div className="text-xs text-base-content/50 mt-1">Save with annual plan</div>
            </div>
          </div>

          {/* Price Comparison */}
          <div className="text-center text-sm text-base-content/60">
            {currency !== 'IDR' && (
              <div className="inline-flex items-center gap-2 bg-base-200/50 px-3 py-1 rounded-full">
                <span>≈ Rp{property.monthly_price.toLocaleString()}/month</span>
                <ChevronRight className="w-3 h-3" />
                <span>Rp{property.yearly_price.toLocaleString()}/year</span>
              </div>
            )}
          </div>
        </div>

        {/* Property Stats */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Home className="w-5 h-5 text-primary" />
            <h4 className="text-lg font-semibold text-base-content">Property Details</h4>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <StatCard
              icon={Bed}
              label="Bedrooms"
              value={property.number_of_bedrooms}
              subtext="Rooms"
            />
            <StatCard
              icon={Bath}
              label="Bathrooms"
              value={property.number_of_bathrooms}
              subtext="Rooms"
            />
            {property.number_of_guests && (
              <StatCard
                icon={Users}
                label="Max Guests"
                value={property.number_of_guests}
                subtext="People"
              />
            )}
            {property.property_size && (
              <StatCard
                icon={Building2}
                label="Property Size"
                value={property.property_size}
                subtext="Square Meters"
              />
            )}
          </div>
        </div>

        {/* Contact Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Phone className="w-5 h-5 text-primary" />
              <h4 className="text-lg font-semibold text-base-content">Contact Agents</h4>
            </div>
            {contacts.length > 1 && (
              <div className="flex gap-2">
                {contacts.map((contact, index) => (
                  <button
                    key={contact.id}
                    onClick={() => setActiveContact(contact)}
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-all ${activeContact?.id === contact.id
                      ? 'bg-primary text-primary-content'
                      : 'bg-base-300 text-base-content/70 hover:bg-base-300/80'
                      }`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
            )}
          </div>

          {contactLoading ? (
            <div className="flex items-center justify-center p-8">
              <div className="text-center space-y-3">
                <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
                <p className="text-base-content/70">Loading contacts...</p>
              </div>
            </div>
          ) : contacts.length === 0 ? (
            <div className="text-center space-y-3 p-6 bg-base-200/50 rounded-xl">
              <AlertCircle className="w-12 h-12 text-warning mx-auto" />
              <p className="text-base-content">No contacts available</p>
              <p className="text-sm text-base-content/70">Please check back later or contact support</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Active Contact Card */}
              {activeContact && (
                <div className="bg-gradient-to-br from-primary/5 to-transparent rounded-xl border border-primary/20 p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <PhoneCall className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-lg font-semibold text-base-content">
                            {formatPhoneNumber(activeContact.number)}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(activeContact.status)}`}>
                              {activeContact.status || 'Available'}
                            </span>
                            <span className="text-xs text-base-content/50">
                              <Clock className="w-3 h-3 inline mr-1" />
                              24/7 Support
                            </span>
                          </div>
                        </div>
                      </div>

                      {activeContact.name && (
                        <div className="flex items-center gap-2 text-sm text-base-content/70 ml-11">
                          <Shield className="w-3 h-3" />
                          <span>Agent: {activeContact.name}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col gap-2">
                      <a
                        href={`https://wa.me/${activeContact.number.replace('+', '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-success gap-2"
                      >
                        <MessageCircle className="w-4 h-4" />
                        WhatsApp
                      </a>
                      <a
                        href={`tel:${activeContact.number}`}
                        className="btn btn-outline gap-2"
                      >
                        <Phone className="w-4 h-4" />
                        Call Now
                      </a>
                    </div>
                  </div>

                  {/* Additional Contact Info */}
                  {activeContact.email && (
                    <div className="mt-4 pt-4 border-t border-base-300">
                      <div className="flex items-center gap-3 text-sm">
                        <Mail className="w-4 h-4 text-base-content/60" />
                        <span className="text-base-content">{activeContact.email}</span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* All Contacts List */}
              {contacts.length > 1 && (
                <div className="space-y-3">
                  <div className="text-sm font-medium text-base-content/60">Other Available Contacts:</div>
                  <div className="space-y-2">
                    {contacts
                      .filter(contact => contact.id !== activeContact?.id)
                      .map((contact) => (
                        <div
                          key={contact.id}
                          className="flex items-center justify-between p-3 bg-base-200/50 hover:bg-base-300/50 rounded-lg transition-colors group"
                        >
                          <div className="flex items-center gap-3">
                            <Phone className="w-4 h-4 text-base-content/60" />
                            <div>
                              <p className="font-medium text-base-content">{formatPhoneNumber(contact.number)}</p>
                              {contact.name && (
                                <p className="text-xs text-base-content/60">{contact.name}</p>
                              )}
                            </div>
                          </div>
                          <a
                            href={`https://wa.me/${contact.number.replace('+', '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-sm btn-outline btn-success gap-2 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            Message
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* Quick Actions */}
              {/* <div className="grid grid-cols-2 gap-3 mt-4">
                <button className="btn btn-outline gap-2">
                  <Mail className="w-4 h-4" />
                  Email Inquiry
                </button>
                <button className="btn btn-primary gap-2">
                  <Calendar className="w-4 h-4" />
                  Schedule Viewing
                </button>
              </div> */}
            </div>
          )}
        </div>

        {/* Property Info Footer */}
        {/* <div className="pt-6 border-t border-base-300">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-base-content/70">
              <Shield className="w-4 h-4" />
              <span>Verified Property</span>
            </div>
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-warning fill-current" />
              <Star className="w-4 h-4 text-warning fill-current" />
              <Star className="w-4 h-4 text-warning fill-current" />
              <Star className="w-4 h-4 text-warning fill-current" />
              <Star className="w-4 h-4 text-warning fill-current" />
              <span className="ml-2 text-base-content/70">5.0</span>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default ContactUs;
