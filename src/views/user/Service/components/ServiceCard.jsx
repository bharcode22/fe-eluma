import React from 'react';
import {
  ChevronLeft,
  ChevronRight,
  MessageCircle,
  Clock,
  Star,
  Shield,
  Heart,
  Eye,
  Layers,
  Image as ImageIcon
} from 'lucide-react';

const ServiceCard = ({
  service,
  index,
  activeImgIdx,
  isFavorite,
  baseUrl,
  onPrevImage,
  onNextImage,
  onDotClick,
  onToggleFavorite,
  onOpenDetail
}) => {
  const typeLabel = service.serviceType?.service_type || service.service_type || 'General Service';
  const hasImages = service.imagesService && service.imagesService.length > 0;

  return (
    <div className="group bg-base-100 rounded-3xl border border-base-300 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between">
      {/* Image Section / Carousel */}
      <div className="relative aspect-[16/10] overflow-hidden bg-base-200">
        {hasImages ? (
          <>
            <img
              src={`${baseUrl}${service.imagesService[activeImgIdx]?.imagesUrl}`}
              alt={service.service_name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20" />

            {/* Navigation Arrows */}
            {service.imagesService.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => onPrevImage(index)}
                  className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/40 text-white hover:bg-black/70 backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => onNextImage(index)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/40 text-white hover:bg-black/70 backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>

                {/* Dot Indicators */}
                <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex items-center gap-1">
                  {service.imagesService.map((_, dotIdx) => (
                    <button
                      key={dotIdx}
                      type="button"
                      onClick={() => onDotClick(index, dotIdx)}
                      className={`h-1.5 rounded-full transition-all ${
                        activeImgIdx === dotIdx ? 'w-4 bg-primary' : 'w-1.5 bg-white/60'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-base-content/40 space-y-1">
            <ImageIcon className="w-10 h-10" />
            <span className="text-xs font-medium">No Image</span>
          </div>
        )}

        {/* Type Badge */}
        <div className="absolute top-3 left-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-base-100/90 backdrop-blur-md text-xs font-bold text-primary shadow-sm capitalize">
            <Layers className="w-3.5 h-3.5" />
            {typeLabel}
          </span>
        </div>

        {/* Favorite Toggle Button */}
        <button
          type="button"
          onClick={() => onToggleFavorite(service.id)}
          className="absolute top-3 right-3 p-2 rounded-full bg-black/40 backdrop-blur-md text-white hover:bg-black/60 transition-colors"
        >
          <Heart className={`w-4 h-4 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-white'}`} />
        </button>
      </div>

      {/* Content Section */}
      <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-bold text-base sm:text-lg text-base-content group-hover:text-primary transition-colors line-clamp-1">
              {service.service_name}
            </h3>
            <div className="flex items-center gap-1 text-warning shrink-0">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span className="text-xs font-bold text-base-content">4.9</span>
            </div>
          </div>

          <p className="text-xs text-base-content/70 line-clamp-2 leading-relaxed">
            {service.description ? service.description.replace(/<[^>]*>/g, '') : 'No description available for this service.'}
          </p>
        </div>

        <div className="pt-3 border-t border-base-200 space-y-3">
          <div className="flex items-center justify-between text-xs text-base-content/60">
            <div className="flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-success" />
              <span>Verified Service</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-primary" />
              <span>Quick Response</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onOpenDetail(service)}
              className="btn btn-outline btn-sm rounded-xl flex-1 gap-1 text-xs"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Details</span>
            </button>
            <a
              href={`https://wa.me/?text=Halo,%20saya%20tertarik%20dengan%20layanan%20${encodeURIComponent(service.service_name || 'Service')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary btn-sm rounded-xl flex-1 gap-1 text-white text-xs shadow-md"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Contact</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;
