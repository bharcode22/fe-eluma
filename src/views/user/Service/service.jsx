import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    Search,
    Award,
    PhoneCall,
    AlertCircle,
    Loader2
} from 'lucide-react';
import api from '../../../service/api.js';

import ServiceSkeleton from './components/ServiceSkeleton.jsx';
import ServiceHeroBanner from './components/ServiceHeroBanner.jsx';
import ServiceCard from './components/ServiceCard.jsx';
import ServiceDetailModal from './components/ServiceDetailModal.jsx';

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

    const fetchServices = async () => {
        try {
            setInitialLoading(true);
            setError(null);
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
            console.error('Failed to fetch services:', err);
            setError('Failed to load services data');
        } finally {
            setInitialLoading(false);
        }
    };

    useEffect(() => {
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
            if (!service || !service.imagesService) return prev;
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
            if (!service || !service.imagesService) return prev;
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
        return <ServiceSkeleton />;
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-base-100 to-base-200 flex items-center justify-center p-4">
                <div className="bg-base-100 p-8 rounded-3xl border border-error/30 shadow-xl text-center space-y-4 max-w-md">
                    <div className="w-16 h-16 bg-error/10 text-error rounded-full flex items-center justify-center mx-auto">
                        <AlertCircle className="w-8 h-8" />
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-xl font-bold text-error">Failed to Load Services</h3>
                        <p className="text-sm text-base-content/70">{error}</p>
                    </div>
                    <button
                        type="button"
                        onClick={fetchServices}
                        className="btn btn-primary gap-2 rounded-xl text-white w-full shadow-md"
                    >
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-base-100 to-base-200 py-8 px-4 md:px-8 space-y-8">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* Hero Banner Component */}
                <ServiceHeroBanner
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    filterType={filterType}
                    setFilterType={setFilterType}
                    availableTypes={availableTypes}
                    totalServicesCount={services.length}
                    filteredCount={filteredServices.length}
                />

                {/* Services Grid Section */}
                {filteredServices.length === 0 ? (
                    <div className="bg-base-100 rounded-3xl border border-base-300 p-12 text-center space-y-4 shadow-sm">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-base-200 text-base-content/40">
                            <Search className="w-8 h-8" />
                        </div>
                        <h3 className="text-lg font-bold text-base-content">No Services Match Your Search</h3>
                        <p className="text-xs text-base-content/60 max-w-sm mx-auto">
                            Try clearing your search filters or browse all categories to find available services.
                        </p>
                        <button
                            type="button"
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
                            const activeImgIdx = activeImageIndexes[index] || 0;

                            return (
                                <ServiceCard
                                    key={service.id}
                                    service={service}
                                    index={index}
                                    activeImgIdx={activeImgIdx}
                                    isFavorite={isFavorite}
                                    baseUrl={baseUrl}
                                    onPrevImage={handlePrevImage}
                                    onNextImage={handleNextImage}
                                    onDotClick={handleDotClick}
                                    onToggleFavorite={toggleFavorite}
                                    onOpenDetail={openDetailModal}
                                />
                            );
                        })}
                    </div>
                )}

                {/* Footer Guarantee Banner */}
                <div className="p-6 md:p-8 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent rounded-3xl border border-primary/20 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
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

            {/* Service Detail Modal Component */}
            {showDetailModal && selectedService && (
                <ServiceDetailModal
                    service={selectedService}
                    baseUrl={baseUrl}
                    onClose={() => setShowDetailModal(false)}
                />
            )}
        </div>
    );
}

export default Service;