import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    Wrench,
    Image as ImageIcon,
    ChevronLeft,
    ChevronRight,
    MessageCircle,
    Clock,
    Star,
    Shield,
    AlertCircle,
    Loader2,
    Search,
    Heart,
    Eye,
    Sparkles,
    Award,
    Briefcase,
    Layers,
    X,
    PhoneCall,
    CheckCircle2
} from 'lucide-react';
import api from '../../../service/api.js';

const baseUrl = api.defaults.baseURL;

function Service() {
    const [services, setServices] = useState([]);
    const [initialLoading, setInitialLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeImageIndexes, setActiveImageIndexes] = useState({});
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('all');
    const [favorites, setFavorites] = useState(new Set());

    // Detail Modal State
    const [selectedService, setSelectedService] = useState(null);
    const [showDetailModal, setShowDetailModal] = useState(false);

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const res = await axios.get(`${baseUrl}/service`);
                const dataList = res.data?.data || [];
                setServices(dataList);

                // Initialize active image indexes
                const indexes = {};
                dataList.forEach((_, index) => {
                    indexes[index] = 0;
                });
                setActiveImageIndexes(indexes);
            } catch (err) {
                console.error(err);
                setError('Failed to load services data');
            } finally {
                setInitialLoading(false);
            }
        };

        fetchServices();
    }, []);

    // Unique Service Types extracted from data for dynamic filtering
    const availableTypes = Array.from(
        new Set(
            services
                .map((s) => s.serviceType?.service_type || s.service_type)
                .filter(Boolean)
        )
    );

    const handlePrevImage = (serviceIndex) => {
        setActiveImageIndexes((prev) => {
            const service = services[serviceIndex];
            const currentIndex = prev[serviceIndex] || 0;
            const newIndex =
                currentIndex === 0
                    ? service.imagesService.length - 1
                    : currentIndex - 1;

            return { ...prev, [serviceIndex]: newIndex };
        });
    };

    const handleNextImage = (serviceIndex) => {
        setActiveImageIndexes((prev) => {
            const service = services[serviceIndex];
            const currentIndex = prev[serviceIndex] || 0;
            const newIndex =
                currentIndex === service.imagesService.length - 1
                    ? 0
                    : currentIndex + 1;

            return { ...prev, [serviceIndex]: newIndex };
        });
    };

    const handleDotClick = (serviceIndex, imageIndex) => {
        setActiveImageIndexes((prev) => ({
            ...prev,
            [serviceIndex]: imageIndex,
        }));
    };

    const toggleFavorite = (serviceId) => {
        setFavorites((prev) => {
            const newFavorites = new Set(prev);
            if (newFavorites.has(serviceId)) {
                newFavorites.delete(serviceId);
            } else {
                newFavorites.add(serviceId);
            }
            return newFavorites;
        });
    };

    const filteredServices = services.filter((service) => {
        const typeName = service.serviceType?.service_type || service.service_type || '';
        const matchesSearch =
            service.service_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            service.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            typeName.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesType =
            filterType === 'all' ||
            typeName.toLowerCase() === filterType.toLowerCase();

        return matchesSearch && matchesType;
    });

    const openDetailModal = (service) => {
        setSelectedService(service);
        setShowDetailModal(true);
    };

    if (initialLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-base-100 to-base-200 flex items-center justify-center p-4">
                <div className="text-center space-y-4">
                    <div className="relative inline-block">
                        <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary/20 border-t-primary"></div>
                        <Wrench className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-primary animate-pulse" size={24} />
                    </div>
                    <div>
                        <p className="text-lg font-bold text-primary">Loading Services</p>
                        <p className="text-xs text-base-content/60">Fetching the best offerings for you...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-base-100 to-base-200 flex items-center justify-center p-4">
                <div className="text-center space-y-4 max-w-md bg-base-100 p-8 rounded-2xl border border-base-300 shadow-xl">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-error/10 text-error">
                        <AlertCircle className="w-8 h-8" />
                    </div>
                    <div className="space-y-1">
                        <h3 className="text-xl font-bold text-base-content">Failed to Load Services</h3>
                        <p className="text-xs text-base-content/70">{error}</p>
                    </div>
                    <button
                        onClick={() => window.location.reload()}
                        className="btn btn-primary gap-2 rounded-xl text-white w-full"
                    >
                        <Loader2 className="w-4 h-4" />
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-base-100 to-base-200 py-8 px-4 sm:px-6">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* Hero Header */}
                <div className="text-center space-y-4 max-w-3xl mx-auto">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold">
                        <Sparkles className="w-4 h-4" />
                        <span>Professional Platform Services</span>
                    </div>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-base-content tracking-tight">
                        Explore Our Premium Services
                    </h1>
                    <p className="text-sm sm:text-base text-base-content/70 leading-relaxed">
                        Discover top-rated services tailored to your needs with guaranteed quality, trusted professionals, and complete satisfaction.
                    </p>
                </div>

                {/* Search & Category Filter Bar */}
                <div className="bg-base-100 p-4 sm:p-6 rounded-2xl border border-base-300 shadow-sm space-y-4">
                    <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                        {/* Search Input */}
                        <div className="relative w-full md:w-96">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-base-content/50" />
                            <input
                                type="text"
                                placeholder="Search by service name or description..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="input input-bordered w-full pl-10 rounded-xl bg-base-100 border-base-300 focus:outline-none focus:border-primary text-sm"
                            />
                        </div>

                        {/* Category Filter Pills */}
                        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto scrollbar-none">
                            <button
                                onClick={() => setFilterType('all')}
                                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${filterType === 'all'
                                    ? 'bg-primary text-white shadow-md'
                                    : 'bg-base-200 text-base-content/70 hover:bg-base-300'
                                    }`}
                            >
                                All Services ({services.length})
                            </button>
                            {availableTypes.map((type) => (
                                <button
                                    key={type}
                                    onClick={() => setFilterType(type)}
                                    className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${filterType === type
                                        ? 'bg-primary text-white shadow-md'
                                        : 'bg-base-200 text-base-content/70 hover:bg-base-300'
                                        }`}
                                >
                                    {type}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Quick Stats Bar */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-base-100 rounded-2xl p-4 border border-base-300 shadow-sm text-center">
                        <div className="text-2xl font-bold text-primary">{filteredServices.length}</div>
                        <div className="text-xs text-base-content/60 font-medium">Services Available</div>
                    </div>
                    <div className="bg-base-100 rounded-2xl p-4 border border-base-300 shadow-sm text-center">
                        <div className="text-2xl font-bold text-secondary">{availableTypes.length}</div>
                        <div className="text-xs text-base-content/60 font-medium">Service Types</div>
                    </div>
                    <div className="bg-base-100 rounded-2xl p-4 border border-base-300 shadow-sm text-center">
                        <div className="text-2xl font-bold text-accent">{favorites.size}</div>
                        <div className="text-xs text-base-content/60 font-medium">Saved Favorites</div>
                    </div>
                    <div className="bg-base-100 rounded-2xl p-4 border border-base-300 shadow-sm text-center">
                        <div className="text-2xl font-bold text-success">100%</div>
                        <div className="text-xs text-base-content/60 font-medium">Verified Quality</div>
                    </div>
                </div>

                {/* Services Grid */}
                {filteredServices.length === 0 ? (
                    <div className="bg-base-100 rounded-2xl border border-base-300 p-12 text-center space-y-4">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-base-200 text-base-content/40">
                            <Search className="w-8 h-8" />
                        </div>
                        <h3 className="text-lg font-bold text-base-content">No Services Match Your Search</h3>
                        <p className="text-xs text-base-content/60 max-w-sm mx-auto">
                            Try clearing your search filters or browse all categories to find available services.
                        </p>
                        <button
                            onClick={() => {
                                setSearchTerm('');
                                setFilterType('all');
                            }}
                            className="btn btn-outline btn-sm rounded-xl"
                        >
                            Reset Filters
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredServices.map((service, index) => {
                            const isFavorite = favorites.has(service.id);
                            const typeLabel = service.serviceType?.service_type || service.service_type || 'General Service';
                            const activeImgIdx = activeImageIndexes[index] || 0;
                            const hasImages = service.imagesService && service.imagesService.length > 0;

                            return (
                                <div
                                    key={service.id}
                                    className="group bg-base-100 rounded-2xl border border-base-300 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between"
                                >
                                    {/* Image Section / Carousel */}
                                    <div className="relative aspect-[16/10] overflow-hidden bg-base-200">
                                        {hasImages ? (
                                            <>
                                                <img
                                                    src={`${baseUrl}${service.imagesService[activeImgIdx].imagesUrl}`}
                                                    alt={service.service_name}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20" />

                                                {/* Navigation Arrows */}
                                                {service.imagesService.length > 1 && (
                                                    <>
                                                        <button
                                                            onClick={() => handlePrevImage(index)}
                                                            className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/40 text-white hover:bg-black/70 backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100"
                                                        >
                                                            <ChevronLeft className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleNextImage(index)}
                                                            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/40 text-white hover:bg-black/70 backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100"
                                                        >
                                                            <ChevronRight className="w-4 h-4" />
                                                        </button>

                                                        {/* Dot Indicators */}
                                                        <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex items-center gap-1">
                                                            {service.imagesService.map((_, dotIdx) => (
                                                                <button
                                                                    key={dotIdx}
                                                                    onClick={() => handleDotClick(index, dotIdx)}
                                                                    className={`h-1.5 rounded-full transition-all ${activeImgIdx === dotIdx ? 'w-4 bg-primary' : 'w-1.5 bg-white/60'
                                                                        }`}
                                                                />
                                                            ))}
                                                        </div>
                                                    </>
                                                )}
                                            </>
                                        ) : (
                                            <div className="w-full h-full flex flex-col items-center justify-center text-base-content/40 space-y-1">
                                                <ImageIcon className="w-10 h-10" />
                                                <span className="text-xs font-medium">No Image</span>
                                            </div>
                                        )}

                                        {/* Type Badge */}
                                        <div className="absolute top-3 left-3">
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-base-100/90 backdrop-blur-md text-xs font-bold text-primary shadow-sm">
                                                <Layers className="w-3.5 h-3.5" />
                                                {typeLabel}
                                            </span>
                                        </div>

                                        {/* Favorite Toggle Button */}
                                        <button
                                            onClick={() => toggleFavorite(service.id)}
                                            className="absolute top-3 right-3 p-2 rounded-full bg-black/40 backdrop-blur-md text-white hover:bg-black/60 transition-colors"
                                        >
                                            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-white'}`} />
                                        </button>
                                    </div>

                                    {/* Content Section */}
                                    <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                                        <div className="space-y-2">
                                            <div className="flex items-start justify-between gap-2">
                                                <h3 className="font-bold text-base sm:text-lg text-base-content group-hover:text-primary transition-colors line-clamp-1">
                                                    {service.service_name}
                                                </h3>
                                                <div className="flex items-center gap-1 text-warning shrink-0">
                                                    <Star className="w-3.5 h-3.5 fill-current" />
                                                    <span className="text-xs font-bold text-base-content">4.9</span>
                                                </div>
                                            </div>

                                            <p className="text-xs text-base-content/70 line-clamp-2 leading-relaxed">
                                                {service.description || 'No description available for this service.'}
                                            </p>
                                        </div>

                                        <div className="pt-3 border-t border-base-200 space-y-3">
                                            <div className="flex items-center justify-between text-xs text-base-content/60">
                                                <div className="flex items-center gap-1.5">
                                                    <Shield className="w-3.5 h-3.5 text-success" />
                                                    <span>Verified Service</span>
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    <Clock className="w-3.5 h-3.5 text-primary" />
                                                    <span>Quick Response</span>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => openDetailModal(service)}
                                                    className="btn btn-outline btn-sm rounded-xl flex-1 gap-1 text-xs"
                                                >
                                                    <Eye className="w-3.5 h-3.5" />
                                                    <span>Details</span>
                                                </button>
                                                <a
                                                    href={`https://wa.me/?text=Halo,%20saya%20tertarik%20dengan%20layanan%20${encodeURIComponent(service.service_name || 'Service')}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="btn btn-primary btn-sm rounded-xl flex-1 gap-1 text-white text-xs shadow-md"
                                                >
                                                    <MessageCircle className="w-3.5 h-3.5" />
                                                    <span>Contact</span>
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Footer Banner */}
                <div className="p-6 md:p-8 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent rounded-2xl border border-primary/20 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-primary/10 rounded-2xl text-primary shrink-0">
                            <Award className="w-8 h-8" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-base-content">Quality & Service Guarantee</h3>
                            <p className="text-xs text-base-content/70 mt-0.5">
                                All listed services undergo verification to ensure maximum client satisfaction.
                            </p>
                        </div>
                    </div>

                    <a
                        href="/contact"
                        className="btn btn-primary gap-2 rounded-xl text-white self-stretch md:self-auto shadow-md"
                    >
                        <PhoneCall className="w-4 h-4" />
                        <span>Need Support?</span>
                    </a>
                </div>

            </div>

            {/* Service Detail Modal */}
            {showDetailModal && selectedService && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
                        onClick={() => setShowDetailModal(false)}
                    />
                    <div className="relative w-full max-w-xl bg-base-100 rounded-2xl shadow-2xl overflow-hidden border border-base-300 z-10 max-h-[90vh] flex flex-col">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-5 border-b border-base-200">
                            <div className="flex items-center gap-2">
                                <span className="p-2 bg-primary/10 text-primary rounded-xl">
                                    <Briefcase className="w-5 h-5" />
                                </span>
                                <div>
                                    <h3 className="text-base font-bold text-base-content">
                                        {selectedService.service_name}
                                    </h3>
                                    <span className="text-xs text-primary font-semibold">
                                        {selectedService.serviceType?.service_type || selectedService.service_type || 'General Service'}
                                    </span>
                                </div>
                            </div>
                            <button
                                onClick={() => setShowDetailModal(false)}
                                className="btn btn-circle btn-xs btn-ghost text-base-content/70"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 overflow-y-auto space-y-4 text-sm">
                            {/* Images Gallery */}
                            {selectedService.imagesService && selectedService.imagesService.length > 0 && (
                                <div className="grid grid-cols-2 gap-2">
                                    {selectedService.imagesService.map((img, idx) => (
                                        <div key={idx} className="aspect-video rounded-xl overflow-hidden bg-base-200 border border-base-300">
                                            <img
                                                src={`${baseUrl}${img.imagesUrl}`}
                                                alt={`Gallery ${idx + 1}`}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div className="space-y-1">
                                <h4 className="text-xs font-bold uppercase tracking-wider text-base-content/60">
                                    Description
                                </h4>
                                <p className="text-base-content/80 leading-relaxed text-xs sm:text-sm">
                                    {selectedService.description || 'No detailed description provided.'}
                                </p>
                            </div>

                            <div className="p-4 rounded-xl bg-base-200/60 border border-base-300 space-y-2 text-xs">
                                <div className="flex items-center justify-between">
                                    <span className="text-base-content/70">Service Status</span>
                                    <span className="px-2.5 py-0.5 rounded-full bg-success/10 text-success font-bold capitalize">
                                        {selectedService.status || 'Active'}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-base-content/70">Verification Status</span>
                                    <span className="flex items-center gap-1 text-success font-semibold">
                                        <CheckCircle2 className="w-3.5 h-3.5" /> Verified Partner
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="p-4 border-t border-base-200 flex gap-3">
                            <button
                                onClick={() => setShowDetailModal(false)}
                                className="btn btn-outline flex-1 rounded-xl"
                            >
                                Close
                            </button>
                            <a
                                href={`https://wa.me/?text=Halo,%20saya%20tertarik%20dengan%20layanan%20${encodeURIComponent(selectedService.service_name || 'Service')}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-primary flex-1 rounded-xl text-white shadow-md gap-2"
                            >
                                <MessageCircle className="w-4 h-4" />
                                <span>Contact Provider</span>
                            </a>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Service;