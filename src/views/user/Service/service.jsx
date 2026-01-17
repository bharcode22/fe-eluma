import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Wrench,
  Image as ImageIcon,
  ChevronLeft,
  ChevronRight,
  Info,
  MessageCircle,
  Phone,
  Calendar,
  Clock,
  Star,
  Users,
  Shield,
  CheckCircle,
  AlertCircle,
  Loader2,
  Search,
  Filter,
  Heart,
  Share2,
  Bookmark,
  Eye,
  MapPin,
  DollarSign,
  Sparkles,
  Award,
  Building2,
  Home,
  Package,
  Settings,
  Zap,
  Leaf,
  Globe,
  Target,
  TrendingUp,
  Briefcase,
  Car,
  Coffee,
  Waves,
  Music,
  Camera,
  Palette,
  Dumbbell,
  Utensils,
  Truck
} from 'lucide-react';
import api from '../../../service/api.js';

const baseUrl = api.defaults.baseURL;

function Service() {
    const [services, setServices] = useState([]);
    const [initialLoading, setInitialLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeServiceIndex, setActiveServiceIndex] = useState(0);
    const [activeImageIndexes, setActiveImageIndexes] = useState({});
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('all');
    const [favorites, setFavorites] = useState(new Set());

    // Mock service categories for filtering
    const serviceCategories = [
        { id: 'all', label: 'All Services', icon: Package },
        { id: 'home', label: 'Home Services', icon: Home },
        { id: 'repair', label: 'Repair & Maintenance', icon: Wrench },
        { id: 'cleaning', label: 'Cleaning', icon: Sparkles },
        { id: 'transport', label: 'Transport', icon: Truck },
        { id: 'event', label: 'Event Services', icon: Calendar },
        { id: 'beauty', label: 'Beauty & Wellness', icon: Leaf },
        { id: 'tech', label: 'Tech Support', icon: Settings }
    ];

    // Service type icons mapping
    const serviceTypeIcons = {
        cleaning: Sparkles,
        repair: Wrench,
        transport: Truck,
        event: Calendar,
        beauty: Leaf,
        tech: Settings,
        home: Home,
        default: Package
    };

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const res = await axios.get(`${baseUrl}/service-user`);
                console.log("Services Response:", res.data.data);
                setServices(res.data?.data || []);
                
                // Initialize active image indexes
                const indexes = {};
                res.data?.data?.forEach((_, index) => {
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

    const toggleFavorite = (serviceId) => {
        setFavorites(prev => {
            const newFavorites = new Set(prev);
            if (newFavorites.has(serviceId)) {
                newFavorites.delete(serviceId);
            } else {
                newFavorites.add(serviceId);
            }
            return newFavorites;
        });
    };

    const filteredServices = services.filter(service => {
        const matchesSearch = service.service_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             service.description?.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesCategory = filterCategory === 'all' || 
                               service.category?.toLowerCase() === filterCategory.toLowerCase();
        
        return matchesSearch && matchesCategory;
    });

    const getServiceIcon = (serviceType) => {
        const Icon = serviceTypeIcons[serviceType?.toLowerCase()] || serviceTypeIcons.default;
        return <Icon className="w-5 h-5" />;
    };

    if (initialLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-base-100 to-base-200 flex items-center justify-center">
                <div className="text-center space-y-4">
                    <div className="relative">
                        <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary/20 border-t-primary"></div>
                        <Wrench className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-primary animate-pulse" size={24} />
                    </div>
                    <div>
                        <p className="text-lg font-medium text-primary animate-pulse">Loading Services</p>
                        <p className="text-sm text-base-content/60">Fetching the best services for you</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-base-100 to-base-200 flex items-center justify-center">
                <div className="text-center space-y-4 max-w-md">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-error/10">
                        <AlertCircle className="w-8 h-8 text-error" />
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-xl font-semibold text-error">Failed to Load Services</h3>
                        <p className="text-base-content/70">{error}</p>
                    </div>
                    <button
                        onClick={() => window.location.reload()}
                        className="btn btn-primary gap-2"
                    >
                        <Loader2 className="w-4 h-4" />
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    if (services.length === 0) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-base-100 to-base-200 flex items-center justify-center">
                <div className="text-center space-y-4 max-w-md">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-warning/10">
                        <Package className="w-8 h-8 text-warning" />
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-xl font-semibold text-base-content">No Services Available</h3>
                        <p className="text-base-content/70">There are no services available at the moment.</p>
                    </div>
                    <button
                        onClick={() => window.location.reload()}
                        className="btn btn-outline gap-2"
                    >
                        <Loader2 className="w-4 h-4" />
                        Refresh
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-base-100 to-base-200">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-12 text-center">
                    <div className="inline-flex items-center gap-3 mb-4">
                        <div className="p-3 bg-gradient-to-br from-primary to-primary/70 rounded-xl">
                            <Wrench className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                                Professional Services
                            </h1>
                            <p className="text-base-content/70 mt-2 max-w-2xl mx-auto">
                                Discover premium services tailored to your needs with guaranteed quality and satisfaction
                            </p>
                        </div>
                    </div>
                </div>

                {/* Search and Filter Bar */}
                <div className="mb-8">
                    <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
                        {/* Search */}
                        <div className="w-full lg:w-auto lg:flex-1 max-w-2xl">
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-base-content/50" />
                                <input
                                    type="text"
                                    placeholder="Search services..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="input input-bordered w-full pl-12 focus:border-primary focus:ring-2 focus:ring-primary/20"
                                />
                            </div>
                        </div>

                        {/* Category Filter */}
                        <div className="flex items-center gap-2 overflow-x-auto pb-2 w-full lg:w-auto">
                            {serviceCategories.map((category) => {
                                const Icon = category.icon;
                                return (
                                    <button
                                        key={category.id}
                                        onClick={() => setFilterCategory(category.id)}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all whitespace-nowrap ${filterCategory === category.id
                                            ? 'bg-primary text-primary-content shadow-md'
                                            : 'bg-base-200 hover:bg-base-300 text-base-content/70 hover:text-base-content'
                                        }`}
                                    >
                                        <Icon className="w-4 h-4" />
                                        <span className="text-sm font-medium">{category.label}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <div className="mb-8 grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-base-100 rounded-xl p-4 border border-base-300 text-center">
                        <div className="text-2xl font-bold text-primary">{filteredServices.length}</div>
                        <div className="text-sm text-base-content/70">Services Available</div>
                    </div>
                    <div className="bg-base-100 rounded-xl p-4 border border-base-300 text-center">
                        <div className="text-2xl font-bold text-secondary">{serviceCategories.length}</div>
                        <div className="text-sm text-base-content/70">Categories</div>
                    </div>
                    <div className="bg-base-100 rounded-xl p-4 border border-base-300 text-center">
                        <div className="text-2xl font-bold text-accent">{favorites.size}</div>
                        <div className="text-sm text-base-content/70">Favorites</div>
                    </div>
                    <div className="bg-base-100 rounded-xl p-4 border border-base-300 text-center">
                        <div className="text-2xl font-bold text-success">24/7</div>
                        <div className="text-sm text-base-content/70">Support</div>
                    </div>
                </div>

                {/* Services List */}
                {filteredServices.length === 0 ? (
                    <div className="text-center py-16 space-y-4">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-info/10">
                            <Search className="w-8 h-8 text-info" />
                        </div>
                        <h3 className="text-xl font-semibold text-base-content">No Services Found</h3>
                        <p className="text-base-content/70">
                            Try adjusting your search or filter criteria
                        </p>
                        <button
                            onClick={() => {
                                setSearchTerm('');
                                setFilterCategory('all');
                            }}
                            className="btn btn-outline gap-2"
                        >
                            <Filter className="w-4 h-4" />
                            Clear All Filters
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-6xl mx-auto">
                        {filteredServices.map((service, index) => {
                            const isFavorite = favorites.has(service.id);
                            const Icon = getServiceIcon(service.category);

                            return (
                                <div 
                                    key={service.id} 
                                    className="group bg-gradient-to-b from-base-100 to-base-200 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-base-300 hover:border-primary/30"
                                >
                                    <div className="relative h-64 overflow-hidden">
                                        {/* Carousel */}
                                        {service.imagesService && service.imagesService.length > 0 ? (
                                            <div className="relative h-full">
                                                {service.imagesService.map((image, idx) => (
                                                    <div 
                                                        key={idx} 
                                                        className={`absolute inset-0 w-full h-full transition-opacity duration-500 ${activeImageIndexes[index] === idx ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                                                    >
                                                        <img 
                                                            src={`${baseUrl}${image.imagesUrl}`} 
                                                            alt={`${service.service_name} - Image ${idx + 1}`}
                                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                                        />
                                                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                                                    </div>
                                                ))}
                                                
                                                {/* Navigation Arrows */}
                                                <button 
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handlePrevImage(index);
                                                    }}
                                                    className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 bg-black/40 backdrop-blur-sm rounded-full hover:bg-black/60 transition-all opacity-0 group-hover:opacity-100"
                                                >
                                                    <ChevronLeft className="w-5 h-5 text-white" />
                                                </button>
                                                <button 
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleNextImage(index);
                                                    }}
                                                    className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 bg-black/40 backdrop-blur-sm rounded-full hover:bg-black/60 transition-all opacity-0 group-hover:opacity-100"
                                                >
                                                    <ChevronRight className="w-5 h-5 text-white" />
                                                </button>
                                                
                                                {/* Image Counter */}
                                                <div className="absolute bottom-4 left-4 px-3 py-1 bg-black/60 backdrop-blur-sm rounded-full text-white text-sm">
                                                    {activeImageIndexes[index] + 1} / {service.imagesService.length}
                                                </div>
                                                
                                                {/* Favorite Button */}
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        toggleFavorite(service.id);
                                                    }}
                                                    className="absolute top-4 right-4 p-2 bg-black/40 backdrop-blur-sm rounded-full hover:bg-black/60 transition-colors"
                                                >
                                                    <Heart className={`w-5 h-5 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-white'}`} />
                                                </button>
                                                
                                                {/* Service Type Badge */}
                                                <div className="absolute top-4 left-4">
                                                    <div className="flex items-center gap-2 px-3 py-1 bg-primary/90 backdrop-blur-sm text-white text-xs font-medium rounded-full">
                                                        {Icon}
                                                        <span className="capitalize">{service.category || 'Service'}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="w-full h-full bg-gradient-to-br from-primary/10 to-secondary/10 flex flex-col items-center justify-center p-6">
                                                <ImageIcon className="w-16 h-16 text-base-content/30 mb-3" />
                                                <p className="text-base-content/50">No images available</p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Service Info */}
                                    <div className="p-6 space-y-4">
                                        {/* Header */}
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <h3 className="text-xl font-bold text-base-content group-hover:text-primary transition-colors">
                                                    {service.service_name}
                                                </h3>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <MapPin className="w-4 h-4 text-base-content/60" />
                                                    <span className="text-sm text-base-content/60">Available Nationwide</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Star className="w-4 h-4 text-warning fill-current" />
                                                <span className="font-medium text-base-content">4.8</span>
                                            </div>
                                        </div>

                                        {/* Description */}
                                        <p className="text-base-content/70 line-clamp-2">
                                            {service.description || 'No description available'}
                                        </p>

                                        {/* Quick Stats */}
                                        <div className="flex items-center gap-4 text-sm">
                                            <div className="flex items-center gap-1">
                                                <Shield className="w-4 h-4 text-success" />
                                                <span className="text-base-content/60">Verified</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Users className="w-4 h-4 text-info" />
                                                <span className="text-base-content/60">500+ Clients</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Clock className="w-4 h-4 text-warning" />
                                                <span className="text-base-content/60">24/7 Available</span>
                                            </div>
                                        </div>

                                        {/* Image Dots */}
                                        {service.imagesService && service.imagesService.length > 0 && (
                                            <div className="flex gap-1">
                                                {service.imagesService.map((_, dotIdx) => (
                                                    <button
                                                        key={dotIdx}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleDotClick(index, dotIdx);
                                                        }}
                                                        className={`h-2 rounded-full transition-all duration-300 ${activeImageIndexes[index] === dotIdx 
                                                            ? 'bg-primary w-4' 
                                                            : 'bg-base-300 hover:bg-base-400 w-2'
                                                        }`}
                                                    />
                                                ))}
                                            </div>
                                        )}

                                        {/* Action Buttons */}
                                        <div className="flex gap-3 pt-4 border-t border-base-300">
                                            <button className="btn btn-primary flex-1 gap-2">
                                                <MessageCircle className="w-4 h-4" />
                                                Contact Now
                                            </button>
                                            <button className="btn btn-outline gap-2">
                                                <Eye className="w-4 h-4" />
                                                Details
                                            </button>
                                            <button className="btn btn-ghost btn-square">
                                                <Share2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Featured Services Banner */}
                <div className="mt-12 p-6 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent rounded-2xl border border-primary/20">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-primary/10 rounded-lg">
                                <Award className="w-8 h-8 text-primary" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-base-content">Premium Service Guarantee</h3>
                                <p className="text-base-content/70">All our services come with quality assurance and customer satisfaction guarantee</p>
                            </div>
                        </div>
                        <button className="btn btn-primary gap-2">
                            <Briefcase className="w-4 h-4" />
                            View All Services
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Service;