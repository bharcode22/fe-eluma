import React from 'react';
import {
  X,
  Briefcase,
  Layers,
  Star,
  Shield,
  Clock,
  CheckCircle2,
  MessageCircle,
  Image as ImageIcon
} from 'lucide-react';

const ServiceDetailModal = ({
  service,
  baseUrl,
  onClose
}) => {
  if (!service) return null;

  const typeLabel = service.serviceType?.service_type || service.service_type || 'General Service';
  const hasImages = service.imagesService && service.imagesService.length > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-xl bg-base-100 rounded-3xl shadow-2xl overflow-hidden border border-base-300 z-10 max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-base-200">
          <div className="flex items-center gap-2">
            <span className="p-2 bg-primary/10 text-primary rounded-xl">
              <Briefcase className="w-5 h-5" />
            </span>
            <div>
              <h3 className="font-bold text-base text-base-content">Service Details</h3>
              <p className="text-xs text-base-content/60 capitalize">{typeLabel}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="btn btn-ghost btn-circle btn-sm rounded-xl"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-5 overflow-y-auto flex-1">
          {/* Main Image */}
          {hasImages ? (
            <div className="rounded-2xl overflow-hidden aspect-video bg-base-200 border border-base-300">
              <img
                src={`${baseUrl}${service.imagesService[0]?.imagesUrl}`}
                alt={service.service_name}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="h-40 rounded-2xl bg-base-200 border border-base-300 flex flex-col items-center justify-center text-base-content/40 space-y-1">
              <ImageIcon className="w-10 h-10" />
              <span className="text-xs">No image available</span>
            </div>
          )}

          {/* Title & Badge */}
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-xl font-bold text-base-content">{service.service_name}</h2>
              <span className="px-3 py-1 bg-primary/10 text-primary font-bold text-xs rounded-full border border-primary/20 capitalize">
                {typeLabel}
              </span>
            </div>
            <div className="flex items-center gap-4 text-xs text-base-content/70">
              <span className="flex items-center gap-1 text-warning font-bold">
                <Star className="w-4 h-4 fill-current" /> 4.9 Rating
              </span>
              <span className="flex items-center gap-1">
                <Shield className="w-4 h-4 text-success" /> Verified Service
              </span>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-base-content/70">Description</h4>
            <div className="p-4 bg-base-200/50 rounded-2xl border border-base-200 text-sm text-base-content/80 leading-relaxed">
              {service.description ? (
                <div dangerouslySetInnerHTML={{ __html: service.description }} />
              ) : (
                'No detailed description available.'
              )}
            </div>
          </div>

          {/* Service Guarantee Info */}
          <div className="p-4 bg-success/5 border border-success/20 rounded-2xl space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-base-content/70">Response Time</span>
              <span className="font-semibold text-base-content flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-primary" /> Within 1 hour
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
            type="button"
            onClick={onClose}
            className="btn btn-outline flex-1 rounded-xl"
          >
            Close
          </button>
          <a
            href={`https://wa.me/?text=Halo,%20saya%20tertarik%20dengan%20layanan%20${encodeURIComponent(service.service_name || 'Service')}`}
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
  );
};

export default ServiceDetailModal;
