import React, { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  Building,
  DollarSign,
  Calendar,
  CheckCircle2,
  Car,
  Eye,
  MapPin,
  User,
  Shield,
  Loader2,
  AlertCircle,
  X,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Image as ImageIcon,
  FileText,
  Info,
  Check
} from "lucide-react";
import Api from "../../../../service/api.js";
import Cookies from "js-cookie";

function UpdatePropertyForm() {
  const [property, setProperty] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();
  const baseUrl = Api.defaults.baseURL;
  const [loading, setLoading] = useState(true);
  const [typeOptions, setTypeOptions] = useState([]);
  const [images, setImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState("");
  const [errors, setErrors] = useState({});
  const [generalAreas, setGeneralAreas] = useState([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);

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
      try {
        const res = await Api.get(`/property/${id}`);
        const prop = res.data.data[0];

        const locationData = prop.location?.[0] || {};
        const availabilityData = prop.availability?.[0] || {};
        const facilitiesData = prop.facilities?.[0] || {};
        const ownerData = prop.propertiesOwner?.[0] || {};
        const additionalDetailsData = Array.isArray(prop.additionalDetails)
          ? (prop.additionalDetails[0] || {})
          : (prop.additionalDetails || {});

        setFormData({
          type_id: prop.type_id || "",
          property_tittle: prop.property_tittle || "",
          description: prop.description || "",
          number_of_bedrooms: prop.number_of_bedrooms || "",
          number_of_bathrooms: prop.number_of_bathrooms || "",
          maximum_guest: prop.maximum_guest || "",
          minimum_stay: prop.minimum_stay || "",
          price: prop.price || "",
          monthly_price: prop.monthly_price || "",
          yearly_price: prop.yearly_price || "",
          location: {
            general_area: locationData.general_area || "",
            map_url: locationData.map_url || "",
            longitude: locationData.longitude || "",
            latitude: locationData.latitude || ""
          },
          availability: [{
            available_from: availabilityData.available_from || "",
            available_to: availabilityData.available_to || ""
          }],
          facilities: {
            wifi: facilitiesData.wifi || false,
            washing_machine: facilitiesData.washing_machine || false,
            coffee_maker: facilitiesData.coffee_maker || false,
            celling_fan: facilitiesData.celling_fan || false,
            kettle: facilitiesData.kettle || false,
            air_conditioning: facilitiesData.air_conditioning || false,
            tv: facilitiesData.tv || false,
            game_console: facilitiesData.game_console || false,
            private_entrance: facilitiesData.private_entrance || false,
            microwave: facilitiesData.microwave || false,
            pool: facilitiesData.pool || false,
            beach_access: facilitiesData.beach_access || false,
            drying_machine: facilitiesData.drying_machine || false,
            workspace_area: facilitiesData.workspace_area || false,
            toaster: facilitiesData.toaster || false,
            kitchen: facilitiesData.kitchen || false,
            gym: facilitiesData.gym || false,
            refrigenerator: facilitiesData.refrigenerator || false,
            fridge: facilitiesData.fridge || false,
            security: facilitiesData.security || false
          },
          propertiesOwner: {
            fullname: ownerData.fullname || "",
            name: ownerData.name || "",
            phone: ownerData.phone || "",
            watsapp: ownerData.watsapp || "",
            email: ownerData.email || ""
          },
          additionalDetails: {
            allow_path: additionalDetailsData.allow_path || false,
            construction_nearby: additionalDetailsData.construction_nearby || false,
            cleaning_requency: additionalDetailsData.cleaning_requency || "",
            linen_chaneg: additionalDetailsData.linen_chaneg || "",
            parking: {
              car_parking: (additionalDetailsData.Parking?.car_parking ?? additionalDetailsData.parking?.car_parking) || false,
              bike_parking: (additionalDetailsData.Parking?.bike_parking ?? additionalDetailsData.parking?.bike_parking) || false,
              both_car_and_bike: (additionalDetailsData.Parking?.both_car_and_bike ?? additionalDetailsData.parking?.both_car_and_bike) || false
            },
            view: {
              ocean_view: (additionalDetailsData.View?.ocean_view ?? additionalDetailsData.view?.ocean_view) || false,
              sunset_view: (additionalDetailsData.View?.sunset_view ?? additionalDetailsData.view?.sunset_view) || false,
              garden_view: (additionalDetailsData.View?.garden_view ?? additionalDetailsData.view?.garden_view) || false,
              beach_view: (additionalDetailsData.View?.beach_view ?? additionalDetailsData.view?.beach_view) || false,
              jungle_view: (additionalDetailsData.View?.jungle_view ?? additionalDetailsData.view?.jungle_view) || false,
              montain_view: (additionalDetailsData.View?.montain_view ?? additionalDetailsData.view?.montain_view) || false,
              pool_view: (additionalDetailsData.View?.pool_view ?? additionalDetailsData.view?.pool_view) || false,
              rice_field: (additionalDetailsData.View?.rice_field ?? additionalDetailsData.view?.rice_field) || false,
              sunrise_view: (additionalDetailsData.View?.sunrise_view ?? additionalDetailsData.view?.sunrise_view) || false,
              volcano_view: (additionalDetailsData.View?.volcano_view ?? additionalDetailsData.view?.volcano_view) || false
            }
          }
        });

        if (prop.images?.length > 0) {
          const formattedImages = prop.images.map(img =>
            img.imagesUrl.startsWith('http') ? img.imagesUrl : `${baseUrl}${img.imagesUrl}`
          );
          setImages(formattedImages);
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
  }, [id, baseUrl]);

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
      Parking: {
        car_parking: formData.additionalDetails.parking?.car_parking || false,
        bike_parking: formData.additionalDetails.parking?.bike_parking || false,
        both_car_and_bike: formData.additionalDetails.parking?.both_car_and_bike || false,
      },
      View: {
        ocean_view: formData.additionalDetails.view?.ocean_view || false,
        sunset_view: formData.additionalDetails.view?.sunset_view || false,
        garden_view: formData.additionalDetails.view?.garden_view || false,
        beach_view: formData.additionalDetails.view?.beach_view || false,
        jungle_view: formData.additionalDetails.view?.jungle_view || false,
        montain_view: formData.additionalDetails.view?.montain_view || false,
        pool_view: formData.additionalDetails.view?.pool_view || false,
        rice_field: formData.additionalDetails.view?.rice_field || false,
        sunrise_view: formData.additionalDetails.view?.sunrise_view || false,
        volcano_view: formData.additionalDetails.view?.volcano_view || false,
      },
    };
    formDataToSend.append('additionalDetails', JSON.stringify(additionalDetailsPayload));

    newImages.forEach(file => {
      formDataToSend.append('images', file);
    });

    try {
      setLoading(true);
      await Api.patch(`/property/${id}`, formDataToSend, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        }
      });
      setSuccess('Berhasil mengupdate properti');
      navigate('/admin/property-management');
    } catch (error) {
      console.error("Update error:", error.response?.data || error.message);
      setMessage(`Gagal update: ${error.response?.data?.message || error.message}`);
      if (error.response?.data?.errors && typeof error.response.data.errors === 'object') {
        setErrors(error.response.data.errors);
      }
    } finally {
      setLoading(false);
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

        {/* Back Button & Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-base-100 p-6 rounded-2xl border border-base-300 shadow-sm">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/admin/property-management')}
              className="btn btn-square btn-ghost rounded-xl border border-base-300 hover:bg-base-200"
              title="Back"
            >
              <ArrowLeft className="w-5 h-5 text-base-content" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-primary/10 text-primary font-mono text-xs font-bold border border-primary/20">
                  {property.property_code}
                </span>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-base-content mt-1">
                Update Property
              </h1>
            </div>
          </div>
        </div>

        {/* Messages */}
        {message && (
          <div className="p-4 bg-error/10 border border-error/30 text-error rounded-2xl flex items-center gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span className="text-sm font-medium">{message}</span>
          </div>
        )}
        {success && (
          <div className="p-4 bg-success/10 border border-success/30 text-success rounded-2xl flex items-center gap-3">
            <Check className="w-5 h-5 flex-shrink-0" />
            <span className="text-sm font-medium">{success}</span>
          </div>
        )}

        {/* Image Gallery */}
        <div className="bg-base-100 p-6 rounded-2xl border border-base-300 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-base-content flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-primary" />
              <span>Current Property Images</span>
            </h2>
            <Link
              to={`/admin/update-images-only/${id}`}
              className="btn btn-outline btn-primary btn-sm gap-2 rounded-xl"
            >
              <ImageIcon className="w-4 h-4" />
              <span>Edit Images Only</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-2">
            {property.images?.map((img, index) => (
              <div key={img.id} className="relative group overflow-hidden rounded-xl border border-base-300 shadow-sm bg-base-200">
                <img
                  src={`${baseUrl}${img.imagesUrl}`}
                  alt={img.imageName}
                  onClick={() => setSelectedImageIndex(index)}
                  className="w-full h-48 object-cover cursor-pointer group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Image Modal */}
        {selectedImageIndex !== null && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
            <div className="relative w-full max-w-4xl bg-base-100 rounded-2xl shadow-2xl overflow-hidden border border-base-300">
              <button
                onClick={() => setSelectedImageIndex(null)}
                className="absolute top-4 right-4 z-50 btn btn-circle btn-sm bg-base-100/80 hover:bg-base-100 border border-base-300 text-base-content"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="relative flex items-center justify-center p-4">
                <img
                  src={`${baseUrl}${property.images[selectedImageIndex]?.imagesUrl}`}
                  alt="Selected"
                  className="max-h-[75vh] w-auto object-contain rounded-xl"
                />
                {property.images.length > 1 && (
                  <div className="absolute left-4 right-4 top-1/2 -translate-y-1/2 flex justify-between pointer-events-none">
                    <button
                      onClick={() =>
                        setSelectedImageIndex(
                          selectedImageIndex === 0
                            ? property.images.length - 1
                            : selectedImageIndex - 1
                        )
                      }
                      className="btn btn-circle btn-sm bg-base-100/90 hover:bg-base-100 border border-base-300 pointer-events-auto shadow-md"
                    >
                      <ChevronLeft className="w-4 h-4 text-base-content" />
                    </button>
                    <button
                      onClick={() =>
                        setSelectedImageIndex(
                          selectedImageIndex === property.images.length - 1
                            ? 0
                            : selectedImageIndex + 1
                        )
                      }
                      className="btn btn-circle btn-sm bg-base-100/90 hover:bg-base-100 border border-base-300 pointer-events-auto shadow-md"
                    >
                      <ChevronRight className="w-4 h-4 text-base-content" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Property Type Picker */}
          <div className="bg-base-100 p-6 rounded-2xl border border-base-300 shadow-sm space-y-3">
            <label className="block text-sm font-bold text-base-content">
              Select Property Type <span className="text-error">*</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {typeOptions.map((type) => (
                <button
                  key={type.id}
                  type="button"
                  className={`btn btn-sm rounded-xl transition-all ${formData.type_id === type.id
                    ? "btn-primary shadow-md"
                    : "btn-outline border-base-300 text-base-content/80 hover:bg-base-200"
                    }`}
                  onClick={() => setFormData(prev => ({ ...prev, type_id: type.id }))}
                >
                  {type.type_name}
                </button>
              ))}
            </div>
            {errors.type_id && <p className="text-error text-xs font-semibold mt-1">{errors.type_id}</p>}
          </div>

          {/* Property Title */}
          <div className="bg-base-100 p-6 rounded-2xl border border-base-300 shadow-sm space-y-2">
            <label htmlFor="property_tittle" className="block text-sm font-bold text-base-content">
              Property Title <span className="text-error">*</span>
            </label>
            <input
              type="text"
              name="property_tittle"
              id="property_tittle"
              placeholder="e.g. Modern Villa in Seminyak"
              value={formData.property_tittle}
              onChange={handleChange}
              className="input input-bordered w-full rounded-xl bg-base-100 border-base-300 focus:outline-none focus:border-primary text-sm"
            />
            {errors.property_tittle && <p className="text-error text-xs font-semibold mt-1">{errors.property_tittle}</p>}
          </div>

          {/* Description */}
          <div className="bg-base-100 p-6 rounded-2xl border border-base-300 shadow-sm space-y-2">
            <label className="block text-sm font-bold text-base-content">
              Description <span className="text-error">*</span>
            </label>
            <ReactQuill
              value={formData.description || ""}
              onChange={(value) => setFormData(prev => ({ ...prev, description: value }))}
              placeholder="Tulis deskripsi properti di sini..."
              className="bg-base-100 rounded-xl border border-base-300 overflow-hidden"
              modules={{
                toolbar: [
                  [{ header: [1, 2, false] }],
                  ["bold", "italic", "underline"],
                  [{ list: "ordered" }, { list: "bullet" }]
                ],
              }}
              formats={[
                "header",
                "bold",
                "italic",
                "underline",
                "list",
                "bullet",
              ]}
            />
            {errors.description && <p className="text-error text-xs font-semibold mt-1">{errors.description}</p>}
          </div>

          {/* Property Details */}
          <div className="bg-base-100 p-6 rounded-2xl border border-base-300 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-base-content flex items-center gap-2">
              <Building className="w-5 h-5 text-primary" />
              <span>Property Details</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="number_of_bedrooms" className="block text-xs font-semibold text-base-content/70 mb-1">Number of Bedrooms</label>
                <input
                  type="number"
                  id="number_of_bedrooms"
                  placeholder="e.g. 3"
                  value={formData.number_of_bedrooms}
                  onChange={e => setFormData({ ...formData, number_of_bedrooms: e.target.value })}
                  className="input input-bordered w-full rounded-xl bg-base-100 border-base-300 focus:outline-none focus:border-primary text-sm"
                  min="0"
                />
              </div>
              <div>
                <label htmlFor="number_of_bathrooms" className="block text-xs font-semibold text-base-content/70 mb-1">Number of Bathrooms</label>
                <input
                  type="number"
                  id="number_of_bathrooms"
                  placeholder="e.g. 2"
                  value={formData.number_of_bathrooms}
                  onChange={e => setFormData({ ...formData, number_of_bathrooms: e.target.value })}
                  className="input input-bordered w-full rounded-xl bg-base-100 border-base-300 focus:outline-none focus:border-primary text-sm"
                  min="0"
                />
              </div>
              <div>
                <label htmlFor="maximum_guest" className="block text-xs font-semibold text-base-content/70 mb-1">Maximum Guests</label>
                <input
                  type="number"
                  id="maximum_guest"
                  placeholder="e.g. 6"
                  value={formData.maximum_guest}
                  onChange={e => setFormData({ ...formData, maximum_guest: e.target.value })}
                  className="input input-bordered w-full rounded-xl bg-base-100 border-base-300 focus:outline-none focus:border-primary text-sm"
                  min="0"
                />
              </div>
              <div>
                <label htmlFor="minimum_stay" className="block text-xs font-semibold text-base-content/70 mb-1">Minimum Stay (Months)</label>
                <input
                  type="number"
                  id="minimum_stay"
                  placeholder="e.g. 1"
                  value={formData.minimum_stay}
                  onChange={e => setFormData({ ...formData, minimum_stay: e.target.value })}
                  className="input input-bordered w-full rounded-xl bg-base-100 border-base-300 focus:outline-none focus:border-primary text-sm"
                  min="0"
                />
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-base-100 p-6 rounded-2xl border border-base-300 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-base-content flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-primary" />
              <span>Pricing</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="price" className="block text-xs font-semibold text-base-content/70 mb-1">Price per Day (IDR) <span className="text-error">*</span></label>
                <input
                  type="number"
                  id="price"
                  placeholder="Daily price"
                  value={formData.price}
                  onChange={e => setFormData({ ...formData, price: e.target.value })}
                  className="input input-bordered w-full rounded-xl bg-base-100 border-base-300 focus:outline-none focus:border-primary text-sm"
                  min="0"
                />
                {errors.price && <p className="text-error text-xs font-semibold mt-1">{errors.price}</p>}
              </div>
              <div>
                <label htmlFor="monthly_price" className="block text-xs font-semibold text-base-content/70 mb-1">Monthly Price (IDR)</label>
                <input
                  type="number"
                  id="monthly_price"
                  placeholder="Monthly price"
                  value={formData.monthly_price}
                  onChange={e => setFormData({ ...formData, monthly_price: e.target.value })}
                  className="input input-bordered w-full rounded-xl bg-base-100 border-base-300 focus:outline-none focus:border-primary text-sm"
                  min="0"
                />
              </div>
              <div>
                <label htmlFor="yearly_price" className="block text-xs font-semibold text-base-content/70 mb-1">Yearly Price (IDR)</label>
                <input
                  type="number"
                  id="yearly_price"
                  placeholder="Yearly price"
                  value={formData.yearly_price}
                  onChange={e => setFormData({ ...formData, yearly_price: e.target.value })}
                  className="input input-bordered w-full rounded-xl bg-base-100 border-base-300 focus:outline-none focus:border-primary text-sm"
                  min="0"
                />
              </div>
            </div>
          </div>

          {/* Availability */}
          <div className="bg-base-100 p-6 rounded-2xl border border-base-300 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-base-content flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              <span>Availability Period</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="available_from" className="block text-xs font-semibold text-base-content/70 mb-1">Available From</label>
                <input
                  id="available_from"
                  type="datetime-local"
                  value={formatDateTimeForInput(formData.availability[0]?.available_from)}
                  onChange={(e) => handleAvailabilityChange('available_from', e.target.value)}
                  className="input input-bordered w-full rounded-xl bg-base-100 border-base-300 focus:outline-none focus:border-primary text-sm"
                />
              </div>
              <div>
                <label htmlFor="available_to" className="block text-xs font-semibold text-base-content/70 mb-1">Available To</label>
                <input
                  id="available_to"
                  type="datetime-local"
                  value={formatDateTimeForInput(formData.availability[0]?.available_to)}
                  onChange={(e) => handleAvailabilityChange('available_to', e.target.value)}
                  className="input input-bordered w-full rounded-xl bg-base-100 border-base-300 focus:outline-none focus:border-primary text-sm"
                />
              </div>
            </div>
            {errors.availability && <p className="text-error text-xs font-semibold mt-1">{errors.availability}</p>}
          </div>

          {/* Facilities Group */}
          <div className="bg-base-100 p-6 rounded-2xl border border-base-300 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-base-content flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-primary" />
              <span>Facilities & Amenities</span>
            </h3>
            <div className="flex flex-wrap gap-2">
              {Object.keys(formData.facilities).map((key) => (
                <button
                  key={key}
                  type="button"
                  className={`btn btn-xs sm:btn-sm rounded-xl transition-all ${formData.facilities[key]
                    ? 'btn-primary shadow-sm'
                    : 'btn-outline border-base-300 text-base-content/70 hover:bg-base-200'
                    }`}
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      facilities: {
                        ...prev.facilities,
                        [key]: !prev.facilities[key],
                      },
                    }))
                  }
                >
                  {key.replace(/_/g, ' ')}
                </button>
              ))}
            </div>
          </div>

          {/* Additional Details Group */}
          <div className="bg-base-100 p-6 rounded-2xl border border-base-300 shadow-sm space-y-6">
            <h3 className="text-base font-bold text-base-content flex items-center gap-2">
              <Info className="w-5 h-5 text-primary" />
              <span>Additional Details</span>
            </h3>

            {/* General Checkboxes */}
            <div className="flex flex-wrap gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  id="allow_path"
                  checked={formData.additionalDetails.allow_path}
                  onChange={e => setFormData({ ...formData, additionalDetails: { ...formData.additionalDetails, allow_path: e.target.checked } })}
                  className="checkbox checkbox-primary rounded-lg"
                />
                <span className="text-sm font-medium text-base-content">Allow Pets</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  id="construction_nearby"
                  checked={formData.additionalDetails.construction_nearby}
                  onChange={e => setFormData({ ...formData, additionalDetails: { ...formData.additionalDetails, construction_nearby: e.target.checked } })}
                  className="checkbox checkbox-primary rounded-lg"
                />
                <span className="text-sm font-medium text-base-content">Construction Nearby</span>
              </label>
            </div>

            {/* Cleaning Inputs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-base-content/70 mb-1">Cleaning Frequency</label>
                <input
                  type="text"
                  placeholder="e.g. 2x a week"
                  value={formData.additionalDetails.cleaning_requency}
                  onChange={e => setFormData({ ...formData, additionalDetails: { ...formData.additionalDetails, cleaning_requency: e.target.value } })}
                  className="input input-bordered w-full rounded-xl bg-base-100 border-base-300 focus:outline-none focus:border-primary text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-base-content/70 mb-1">Linen Change Frequency</label>
                <input
                  type="text"
                  placeholder="e.g. 1x a week"
                  value={formData.additionalDetails.linen_chaneg}
                  onChange={e => setFormData({ ...formData, additionalDetails: { ...formData.additionalDetails, linen_chaneg: e.target.value } })}
                  className="input input-bordered w-full rounded-xl bg-base-100 border-base-300 focus:outline-none focus:border-primary text-sm"
                />
              </div>
            </div>

            {/* Parking Options */}
            <div className="space-y-2 pt-2">
              <span className="text-xs font-bold uppercase tracking-wider text-base-content/70">Parking</span>
              <div className="flex flex-wrap gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    id="car_parking"
                    checked={formData.additionalDetails.parking.car_parking}
                    onChange={e => setFormData({ ...formData, additionalDetails: { ...formData.additionalDetails, parking: { ...formData.additionalDetails.parking, car_parking: e.target.checked } } })}
                    className="checkbox checkbox-primary rounded-lg"
                  />
                  <span className="text-sm text-base-content">Car Parking</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    id="bike_parking"
                    checked={formData.additionalDetails.parking.bike_parking}
                    onChange={e => setFormData({ ...formData, additionalDetails: { ...formData.additionalDetails, parking: { ...formData.additionalDetails.parking, bike_parking: e.target.checked } } })}
                    className="checkbox checkbox-primary rounded-lg"
                  />
                  <span className="text-sm text-base-content">Motorcycle Parking</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    id="both_car_and_bike"
                    checked={formData.additionalDetails.parking.both_car_and_bike}
                    onChange={e => setFormData({ ...formData, additionalDetails: { ...formData.additionalDetails, parking: { ...formData.additionalDetails.parking, both_car_and_bike: e.target.checked } } })}
                    className="checkbox checkbox-primary rounded-lg"
                  />
                  <span className="text-sm text-base-content">Car & Motorcycle</span>
                </label>
              </div>
            </div>

            {/* View Options */}
            <div className="space-y-2 pt-2">
              <span className="text-xs font-bold uppercase tracking-wider text-base-content/70">Views</span>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {Object.keys(formData.additionalDetails.view).map((viewKey) => (
                  <label key={viewKey} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      id={viewKey}
                      checked={formData.additionalDetails.view[viewKey]}
                      onChange={e => setFormData({
                        ...formData,
                        additionalDetails: {
                          ...formData.additionalDetails,
                          view: {
                            ...formData.additionalDetails.view,
                            [viewKey]: e.target.checked
                          }
                        }
                      })}
                      className="checkbox checkbox-primary rounded-lg"
                    />
                    <span className="text-xs font-medium text-base-content capitalize">
                      {viewKey.replace(/_/g, ' ')}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Location Group */}
          <div className="bg-base-100 p-6 rounded-2xl border border-base-300 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-base-content flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              <span>General Area <span className="text-error">*</span></span>
            </h3>
            <select
              value={formData.location.general_area}
              onChange={(e) =>
                setFormData(prev => ({
                  ...prev,
                  location: {
                    ...prev.location,
                    general_area: e.target.value,
                  },
                }))
              }
              className="select select-bordered w-full rounded-xl bg-base-100 border-base-300 focus:outline-none focus:border-primary text-sm"
            >
              <option value="">Select General Area</option>
              {generalAreas.map((area, idx) => (
                <option key={idx} value={area.area}>
                  {area.area}
                </option>
              ))}
            </select>
            {errors.general_area && <p className="text-error text-xs font-semibold mt-1">{errors.general_area}</p>}
          </div>

          {/* Property Owner */}
          <div className="bg-base-100 p-6 rounded-2xl border border-base-300 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-base-content flex items-center gap-2">
              <User className="w-5 h-5 text-primary" />
              <span>Property Owner Information</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-base-content/70 mb-1">Fullname</label>
                <input
                  type="text"
                  placeholder="Full name"
                  value={formData.propertiesOwner.fullname}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      propertiesOwner: {
                        ...prev.propertiesOwner,
                        fullname: e.target.value,
                      },
                    }))
                  }
                  className="input input-bordered w-full rounded-xl bg-base-100 border-base-300 focus:outline-none focus:border-primary text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-base-content/70 mb-1">Display Name</label>
                <input
                  type="text"
                  placeholder="Display name"
                  value={formData.propertiesOwner.name}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      propertiesOwner: {
                        ...prev.propertiesOwner,
                        name: e.target.value,
                      },
                    }))
                  }
                  className="input input-bordered w-full rounded-xl bg-base-100 border-base-300 focus:outline-none focus:border-primary text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-base-content/70 mb-1">Phone Number</label>
                <input
                  type="number"
                  placeholder="Phone number"
                  value={formData.propertiesOwner.phone}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      propertiesOwner: {
                        ...prev.propertiesOwner,
                        phone: e.target.value,
                      },
                    }))
                  }
                  className="input input-bordered w-full rounded-xl bg-base-100 border-base-300 focus:outline-none focus:border-primary text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-base-content/70 mb-1">WhatsApp Number</label>
                <input
                  type="number"
                  placeholder="WhatsApp number"
                  value={formData.propertiesOwner.watsapp}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      propertiesOwner: {
                        ...prev.propertiesOwner,
                        watsapp: e.target.value,
                      },
                    }))
                  }
                  className="input input-bordered w-full rounded-xl bg-base-100 border-base-300 focus:outline-none focus:border-primary text-sm"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-base-content/70 mb-1">Email Address</label>
                <input
                  type="email"
                  placeholder="Email address"
                  value={formData.propertiesOwner.email}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      propertiesOwner: {
                        ...prev.propertiesOwner,
                        email: e.target.value,
                      },
                    }))
                  }
                  className="input input-bordered w-full rounded-xl bg-base-100 border-base-300 focus:outline-none focus:border-primary text-sm"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => navigate('/admin/property-management')}
              className="btn btn-outline flex-1 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary flex-1 shadow-lg hover:shadow-xl rounded-xl gap-2 text-white"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving...</span>
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
