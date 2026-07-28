import React from 'react';
import { Sparkles } from 'lucide-react';

export default function ServiceHeader() {
    return (
        <div className="text-center space-y-4 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold">
                <Sparkles className="w-4 h-4" />
                <span>Professional Platform Services</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-base-content tracking-tight">
                Explore Premium Services
            </h1>
            <p className="text-sm sm:text-base text-base-content/70 leading-relaxed">
                Find top-rated services designed for your property, home, and personal needs with verified quality.
            </p>
        </div>
    );
}
