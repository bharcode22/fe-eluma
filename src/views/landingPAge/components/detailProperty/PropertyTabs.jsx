import React, { useState } from 'react';
import {
  Info,
  Star,
  Calendar,
  Sparkles,
  CheckCircle,
  Construction,
  Car,
  Bike,
  ParkingSquare,
  Waves,
  Sun,
  Leaf,
  Trees,
  Mountain,
  Sunrise,
  Eye
} from 'lucide-react';

const AvailabilityCard = ({ label, date, icon: Icon }) => (
  <div className="flex items-center gap-4 p-4 bg-base-200/50 rounded-2xl border border-base-300 hover:border-primary/40 transition-all flex-1">
    <div className="p-3 bg-primary/10 rounded-xl text-primary">
      <Icon className="w-5 h-5" />
    </div>
    <div>
      <p className="text-xs text-base-content/60">{label}</p>
      <p className="text-sm font-semibold text-base-content">
        {date ? new Date(date).toLocaleDateString('en-US', {
          weekday: 'short',
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        }) : 'N/A'}
      </p>
    </div>
  </div>
);

const FeatureBadge = ({ icon: Icon, label }) => (
  <div className="inline-flex items-center gap-2 px-4 py-2.5 bg-base-200/60 rounded-xl border border-base-300 hover:border-primary/30 transition-all">
    {Icon ? <Icon className="w-4 h-4 text-primary" /> : <CheckCircle className="w-4 h-4 text-success" />}
    <span className="text-xs font-semibold text-base-content capitalize">
      {label.replace(/_/g, ' ')}
    </span>
  </div>
);

const ViewDetails = ({ view }) => {
  if (!view) return null;

  const viewOptions = [
    { key: 'ocean_view', label: 'Ocean View', icon: Waves, color: 'text-blue-500' },
    { key: 'sunset_view', label: 'Sunset View', icon: Sun, color: 'text-orange-500' },
    { key: 'garden_view', label: 'Garden View', icon: Leaf, color: 'text-green-500' },
    { key: 'beach_view', label: 'Beach View', icon: Waves, color: 'text-blue-400' },
    { key: 'jungle_view', label: 'Jungle View', icon: Trees, color: 'text-emerald-600' },
    { key: 'montain_view', label: 'Mountain View', icon: Mountain, color: 'text-stone-600' },
    { key: 'pool_view', label: 'Pool View', icon: Waves, color: 'text-cyan-500' },
    { key: 'rice_field', label: 'Rice Field View', icon: Leaf, color: 'text-lime-600' },
    { key: 'sunrise_view', label: 'Sunrise View', icon: Sunrise, color: 'text-yellow-500' },
    { key: 'volcano_view', label: 'Volcano View', icon: Mountain, color: 'text-red-600' }
  ];

  const availableViews = viewOptions.filter(({ key }) => view[key]);
  if (availableViews.length === 0) return null;

  return (
    <div className="space-y-3 p-4 bg-gradient-to-br from-info/5 to-info/10 rounded-2xl border border-info/20">
      <div className="flex items-center gap-2">
        <Eye className="w-5 h-5 text-info" />
        <h4 className="font-bold text-sm text-base-content">Property Views</h4>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
        {availableViews.map(({ key, label, icon: Icon, color }) => (
          <div key={key} className="flex items-center gap-2 p-2.5 bg-base-100 rounded-xl border border-base-200">
            <Icon className={`w-4 h-4 ${color}`} />
            <span className="text-xs text-base-content font-medium">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const ParkingDetails = ({ parking }) => {
  if (!parking) return null;

  const parkingOptions = [
    { key: 'car_parking', label: 'Car Parking', icon: Car },
    { key: 'bike_parking', label: 'Motorcycle Parking', icon: Bike },
    { key: 'both_car_and_bike', label: 'Car & Motor Parking', icon: ParkingSquare }
  ];

  const availableParking = parkingOptions.filter(({ key }) => parking[key]);
  if (availableParking.length === 0) return null;

  return (
    <div className="space-y-3 p-4 bg-gradient-to-br from-warning/5 to-warning/10 rounded-2xl border border-warning/20">
      <div className="flex items-center gap-2">
        <ParkingSquare className="w-5 h-5 text-warning" />
        <h4 className="font-bold text-sm text-base-content">Parking Facilities</h4>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
        {availableParking.map(({ key, label, icon: Icon }) => (
          <div key={key} className="flex items-center gap-2 p-2.5 bg-base-100 rounded-xl border border-base-200">
            <Icon className="w-4 h-4 text-warning" />
            <span className="text-xs text-base-content font-medium">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const PropertyTabs = ({
  property,
  sanitizedHTML,
  facilitiesData,
  availabilityData,
  additionalData,
  parkingData,
  viewData
}) => {
  const [activeTab, setActiveTab] = useState('overview');

  const activeFacilities = Object.entries(facilitiesData)
    .filter(([key, val]) => typeof val === 'boolean' && val && key !== 'id' && key !== 'property_id');

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="tabs tabs-boxed bg-base-200/70 p-1.5 rounded-2xl flex">
        {['overview', 'facilities', 'availability', 'details'].map((tab) => (
          <button
            key={tab}
            className={`tab tab-md sm:tab-lg flex-1 capitalize font-bold rounded-xl transition-all ${
              activeTab === tab ? 'tab-active bg-primary text-white shadow-md' : 'text-base-content/70'
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Contents */}
      <div className="space-y-6">
        {activeTab === 'overview' && (
          <div className="bg-base-100 border border-base-300 shadow-sm rounded-3xl overflow-hidden p-6 space-y-4">
            <div className="flex items-center gap-3 border-b border-base-200 pb-4">
              <Info className="w-6 h-6 text-primary" />
              <h2 className="text-xl font-bold text-base-content">Property Description</h2>
            </div>
            <div className="prose prose-sm sm:prose-base max-w-none text-base-content leading-relaxed">
              <div
                className="prose-headings:text-base-content prose-p:text-base-content/80 prose-li:text-base-content/80"
                dangerouslySetInnerHTML={{ __html: sanitizedHTML || property.description || 'No description provided.' }}
              />
            </div>
          </div>
        )}

        {activeTab === 'facilities' && (
          <div className="bg-base-100 border border-base-300 shadow-sm rounded-3xl overflow-hidden p-6 space-y-4">
            <div className="flex items-center gap-3 border-b border-base-200 pb-4">
              <Star className="w-6 h-6 text-primary" />
              <h2 className="text-xl font-bold text-base-content">Facilities & Amenities</h2>
            </div>
            {activeFacilities.length === 0 ? (
              <p className="text-xs text-base-content/50 italic">No specific facilities specified.</p>
            ) : (
              <div className="flex flex-wrap gap-2.5">
                {activeFacilities.map(([key]) => (
                  <FeatureBadge
                    key={key}
                    label={key}
                    icon={CheckCircle}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'availability' && (
          <div className="bg-base-100 border border-base-300 shadow-sm rounded-3xl overflow-hidden p-6 space-y-4">
            <div className="flex items-center gap-3 border-b border-base-200 pb-4">
              <Calendar className="w-6 h-6 text-primary" />
              <h2 className="text-xl font-bold text-base-content">Availability Schedule</h2>
            </div>
            {!availabilityData.available_from ? (
              <p className="text-xs text-base-content/50 italic">No availability schedule configured.</p>
            ) : (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <AvailabilityCard
                    label="Available From"
                    date={availabilityData.available_from}
                    icon={Calendar}
                  />
                  <AvailabilityCard
                    label="Available To"
                    date={availabilityData.available_to}
                    icon={Calendar}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'details' && (
          <div className="bg-base-100 border border-base-300 shadow-sm rounded-3xl overflow-hidden p-6 space-y-4">
            <div className="flex items-center gap-3 border-b border-base-200 pb-4">
              <Sparkles className="w-6 h-6 text-primary" />
              <h2 className="text-xl font-bold text-base-content">Additional Information</h2>
            </div>
            <div className="space-y-5">
              {/* Construction Nearby Notice */}
              {additionalData.construction_nearby && (
                <div className="p-4 rounded-2xl bg-warning/10 border border-warning/30 text-warning flex items-center gap-3 text-xs font-semibold">
                  <Construction className="w-5 h-5 flex-shrink-0" />
                  <span>Notice: Construction activity reported nearby.</span>
                </div>
              )}

              {/* Pets Allowed */}
              {(additionalData.allow_pets || additionalData.allow_path) && (
                <div className="flex items-center gap-2 p-3 bg-base-200/50 rounded-xl border border-base-300 text-xs font-medium text-base-content">
                  <CheckCircle className="w-4 h-4 text-success" />
                  <span>Pets / Path Access Allowed</span>
                </div>
              )}

              {/* Cleaning Info */}
              {(additionalData.cleaning_requency || additionalData.linen_chaneg) && (
                <div className="p-4 bg-base-200/50 rounded-2xl border border-base-300 space-y-2">
                  <div className="text-xs font-bold text-base-content uppercase tracking-wider">
                    Cleaning & Service Schedule
                  </div>
                  {additionalData.cleaning_requency && (
                    <div className="text-xs text-base-content/80">
                      <strong>Cleaning Frequency:</strong> {additionalData.cleaning_requency}
                    </div>
                  )}
                  {additionalData.linen_chaneg && (
                    <div className="text-xs text-base-content/80">
                      <strong>Linen Change:</strong> {additionalData.linen_chaneg}
                    </div>
                  )}
                </div>
              )}

              {/* Parking Facilities */}
              <ParkingDetails parking={parkingData} />

              {/* View Details */}
              <ViewDetails view={viewData} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertyTabs;
