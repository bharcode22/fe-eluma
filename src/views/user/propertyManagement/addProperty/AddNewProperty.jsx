import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import {
  Home,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  ChevronRight,
  Save,
  Loader2
} from 'lucide-react';
import api from '../../../../service/api';

import SectionNavigation from './components/SectionNavigation';
import BasicInfoSection from './components/BasicInfoSection';
import MediaSection from './components/MediaSection';
import DetailsSection from './components/DetailsSection';
import PricingSection from './components/PricingSection';
import FacilitiesSection from './components/FacilitiesSection';
import LocationSection from './components/LocationSection';
import OwnerSection from './components/OwnerSection';
import AdditionalSection from './components/AdditionalSection';
import { sections } from './components/constants';

const baseUrl = api.defaults.baseURL;

const AddNewProperty = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [generalAreas, setGeneralAreas] = useState([]);
  const [typeOptions, setTypeOptions] = useState([]);
  const [activeSection, setActiveSection] = useState('basic');

  const [formState, setFormState] = useState({
    type_id: '',
    property_tittle: '',
    description: '',
    number_of_bedrooms: '',
    number_of_bathrooms: '',
    maximum_guest: '',
    minimum_stay: '',
    price: '',
    monthly_price: '',
    yearly_price: '',
    location: {
      general_area: '',
      map_url: '',
      longitude: '',
      latitude: ''
    },
    availability: {
      available_from: '',
      available_to: ''
    },
    facilities: {
      wifi: false,
      washing_machine: false,
      coffee_maker: false,
      celling_fan: false,
      kettle: false,
      air_conditioning: false,
      tv: false,
      game_console: false,
      private_entrance: false,
      microwave: false,
      pool: false,
      beach_access: false,
      drying_machine: false,
      workspace_area: false,
      toaster: false,
      kitchen: false,
      gym: false,
      refrigenerator: false,
      fridge: false,
      security: false
    },
    propertiesOwner: {
      fullname: '',
      name: '',
      phone: '',
      watsapp: '',
      email: ''
    },
    additionalDetails: {
      allow_pets: false,
      construction_nearby: false,
      cleaning_requency: '',
      linen_chaneg: '',
      parking: {
        car_parking: false,
        bike_parking: false,
        both_car_and_bike: false,
      },
      view: {
        ocean_view: false,
        sunset_view: false,
        garden_view: false,
        beach_view: false,
        jungle_view: false,
        montain_view: false,
        pool_view: false,
        rice_field: false,
        sunrise_view: false,
        volcano_view: false,
      }
    }
  });

  useEffect(() => {
    axios.get(`${baseUrl}/general-area`)
      .then(res => setGeneralAreas(res.data.data || []))
      .catch(err => console.error('Failed to fetch general areas:', err));

    axios.get(`${baseUrl}/type-property/`)
      .then(res => {
        if (res.data.data) setTypeOptions(res.data.data);
      })
      .catch(err => console.error('Failed to fetch type property:', err));
  }, [baseUrl]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = Cookies.get('token');

    if (!token) {
      setMessage('Authentication required. Please login first.');
      return;
    }

    if (images.length === 0) {
      setMessage('Please upload at least one image.');
      return;
    }

    setLoading(true);
    setMessage('');

    const formData = new FormData();
    const {
      type_id,
      property_tittle,
      description,
      number_of_bedrooms,
      number_of_bathrooms,
      maximum_guest,
      minimum_stay,
      price,
      monthly_price,
      yearly_price,
      location,
      availability,
      facilities,
      propertiesOwner,
      additionalDetails
    } = formState;

    formData.append('type_id', type_id);
    formData.append('property_tittle', property_tittle);
    formData.append('description', description);
    formData.append('number_of_bedrooms', number_of_bedrooms);
    formData.append('number_of_bathrooms', number_of_bathrooms);
    formData.append('maximum_guest', maximum_guest);
    formData.append('minimum_stay', minimum_stay);
    formData.append('price', price);
    formData.append('monthly_price', monthly_price);
    formData.append('yearly_price', yearly_price);

    formData.append('location', JSON.stringify(location));
    const formattedAvailability = {
      ...availability,
      available_from: availability.available_from ? new Date(availability.available_from).toISOString() : '',
      available_to: availability.available_to ? new Date(availability.available_to).toISOString() : '',
    };
    formData.append('availability', JSON.stringify(formattedAvailability));
    formData.append('facilities', JSON.stringify(facilities));
    const propertiesOwnerForBackend = {
      ...propertiesOwner,
      phone: propertiesOwner.phone ? parseInt(propertiesOwner.phone, 10) : null,
      watsapp: propertiesOwner.watsapp ? parseInt(propertiesOwner.watsapp, 10) : null,
    };
    formData.append('propertiesOwner', JSON.stringify(propertiesOwnerForBackend));
    formData.append('additionalDetails', JSON.stringify(additionalDetails));

    images.forEach((file) => {
      formData.append('images', file);
    });

    try {
      await axios.post(`${baseUrl}/property`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      setMessage('Property added successfully!');
      setTimeout(() => {
        navigate('/user/home');
      }, 1500);
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || 'Failed to add property.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-base-100 to-base-200 py-8 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto space-y-6">

        {/* Header Bar */}
        <div className="bg-base-100 p-6 rounded-2xl border border-base-300 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="btn btn-circle btn-ghost btn-sm text-base-content/70 hover:bg-base-200"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-base-content flex items-center gap-2">
                <Home className="w-7 h-7 text-primary" />
                Add New Property
              </h1>
              <p className="text-base-content/70 text-xs sm:text-sm mt-0.5">
                Fill in details to list your property on the platform
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Step Pills */}
        <SectionNavigation
          activeSection={activeSection}
          setActiveSection={setActiveSection}
        />

        {/* Global Alert Banner */}
        {message && (
          <div className={`p-4 rounded-2xl flex items-center gap-3 border ${message.includes('success')
            ? 'bg-success/10 border-success/30 text-success'
            : 'bg-error/10 border-error/30 text-error'
            }`}>
            {message.includes('success') ? (
              <CheckCircle className="w-5 h-5 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
            )}
            <span className="text-sm font-medium">{message}</span>
          </div>
        )}

        {/* Form Container */}
        <form
          onSubmit={handleSubmit}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && e.target.tagName === 'INPUT') {
              e.preventDefault();
            }
          }}
          encType="multipart/form-data"
          className="bg-base-100 rounded-2xl shadow-sm border border-base-300 overflow-hidden"
        >
          {activeSection === 'basic' && (
            <BasicInfoSection
              formState={formState}
              setFormState={setFormState}
              typeOptions={typeOptions}
            />
          )}

          {activeSection === 'media' && (
            <MediaSection
              images={images}
              setImages={setImages}
            />
          )}

          {activeSection === 'details' && (
            <DetailsSection
              formState={formState}
              setFormState={setFormState}
            />
          )}

          {activeSection === 'pricing' && (
            <PricingSection
              formState={formState}
              setFormState={setFormState}
            />
          )}

          {activeSection === 'facilities' && (
            <FacilitiesSection
              formState={formState}
              setFormState={setFormState}
            />
          )}

          {activeSection === 'location' && (
            <LocationSection
              formState={formState}
              setFormState={setFormState}
              generalAreas={generalAreas}
            />
          )}

          {activeSection === 'owner' && (
            <OwnerSection
              formState={formState}
              setFormState={setFormState}
            />
          )}

          {activeSection === 'additional' && (
            <AdditionalSection
              formState={formState}
              setFormState={setFormState}
            />
          )}

          {/* Bottom Controls */}
          <div className="p-6 border-t border-base-200 bg-base-200/40 flex justify-between gap-4">
            <button
              type="button"
              onClick={() => {
                const currentIndex = sections.findIndex(s => s.id === activeSection);
                if (currentIndex > 0) {
                  setActiveSection(sections[currentIndex - 1].id);
                }
              }}
              className="btn btn-outline rounded-xl gap-2 text-xs"
              disabled={activeSection === 'basic'}
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            {activeSection !== 'additional' ? (
              <button
                key="nav-next-btn"
                type="button"
                onClick={() => {
                  const currentIndex = sections.findIndex(s => s.id === activeSection);
                  if (currentIndex < sections.length - 1) {
                    setActiveSection(sections[currentIndex + 1].id);
                  }
                }}
                className="btn btn-primary rounded-xl gap-2 text-white text-xs shadow-md"
              >
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                key="nav-submit-btn"
                type="submit"
                disabled={loading}
                className="btn btn-primary rounded-xl gap-2 text-white text-xs shadow-lg hover:shadow-xl"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Submitting Property...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Submit Property</span>
                  </>
                )}
              </button>
            )}
          </div>

        </form>
      </div>
    </div>
  );
};

export default AddNewProperty;