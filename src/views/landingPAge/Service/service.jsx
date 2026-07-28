import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    Wrench,
    AlertCircle,
    Loader2,
    Search,
} from 'lucide-react';
import api from '../../../service/api.js';

import ServiceHeader from './components/ServiceHeader.jsx';
import ServiceFilter from './components/ServiceFilter.jsx';
import ServiceCard from './components/ServiceCard.jsx';
import ServiceDetailModal from './components/ServiceDetailModal.jsx';
import ServiceFooterBanner from './components/ServiceFooterBanner.jsx';
import ServiceSkeleton from './components/ServiceSkeleton.jsx';

const baseUrl = api.defaults.baseURL;

function ServiceLanding() {
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

    // Extract unique Service Types dynamically
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
        return <ServiceSkeleton />;
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
        <div className="min-h-screen bg-gradient-to-b from-base-100 to-base-200 py-10 px-4 sm:px-6">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Hero Header */}
                <ServiceHeader />

                {/* Search & Category Filter Bar */}
                <ServiceFilter
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    filterType={filterType}
                    setFilterType={setFilterType}
                    availableTypes={availableTypes}
                    totalServicesCount={services.length}
                />

                {/* Services Grid */}
                {filteredServices.length === 0 ? (
                    <div className="bg-base-100 rounded-2xl border border-base-300 p-12 text-center space-y-4">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-base-200 text-base-content/40">
                            <Search className="w-8 h-8" />
                        </div>
                        <h3 className="text-lg font-bold text-base-content">No Services Match Your Filter</h3>
                        <p className="text-xs text-base-content/60 max-w-sm mx-auto">
                            Try resetting your search query or view all available services.
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
                        {filteredServices.map((service, index) => (
                            <ServiceCard
                                key={service.id}
                                service={service}
                                index={index}
                                baseUrl={baseUrl}
                                isFavorite={favorites.has(service.id)}
                                toggleFavorite={toggleFavorite}
                                activeImgIdx={activeImageIndexes[index] || 0}
                                handlePrevImage={handlePrevImage}
                                handleNextImage={handleNextImage}
                                handleDotClick={handleDotClick}
                                onOpenDetailModal={openDetailModal}
                            />
                        ))}
                    </div>
                )}

                {/* Footer Banner */}
                <ServiceFooterBanner />
            </div>

            {/* Service Detail Modal */}
            {showDetailModal && (
                <ServiceDetailModal
                    service={selectedService}
                    baseUrl={baseUrl}
                    onClose={() => setShowDetailModal(false)}
                />
            )}
        </div>
    );
}

export default ServiceLanding;