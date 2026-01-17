import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Api from '../../../service/api.js';
import { useLanguage } from "../../../context/LanguageContext.jsx";
import { translateNodes } from "../../../utils/translator.js";
import { useCurrency } from "../../../context/CurrencyContext.jsx";
import ContactUs from "./ContactUs.jsx";
import NavbarUsers from "../../../components/NavbarUser.jsx";
import {
  Calendar,
  Bed,
  Clock,
  Car,
  Mountain,
  Sun,
  Sunrise,
  Waves,
  Trees,
  Leaf,
  Eye,
  Construction,
  Sparkles,
  Home,
  MapPin,
  X,
  ChevronLeft,
  ChevronRight,
  Star,
  Bath,
  Users,
  Ruler,
  ParkingSquare,
  Bike,
  CheckCircle,
  Info,
  AlertCircle,
  RefreshCw
} from 'lucide-react';

// ==================== Sub-Components ====================

const LoadingSpinner = () => (
  <div className="flex justify-center items-center min-h-[60vh]">
    <div className="text-center space-y-4">
      <div className="relative">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary/20 border-t-primary"></div>
        <Sparkles className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-primary animate-pulse" size={20} />
      </div>
      <p className="text-lg font-medium text-primary animate-pulse">Loading Property Details...</p>
    </div>
  </div>
);

const ErrorMessage = ({ message }) => (
  <div className="flex justify-center items-center min-h-[60vh]">
    <div className="text-center space-y-4 max-w-md">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-error/10">
        <AlertCircle className="w-8 h-8 text-error" />
      </div>
      <div className="space-y-2">
        <h3 className="text-xl font-semibold text-error">Oops! Something went wrong</h3>
        <p className="text-base-content/70">{message}</p>
      </div>
      <button
        onClick={() => window.location.reload()}
        className="btn btn-primary gap-2"
      >
        <RefreshCw size={18} />
        Try Again
      </button>
    </div>
  </div>
);

const DetailSection = ({ title, children, icon: Icon, className = '' }) => (
  <div className={`bg-base-100 border border-base-300 shadow-xl rounded-2xl overflow-hidden ${className}`}>
    <div className="bg-gradient-to-r from-primary/10 to-secondary/10 px-6 py-4 border-b border-base-300">
      <div className="flex items-center gap-3">
        {Icon && <Icon className="w-6 h-6 text-primary" />}
        <h2 className="text-xl font-bold text-base-content">{title}</h2>
      </div>
    </div>
    <div className="p-6">
      {children}
    </div>
  </div>
);

const ImageGallery = ({ images, baseUrl, onImageClick }) => (
  <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
    {images.map((img, index) => (
      <div
        key={img.id}
        className={`relative overflow-hidden rounded-lg cursor-pointer group ${index === 0 ? 'md:col-span-2 md:row-span-2' : ''}`}
        onClick={() => onImageClick(index)}
      >
        <img
          src={`${baseUrl}${img.imagesUrl}`}
          alt={img.imageName}
          className="w-full h-full object-cover aspect-square group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute bottom-0 left-0 right-0 p-3 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <p className="text-white text-sm font-medium truncate">{img.imageName}</p>
        </div>
      </div>
    ))}
  </div>
);

const ImageCarousel = ({ images, baseUrl, selectedIndex, onClose, onNavigate }) => {
  if (selectedIndex === null) return null;

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50">
      <button
        onClick={onClose}
        className="fixed top-4 right-4 z-[60] bg-error text-white rounded-full p-3 hover:bg-error/90 transition-colors shadow-lg"
      >
        <X size={24} />
      </button>

      <div className="h-full w-full max-w-6xl mx-auto px-4 py-4 flex flex-col">
        <div className="relative flex-1 rounded-xl overflow-hidden bg-black">
          <div className="relative h-full flex items-center justify-center">
            <img
              src={`${baseUrl}${images[selectedIndex].imagesUrl}`}
              alt={images[selectedIndex].imageName}
              className="w-full max-h-[calc(100vh-160px)] object-contain"
            />

            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-6">
              <p className="text-white text-lg font-medium">
                {images[selectedIndex].imageName}
              </p>
              <p className="text-white/70 text-sm">
                {selectedIndex + 1} / {images.length}
              </p>
            </div>
          </div>

          <button
            onClick={() => onNavigate('prev')}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white rounded-full p-3 backdrop-blur-sm transition-all"
          >
            <ChevronLeft size={28} />
          </button>
          <button
            onClick={() => onNavigate('next')}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white rounded-full p-3 backdrop-blur-sm transition-all"
          >
            <ChevronRight size={28} />
          </button>
        </div>

        <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
          {images.map((img, index) => (
            <button
              key={img.id}
              onClick={() => {
                const event = new CustomEvent('carouselNavigate', { detail: index });
                window.dispatchEvent(event);
              }}
              className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${index === selectedIndex ? 'border-primary' : 'border-transparent'}`}
            >
              <img
                src={`${baseUrl}${img.imagesUrl}`}
                alt={img.imageName}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

const AvailabilityCard = ({ label, date, icon: Icon }) => (
  <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-xl border border-base-300 hover:border-primary/50 transition-all group">
    <div className="p-3 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
      <Icon className="w-6 h-6 text-primary" />
    </div>
    <div>
      <p className="text-sm text-base-content/60">{label}</p>
      <p className="text-lg font-semibold text-base-content">
        {new Date(date).toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })}
      </p>
    </div>
  </div>
);

const InfoCard = ({ icon: Icon, text, badge, className = '' }) => (
  <div className={`flex items-center gap-3 p-3 bg-base-200/50 rounded-lg hover:bg-base-300/50 transition-colors ${className}`}>
    <div className="p-2 bg-primary/10 rounded-lg">
      <Icon className="w-5 h-5 text-primary" />
    </div>
    <span className="font-medium flex-1">{text}</span>
    {badge && (
      <span className="badge badge-primary badge-sm">{badge}</span>
    )}
  </div>
);

const FeatureBadge = ({ icon: Icon, label }) => (
  <div className="inline-flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl border border-primary/20 hover:border-primary/40 transition-all group">
    <Icon className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
    <span className="font-semibold text-base-content capitalize">
      {label.replace(/_/g, ' ')}
    </span>
  </div>
);

const CleaningInfo = ({ detail }) => {
  if (!detail.cleaning_requency && !detail.linen_chaneg) return null;

  return (
    <div className="space-y-3 p-4 bg-gradient-to-br from-success/5 to-success/10 rounded-xl border border-success/20">
      <div className="flex items-center gap-3">
        <Sparkles className="w-6 h-6 text-success" />
        <h4 className="font-semibold text-lg text-base-content">Cleaning Information</h4>
      </div>
      <div className="space-y-2 ml-9">
        {detail.cleaning_requency && (
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-success" />
            <span className="text-base-content">
              <strong>Cleaning Frequency:</strong> {detail.cleaning_requency}
            </span>
          </div>
        )}
        {detail.linen_chaneg && (
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-success" />
            <span className="text-base-content">
              <strong>Linen Change:</strong> {detail.linen_chaneg}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

const ParkingDetails = ({ parking }) => {
  if (!parking) return null;

  const parkingOptions = [
    { key: 'car_parking', label: 'Car Parking', icon: Car },
    { key: 'bike_parking', label: 'Motorcycle Parking', icon: Bike },
    { key: 'both_car_and_bike', label: 'Car & Motor Parking', icon: ParkingSquare }
  ];

  const availableParking = parkingOptions.filter(({ key }) => parking[key]);

  if (availableParking.length === 0) return null;

  return (
    <div className="space-y-3 p-4 bg-gradient-to-br from-warning/5 to-warning/10 rounded-xl border border-warning/20">
      <div className="flex items-center gap-3">
        <ParkingSquare className="w-6 h-6 text-warning" />
        <h4 className="font-semibold text-lg text-base-content">Parking Facilities</h4>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 ml-9">
        {availableParking.map(({ key, label, icon: Icon }) => (
          <div key={key} className="flex items-center gap-2 p-2 bg-base-100/50 rounded-lg">
            <Icon className="w-4 h-4 text-warning" />
            <span className="text-base-content">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const ViewDetails = ({ view }) => {
  if (!view) return null;

  const viewOptions = [
    { key: 'ocean_view', label: 'Ocean View', icon: Waves, color: 'text-blue-500' },
    { key: 'sunset_view', label: 'Sunset View', icon: Sun, color: 'text-orange-500' },
    { key: 'garden_view', label: 'Garden View', icon: Leaf, color: 'text-green-500' },
    { key: 'beach_view', label: 'Beach View', icon: Waves, color: 'text-blue-400' },
    { key: 'jungle_view', label: 'Jungle View', icon: Trees, color: 'text-emerald-600' },
    { key: 'montain_view', label: 'Mountain View', icon: Mountain, color: 'text-stone-600' },
    { key: 'pool_view', label: 'Pool View', icon: Waves, color: 'text-cyan-500' },
    { key: 'rice_field', label: 'Rice Field View', icon: Leaf, color: 'text-lime-600' },
    { key: 'sunrise_view', label: 'Sunrise View', icon: Sunrise, color: 'text-yellow-500' },
    { key: 'volcano_view', label: 'Volcano View', icon: Mountain, color: 'text-red-600' }
  ];

  const availableViews = viewOptions.filter(({ key }) => view[key]);

  if (availableViews.length === 0) return null;

  return (
    <div className="space-y-3 p-4 bg-gradient-to-br from-info/5 to-info/10 rounded-xl border border-info/20">
      <div className="flex items-center gap-3">
        <Eye className="w-6 h-6 text-info" />
        <h4 className="font-semibold text-lg text-base-content">Property Views</h4>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 ml-9">
        {availableViews.map(({ key, label, icon: Icon, color }) => (
          <div key={key} className="flex flex-col items-center p-3 bg-base-100/50 rounded-lg space-y-2">
            <Icon className={`w-5 h-5 ${color}`} />
            <span className="text-sm text-center text-base-content font-medium">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const PropertyStats = ({ property }) => (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
    <div className="stat bg-base-200/50 rounded-xl p-4">
      <div className="stat-figure text-primary">
        <Bed className="w-8 h-8" />
      </div>
      <div className="stat-title">Bedrooms</div>
      <div className="stat-value text-primary">{property.number_of_bedrooms || property.bedroom || 'N/A'}</div>
    </div>

    <div className="stat bg-base-200/50 rounded-xl p-4">
      <div className="stat-figure text-secondary">
        <Bath className="w-8 h-8" />
      </div>
      <div className="stat-title">Bathrooms</div>
      <div className="stat-value text-secondary">{property.number_of_bathrooms || property.bathroom || 'N/A'}</div>
    </div>

    <div className="stat bg-base-200/50 rounded-xl p-4">
      <div className="stat-figure text-accent">
        <Users className="w-8 h-8" />
      </div>
      <div className="stat-title">Max Guests</div>
      <div className="stat-value text-accent">{property.max_guests || 'N/A'}</div>
    </div>

    <div className="stat bg-base-200/50 rounded-xl p-4">
      <div className="stat-figure text-warning">
        <Ruler className="w-8 h-8" />
      </div>
      <div className="stat-title">Size</div>
      <div className="stat-value text-warning">{property.size ? `${property.size} m²` : 'N/A'}</div>
    </div>
  </div>
);

// ==================== Main Component ====================

function LandingPageDetailProperty() {
  // Hooks
  const { id } = useParams();
  const navigate = useNavigate();
  const divRef = useRef(null);
  const { lang } = useLanguage();
  const { currency, exchangeRates, convertPrice, getCurrencySymbol } = useCurrency();

  // State
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sanitizedHTML, setSanitizedHTML] = useState('');
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  // Constants
  const baseUrl = Api.defaults.baseURL;

  // Effects
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
        console.error('Failed to load property data:', error);
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
          console.error("Failed to import DOMPurify:", err);
        }
      }
    };

    sanitize();
    return () => {
      isMounted = false;
    };
  }, [property]);

  // Event Handlers
  const handleImageClick = (index) => setSelectedImageIndex(index);
  const handleCloseCarousel = () => setSelectedImageIndex(null);

  const handleCarouselNavigate = (direction) => {
    if (direction === 'prev') {
      setSelectedImageIndex(
        selectedImageIndex === 0 ? property.images.length - 1 : selectedImageIndex - 1
      );
    } else {
      setSelectedImageIndex(
        selectedImageIndex === property.images.length - 1 ? 0 : selectedImageIndex + 1
      );
    }
  };

  // Add event listener for thumbnail clicks
  useEffect(() => {
    const handleThumbnailClick = (event) => {
      setSelectedImageIndex(event.detail);
    };

    window.addEventListener('carouselNavigate', handleThumbnailClick);
    return () => window.removeEventListener('carouselNavigate', handleThumbnailClick);
  }, []);

  // Render Conditions
  if (loading) return <LoadingSpinner />;
  if (!property) return <ErrorMessage message="Property not found. Please check the property ID or try again later." />;

  // Prepare Additional Details
  const additionalDetails = Array.isArray(property?.additionalDetails)
    ? property.additionalDetails
    : (property?.additionalDetails ? [property.additionalDetails] : []);

  // Calculate price
  const displayPrice = convertPrice(property.price, currency, exchangeRates);
  const currencySymbol = getCurrencySymbol();

  return (
    <div ref={divRef} className="min-h-screen bg-gradient-to-b from-base-100 to-base-200">
      {/* <NavbarUsers /> */}

      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        <div>
          <button
            type="button"
            onClick={() => {
              if (window.history.length > 1) {
                navigate(-1);
              } else {
                navigate('/');
              }
            }}
            className="btn btn-ghost gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </button>
        </div>
        {/* Header with Property Code and Price */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-base-100 rounded-2xl p-6 shadow-xl">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Home className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium text-base-content/60">PROPERTY CODE</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-base-content">
              {property.property_code}
            </h1>
            <div className="flex items-center gap-2 mt-2">
              <MapPin className="w-4 h-4 text-base-content/60" />
              <span className="text-base-content/70">
                {property.location?.[0]?.general_area || 'Location not specified'}
              </span>
            </div>
          </div>

          <div className="text-right">
            <div className="text-sm font-medium text-base-content/60 mb-1">PRICE</div>
            <div className="flex items-center gap-2">
              <span className="text-4xl md:text-5xl font-bold text-primary">
                {currencySymbol}{displayPrice.toLocaleString()}
              </span>
              <span className="text-lg text-base-content/60">/ month</span>
            </div>
            <div className="text-sm text-base-content/50 mt-1">
              {currency !== 'IDR' && `≈ Rp${property.price.toLocaleString()}`}
            </div>
          </div>
        </div>

        {/* Property Stats */}
        <PropertyStats property={property} />

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:w-2/3 space-y-8">
            {/* Image Gallery */}
            <DetailSection title="Gallery" icon={Eye}>
              <ImageGallery
                images={property.images}
                baseUrl={baseUrl}
                onImageClick={handleImageClick}
              />
            </DetailSection>

            {/* Image Carousel Modal */}
            <ImageCarousel
              images={property.images}
              baseUrl={baseUrl}
              selectedIndex={selectedImageIndex}
              onClose={handleCloseCarousel}
              onNavigate={handleCarouselNavigate}
            />

            {/* Tabs Navigation */}
            <div className="tabs tabs-boxed bg-base-200 p-1">
              {['overview', 'facilities', 'availability', 'details'].map((tab) => (
                <button
                  key={tab}
                  className={`tab tab-lg flex-1 capitalize ${activeTab === tab ? 'tab-active' : ''}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="mt-6">
              {activeTab === 'overview' && (
                <DetailSection title="Property Overview" icon={Info}>
                  <div className="prose prose-lg max-w-none text-base-content">
                    <div
                      className="prose-headings:text-base-content prose-p:text-base-content/80 prose-li:text-base-content/80"
                      dangerouslySetInnerHTML={{ __html: sanitizedHTML }}
                    />
                  </div>
                </DetailSection>
              )}

              {activeTab === 'facilities' && (
                <DetailSection title="Facilities & Amenities" icon={Star}>
                  <div className="flex flex-wrap gap-3">
                    {Object.entries(property.facilities[0])
                      .filter(([key, value]) => typeof value === 'boolean' && value)
                      .map(([key]) => (
                        <FeatureBadge
                          key={key}
                          label={key}
                          icon={CheckCircle}
                        />
                      ))}
                  </div>
                </DetailSection>
              )}

              {activeTab === 'availability' && (
                <DetailSection title="Availability Schedule" icon={Calendar}>
                  <div className="space-y-4">
                    {property.availability.map((a) => (
                      <div key={a.id} className="space-y-3">
                        <div className="flex gap-3">
                          <AvailabilityCard
                            label="Available From"
                            date={a.available_from}
                            icon={Calendar}
                          />
                          <AvailabilityCard
                            label="Available To"
                            date={a.available_to}
                            icon={Calendar}
                          />
                        </div>
                        <div className="text-sm text-base-content/60 italic">
                          Duration: {Math.ceil((new Date(a.available_to) - new Date(a.available_from)) / (1000 * 60 * 60 * 24))} days
                        </div>
                      </div>
                    ))}
                  </div>
                </DetailSection>
              )}

              {activeTab === 'details' && (
                <DetailSection title="Additional Details" icon={Sparkles}>
                  <div className="space-y-6">
                    {additionalDetails.map((detail) => (
                      <div key={detail.id} className="space-y-4">
                        {/* Construction Notice */}
                        {detail.construction_nearby && (
                          <div className="alert alert-warning">
                            <Construction className="w-5 h-5" />
                            <span>Construction Nearby - Please be aware of potential noise</span>
                          </div>
                        )}

                        {/* Path Access */}
                        {detail.allow_path && (
                          <InfoCard
                            icon={CheckCircle}
                            text="Path Access Available"
                            badge="Accessible"
                          />
                        )}

                        {/* Cleaning Info */}
                        <CleaningInfo detail={detail} />

                        {/* Parking */}
                        <ParkingDetails parking={detail.parking || detail.Parking} />

                        {/* Views */}
                        <ViewDetails view={detail.view || detail.View} />
                      </div>
                    ))}
                  </div>
                </DetailSection>
              )}
            </div>
          </div>

          {/* Right Column - Contact Form (Sticky) */}
          <div className="lg:w-1/3">
            <div className="sticky top-8 space-y-6">
              <ContactUs id={id} />

              {/* Quick Info Card */}
              <div className="card bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/20">
                <div className="card-body">
                  <h3 className="card-title flex items-center gap-2">
                    <Info className="w-5 h-5" />
                    Quick Info
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-base-content/70">Property Type</span>
                      <span className="font-semibold">{property.property_type || 'Residential'}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-base-content/70">Floor Area</span>
                      <span className="font-semibold">{property.size ? `${property.size} m²` : 'N/A'}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-base-content/70">Year Built</span>
                      <span className="font-semibold">{property.year_built || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-base-content/70">Status</span>
                      <span className="badge badge-success badge-lg">Available</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LandingPageDetailProperty;