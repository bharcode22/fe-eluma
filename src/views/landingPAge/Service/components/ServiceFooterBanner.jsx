import React from 'react';
import { Award, PhoneCall } from 'lucide-react';

export default function ServiceFooterBanner() {
    return (
        <div className="p-6 md:p-8 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent rounded-2xl border border-primary/20 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-2xl text-primary shrink-0">
                    <Award className="w-8 h-8" />
                </div>
                <div>
                    <h3 className="text-lg font-bold text-base-content">Quality & Service Assurance</h3>
                    <p className="text-xs text-base-content/70 mt-0.5">
                        Every service offering is verified to provide maximum customer satisfaction.
                    </p>
                </div>
            </div>

            <a
                href="/contact"
                className="btn btn-primary gap-2 rounded-xl text-white self-stretch md:self-auto shadow-md"
            >
                <PhoneCall className="w-4 h-4" />
                <span>Contact Us</span>
            </a>
        </div>
    );
}
