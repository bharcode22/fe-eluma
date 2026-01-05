import React, { useEffect, useState } from 'react';
import axios from 'axios';
import api from '../../../service/api.js';

const baseUrl = api.defaults.baseURL;

function Service() {
    const [services, setServices] = useState([]);
    const [initialLoading, setInitialLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeServiceIndex, setActiveServiceIndex] = useState(0);
    const [activeImageIndexes, setActiveImageIndexes] = useState({});

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const res = await axios.get(`${baseUrl}/service-user`);
                console.log("Response:", res.data.data);
                setServices(res.data?.data || []);
                
                // Initialize active image indexes
                const indexes = {};
                res.data?.data?.forEach((_, index) => {
                    indexes[index] = 0;
                });
                setActiveImageIndexes(indexes);
            } catch (err) {
                console.error(err);
                setError('Gagal memuat data service');
            } finally {
                setInitialLoading(false);
            }
        };

        fetchServices();
    }, []);

    const handlePrevImage = (serviceIndex) => {
        setActiveImageIndexes(prev => {
            const service = services[serviceIndex];
            const currentIndex = prev[serviceIndex];
            const newIndex = currentIndex === 0 
                ? service.imagesService.length - 1 
                : currentIndex - 1;
            
            return { ...prev, [serviceIndex]: newIndex };
        });
    };

    const handleNextImage = (serviceIndex) => {
        setActiveImageIndexes(prev => {
            const service = services[serviceIndex];
            const currentIndex = prev[serviceIndex];
            const newIndex = currentIndex === service.imagesService.length - 1 
                ? 0 
                : currentIndex + 1;
            
            return { ...prev, [serviceIndex]: newIndex };
        });
    };

    const handleDotClick = (serviceIndex, imageIndex) => {
        setActiveImageIndexes(prev => ({
            ...prev,
            [serviceIndex]: imageIndex
        }));
    };

    if (initialLoading) {
        return (
            <div className="flex justify-center items-center min-h-64">
                <div className="text-center">
                    <div className="loading loading-spinner loading-lg text-primary"></div>
                    <p className="mt-4 text-lg">Memuat data service...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="alert alert-error max-w-2xl mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{error}</span>
            </div>
        );
    }

    if (services.length === 0) {
        return (
            <div className="text-center py-10">
                <div className="max-w-md mx-auto">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h3 className="text-xl font-semibold mb-2">Tidak ada data service</h3>
                    <p className="text-gray-500">Belum ada service yang tersedia saat ini.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Header */}
            <div className="mb-8 text-center">
                <h1 className="text-3xl font-bold mb-3">Daftar Service</h1>
                <p className="text-gray-600 max-w-2xl mx-auto">
                    Temukan berbagai service yang kami sediakan dengan kualitas terbaik
                </p>
            </div>

            {/* Services List - Vertical Layout */}
            <div className="flex flex-col gap-8 max-w-6xl mx-auto">
                {services.map((service, index) => (
                    <div 
                        key={service.id} 
                        className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100"
                    >
                        <div className="card-body p-0">
                            <div className="flex flex-col lg:flex-row">
                                {/* Image Section */}
                                <div className="lg:w-2/5 relative overflow-hidden">
                                    {service.imagesService && service.imagesService.length > 0 ? (
                                        <div className="relative h-64 lg:h-full">
                                            <div className="carousel w-full h-full">
                                                {service.imagesService.map((image, idx) => (
                                                    <div 
                                                        key={idx} 
                                                        className={`carousel-item absolute inset-0 w-full h-full transition-opacity duration-500 ${activeImageIndexes[index] === idx ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                                                    >
                                                        <img 
                                                            src={`${baseUrl}${image.imagesUrl}`} 
                                                            alt={`${service.service_name} - Gambar ${idx + 1}`}
                                                            className="w-full h-full object-cover"
                                                        />
                                                        
                                                        {/* Navigation Arrows */}
                                                        <button 
                                                            onClick={() => handlePrevImage(index)}
                                                            className="absolute left-4 top-1/2 transform -translate-y-1/2 btn btn-circle btn-sm bg-black/60 hover:bg-black/80 text-white border-0"
                                                        >
                                                            ❮
                                                        </button>
                                                        <button 
                                                            onClick={() => handleNextImage(index)}
                                                            className="absolute right-4 top-1/2 transform -translate-y-1/2 btn btn-circle btn-sm bg-black/60 hover:bg-black/80 text-white border-0"
                                                        >
                                                            ❯
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                            
                                            {/* Image Counter */}
                                            <div className="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
                                                {activeImageIndexes[index] + 1} / {service.imagesService.length}
                                            </div>
                                            
                                            {/* Image Dots */}
                                            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                                                {service.imagesService.map((_, dotIdx) => (
                                                    <button
                                                        key={dotIdx}
                                                        onClick={() => handleDotClick(index, dotIdx)}
                                                        className={`h-2 w-2 rounded-full transition-all duration-300 ${activeImageIndexes[index] === dotIdx ? 'bg-white w-4' : 'bg-white/50 hover:bg-white/70'}`}
                                                    ></button>
                                                ))}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="w-full h-64 lg:h-full bg-gradient-to-br from-primary/10 to-secondary/10 flex flex-col items-center justify-center p-6">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            <p className="text-gray-500 text-center">Tidak ada gambar</p>
                                        </div>
                                    )}
                                </div>

                                {/* Content Section */}
                                <div className="lg:w-3/5 p-6">
                                    <div className="flex flex-col h-full">
                                        {/* Service Header */}
                                        <div className="flex items-start justify-between mb-4">
                                            <div>
                                                <div className="flex items-center gap-3 mb-2">
                                                    <h2 className="card-title text-xl text-primary">
                                                        {service.service_name}
                                                    </h2>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Service Details (Expandable) */}
                                        <div className="mb-4">
                                            <div className="collapse collapse-arrow bg-base-100 border border-gray-200">
                                                <input type="checkbox" />
                                                <div className="collapse-title font-medium">
                                                    Detail Service
                                                </div>
                                                <div className="collapse-content">
                                                    <div className="space-y-2 pt-2">
                                                        <div className="flex items-center gap-2">
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                            </svg>
                                                            <span>{service.description}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Image Preview */}
                                        {service.imagesService && service.imagesService.length > 0 && (
                                            <div className="mb-4">
                                                <p className="text-sm text-gray-600 mb-2">Pratinjau Gambar:</p>
                                                <div className="flex gap-2 overflow-x-auto pb-2">
                                                    {service.imagesService.map((image, imgIdx) => (
                                                        <button
                                                            key={imgIdx}
                                                            onClick={() => handleDotClick(index, imgIdx)}
                                                            className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-300 ${activeImageIndexes[index] === imgIdx ? 'border-primary ring-2 ring-primary/30' : 'border-gray-200 hover:border-gray-300'}`}
                                                        >
                                                            <img 
                                                                src={`${baseUrl}${image.imagesUrl}`} 
                                                                alt={`Thumbnail ${imgIdx + 1}`}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Action Buttons */}
                                        <div className="mt-auto pt-4 border-t border-gray-100">
                                            <div className="flex flex-col sm:flex-row gap-3">
                                                <button className="btn btn-outline btn-primary">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                                                    </svg>
                                                    Hubungi
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Service;