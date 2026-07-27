import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import {
  Image as ImageIcon,
  Edit2,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Loader2,
  ChevronRight,
  Save
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

const UpdateProperty = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [existingImages, setExistingImages] = useState([]);
  const [images, setImages] = useState([]);
  const [isFetching, setIsFetching] = useState(true);
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

  const formatDateTimeForInput = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      if (Number.isNaN(date.getTime())) return '';
      const timezoneOffset = date.getTimezoneOffset() * 60000;
      const adjustedDate = new Date(date.getTime() - timezoneOffset);
      return adjustedDate.toISOString().slice(0, 16);
    } catch {
      return '';
    }
  };

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

  useEffect(() => {
    const fetchProperty = async () => {
      if (!id) {
        setMessage('Property ID not found.');
        setIsFetching(false);
        return;
      }

      try {
        const response = await axios.get(`${baseUrl}/property/${id}`);
        const rawData = response.data?.data;
        const propertyData = Array.isArray(rawData) ? rawData[0] : rawData;

        if (propertyData) {
          const getFirstOrObj = (val) => (Array.isArray(val) ? val[0] : val) || {};

          const avail = getFirstOrObj(propertyData.availability);
          const loc = getFirstOrObj(propertyData.location);
          const owner = getFirstOrObj(propertyData.propertiesOwner);
          const fac = getFirstOrObj(propertyData.facilities);
          const add = getFirstOrObj(propertyData.additionalDetails);
          const parking = getFirstOrObj(add.Parking || add.parking);
          const view = getFirstOrObj(add.View || add.view);

          setFormState({
            type_id: propertyData.type_id || '',
            property_tittle: propertyData.property_tittle || '',
            description: propertyData.description || '',
            number_of_bedrooms: propertyData.number_of_bedrooms ?? '',
            number_of_bathrooms: propertyData.number_of_bathrooms ?? '',
            maximum_guest: propertyData.maximum_guest ?? '',
            minimum_stay: propertyData.minimum_stay ?? '',
            price: propertyData.price ?? '',
            monthly_price: propertyData.monthly_price ?? '',
            yearly_price: propertyData.yearly_price ?? '',
            location: {
              general_area: loc.general_area || '',
              map_url: loc.map_url || '',
              longitude: loc.longitude || '',
              latitude: loc.latitude || ''
            },
            availability: {
              available_from: formatDateTimeForInput(avail.available_from),
              available_to: formatDateTimeForInput(avail.available_to)
            },
            facilities: {
              wifi: !!fac.wifi,
              washing_machine: !!fac.washing_machine,
              coffee_maker: !!fac.coffee_maker,
              celling_fan: !!fac.celling_fan,
              kettle: !!fac.kettle,
              air_conditioning: !!fac.air_conditioning,
              tv: !!fac.tv,
              game_console: !!fac.game_console,
              private_entrance: !!fac.private_entrance,
              microwave: !!fac.microwave,
              pool: !!fac.pool,
              beach_access: !!fac.beach_access,
              drying_machine: !!fac.drying_machine,
              workspace_area: !!fac.workspace_area,
              toaster: !!fac.toaster,
              kitchen: !!fac.kitchen,
              gym: !!fac.gym,
              refrigenerator: !!fac.refrigenerator,
              fridge: !!fac.fridge,
              security: !!fac.security
            },
            propertiesOwner: {
              fullname: owner.fullname || '',
              name: owner.name || '',
              phone: owner.phone || '',
              watsapp: owner.watsapp || '',
              email: owner.email || ''
            },
            additionalDetails: {
              allow_pets: !!(add.allow_pets ?? add.allow_path),
              construction_nearby: !!add.construction_nearby,
              cleaning_requency: add.cleaning_requency || '',
              linen_chaneg: add.linen_chaneg || '',
              parking: {
                car_parking: !!parking.car_parking,
                bike_parking: !!parking.bike_parking,
                both_car_and_bike: !!parking.both_car_and_bike,
              },
              view: {
                ocean_view: !!view.ocean_view,
                sunset_view: !!view.sunset_view,
                garden_view: !!view.garden_view,
                beach_view: !!view.beach_view,
                jungle_view: !!view.jungle_view,
                montain_view: !!view.montain_view,
                pool_view: !!view.pool_view,
                rice_field: !!view.rice_field,
                sunrise_view: !!view.sunrise_view,
                volcano_view: !!view.volcano_view,
              }
            }
          });

          if (propertyData.images && Array.isArray(propertyData.images)) {
            setExistingImages(propertyData.images);
          }
        }
      } catch (err) {
        console.error(err);
        setMessage('Failed to load property details.');
      } finally {
        setIsFetching(false);
      }
    };

    fetchProperty();
  }, [id, baseUrl]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = Cookies.get('token');

    if (!token) {
      setMessage('Authentication required. Please login first.');
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
      await axios.patch(`${baseUrl}/property/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      setMessage('Property updated successfully!');
      setTimeout(() => {
        navigate('/user/home');
      }, 1500);
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || 'Failed to update property.');
    } finally {
      setLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-base-100 to-base-200 p-8 flex items-center justify-center">
        <div className="text-center space-y-3">
          <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto" />
          <p className="text-sm font-medium text-base-content/70">Loading property details...</p>
        </div>
      </div>
    );
  }

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
                <Edit2 className="w-7 h-7 text-primary" />
                Update Property
              </h1>
              <p className="text-base-content/70 text-xs sm:text-sm mt-0.5">
                Update property listing details and photos
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => navigate(`/user/update/image/property/${id}`)}
            className="btn btn-outline btn-sm rounded-xl gap-2 text-xs self-start sm:self-auto"
          >
            <ImageIcon className="w-4 h-4 text-primary" />
            <span>Manage Images Only</span>
          </button>
        </div>

        {/* Navigation Step Pills */}
        <SectionNavigation
          activeSection={activeSection}
          setActiveSection={setActiveSection}
        />

        {/* Global Alert Banner */}
        {message && (
          <div className={`p-4 rounded-2xl flex items-center gap-3 border ${
            message.includes('success')
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
              id={id}
              baseUrl={baseUrl}
              existingImages={existingImages}
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
                    <span>Updating Property...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Save Changes</span>
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

export default UpdateProperty;