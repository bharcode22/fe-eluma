import React from 'react';
import { UserCheck, MessageSquare, PhoneCall } from 'lucide-react';

const PropertyHostCard = ({ ownerData }) => {
  if (!ownerData || !ownerData.fullname) return null;

  return (
    <div className="bg-base-100 border border-base-300 shadow-sm rounded-3xl p-6 space-y-4">
      <div className="flex items-center gap-3 border-b border-base-200 pb-3">
        <UserCheck className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-bold text-base-content">Property Host / Owner</h3>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md">
            {ownerData.fullname.charAt(0).toUpperCase()}
          </div>
          <div>
            <h4 className="font-bold text-base text-base-content">{ownerData.fullname}</h4>
            <p className="text-xs text-base-content/60">Verified Property Host</p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {ownerData.watsapp && (
            <a
              href={`https://wa.me/${ownerData.watsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-success btn-sm text-white rounded-xl gap-1.5 flex-1 sm:flex-initial shadow-sm"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>WhatsApp Host</span>
            </a>
          )}
          {ownerData.phone && (
            <a
              href={`tel:${ownerData.phone}`}
              className="btn btn-outline btn-sm rounded-xl gap-1.5 flex-1 sm:flex-initial"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Call Host</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default PropertyHostCard;
