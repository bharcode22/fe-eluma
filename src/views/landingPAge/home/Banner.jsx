import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Search,
    MapPin,
    Building2,
    DollarSign,
    Sparkles,
    ShieldCheck,
    Home as HomeIcon,
    Award
} from 'lucide-react';
import api from '../../../service/api';

const baseUrl = api.defaults.baseURL;

function Banner({ bannerFilters, setBannerFilters }) {
    const [searchLocation, setSearchLocation] = useState(bannerFilters?.searchLocation || '');
    const [propertyType, setPropertyType] = useState(bannerFilters?.propertyType || '');
    const [priceRange, setPriceRange] = useState(bannerFilters?.priceRange || '');
    const [typeOptions, setTypeOptions] = useState([]);
    const [generalAreas, setGeneralAreas] = useState([]);

    useEffect(() => {
        axios.get(`${baseUrl}/type-property/`)
            .then(res => {
                if (res.data.data) setTypeOptions(res.data.data);
            })
            .catch(err => console.error('Failed to fetch property types:', err));

        axios.get(`${baseUrl}/general-area`)
            .then(res => {
                if (res.data.data) setGeneralAreas(res.data.data);
            })
            .catch(err => console.error('Failed to fetch general areas:', err));
    }, []);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (setBannerFilters) {
            setBannerFilters({
                searchLocation,
                propertyType,
                priceRange
            });
        }
        const propertySection = document.getElementById('all-properties-section');
        if (propertySection) {
            propertySection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-base-900">
            {/* Background Image with Gradient Overlay */}
            <div className="absolute inset-0 z-0">
                <img
                    src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=2000&q=80"
                    alt="Luxury Villa Banner"
                    className="w-full h-full object-cover object-center scale-105 animate-pulse-slow"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-base-100 via-black/60 to-black/70" />
                <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]" />
            </div>

            {/* Decorative Glow Effects */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-3xl pointer-events-none" />

            {/* Hero Content */}
            <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center py-16 md:py-24 space-y-8">

                {/* Top Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white shadow-lg animate-fade-in">
                    <Sparkles className="w-4 h-4 text-amber-400 animate-spin-slow" />
                    <span className="text-xs sm:text-sm font-semibold tracking-wide">
                        Exclusive Luxury Living & Real Estate
                    </span>
                </div>

                {/* Main Headline */}
                <div className="space-y-4 max-w-3xl mx-auto">
                    <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-white leading-tight tracking-tight drop-shadow-md">
                        Find Your Dream Sanctuary With{' '}
                        <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                            Eluma Property
                        </span>
                    </h1>
                    <p className="text-sm sm:text-base md:text-lg text-white/80 max-w-2xl mx-auto leading-relaxed font-light">
                        Discover handpicked luxury villas, modern apartments, and prime real estate investments tailored for your lifestyle in paradise.
                    </p>
                </div>

                {/* Interactive Search Bar (Glassmorphism Card) */}
                <div className="max-w-4xl mx-auto">
                    <form
                        onSubmit={handleSearchSubmit}
                        className="bg-base-100/90 backdrop-blur-xl border border-white/20 shadow-2xl rounded-3xl p-3 sm:p-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-left transition-all hover:border-white/30"
                    >
                        {/* Location Dropdown (from Genral_area database table) */}
                        <div className="flex items-center gap-3 bg-base-200/60 p-3 rounded-2xl border border-base-300/50 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all">
                            <MapPin className="w-5 h-5 text-primary flex-shrink-0" />
                            <div className="w-full min-w-0">
                                <label className="block text-[10px] uppercase font-bold text-base-content/50 tracking-wider">
                                    Location
                                </label>
                                <select
                                    value={searchLocation}
                                    onChange={(e) => setSearchLocation(e.target.value)}
                                    className="w-full bg-transparent text-xs sm:text-sm font-medium text-base-content focus:outline-none cursor-pointer"
                                >
                                    <option value="">All Locations</option>
                                    {generalAreas.map((item, idx) => (
                                        <option key={item.id || item.area || idx} value={item.area}>
                                            {item.area}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Property Type Dropdown (from PropertyType database table) */}
                        <div className="flex items-center gap-3 bg-base-200/60 p-3 rounded-2xl border border-base-300/50 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all">
                            <Building2 className="w-5 h-5 text-primary flex-shrink-0" />
                            <div className="w-full min-w-0">
                                <label className="block text-[10px] uppercase font-bold text-base-content/50 tracking-wider">
                                    Property Type
                                </label>
                                <select
                                    value={propertyType}
                                    onChange={(e) => setPropertyType(e.target.value)}
                                    className="w-full bg-transparent text-xs sm:text-sm font-medium text-base-content focus:outline-none cursor-pointer"
                                >
                                    <option value="">All Types</option>
                                    {typeOptions.map((type) => (
                                        <option key={type.id} value={type.id}>
                                            {type.type_name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Price Range Dropdown */}
                        <div className="flex items-center gap-3 bg-base-200/60 p-3 rounded-2xl border border-base-300/50 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all">
                            <DollarSign className="w-5 h-5 text-primary flex-shrink-0" />
                            <div className="w-full min-w-0">
                                <label className="block text-[10px] uppercase font-bold text-base-content/50 tracking-wider">
                                    Price Range
                                </label>
                                <select
                                    value={priceRange}
                                    onChange={(e) => setPriceRange(e.target.value)}
                                    className="w-full bg-transparent text-xs sm:text-sm font-medium text-base-content focus:outline-none cursor-pointer"
                                >
                                    <option value="">Any Budget</option>
                                    <option value="under_100k">Under Rp100M</option>
                                    <option value="100k_500k">Rp100M - Rp500M</option>
                                    <option value="500k_1m">Rp500M - Rp1B</option>
                                    <option value="above_1m">Above Rp1B</option>
                                </select>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="btn btn-primary rounded-2xl h-full min-h-[50px] gap-2 text-white font-bold text-sm shadow-lg hover:shadow-primary/30 transition-all group"
                        >
                            <Search className="w-4 h-4 group-hover:scale-110 transition-transform" />
                            <span>Search Property</span>
                        </button>
                    </form>
                </div>

                {/* Highlight Stats Bar */}
                <div className="pt-6 grid grid-cols-2 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
                    <div className="flex items-center justify-center gap-3 p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 text-white">
                        <HomeIcon className="w-5 h-5 text-primary" />
                        <div className="text-left">
                            <div className="text-sm font-bold">500+</div>
                            <div className="text-[11px] text-white/70">Luxury Properties</div>
                        </div>
                    </div>

                    <div className="flex items-center justify-center gap-3 p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 text-white">
                        <ShieldCheck className="w-5 h-5 text-secondary" />
                        <div className="text-left">
                            <div className="text-sm font-bold">100%</div>
                            <div className="text-[11px] text-white/70">Verified Listings</div>
                        </div>
                    </div>

                    <div className="col-span-2 md:col-span-1 flex items-center justify-center gap-3 p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 text-white">
                        <Award className="w-5 h-5 text-amber-400" />
                        <div className="text-left">
                            <div className="text-sm font-bold">#1 Rated</div>
                            <div className="text-[11px] text-white/70">Real Estate Agency</div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default Banner;
