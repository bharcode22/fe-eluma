import React from 'react';
import { Link } from 'react-router-dom';
import {
    Building2,
    Sparkles,
    ShieldCheck,
    Award,
    Users,
    Target,
    Compass,
    HeartHandshake,
    ArrowRight,
    CheckCircle2,
    PhoneCall,
    Home
} from 'lucide-react';

function AboutContent() {
    const stats = [
        { value: '500+', label: 'Luxury Properties Managed', icon: Home },
        { value: '$150M+', label: 'Total Transaction Volume', icon: Award },
        { value: '99%', label: 'Satisfied Clients', icon: HeartHandshake },
        { value: '10+', label: 'Years of Excellence', icon: ShieldCheck },
    ];

    const values = [
        {
            icon: Award,
            title: 'Uncompromised Quality',
            description: 'Every property listed on Eluma undergoes rigorous inspection to ensure top-tier architecture, premium amenities, and legal compliance.'
        },
        {
            icon: ShieldCheck,
            title: 'Complete Transparency',
            description: 'No hidden fees, no ambiguous terms. We provide clear pricing, direct owner communications, and full disclosure at every step.'
        },
        {
            icon: Target,
            title: 'Tailored Investment Advice',
            description: 'Our advisory team leverages deep market intelligence to help clients find high-yield rental properties and long-term capital growth.'
        },
        {
            icon: Compass,
            title: 'Seamless Digital Platform',
            description: 'From virtual tours and dynamic filter search to digital document management, we make buying or renting properties effortless.'
        }
    ];

    const teamMembers = [
        {
            name: 'Alexander Wright',
            role: 'Founder & Managing Director',
            image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=600&q=80',
            bio: '15+ years in real estate development and luxury property brokerage in Southeast Asia.'
        },
        {
            name: 'Sophia Laurent',
            role: 'Head of Luxury Advisory',
            image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
            bio: 'Specialist in high-end villa portfolio acquisition and personalized client concierge services.'
        },
        {
            name: 'David Wijaya',
            role: 'Chief Operations Officer',
            image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=600&q=80',
            bio: 'Oversees legal compliance, property management operations, and client satisfaction.'
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-base-100 via-base-200/50 to-base-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto space-y-20">

                {/* 1. Hero Header */}
                <div className="text-center space-y-6 max-w-3xl mx-auto">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary shadow-sm">
                        <Sparkles className="w-4 h-4 text-amber-500" />
                        <span className="text-xs sm:text-sm font-bold uppercase tracking-wider">
                            Redefining Luxury Living
                        </span>
                    </div>

                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-base-content tracking-tight leading-tight">
                        About <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">Eluma Property</span>
                    </h1>

                    <p className="text-base sm:text-lg text-base-content/70 leading-relaxed">
                        Your premier destination for handpicked luxury villas, modern residences, and strategic real estate investments. We bridge extraordinary spaces with extraordinary lives.
                    </p>
                </div>

                {/* 2. Story & Vision (Two Column Showcase) */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div className="relative">
                        <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border border-base-300">
                            <img
                                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"
                                alt="Eluma Luxury Villa"
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                        </div>

                        {/* Overlapping Glass Card */}
                        <div className="absolute -bottom-6 -right-2 sm:-right-6 bg-base-100/90 backdrop-blur-md p-6 rounded-2xl border border-base-300 shadow-2xl max-w-xs space-y-2 hidden sm:block">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-primary/10 text-primary rounded-xl">
                                    <Building2 className="w-6 h-6" />
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-base-content">100%</div>
                                    <div className="text-xs text-base-content/60 font-medium">Verified Property Listings</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary">
                            <Target className="w-4 h-4" />
                            <span>Our Mission & Vision</span>
                        </div>

                        <h2 className="text-3xl sm:text-4xl font-bold text-base-content leading-tight">
                            Elevating Real Estate Experiences With Integrity & Elegance
                        </h2>

                        <p className="text-sm sm:text-base text-base-content/70 leading-relaxed">
                            Founded with a passion for architectural brilliance and client satisfaction, Eluma Property connects buyers, tenants, and property owners through a seamless digital experience backed by local expertise.
                        </p>

                        <div className="space-y-3 pt-2">
                            {[
                                'Strict quality verification for every villa and estate',
                                'Tailored advisory for high-yield rental returns & capital growth',
                                'Transparent transaction processes with zero hidden fees',
                                'Dedicated 24/7 concierge & post-acquisition client support'
                            ].map((item, idx) => (
                                <div key={idx} className="flex items-center gap-3">
                                    <div className="p-1 rounded-full bg-success/10 text-success">
                                        <CheckCircle2 className="w-4 h-4" />
                                    </div>
                                    <span className="text-xs sm:text-sm font-medium text-base-content">{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* 3. Achievement Stats Counter */}
                <div className="bg-base-100 rounded-3xl border border-base-300 shadow-sm p-8 sm:p-12">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {stats.map((stat, idx) => (
                            <div key={idx} className="text-center space-y-2">
                                <div className="inline-flex p-3 rounded-2xl bg-primary/10 text-primary mb-2">
                                    <stat.icon className="w-6 h-6" />
                                </div>
                                <div className="text-3xl sm:text-4xl font-extrabold text-base-content">
                                    {stat.value}
                                </div>
                                <div className="text-xs sm:text-sm text-base-content/60 font-medium">
                                    {stat.label}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 4. Core Values Grid */}
                <div className="space-y-10">
                    <div className="text-center space-y-3 max-w-2xl mx-auto">
                        <h2 className="text-3xl sm:text-4xl font-bold text-base-content">
                            Why Choose Eluma Property?
                        </h2>
                        <p className="text-sm text-base-content/70">
                            Our core values guide every interaction, ensuring you receive world-class service.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {values.map((val, idx) => (
                            <div
                                key={idx}
                                className="bg-base-100 rounded-2xl p-6 border border-base-300 shadow-sm hover:shadow-md hover:border-primary/30 transition-all duration-300 space-y-4 group"
                            >
                                <div className="p-3.5 bg-primary/10 rounded-2xl text-primary w-fit group-hover:scale-110 transition-transform">
                                    <val.icon className="w-6 h-6" />
                                </div>
                                <h3 className="text-lg font-bold text-base-content">{val.title}</h3>
                                <p className="text-xs text-base-content/70 leading-relaxed">{val.description}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 5. Team Showcase */}
                <div className="space-y-10">
                    <div className="text-center space-y-3 max-w-2xl mx-auto">
                        <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary">
                            <Users className="w-4 h-4" />
                            <span>Leadership Team</span>
                        </div>
                        <h2 className="text-3xl sm:text-4xl font-bold text-base-content">
                            Meet Our Real Estate Experts
                        </h2>
                        <p className="text-sm text-base-content/70">
                            Passionate professionals committed to delivering exceptional property solutions.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {teamMembers.map((member, idx) => (
                            <div
                                key={idx}
                                className="bg-base-100 rounded-2xl overflow-hidden border border-base-300 shadow-sm hover:shadow-lg transition-all group"
                            >
                                <div className="aspect-[4/3] overflow-hidden">
                                    <img
                                        src={member.image}
                                        alt={member.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                </div>
                                <div className="p-6 space-y-2">
                                    <h3 className="text-lg font-bold text-base-content">{member.name}</h3>
                                    <p className="text-xs font-semibold text-primary">{member.role}</p>
                                    <p className="text-xs text-base-content/70 pt-2 border-t border-base-200">
                                        {member.bio}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 6. CTA Card */}
                <div className="bg-gradient-to-r from-primary via-primary/90 to-secondary text-primary-content rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden text-center space-y-6">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />

                    <div className="max-w-2xl mx-auto space-y-4 relative z-10">
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
                            Ready to Find Your Sanctuary?
                        </h2>
                        <p className="text-sm sm:text-base text-white/90 font-light">
                            Explore our curated portfolio of luxury properties or speak directly with our advisory team today.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
                        <Link
                            to="/"
                            className="btn btn-neutral bg-white text-primary hover:bg-white/90 border-none rounded-xl gap-2 text-xs sm:text-sm font-bold shadow-md w-full sm:w-auto"
                        >
                            <span>Explore Properties</span>
                            <ArrowRight className="w-4 h-4" />
                        </Link>

                        <Link
                            to="/contact"
                            className="btn btn-outline border-white text-white hover:bg-white/10 rounded-xl gap-2 text-xs sm:text-sm font-semibold w-full sm:w-auto"
                        >
                            <PhoneCall className="w-4 h-4" />
                            <span>Contact Us</span>
                        </Link>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default AboutContent;
