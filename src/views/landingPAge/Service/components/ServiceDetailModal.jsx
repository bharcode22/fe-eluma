import React from 'react';
import { Briefcase, X, CheckCircle2 } from 'lucide-react';

export default function ServiceDetailModal({
    service,
    baseUrl,
    onClose,
}) {
    if (!service) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
                onClick={onClose}
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
                                {service.service_name}
                            </h3>
                            <span className="text-xs text-primary font-semibold">
                                {service.serviceType?.service_type || service.service_type || 'General Service'}
                            </span>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="btn btn-circle btn-xs btn-ghost text-base-content/70"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Modal Body */}
                <div className="p-6 overflow-y-auto space-y-4 text-sm">
                    {/* Images Gallery */}
                    {service.imagesService && service.imagesService.length > 0 && (
                        <div className="grid grid-cols-2 gap-2">
                            {service.imagesService.map((img, idx) => (
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
                            {service.description || 'No detailed description provided.'}
                        </p>
                    </div>

                    <div className="p-4 rounded-xl bg-base-200/60 border border-base-300 space-y-2 text-xs">
                        <div className="flex items-center justify-between">
                            <span className="text-base-content/70">Service Status</span>
                            <span className="px-2.5 py-0.5 rounded-full bg-success/10 text-success font-bold capitalize">
                                {service.status || 'Active'}
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
                        onClick={onClose}
                        className="btn btn-outline flex-1 rounded-xl"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}
