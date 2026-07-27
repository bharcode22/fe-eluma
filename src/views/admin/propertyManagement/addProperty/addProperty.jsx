import React, { useState, useEffect } from 'react';
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useNavigate } from 'react-router-dom';
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
  Plus,
  Image as ImageIcon,
  FileText,
  Info,
  Sparkles,
  UploadCloud
} from 'lucide-react';
import axios from 'axios';
import Cookies from 'js-cookie';
import api from '../../../../service/api';

const AddProperty = () => {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]);
  const baseUrl = api.defaults.baseURL;
  const [generalAreas, setGeneralAreas] = useState([]);
  const [typeOptions, setTypeOptions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${baseUrl}/general-area`)
      .then(res => res.json())
      .then(data => {
        setGeneralAreas(data.data || []);
      })
      .catch(err => console.error('Failed to fetch general areas:', err));
  }, [baseUrl]);

  useEffect(() => {
    fetch(`${baseUrl}/type-property/`)
      .then(res => res.json())
      .then(data => {
        if (data.data) setTypeOptions(data.data);
      })
      .catch(err => console.error('Failed to fetch type property:', err));
  }, [baseUrl]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = Cookies.get('token');

    if (!token) {
      setMessage('Token tidak tersedia. Harap login terlebih dahulu.');
      return;
    }

    if (!formState.type_id) {
      setMessage('Harap pilih Tipe Properti terlebih dahulu.');
      return;
    }

    if (!formState.property_tittle) {
      setMessage('Judul Properti wajib diisi.');
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
      phone: propertiesOwner.phone ? parseInt(propertiesOwner.phone) : null,
      watsapp: propertiesOwner.watsapp ? parseInt(propertiesOwner.watsapp) : null,
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
      setMessage('Properti berhasil ditambahkan!');
      navigate('/admin/property-management');
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || 'Gagal menambahkan properti.');
    } finally {
      setLoading(false);
    }
  };

  const handleImagesChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(prev => [...prev, ...files]);
  };

  const handleRemoveImage = (idx) => {
    setImages(prev => prev.filter((_, i) => i !== idx));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    setImages(prev => [...prev, ...files]);
  };

  const handleReorderImages = (result) => {
    if (!result.destination) return;
    const reordered = Array.from(images);
    const [removed] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, removed);
    setImages(reordered);
  };

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
              <h1 className="text-2xl md:text-3xl font-bold text-base-content">
                Create New Property
              </h1>
              <p className="text-base-content/70 text-sm mt-0.5">
                Fill in property details, upload photos, and configure listing availability
              </p>
            </div>
          </div>
        </div>

        {/* Message Alert */}
        {message && (
          <div className="p-4 bg-error/10 border border-error/30 text-error rounded-2xl flex items-center gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span className="text-sm font-medium">{message}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-6">

          {/* Property Type Selection */}
          <div className="bg-base-100 p-6 rounded-2xl border border-base-300 shadow-sm space-y-3">
            <label className="block text-sm font-bold text-base-content">
              Select Property Type <span className="text-error">*</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {typeOptions.map(type => (
                <button
                  key={type.id}
                  type="button"
                  className={`btn btn-sm rounded-xl transition-all ${formState.type_id === type.id
                    ? 'btn-primary shadow-md'
                    : 'btn-outline border-base-300 text-base-content/80 hover:bg-base-200'
                    }`}
                  onClick={() => setFormState({ ...formState, type_id: type.id })}
                >
                  {type.type_name}
                </button>
              ))}
            </div>
          </div>

          {/* Property Title */}
          <div className="bg-base-100 p-6 rounded-2xl border border-base-300 shadow-sm space-y-2">
            <label htmlFor="property_tittle" className="block text-sm font-bold text-base-content">
              Property Title <span className="text-error">*</span>
            </label>
            <input
              type="text"
              id="property_tittle"
              placeholder="e.g. Luxury Beachfront Villa in Canggu"
              value={formState.property_tittle}
              onChange={(e) =>
                setFormState({ ...formState, property_tittle: e.target.value })
              }
              className="input input-bordered w-full rounded-xl bg-base-100 border-base-300 focus:outline-none focus:border-primary text-sm"
              required
            />
          </div>

          {/* Upload Image Section */}
          <div className="bg-base-100 p-6 rounded-2xl border border-base-300 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-bold text-base-content">
                Upload Property Images <span className="text-error">*</span>
              </label>
              <span className="text-xs text-base-content/60">Upload at least one image</span>
            </div>

            <div
              className="flex flex-col items-center justify-center w-full p-8 rounded-2xl border-2 border-dashed border-base-300 bg-base-200/50 hover:bg-base-200/80 transition-colors cursor-pointer text-center"
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
            >
              <UploadCloud className="w-10 h-10 text-primary mb-3" />
              <label htmlFor="images" className="cursor-pointer">
                <span className="text-sm font-bold text-primary hover:underline">Click to upload</span>
                <span className="text-sm text-base-content/70"> or drag & drop files here</span>
                <input
                  id="images"
                  name="images"
                  type="file"
                  multiple
                  accept="image/*"
                  className="sr-only"
                  onChange={handleImagesChange}
                />
              </label>
              <p className="mt-2 text-xs text-base-content/60">
                Supports PNG, JPG, WEBP (Max 10MB per file)
              </p>
            </div>

            {/* Images Preview List */}
            {images && images.length > 0 && (
              <DragDropContext onDragEnd={handleReorderImages}>
                <Droppable droppableId="images-droppable" direction="horizontal">
                  {(provided) => (
                    <div
                      className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 pt-2"
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                    >
                      {images.map((img, idx) => (
                        <Draggable key={idx} draggableId={`img-${idx}`} index={idx}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`relative aspect-square select-none rounded-xl overflow-hidden bg-base-200 border ${idx === 0 ? 'border-primary ring-2 ring-primary/30' : 'border-base-300'
                                } cursor-move shadow-sm`}
                              style={{
                                ...provided.draggableProps.style,
                                opacity: snapshot.isDragging ? 0.9 : 1,
                                zIndex: snapshot.isDragging ? 50 : 1,
                              }}
                            >
                              {idx === 0 && (
                                <div className="absolute top-2 left-2 z-20 bg-primary text-white text-[10px] px-2 py-0.5 rounded-full font-bold shadow-md">
                                  Main Image
                                </div>
                              )}

                              <img
                                alt={`Uploaded ${idx + 1}`}
                                src={
                                  typeof img === 'string'
                                    ? img
                                    : URL.createObjectURL(img)
                                }
                                className="w-full h-full object-cover"
                                draggable={false}
                              />

                              <button
                                type="button"
                                onClick={() => handleRemoveImage(idx)}
                                className="absolute top-2 right-2 bg-error text-white rounded-full p-1 hover:bg-error/80 transition-colors z-20 shadow-md"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            )}
          </div>

          {/* Description Section */}
          <div className="bg-base-100 p-6 rounded-2xl border border-base-300 shadow-sm space-y-2">
            <label className="block text-sm font-bold text-base-content">
              Property Description
            </label>
            <ReactQuill
              value={formState.description || ""}
              onChange={(value) => setFormState((prev) => ({ ...prev, description: value }))}
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
          </div>

          {/* Detail Property Specs */}
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
                  value={formState.number_of_bedrooms}
                  onChange={e => setFormState({ ...formState, number_of_bedrooms: e.target.value })}
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
                  value={formState.number_of_bathrooms}
                  onChange={e => setFormState({ ...formState, number_of_bathrooms: e.target.value })}
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
                  value={formState.maximum_guest}
                  onChange={e => setFormState({ ...formState, maximum_guest: e.target.value })}
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
                  value={formState.minimum_stay}
                  onChange={e => setFormState({ ...formState, minimum_stay: e.target.value })}
                  className="input input-bordered w-full rounded-xl bg-base-100 border-base-300 focus:outline-none focus:border-primary text-sm"
                  min="0"
                />
              </div>
            </div>
          </div>

          {/* Pricing Section */}
          <div className="bg-base-100 p-6 rounded-2xl border border-base-300 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-base-content flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-primary" />
              <span>Pricing</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="price" className="block text-xs font-semibold text-base-content/70 mb-1">Price per Day (IDR)</label>
                <input
                  type="number"
                  id="price"
                  placeholder="Daily price"
                  value={formState.price}
                  onChange={e => setFormState({ ...formState, price: e.target.value })}
                  className="input input-bordered w-full rounded-xl bg-base-100 border-base-300 focus:outline-none focus:border-primary text-sm"
                  min="0"
                />
              </div>
              <div>
                <label htmlFor="monthly_price" className="block text-xs font-semibold text-base-content/70 mb-1">Monthly Price (IDR)</label>
                <input
                  type="number"
                  id="monthly_price"
                  placeholder="Monthly price"
                  value={formState.monthly_price}
                  onChange={e => setFormState({ ...formState, monthly_price: e.target.value })}
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
                  value={formState.yearly_price}
                  onChange={e => setFormState({ ...formState, yearly_price: e.target.value })}
                  className="input input-bordered w-full rounded-xl bg-base-100 border-base-300 focus:outline-none focus:border-primary text-sm"
                  min="0"
                />
              </div>
            </div>
          </div>

          {/* Availability Group */}
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
                  value={formState.availability.available_from}
                  onChange={e => setFormState({ ...formState, availability: { ...formState.availability, available_from: e.target.value } })}
                  className="input input-bordered w-full rounded-xl bg-base-100 border-base-300 focus:outline-none focus:border-primary text-sm"
                />
              </div>
              <div>
                <label htmlFor="available_to" className="block text-xs font-semibold text-base-content/70 mb-1">Available To</label>
                <input
                  id="available_to"
                  type="datetime-local"
                  value={formState.availability.available_to}
                  onChange={e => setFormState({ ...formState, availability: { ...formState.availability, available_to: e.target.value } })}
                  className="input input-bordered w-full rounded-xl bg-base-100 border-base-300 focus:outline-none focus:border-primary text-sm"
                />
              </div>
            </div>
          </div>

          {/* Facilities Group */}
          <div className="bg-base-100 p-6 rounded-2xl border border-base-300 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-base-content flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-primary" />
              <span>Facilities & Amenities</span>
            </h3>
            <div className="flex flex-wrap gap-2">
              {Object.keys(formState.facilities).map((key) => (
                <button
                  key={key}
                  type="button"
                  className={`btn btn-xs sm:btn-sm rounded-xl transition-all ${formState.facilities[key]
                    ? 'btn-primary shadow-sm'
                    : 'btn-outline border-base-300 text-base-content/70 hover:bg-base-200'
                    }`}
                  onClick={() =>
                    setFormState({
                      ...formState,
                      facilities: {
                        ...formState.facilities,
                        [key]: !formState.facilities[key],
                      },
                    })
                  }
                >
                  {key.replace(/_/g, ' ')}
                </button>
              ))}
            </div>
          </div>

          {/* Location Group */}
          <div className="bg-base-100 p-6 rounded-2xl border border-base-300 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-base-content flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              <span>General Area</span>
            </h3>
            <select
              value={formState.location.general_area}
              onChange={e => setFormState({ ...formState, location: { ...formState.location, general_area: e.target.value } })}
              className="select select-bordered w-full rounded-xl bg-base-100 border-base-300 focus:outline-none focus:border-primary text-sm"
            >
              <option value="">Select General Area</option>
              {generalAreas.map((area, idx) => (
                <option key={idx} value={area.area}>{area.area}</option>
              ))}
            </select>
          </div>

          {/* Owner Group */}
          <div className="bg-base-100 p-6 rounded-2xl border border-base-300 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-base-content flex items-center gap-2">
              <User className="w-5 h-5 text-primary" />
              <span>Property Owner Information</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-base-content/70 mb-1">Full Name</label>
                <input
                  type="text"
                  placeholder="Full name"
                  value={formState.propertiesOwner.fullname}
                  onChange={e => setFormState({ ...formState, propertiesOwner: { ...formState.propertiesOwner, fullname: e.target.value } })}
                  className="input input-bordered w-full rounded-xl bg-base-100 border-base-300 focus:outline-none focus:border-primary text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-base-content/70 mb-1">Display Name</label>
                <input
                  type="text"
                  placeholder="Display name"
                  value={formState.propertiesOwner.name}
                  onChange={e => setFormState({ ...formState, propertiesOwner: { ...formState.propertiesOwner, name: e.target.value } })}
                  className="input input-bordered w-full rounded-xl bg-base-100 border-base-300 focus:outline-none focus:border-primary text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-base-content/70 mb-1">Phone Number</label>
                <input
                  type="number"
                  placeholder="Phone number"
                  value={formState.propertiesOwner.phone}
                  onChange={e => setFormState({ ...formState, propertiesOwner: { ...formState.propertiesOwner, phone: e.target.value } })}
                  className="input input-bordered w-full rounded-xl bg-base-100 border-base-300 focus:outline-none focus:border-primary text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-base-content/70 mb-1">WhatsApp Number</label>
                <input
                  type="number"
                  placeholder="WhatsApp number"
                  value={formState.propertiesOwner.watsapp}
                  onChange={e => setFormState({ ...formState, propertiesOwner: { ...formState.propertiesOwner, watsapp: e.target.value } })}
                  className="input input-bordered w-full rounded-xl bg-base-100 border-base-300 focus:outline-none focus:border-primary text-sm"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-base-content/70 mb-1">Email Address</label>
                <input
                  type="email"
                  placeholder="Email address"
                  value={formState.propertiesOwner.email}
                  onChange={e => setFormState({ ...formState, propertiesOwner: { ...formState.propertiesOwner, email: e.target.value } })}
                  className="input input-bordered w-full rounded-xl bg-base-100 border-base-300 focus:outline-none focus:border-primary text-sm"
                />
              </div>
            </div>
          </div>

          {/* Additional Details Group */}
          <div className="bg-base-100 p-6 rounded-2xl border border-base-300 shadow-sm space-y-6">
            <h3 className="text-base font-bold text-base-content flex items-center gap-2">
              <Info className="w-5 h-5 text-primary" />
              <span>Additional Details</span>
            </h3>

            <div className="flex flex-wrap gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  id="allow_pets"
                  checked={formState.additionalDetails.allow_pets}
                  onChange={e => setFormState({ ...formState, additionalDetails: { ...formState.additionalDetails, allow_pets: e.target.checked } })}
                  className="checkbox checkbox-primary rounded-lg"
                />
                <span className="text-sm font-medium text-base-content">Allow Pets</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  id="construction_nearby"
                  checked={formState.additionalDetails.construction_nearby}
                  onChange={e => setFormState({ ...formState, additionalDetails: { ...formState.additionalDetails, construction_nearby: e.target.checked } })}
                  className="checkbox checkbox-primary rounded-lg"
                />
                <span className="text-sm font-medium text-base-content">Construction Nearby</span>
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-base-content/70 mb-1">Cleaning Frequency</label>
                <input
                  type="text"
                  placeholder="e.g. 2x a week"
                  value={formState.additionalDetails.cleaning_requency}
                  onChange={e => setFormState({ ...formState, additionalDetails: { ...formState.additionalDetails, cleaning_requency: e.target.value } })}
                  className="input input-bordered w-full rounded-xl bg-base-100 border-base-300 focus:outline-none focus:border-primary text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-base-content/70 mb-1">Linen Change Frequency</label>
                <input
                  type="text"
                  placeholder="e.g. 1x a week"
                  value={formState.additionalDetails.linen_chaneg}
                  onChange={e => setFormState({ ...formState, additionalDetails: { ...formState.additionalDetails, linen_chaneg: e.target.value } })}
                  className="input input-bordered w-full rounded-xl bg-base-100 border-base-300 focus:outline-none focus:border-primary text-sm"
                />
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <span className="text-xs font-bold uppercase tracking-wider text-base-content/70">Parking</span>
              <div className="flex flex-wrap gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    id="car_parking"
                    checked={formState.additionalDetails.parking.car_parking}
                    onChange={e => setFormState({ ...formState, additionalDetails: { ...formState.additionalDetails, parking: { ...formState.additionalDetails.parking, car_parking: e.target.checked } } })}
                    className="checkbox checkbox-primary rounded-lg"
                  />
                  <span className="text-sm text-base-content">Car Parking</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    id="bike_parking"
                    checked={formState.additionalDetails.parking.bike_parking}
                    onChange={e => setFormState({ ...formState, additionalDetails: { ...formState.additionalDetails, parking: { ...formState.additionalDetails.parking, bike_parking: e.target.checked } } })}
                    className="checkbox checkbox-primary rounded-lg"
                  />
                  <span className="text-sm text-base-content">Motorcycle Parking</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    id="both_car_and_bike"
                    checked={formState.additionalDetails.parking.both_car_and_bike}
                    onChange={e => setFormState({ ...formState, additionalDetails: { ...formState.additionalDetails, parking: { ...formState.additionalDetails.parking, both_car_and_bike: e.target.checked } } })}
                    className="checkbox checkbox-primary rounded-lg"
                  />
                  <span className="text-sm text-base-content">Car & Motorcycle</span>
                </label>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <span className="text-xs font-bold uppercase tracking-wider text-base-content/70">Views</span>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {Object.keys(formState.additionalDetails.view).map((viewKey) => (
                  <label key={viewKey} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      id={viewKey}
                      checked={formState.additionalDetails.view[viewKey]}
                      onChange={e => setFormState({
                        ...formState,
                        additionalDetails: {
                          ...formState.additionalDetails,
                          view: {
                            ...formState.additionalDetails.view,
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

          {/* Action Buttons */}
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
              disabled={loading}
              className="btn btn-primary flex-1 shadow-lg hover:shadow-xl rounded-xl gap-2 text-white"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Uploading...</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>Upload Property</span>
                </>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default AddProperty;