import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Building,
  Calendar,
  DollarSign,
  FileText,
  CheckCircle2,
  Car,
  Eye,
  MapPin,
  User,
  Shield,
  Loader2,
  AlertCircle,
  X,
  ChevronLeft,
  ChevronRight,
  Info,
  Globe,
  Lock,
  Sparkles
} from 'lucide-react';
import Api from '../../../../service/api.js';
import { useLanguage } from "../../../../context/LanguageContext.jsx";
import { translateNodes } from "../../../../utils/translator.js";
import { useCurrency } from "../../../../context/CurrencyContext.jsx";

function DetailPropertyManagement() {
  const { id } = useParams();
  const navigate = useNavigate();
  const baseUrl = Api.defaults.baseURL;
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sanitizedHTML, setSanitizedHTML] = useState('');
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);

  const divRef = useRef(null);
  const { lang } = useLanguage();
  const { currency, exchangeRates, convertPrice, getCurrencySymbol } = useCurrency();

  useEffect(() => {
    if (divRef.current) {
      translateNodes(divRef.current, lang);
    }
  }, [lang]);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const res = await Api.get(`/property/${id}`);
        setProperty(res.data.data[0]);
      } catch (error) {
        console.error('Gagal memuat data properti:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id]);

  useEffect(() => {
    let isMounted = true;

    const sanitize = async () => {
      if (property && property.description) {
        try {
          const module = await import("dompurify");
          const clean = module.default.sanitize(property.description);
          if (isMounted) setSanitizedHTML(clean);
        } catch (err) {
          console.error("Gagal import DOMPurify:", err);
        }
      }
    };

    sanitize();
    return () => {
      isMounted = false;
    };
  }, [property]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-base-100 to-base-200 p-4 md:p-8 flex justify-center items-center">
        <div className="text-center space-y-3">
          <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto" />
          <p className="text-base-content/70 font-medium">Loading property details...</p>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-base-100 to-base-200 p-4 md:p-8 flex justify-center items-center">
        <div className="bg-base-100 rounded-2xl border border-error/30 p-8 text-center max-w-md shadow-xl space-y-4">
          <div className="w-14 h-14 bg-error/10 text-error rounded-full flex items-center justify-center mx-auto">
            <AlertCircle className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-error">Property Not Found</h3>
            <p className="text-base-content/70 text-sm mt-1">The requested property does not exist or has been deleted.</p>
          </div>
          <button
            onClick={() => navigate('/admin/property-management')}
            className="btn btn-primary gap-2 shadow-md"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Property List
          </button>
        </div>
      </div>
    );
  }

  return (
    <div ref={divRef} className="min-h-screen bg-gradient-to-b from-base-100 to-base-200 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Back Button & Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-base-100 p-6 rounded-2xl border border-base-300 shadow-sm">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/admin/property-management')}
              className="btn btn-square btn-ghost rounded-xl border border-base-300 hover:bg-base-200"
              title="Back"
            >
              <ArrowLeft className="w-5 h-5 text-base-content" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-primary/10 text-primary font-mono text-xs font-bold border border-primary/20">
                  {property.property_code}
                </span>
                {property.isPublic ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-semibold bg-success/10 text-success rounded-full">
                    <Globe className="w-3 h-3" />
                    Public
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-semibold bg-warning/10 text-warning rounded-full">
                    <Lock className="w-3 h-3" />
                    Private
                  </span>
                )}
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-base-content mt-1">
                {property.property_tittle || `Property #${property.property_code}`}
              </h1>
            </div>
          </div>

          <Link
            to={`/admin/update-property-management/${property.id}`}
            className="btn btn-primary gap-2 shadow-md self-start md:self-auto"
          >
            <Sparkles className="w-4 h-4" />
            <span>Edit Property</span>
          </Link>
        </div>

        {/* Image Gallery Grid */}
        <div className="bg-base-100 p-6 rounded-2xl border border-base-300 shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-base-content flex items-center gap-2">
            <Building className="w-5 h-5 text-primary" />
            <span>Property Gallery</span>
            <span className="text-xs font-normal text-base-content/60">({property.images?.length || 0} images)</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {property.images?.map((img, index) => (
              <div key={img.id} className="relative group overflow-hidden rounded-xl border border-base-300 shadow-sm bg-base-200">
                <img
                  src={`${baseUrl}${img.imagesUrl}`}
                  alt={img.imageName}
                  onClick={() => setSelectedImageIndex(index)}
                  className="w-full h-48 object-cover cursor-pointer group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Image Carousel Modal */}
        {selectedImageIndex !== null && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
            <div className="relative w-full max-w-4xl bg-base-100 rounded-2xl shadow-2xl overflow-hidden border border-base-300">
              <button
                onClick={() => setSelectedImageIndex(null)}
                className="absolute top-4 right-4 z-50 btn btn-circle btn-sm bg-base-100/80 hover:bg-base-100 border border-base-300 text-base-content"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="relative flex items-center justify-center p-4">
                <img
                  src={`${baseUrl}${property.images[selectedImageIndex]?.imagesUrl}`}
                  alt="Selected"
                  className="max-h-[75vh] w-auto object-contain rounded-xl"
                />
                {property.images.length > 1 && (
                  <div className="absolute left-4 right-4 top-1/2 -translate-y-1/2 flex justify-between pointer-events-none">
                    <button
                      onClick={() =>
                        setSelectedImageIndex(
                          selectedImageIndex === 0
                            ? property.images.length - 1
                            : selectedImageIndex - 1
                        )
                      }
                      className="btn btn-circle btn-sm bg-base-100/90 hover:bg-base-100 border border-base-300 pointer-events-auto shadow-md"
                    >
                      <ChevronLeft className="w-4 h-4 text-base-content" />
                    </button>
                    <button
                      onClick={() =>
                        setSelectedImageIndex(
                          selectedImageIndex === property.images.length - 1
                            ? 0
                            : selectedImageIndex + 1
                        )
                      }
                      className="btn btn-circle btn-sm bg-base-100/90 hover:bg-base-100 border border-base-300 pointer-events-auto shadow-md"
                    >
                      <ChevronRight className="w-4 h-4 text-base-content" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Info Grid: Price, Description, Facilities, Availability */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Pricing Card */}
          <div className="bg-base-100 p-6 rounded-2xl border border-base-300 shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-xl text-primary">
                <DollarSign className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-base-content">Pricing Information</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="bg-base-200/50 p-4 rounded-xl border border-base-300/80">
                <span className="text-xs text-base-content/60 font-medium">Daily Rate</span>
                <p className="text-lg font-bold text-primary mt-1">
                  {getCurrencySymbol()}{convertPrice(property.price, currency, exchangeRates)}
                </p>
              </div>
              <div className="bg-base-200/50 p-4 rounded-xl border border-base-300/80">
                <span className="text-xs text-base-content/60 font-medium">Monthly Rate</span>
                <p className="text-lg font-bold text-primary mt-1">
                  {getCurrencySymbol()}{convertPrice(property.monthly_price, currency, exchangeRates)}
                </p>
              </div>
              <div className="bg-base-200/50 p-4 rounded-xl border border-base-300/80">
                <span className="text-xs text-base-content/60 font-medium">Yearly Rate</span>
                <p className="text-lg font-bold text-primary mt-1">
                  {getCurrencySymbol()}{convertPrice(property.yearly_price, currency, exchangeRates)}
                </p>
              </div>
            </div>
          </div>

          {/* Availability Card */}
          <div className="bg-base-100 p-6 rounded-2xl border border-base-300 shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-xl text-primary">
                <Calendar className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-base-content">Availability & Stay</h2>
            </div>
            <div className="space-y-3 pt-2">
              {property.availability?.map((a) => (
                <div key={a.id} className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-base-200/50 rounded-xl border border-base-300/80 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-primary" />
                    <div>
                      <span className="text-xs text-base-content/60">From</span>
                      <p className="text-sm font-semibold text-base-content">{new Date(a.available_from).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="p-3 bg-base-200/50 rounded-xl border border-base-300/80 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-primary" />
                    <div>
                      <span className="text-xs text-base-content/60">To</span>
                      <p className="text-sm font-semibold text-base-content">{new Date(a.available_to).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              ))}
              <div className="text-xs text-base-content/60 pt-1">
                Minimum stay requirement: <span className="font-semibold text-base-content">{property.minimum_stay || 1} months</span>
              </div>
            </div>
          </div>

        </div>

        {/* Description Section */}
        <div className="bg-base-100 p-6 rounded-2xl border border-base-300 shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-xl text-primary">
              <FileText className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-base-content">Description</h2>
          </div>
          <div
            className="prose max-w-none text-base-content/80 text-sm leading-relaxed pt-2"
            dangerouslySetInnerHTML={{ __html: sanitizedHTML }}
          />
        </div>

        {/* Facilities Section */}
        {property.facilities && property.facilities[0] && (
          <div className="bg-base-100 p-6 rounded-2xl border border-base-300 shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-xl text-primary">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-base-content">Facilities & Amenities</h2>
            </div>
            <div className="flex flex-wrap gap-2 pt-2">
              {Object.entries(property.facilities[0])
                .filter(([key, val]) => typeof val === 'boolean' && val)
                .map(([key]) => (
                  <span
                    key={key}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary/10 text-primary text-xs font-semibold border border-primary/20 capitalize"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{key.replace(/_/g, ' ')}</span>
                  </span>
                ))}
            </div>
          </div>
        )}

        {/* Additional Details (Parking, Views, Cleaning) */}
        <div className="bg-base-100 p-6 rounded-2xl border border-base-300 shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-xl text-primary">
              <Info className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-base-content">Additional Details</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            {(() => {
              const detailsArr = Array.isArray(property?.additionalDetails)
                ? property.additionalDetails
                : (property?.additionalDetails ? [property.additionalDetails] : []);

              if (detailsArr.length === 0) {
                return <p className="text-sm text-base-content/60">No additional details recorded.</p>;
              }

              return detailsArr.map((detail) => (
                <React.Fragment key={detail.id}>
                  {/* Cleaning Info */}
                  <div className="p-4 bg-base-200/50 rounded-xl border border-base-300/80 space-y-2">
                    <h3 className="font-bold text-sm text-base-content flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-primary" />
                      Cleaning Services
                    </h3>
                    <p className="text-xs text-base-content/70">
                      Frequency: <span className="font-semibold text-base-content">{detail.cleaning_requency || '-'}</span>
                    </p>
                    <p className="text-xs text-base-content/70">
                      Linen Change: <span className="font-semibold text-base-content">{detail.linen_chaneg || '-'}</span>
                    </p>
                  </div>

                  {/* Parking Info */}
                  <div className="p-4 bg-base-200/50 rounded-xl border border-base-300/80 space-y-2">
                    <h3 className="font-bold text-sm text-base-content flex items-center gap-2">
                      <Car className="w-4 h-4 text-primary" />
                      Parking Options
                    </h3>
                    <div className="text-xs text-base-content/70 space-y-1">
                      {(detail.parking || detail.Parking)?.car_parking && <p>✓ Car Parking Available</p>}
                      {(detail.parking || detail.Parking)?.bike_parking && <p>✓ Motorcycle Parking</p>}
                      {(detail.parking || detail.Parking)?.both_car_and_bike && <p>✓ Car & Motorcycle Parking</p>}
                    </div>
                  </div>

                  {/* View Info */}
                  <div className="p-4 bg-base-200/50 rounded-xl border border-base-300/80 space-y-2">
                    <h3 className="font-bold text-sm text-base-content flex items-center gap-2">
                      <Eye className="w-4 h-4 text-primary" />
                      Views & Surroundings
                    </h3>
                    <div className="text-xs text-base-content/70 space-y-1">
                      {Object.entries(detail.view || detail.View || {})
                        .filter(([k, v]) => v === true)
                        .map(([k]) => (
                          <p key={k}>✓ {k.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</p>
                        ))}
                    </div>
                  </div>
                </React.Fragment>
              ));
            })()}
          </div>
        </div>

        {/* Location & Owner Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {property.location && property.location[0] && (
            <div className="bg-base-100 p-6 rounded-2xl border border-base-300 shadow-sm space-y-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-xl text-primary">
                  <MapPin className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-bold text-base-content">Location Info</h2>
              </div>
              <p className="text-sm font-semibold text-base-content">{property.location[0].general_area || '-'}</p>
              {property.location[0].map_url && (
                <a
                  href={property.location[0].map_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-primary font-semibold hover:underline"
                >
                  <Globe className="w-3.5 h-3.5" />
                  View on Google Maps
                </a>
              )}
            </div>
          )}

          {property.propertiesOwner && property.propertiesOwner[0] && (
            <div className="bg-base-100 p-6 rounded-2xl border border-base-300 shadow-sm space-y-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-xl text-primary">
                  <User className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-bold text-base-content">Property Owner</h2>
              </div>
              <div className="text-xs text-base-content/70 space-y-1">
                <p>Fullname: <span className="font-semibold text-base-content">{property.propertiesOwner[0].fullname || '-'}</span></p>
                <p>Phone / WhatsApp: <span className="font-semibold text-base-content">{property.propertiesOwner[0].phone || property.propertiesOwner[0].watsapp || '-'}</span></p>
                <p>Email: <span className="font-semibold text-base-content">{property.propertiesOwner[0].email || '-'}</span></p>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default DetailPropertyManagement;
