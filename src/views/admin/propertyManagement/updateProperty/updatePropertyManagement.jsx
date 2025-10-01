import React, { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useParams, useNavigate, Link } from "react-router-dom";
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
      
      // Adjust for timezone offset
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
        // If setting from date, ensure to date is not before it
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
        const property = res.data.data[0];

        const locationData = property.location?.[0] || {};
        const availabilityData = property.availability?.[0] || {};
        const facilitiesData = property.facilities?.[0] || {};
        const ownerData = property.propertiesOwner?.[0] || {};
        const additionalDetailsData = property.additionalDetails?.[0] || {};

        setFormData({
          type_id: property.type_id || "",
          property_tittle: property.property_tittle || "",
          description: property.description || "",
          number_of_bedrooms: property.number_of_bedrooms || "",
          number_of_bathrooms: property.number_of_bathrooms || "",
          maximum_guest: property.maximum_guest || "",
          minimum_stay: property.minimum_stay || "",
          price: property.price || "",
          monthly_price: property.monthly_price || "",
          yearly_price: property.yearly_price || "",
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
              car_parking: additionalDetailsData.parking?.car_parking || false,
              bike_parking: additionalDetailsData.parking?.bike_parking || false,
              both_car_and_bike: additionalDetailsData.parking?.both_car_and_bike || false
            },
            view: {
              ocean_view: additionalDetailsData.view?.ocean_view || false,
              sunset_view: additionalDetailsData.view?.sunset_view || false,
              garden_view: additionalDetailsData.view?.garden_view || false,
              beach_view: additionalDetailsData.view?.beach_view || false,
              jungle_view: additionalDetailsData.view?.jungle_view || false,
              montain_view: additionalDetailsData.view?.montain_view || false,
              pool_view: additionalDetailsData.view?.pool_view || false,
              rice_field: additionalDetailsData.view?.rice_field || false,
              sunrise_view: additionalDetailsData.view?.sunrise_view || false,
              volcano_view: additionalDetailsData.view?.volcano_view || false,
            }
          }
        });

        if (property.images?.length > 0) {
          const formattedImages = property.images.map(img => 
            img.imagesUrl.startsWith('http') ? img.imagesUrl : `${baseUrl}${img.imagesUrl}`
          );
          setImages(formattedImages);
        }

        setProperty(property);
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

  // Prepare data with properly formatted dates
  const availabilityData = {
    available_from: formatDateToISO(formData.availability[0]?.available_from),
    available_to: formatDateToISO(formData.availability[0]?.available_to)
  };

  // Append all fields
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
  
  // Stringify nested objects with proper date formatting
  formDataToSend.append('location', JSON.stringify(formData.location));
  formDataToSend.append('availability', JSON.stringify(availabilityData));
  formDataToSend.append('facilities', JSON.stringify(formData.facilities));
  formDataToSend.append('propertiesOwner', JSON.stringify(formData.propertiesOwner));
  formDataToSend.append('additionalDetails', JSON.stringify(formData.additionalDetails));

  // Append images
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

    navigate('/admin/property-management');
  } catch (error) {
    console.error("Update error:", error.response?.data || error.message);
    setMessage(`Gagal update: ${error.response?.data?.message || error.message}`);
  } finally {
    setLoading(false);
  }
};

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="mt-4 text-primary">Loading</p>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <p className="text-red-500">Failed to load property data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">Update Property</h1>
      {message && <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">{message}</div>}

      {/* Image Gallery */}
      <div className="bg-secondary/50 backdrop-blur-lg px-5 py-5 rounded-lg mb-5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {property.images?.map((img, index) => (
            <img
              key={img.id}
              src={`${baseUrl}${img.imagesUrl}`}
              alt={img.imageName}
              onClick={() => setSelectedImageIndex(index)}
              className="w-full h-64 object-cover rounded-md cursor-pointer hover:scale-105 transition-transform duration-200 shadow-2xl"
            />
          ))}
        </div>

        <div className="mx-80 flex justify-center mt-5">
          <Link to={`/user/update/image/property/${id}`}>
            <div className="flex justify-end px-5 py-5 btn btn-primary text-white shadow-2xl">
              <p>Edit Image</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Image Modal */}
      {selectedImageIndex !== null && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-70 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="relative w-full max-w-4xl mx-auto">
            <button
              onClick={() => setSelectedImageIndex(null)}
              className="absolute top-2 right-2 z-50 bg-white text-black rounded-full p-2 hover:bg-gray-300"
            >
              ✕
            </button>
            <div className="carousel w-full rounded-lg overflow-hidden">
              {property.images?.map((img, index) => (
                <div
                  key={img.id}
                  className={`carousel-item relative w-full transition-opacity duration-300 ${
                    index === selectedImageIndex ? 'opacity-100' : 'hidden opacity-0'
                  }`}
                >
                  <img
                    src={`${baseUrl}${img.imagesUrl}`}
                    alt={img.imageName}
                    className="w-full max-h-[80vh] object-contain"
                  />
                  <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
                    <button
                      onClick={() =>
                        setSelectedImageIndex(
                          selectedImageIndex === 0
                            ? property.images.length - 1
                            : selectedImageIndex - 1
                        )
                      }
                      className="btn btn-circle"
                    >
                      ❮
                    </button>
                    <button
                      onClick={() =>
                        setSelectedImageIndex(
                          selectedImageIndex === property.images.length - 1
                            ? 0
                            : selectedImageIndex + 1
                        )
                      }
                      className="btn btn-circle"
                    >
                      ❯
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Property Type */}
        <div className="flex mb-5 flex-wrap gap-2 justify-center p-5 bg-secondary/50 backdrop-blur-lg rounded-lg">
          {typeOptions.map((type) => (
            <button 
              key={type.id} 
              type="button" 
              className={`btn shadow-2xl ${
                formData.type_id === type.id ? "btn-primary" : "btn-secondary"
              }`}
              onClick={() => setFormData(prev => ({ ...prev, type_id: type.id }))}
            >
              {type.type_name}
            </button>
          ))}
        </div>

        {/* Property Title */}
        <div className="mb-4 bg-secondary/50 backdrop-blur-lg p-5 rounded-lg">
          <input 
            type="text" 
            name="property_tittle" 
            id="property_tittle"
            placeholder="Judul Properti" 
            value={formData.property_tittle} 
            onChange={handleChange} 
            className="input input-primary w-full rounded-lg bg-secondary/50 backdrop-blur-lg shadow-lg"
          />
        </div>

        {/* Description */}
        <div className="bg-secondary/50 backdrop-blur-lg p-5 rounded-lg mb-5">
          <label className="block text-lg font-semibold mb-2 text-white">
            Description
          </label>
          <ReactQuill
            value={formData.description || ""}
            onChange={(value) => setFormData(prev => ({ ...prev, description: value }))}
            placeholder="Tulis deskripsi properti di sini..."
            className="custom-quill bg-white rounded"
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
        </div>

        {/* Property Details */}
        <div className='bg-secondary/50 backdrop-blur-lg p-5 rounded-lg mb-5'>
          <p className="text-lg font-semibold mb-4 text-white">Detail Property</p>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div>
              <label htmlFor="number_of_bedrooms" className="block text-sm font-medium text-white mb-1">Number of Bedrooms</label>
              <input
                type="number"
                id="number_of_bedrooms"
                placeholder="Number of Bedrooms"
                value={formData.number_of_bedrooms}
                onChange={e => setFormData({ ...formData, number_of_bedrooms: e.target.value })}
                className="input input-primary w-full rounded-lg bg-secondary/50 backdrop-blur-lg shadow-lg"
                min="0"
              />
            </div>
            <div>
              <label htmlFor="number_of_bathrooms" className="block text-sm font-medium text-white mb-1">Number of Bathrooms</label>
              <input
                type="number"
                id="number_of_bathrooms"
                placeholder="Number of Bathrooms"
                value={formData.number_of_bathrooms}
                onChange={e => setFormData({ ...formData, number_of_bathrooms: e.target.value })}
                className="input input-primary w-full rounded-lg bg-secondary/50 backdrop-blur-lg shadow-lg"
                min="0"
              />
            </div>
            <div>
              <label htmlFor="maximum_guest" className="block text-sm font-medium text-white mb-1">Maximum Guest</label>
              <input
                type="number"
                id="maximum_guest"
                placeholder="Maximum Guest"
                value={formData.maximum_guest}
                onChange={e => setFormData({ ...formData, maximum_guest: e.target.value })}
                className="input input-primary w-full rounded-lg bg-secondary/50 backdrop-blur-lg shadow-lg"
                min="0"
              />
            </div>
            <div>
              <label htmlFor="minimum_stay" className="block text-sm font-medium text-white mb-1">Minimum Stay</label>
              <input
                type="number"
                id="minimum_stay"
                placeholder="Minimal Menginap"
                value={formData.minimum_stay}
                onChange={e => setFormData({ ...formData, minimum_stay: e.target.value })}
                className="input input-primary w-full rounded-lg bg-secondary/50 backdrop-blur-lg shadow-lg"
                min="0"
              />
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div className='bg-secondary/50 backdrop-blur-lg mb-5 px-4 py-4 rounded-lg'>
          <p className="text-lg font-semibold mb-4 text-white">Pricing</p>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-white mb-1">Price per Day</label>
              <input
                type="number"
                id="price"
                placeholder="Price per Day"
                value={formData.price}
                onChange={e => setFormData({ ...formData, price: e.target.value })}
                className="input input-primary w-full rounded-lg bg-secondary/50 backdrop-blur-lg shadow-lg"
                min="0"
              />
            </div>
            <div>
              <label htmlFor="monthly_price" className="block text-sm font-medium text-white mb-1">Monthly Price</label>
              <input
                type="number"
                id="monthly_price"
                placeholder="Harga Bulanan"
                value={formData.monthly_price}
                onChange={e => setFormData({ ...formData, monthly_price: e.target.value })}
                className="input input-primary w-full rounded-lg bg-secondary/50 backdrop-blur-lg shadow-lg"
                min="0"
              />
            </div>
            <div>
              <label htmlFor="yearly_price" className="block text-sm font-medium text-white mb-1">Yearly Price</label>
              <input
                type="number"
                id="yearly_price"
                placeholder="Harga Tahunan"
                value={formData.yearly_price}
                onChange={e => setFormData({ ...formData, yearly_price: e.target.value })}
                className="input input-primary w-full rounded-lg bg-secondary/50 backdrop-blur-lg shadow-lg"
                min="0"
              />
            </div>
          </div>
        </div>

        {/* Availability */}
        <div className="p-4 shadow-sm bg-secondary/50 backdrop-blur-lg rounded-lg mb-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col items-start">
              <label htmlFor="available_from" className="text-lg mb-2 font-semibold">available from</label>
              <input
                id="available_from"
                type="datetime-local"
                value={formatDateTimeForInput(formData.availability[0]?.available_from)}
                onChange={(e) => handleAvailabilityChange('available_from', e.target.value)}
                className="input input-primary w-full rounded-lg bg-secondary/50 backdrop-blur-lg shadow-lg"
              />
            </div>
            <div className="flex flex-col items-start">
              <label htmlFor="available_to" className="text-lg mb-2 font-semibold">available to</label>
              <input
                id="available_to"
                type="datetime-local"
                value={formatDateTimeForInput(formData.availability[0]?.available_to)}
                onChange={(e) => handleAvailabilityChange('available_to', e.target.value)}
                className="input input-primary w-full rounded-lg bg-secondary/50 backdrop-blur-lg shadow-lg"
              />
            </div>
          </div>
        </div>

        {/* Facilities Group */}
        <div className="p-4 shadow-sm bg-secondary/50 backdrop-blur-lg rounded-lg mb-5">
          <div className="mb-2 text-lg">Facilities</div>
          <div className="flex flex-wrap gap-3 justify-center">
            {Object.keys(formData.facilities).map((key) => (
              <button
                key={key}
                type="button"
                className={`btn ${formData.facilities[key] ? 'btn-primary shadow-lg' : 'btn-secondary shadow-lg'}`}
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
        <div className="p-4 shadow-sm bg-secondary/50 backdrop-blur-lg rounded-lg mb-5">
          <div className="font-bold mb-2 text-lg">Additional Detail</div>
          <div className="flex items-center mb-1">
            <input type="checkbox" id="allow_path" checked={formData.additionalDetails.allow_path}
              onChange={e => setFormData({ ...formData, additionalDetails: { ...formData.additionalDetails, allow_path: e.target.checked } })}
              className="checkbox checkbox-secondary" />
            <label htmlFor="allow_path" className="ml-2 text-lg">Allow Pet</label>
          </div>
          <div className="flex items-center mb-1">
            <input type="checkbox" id="construction_nearby" checked={formData.additionalDetails.construction_nearby}
              onChange={e => setFormData({ ...formData, additionalDetails: { ...formData.additionalDetails, construction_nearby: e.target.checked } })}
              className="checkbox checkbox-secondary" />
            <label htmlFor="construction_nearby" className="ml-2 text-lg">Construction Nearby</label>
          </div>
          <input type="text" placeholder="Cleaning Frequency" value={formData.additionalDetails.cleaning_requency}
            onChange={e => setFormData({ ...formData, additionalDetails: { ...formData.additionalDetails, cleaning_requency: e.target.value } })}
            className="input input-primary w-full rounded-lg bg-secondary/50 backdrop-blur-lg shadow-lg my-3"
          />
          <input type="text" placeholder="Penggantian Linen" value={formData.additionalDetails.linen_chaneg}
            onChange={e => setFormData({ ...formData, additionalDetails: { ...formData.additionalDetails, linen_chaneg: e.target.value } })}
            className="input input-primary w-full rounded-lg bg-secondary/50 backdrop-blur-lg shadow-lg mb-3"
          />
          <div className="text-lg font-bold mb-1">Parking</div>
          <div className="flex items-center mb-1">
            <input type="checkbox" id="car_parking" checked={formData.additionalDetails.parking.car_parking}
              onChange={e => setFormData({ ...formData, additionalDetails: { ...formData.additionalDetails, parking: { ...formData.additionalDetails.parking, car_parking: e.target.checked } } })}
              className="checkbox checkbox-secondary" />
            <label htmlFor="car_parking" className="ml-2 text-lg">Parkir Mobil</label>
          </div>
          <div className="flex items-center mb-1">
            <input type="checkbox" id="bike_parking" checked={formData.additionalDetails.parking.bike_parking}
              onChange={e => setFormData({ ...formData, additionalDetails: { ...formData.additionalDetails, parking: { ...formData.additionalDetails.parking, bike_parking: e.target.checked } } })}
              className="checkbox checkbox-secondary" />
            <label htmlFor="bike_parking" className="ml-2 text-lg">Parkir Motor</label>
          </div>
          <div className="flex items-center mb-1">
            <input type="checkbox" id="both_car_and_bike" checked={formData.additionalDetails.parking.both_car_and_bike}
              onChange={e => setFormData({ ...formData, additionalDetails: { ...formData.additionalDetails, parking: { ...formData.additionalDetails.parking, both_car_and_bike: e.target.checked } } })}
              className="checkbox checkbox-secondary" />
            <label htmlFor="both_car_and_bike" className="ml-2 text-lg">Parkir Mobil dan Motor</label>
          </div>
          <div className="text-lg font-bold mb-1">View</div>
          <div className="flex items-center mb-1">
            <input type="checkbox" id="ocean_view" checked={formData.additionalDetails.view.ocean_view}
              onChange={e => setFormData({ ...formData, additionalDetails: { ...formData.additionalDetails, view: { ...formData.additionalDetails.view, ocean_view: e.target.checked } } })}
              className="checkbox checkbox-secondary" />
            <label htmlFor="ocean_view" className="ml-2 text-lg">Ocean View</label>
          </div>
          <div className="flex items-center mb-1">
            <input type="checkbox" id="sunset_view" checked={formData.additionalDetails.view.sunset_view}
              onChange={e => setFormData({ ...formData, additionalDetails: { ...formData.additionalDetails, view: { ...formData.additionalDetails.view, sunset_view: e.target.checked } } })}
              className="checkbox checkbox-secondary" />
            <label htmlFor="sunset_view" className="ml-2 text-lg">Sunset View</label>
          </div>
          <div className="flex items-center mb-1">
            <input type="checkbox" id="garden_view" checked={formData.additionalDetails.view.garden_view}
              onChange={e => setFormData({ ...formData, additionalDetails: { ...formData.additionalDetails, view: { ...formData.additionalDetails.view, garden_view: e.target.checked } } })}
              className="checkbox checkbox-secondary" />
            <label htmlFor="garden_view" className="ml-2 text-lg">Garden View</label>
          </div>
          <div className="flex items-center mb-1">
            <input type="checkbox" id="beach_view" checked={formData.additionalDetails.view.beach_view}
              onChange={e => setFormData({ ...formData, additionalDetails: { ...formData.additionalDetails, view: { ...formData.additionalDetails.view, beach_view: e.target.checked } } })}
              className="checkbox checkbox-secondary" />
            <label htmlFor="beach_view" className="ml-2 text-lg">Beach View</label>
          </div>
          <div className="flex items-center mb-1">
            <input type="checkbox" id="jungle_view" checked={formData.additionalDetails.view.jungle_view}
              onChange={e => setFormData({ ...formData, additionalDetails: { ...formData.additionalDetails, view: { ...formData.additionalDetails.view, jungle_view: e.target.checked } } })}
              className="checkbox checkbox-secondary" />
            <label htmlFor="jungle_view" className="ml-2 text-lg">Jungle View</label>
          </div>
          <div className="flex items-center mb-1">
            <input type="checkbox" id="montain_view" checked={formData.additionalDetails.view.montain_view}
              onChange={e => setFormData({ ...formData, additionalDetails: { ...formData.additionalDetails, view: { ...formData.additionalDetails.view, montain_view: e.target.checked } } })}
              className="checkbox checkbox-secondary" />
            <label htmlFor="montain_view" className="ml-2 text-lg">Mountain View</label>
          </div>
          <div className="flex items-center mb-1">
            <input type="checkbox" id="pool_view" checked={formData.additionalDetails.view.pool_view}
              onChange={e => setFormData({ ...formData, additionalDetails: { ...formData.additionalDetails, view: { ...formData.additionalDetails.view, pool_view: e.target.checked } } })}
              className="checkbox checkbox-secondary" />
            <label htmlFor="pool_view" className="ml-2 text-lg">Pool View</label>
          </div>
          <div className="flex items-center mb-1">
            <input type="checkbox" id="rice_field" checked={formData.additionalDetails.view.rice_field}
              onChange={e => setFormData({ ...formData, additionalDetails: { ...formData.additionalDetails, view: { ...formData.additionalDetails.view, rice_field: e.target.checked } } })}
              className="checkbox checkbox-secondary" />
            <label htmlFor="rice_field" className="ml-2 text-lg">Rice Field View</label>
          </div>
          <div className="flex items-center mb-1">
            <input type="checkbox" id="sunrise_view" checked={formData.additionalDetails.view.sunrise_view}
              onChange={e => setFormData({ ...formData, additionalDetails: { ...formData.additionalDetails, view: { ...formData.additionalDetails.view, sunrise_view: e.target.checked } } })}
              className="checkbox checkbox-secondary" />
            <label htmlFor="sunrise_view" className="ml-2 text-lg">Sunrise View</label>
          </div>
          <div className="flex items-center mb-1">
            <input type="checkbox" id="volcano_view" checked={formData.additionalDetails.view.volcano_view}
              onChange={e => setFormData({ ...formData, additionalDetails: { ...formData.additionalDetails, view: { ...formData.additionalDetails.view, volcano_view: e.target.checked } } })}
              className="checkbox checkbox-secondary" />
            <label htmlFor="volcano_view" className="ml-2 text-lg">Volcano View</label>
          </div>
        </div>

        {/* Location Group */}
        <div className="p-4 shadow-sm bg-secondary/50 backdrop-blur-lg rounded-lg mb-5">
          <div className="font-bold mb-1 text-lg">Location</div>
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
            className="input input-primary w-full rounded-lg bg-secondary/50 backdrop-blur-lg shadow-lg mb-3"
          >
            <option value="">Pilih General Area</option>
            {generalAreas.map((area, idx) => (
              <option key={idx} value={area.area}>
                {area.area}
              </option>
            ))}
          </select>

          {/* <input
            type="text"
            placeholder="Map URL"
            value={formData.location.map_url}
            onChange={(e) =>
              setFormData(prev => ({
                ...prev,
                location: {
                  ...prev.location,
                  map_url: e.target.value,
                },
              }))
            }
            className="input input-bordered w-full mb-1"
          />

          <input
            type="text"
            placeholder="Longitude"
            value={formData.location.longitude}
            onChange={(e) =>
              setFormData(prev => ({
                ...prev,
                location: {
                  ...prev.location,
                  longitude: e.target.value,
                },
              }))
            }
            className="input input-bordered w-full mb-1"
          />

          <input
            type="text"
            placeholder="Latitude"
            value={formData.location.latitude}
            onChange={(e) =>
              setFormData(prev => ({
                ...prev,
                location: {
                  ...prev.location,
                  latitude: e.target.value,
                },
              }))
            }
            className="input input-bordered w-full mb-1"
          /> */}
        </div>

        {/* Property Owner */}
        <div className="p-4 shadow-sm bg-secondary/50 backdrop-blur-lg rounded-lg mb-3">
          <div className="font-bold mb-1 text-lg">Data Pemilik Properti</div>
          <input
            type="text"
            placeholder="Nama Lengkap"
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
            className="input input-primary w-full rounded-lg bg-secondary/50 backdrop-blur-lg shadow-lg mb-3"
          />
          <input
            type="text"
            placeholder="Nama"
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
            className="input input-primary w-full rounded-lg bg-secondary/50 backdrop-blur-lg shadow-lg mb-3"
          />
          <input
            type="number"
            placeholder="No. Telepon"
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
            className="input input-primary w-full rounded-lg bg-secondary/50 backdrop-blur-lg shadow-lg mb-3"
          />
          <input
            type="number"
            placeholder="No. WhatsApp"
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
            className="input input-primary w-full rounded-lg bg-secondary/50 backdrop-blur-lg shadow-lg mb-3"
          />
          <input
            type="email"
            placeholder="Email"
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
            className="input input-primary w-full rounded-lg bg-secondary/50 backdrop-blur-lg shadow-lg mb-3"
          />
        </div>

        {/* Submit Button */}
        <button 
          type="submit" 
          className="btn btn-primary w-full rounded-lg shadow-lg"
          disabled={loading}
        >
          {loading ? 'Processing...' : 'Update'}
        </button>
      </form>
    </div>
  );
}

export default UpdatePropertyForm;