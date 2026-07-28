import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Loader2,
  AlertCircle,
  Sparkles
} from "lucide-react";
import Api from "../../../../service/api.js";
import Cookies from "js-cookie";

import PropertyUpdateHeader from "./components/PropertyUpdateHeader.jsx";
import PropertyImagesGallery from "./components/PropertyImagesGallery.jsx";
import PropertyBasicInfoSection from "./components/PropertyBasicInfoSection.jsx";
import PropertyDetailsSection from "./components/PropertyDetailsSection.jsx";
import PropertyPricingSection from "./components/PropertyPricingSection.jsx";
import PropertyAvailabilitySection from "./components/PropertyAvailabilitySection.jsx";
import PropertyFacilitiesSection from "./components/PropertyFacilitiesSection.jsx";
import PropertyAdditionalSection from "./components/PropertyAdditionalSection.jsx";
import PropertyLocationSection from "./components/PropertyLocationSection.jsx";
import PropertyOwnerSection from "./components/PropertyOwnerSection.jsx";

function UpdatePropertyForm({ id: propId }) {
  const [property, setProperty] = useState(null);
  const params = useParams();
  const navigate = useNavigate();
  const baseUrl = Api.defaults.baseURL;
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [typeOptions, setTypeOptions] = useState([]);
  const [images, setImages] = useState([]);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState("");
  const [errors, setErrors] = useState({});
  const [generalAreas, setGeneralAreas] = useState([]);

  const [formData, setFormData] = useState({
    type_id: "",
    property_tittle: "",
    description: "",
    number_of_bedrooms: "",
    number_of_bathrooms: "",
    maximum_guest: "",
    minimum_stay: "",
    price: "",
    monthly_price: "",
    yearly_price: "",
    location: {
      general_area: "",
      map_url: "",
      longitude: "",
      latitude: ""
    },
    availability: [{
      available_from: "",
      available_to: ""
    }],
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
      fullname: "",
      name: "",
      phone: "",
      watsapp: "",
      email: ""
    },
    additionalDetails: {
      allow_path: false,
      construction_nearby: false,
      cleaning_requency: "",
      linen_chaneg: "",
      parking: {
        car_parking: false,
        bike_parking: false,
        both_car_and_bike: false
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

  const targetId = propId || params?.id;
  const id = targetId;

  // Format date for datetime-local input
  const formatDateTimeForInput = (dateString) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "";
      const timezoneOffset = date.getTimezoneOffset() * 60000;
      const adjustedDate = new Date(date.getTime() - timezoneOffset);
      return adjustedDate.toISOString().slice(0, 16);
    } catch (error) {
      console.error("Error formatting date:", error);
      return "";
    }
  };

  // Handler for availability changes
  const handleAvailabilityChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      availability: [{
        ...prev.availability[0] || {},
        [field]: value,
        ...(field === 'available_from' && value && (!prev.availability[0]?.available_to || value > prev.availability[0]?.available_to)
          ? { available_to: value }
          : {})
      }]
    }));
  };

  // Fetch property data
  useEffect(() => {
    const fetchProperty = async () => {
      if (!targetId) {
        setLoading(false);
        setMessage("ID properti tidak ditemukan");
        return;
      }

      try {
        setLoading(true);
        const res = await Api.get(`/property/${targetId}`);
        const rawData = res.data?.data;
        const prop = Array.isArray(rawData) ? rawData[0] : rawData;

        if (!prop) {
          throw new Error("Data properti tidak ditemukan");
        }

        const getFirstOrObj = (val) => {
          if (Array.isArray(val)) return val[0] || {};
          return val || {};
        };

        const locationData = getFirstOrObj(prop.location);
        const availabilityData = getFirstOrObj(prop.availability);
        const facilitiesData = getFirstOrObj(prop.facilities);
        const ownerData = getFirstOrObj(prop.propertiesOwner);
        const additionalDetailsData = getFirstOrObj(prop.additionalDetails);
        const parking = getFirstOrObj(additionalDetailsData.Parking || additionalDetailsData.parking);
        const view = getFirstOrObj(additionalDetailsData.View || additionalDetailsData.view);

        setFormData({
          type_id: prop.type_id || "",
          property_tittle: prop.property_tittle || "",
          description: prop.description || "",
          number_of_bedrooms: prop.number_of_bedrooms ?? "",
          number_of_bathrooms: prop.number_of_bathrooms ?? "",
          maximum_guest: prop.maximum_guest ?? "",
          minimum_stay: prop.minimum_stay ?? "",
          price: prop.price ?? "",
          monthly_price: prop.monthly_price ?? "",
          yearly_price: prop.yearly_price ?? "",
          location: {
            general_area: locationData.general_area || "",
            map_url: locationData.map_url || "",
            longitude: locationData.longitude || "",
            latitude: locationData.latitude || ""
          },
          availability: [{
            available_from: formatDateTimeForInput(availabilityData.available_from),
            available_to: formatDateTimeForInput(availabilityData.available_to)
          }],
          facilities: {
            wifi: !!facilitiesData.wifi,
            washing_machine: !!facilitiesData.washing_machine,
            coffee_maker: !!facilitiesData.coffee_maker,
            celling_fan: !!facilitiesData.celling_fan,
            kettle: !!facilitiesData.kettle,
            air_conditioning: !!facilitiesData.air_conditioning,
            tv: !!facilitiesData.tv,
            game_console: !!facilitiesData.game_console,
            private_entrance: !!facilitiesData.private_entrance,
            microwave: !!facilitiesData.microwave,
            pool: !!facilitiesData.pool,
            beach_access: !!facilitiesData.beach_access,
            drying_machine: !!facilitiesData.drying_machine,
            workspace_area: !!facilitiesData.workspace_area,
            toaster: !!facilitiesData.toaster,
            kitchen: !!facilitiesData.kitchen,
            gym: !!facilitiesData.gym,
            refrigenerator: !!facilitiesData.refrigenerator,
            fridge: !!facilitiesData.fridge,
            security: !!facilitiesData.security
          },
          propertiesOwner: {
            fullname: ownerData.fullname || "",
            name: ownerData.name || "",
            phone: ownerData.phone || "",
            watsapp: ownerData.watsapp || "",
            email: ownerData.email || ""
          },
          additionalDetails: {
            allow_path: additionalDetailsData.allow_path !== undefined ? !!additionalDetailsData.allow_path : !!additionalDetailsData.allow_pets,
            construction_nearby: !!additionalDetailsData.construction_nearby,
            cleaning_requency: additionalDetailsData.cleaning_requency || "",
            linen_chaneg: additionalDetailsData.linen_chaneg || "",
            parking: {
              car_parking: !!parking.car_parking,
              bike_parking: !!parking.bike_parking,
              both_car_and_bike: !!parking.both_car_and_bike
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
              volcano_view: !!view.volcano_view
            }
          }
        });

        if (Array.isArray(prop.images) && prop.images.length > 0) {
          setImages(prop.images);
        }

        setProperty(prop);
      } catch (error) {
        console.error("Gagal memuat data properti:", error);
        setMessage("Gagal memuat data properti");
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [targetId, baseUrl]);

  // Fetch property types
  useEffect(() => {
    Api.get("/type-property")
      .then((res) => {
        if (res.data.data) setTypeOptions(res.data.data);
      })
      .catch((err) => console.error("Failed to fetch type property:", err));
  }, []);

  // Fetch general areas
  useEffect(() => {
    fetch(`${baseUrl}/general-area`)
      .then(res => res.json())
      .then(data => {
        setGeneralAreas(data.data || []);
      })
      .catch(err => console.error('Failed to fetch general areas:', err));
  }, [baseUrl]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const errs = {};
    if (!formData.type_id) errs.type_id = "Type property wajib diisi";
    if (!String(formData.property_tittle || "").trim()) errs.property_tittle = "Judul properti wajib diisi";
    const plainDesc = String(formData.description || "").replace(/<[^>]*>/g, "").trim();
    if (!plainDesc) errs.description = "Deskripsi wajib diisi";
    if (!formData.price) errs.price = "Harga wajib diisi";
    if (!String(formData.location.general_area || "").trim()) errs.general_area = "General area wajib dipilih";
    const from = formData.availability?.[0]?.available_from;
    const to = formData.availability?.[0]?.available_to;
    if (!from || !to) errs.availability = "Tanggal ketersediaan wajib diisi";
    return errs;
  };

  const formatDateToISO = (dateString) => {
    if (!dateString) return "";
    try {
      return new Date(dateString).toISOString();
    } catch (error) {
      console.error("Error formatting date to ISO:", error);
      return "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    const token = Cookies.get('token');

    if (!token) {
      setMessage('Token tidak tersedia. Harap login terlebih dahulu.');
      return;
    }

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setMessage('Periksa kembali field yang wajib diisi');
      return;
    }
    setErrors({});
    setMessage("");

    const availabilityData = {
      available_from: formatDateToISO(formData.availability[0]?.available_from),
      available_to: formatDateToISO(formData.availability[0]?.available_to)
    };

    formDataToSend.append('type_id', formData.type_id);
    formDataToSend.append('property_tittle', formData.property_tittle);
    formDataToSend.append('description', formData.description);
    formDataToSend.append('number_of_bedrooms', formData.number_of_bedrooms);
    formDataToSend.append('number_of_bathrooms', formData.number_of_bathrooms);
    formDataToSend.append('maximum_guest', formData.maximum_guest);
    formDataToSend.append('minimum_stay', formData.minimum_stay);
    formDataToSend.append('price', formData.price);
    formDataToSend.append('monthly_price', formData.monthly_price);
    formDataToSend.append('yearly_price', formData.yearly_price);

    formDataToSend.append('location', JSON.stringify(formData.location));
    formDataToSend.append('availability', JSON.stringify(availabilityData));
    formDataToSend.append('facilities', JSON.stringify(formData.facilities));
    formDataToSend.append('propertiesOwner', JSON.stringify(formData.propertiesOwner));

    const additionalDetailsPayload = {
      allow_path: formData.additionalDetails.allow_path,
      construction_nearby: formData.additionalDetails.construction_nearby,
      cleaning_requency: formData.additionalDetails.cleaning_requency,
      linen_chaneg: formData.additionalDetails.linen_chaneg,
      parking: {
        car_parking: formData.additionalDetails.parking.car_parking,
        bike_parking: formData.additionalDetails.parking.bike_parking,
        both_car_and_bike: formData.additionalDetails.parking.both_car_and_bike
      },
      view: {
        ocean_view: formData.additionalDetails.view.ocean_view,
        sunset_view: formData.additionalDetails.view.sunset_view,
        garden_view: formData.additionalDetails.view.garden_view,
        beach_view: formData.additionalDetails.view.beach_view,
        jungle_view: formData.additionalDetails.view.jungle_view,
        montain_view: formData.additionalDetails.view.montain_view,
        pool_view: formData.additionalDetails.view.pool_view,
        rice_field: formData.additionalDetails.view.rice_field,
        sunrise_view: formData.additionalDetails.view.sunrise_view,
        volcano_view: formData.additionalDetails.view.volcano_view
      }
    };

    formDataToSend.append('additionalDetails', JSON.stringify(additionalDetailsPayload));

    try {
      setSubmitting(true);
      await Api.patch(`/property/${targetId}`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });
      setSuccess('Berhasil mengupdate properti');
      setTimeout(() => {
        navigate('/admin/property-management');
      }, 1200);
    } catch (error) {
      console.error("Update error:", error.response?.data || error.message);
      setMessage(`Gagal update: ${error.response?.data?.message || error.message}`);
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-base-100 to-base-200 p-4 md:p-8 flex justify-center items-center">
        <div className="text-center space-y-3">
          <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto" />
          <p className="text-base-content/70 font-medium">Loading property data...</p>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-base-100 to-base-200 p-4 md:p-8 flex justify-center items-center">
        <div className="bg-base-100 rounded-2xl border border-error/30 p-8 text-center max-w-md shadow-xl space-y-4">
          <div className="w-14 h-14 bg-error/10 text-error rounded-full flex items-center justify-center mx-auto">
            <AlertCircle className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-error">Property Not Found</h3>
            <p className="text-base-content/70 text-sm mt-1">Failed to load property data.</p>
          </div>
          <button
            type="button"
            onClick={() => navigate('/admin/property-management')}
            className="btn btn-primary gap-2 shadow-md"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Property List
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-base-100 to-base-200 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Header Component */}
        <PropertyUpdateHeader
          propertyCode={property.property_code}
          message={message}
          success={success}
          onBack={() => navigate('/admin/property-management')}
        />

        {/* Image Gallery Component */}
        <PropertyImagesGallery
          images={images}
          propertyId={targetId}
          baseUrl={baseUrl}
        />

        {/* Main Update Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info Section Component */}
          <PropertyBasicInfoSection
            formData={formData}
            setFormData={setFormData}
            typeOptions={typeOptions}
            handleChange={handleChange}
            errors={errors}
          />

          {/* Details Section Component */}
          <PropertyDetailsSection
            formData={formData}
            setFormData={setFormData}
          />

          {/* Pricing Section Component */}
          <PropertyPricingSection
            formData={formData}
            setFormData={setFormData}
            errors={errors}
          />

          {/* Availability Section Component */}
          <PropertyAvailabilitySection
            formData={formData}
            handleAvailabilityChange={handleAvailabilityChange}
            formatDateTimeForInput={formatDateTimeForInput}
            errors={errors}
          />

          {/* Facilities Section Component */}
          <PropertyFacilitiesSection
            formData={formData}
            setFormData={setFormData}
          />

          {/* Additional Details Section Component */}
          <PropertyAdditionalSection
            formData={formData}
            setFormData={setFormData}
          />

          {/* Location Section Component */}
          <PropertyLocationSection
            formData={formData}
            setFormData={setFormData}
            generalAreas={generalAreas}
            errors={errors}
          />

          {/* Owner Section Component */}
          <PropertyOwnerSection
            formData={formData}
            setFormData={setFormData}
          />

          {/* Submit Action Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={() => navigate('/admin/property-management')}
              className="btn btn-outline flex-1 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary flex-1 shadow-lg hover:shadow-xl rounded-xl gap-2 text-white font-bold"
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving Changes...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Update Property</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UpdatePropertyForm;
