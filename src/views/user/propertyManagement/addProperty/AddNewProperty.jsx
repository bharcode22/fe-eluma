import React, { useState, useEffect } from 'react';
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import {
  Upload,
  Image,
  X,
  GripVertical,
  Home,
  Bed,
  Bath,
  Users,
  Calendar,
  DollarSign,
  MapPin,
  Wifi,
  Car,
  Coffee,
  Fan,
  Tv,
  Gamepad2,
  DoorOpen,
  Microwave,
  Waves,
  Umbrella,
  Monitor,
  ChefHat,
  Dumbbell,
  Refrigerator,
  Shield,
  PawPrint,
  Construction,
  Sparkles,
  Building,
  Mountain,
  Sunrise,
  Sunset,
  Trees,
  Eye,
  Save,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Loader2,
  Plus,
  Filter,
  ChevronRight,
  ClipboardList,
  Package,
  Phone,
  Mail,
  MessageCircle,
  User,
  Clock,
  Camera,
  Grid3x3,
  LayoutGrid,
  Star,
  CloudUpload,
  Trash2,
  Edit2,
  CheckSquare,
  Square,
  Navigation
} from 'lucide-react';
import api from '../../../../service/api';

const AddProperty = () => {
  const [message, setMessage] = useState('');
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const baseUrl = api.defaults.baseURL;
  const [generalAreas, setGeneralAreas] = useState([]);
  const [typeOptions, setTypeOptions] = useState([]);
  const [activeSection, setActiveSection] = useState('basic');

  useEffect(() => {
    fetch(`${baseUrl}/general-area`)
      .then(res => res.json())
      .then(data => {
        setGeneralAreas(data.data || []);
      })
      .catch(err => console.error('Failed to fetch general areas:', err));
  }, []);

  useEffect(() => {
    fetch(`${baseUrl}/type-property/`)
      .then(res => res.json())
      .then(data => {
        if (data.data) setTypeOptions(data.data);
      })
      .catch(err => console.error('Failed to fetch type property:', err));
  }, []);

  const navigate = useNavigate();
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

  const facilityIcons = {
    wifi: Wifi,
    washing_machine: Package,
    coffee_maker: Coffee,
    celling_fan: Fan,
    kettle: Coffee,
    air_conditioning: Fan,
    tv: Tv,
    game_console: Gamepad2,
    private_entrance: DoorOpen,
    microwave: Microwave,
    pool: Waves,
    beach_access: Umbrella,
    drying_machine: ChefHat,
    workspace_area: Monitor,
    toaster: ChefHat,
    kitchen: ChefHat,
    gym: Dumbbell,
    refrigenerator: Refrigerator,
    fridge: Refrigerator,
    security: Shield
  };

  const viewIcons = {
    ocean_view: Waves,
    sunset_view: Sunset,
    garden_view: Trees,
    beach_view: Umbrella,
    jungle_view: Trees,
    montain_view: Mountain,
    pool_view: Waves,
    rice_field: Trees,
    sunrise_view: Sunrise,
    volcano_view: Mountain
  };

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
      const res = await axios.post(`${baseUrl}/property`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      setMessage('Property added successfully!');
      setTimeout(() => {
        navigate('/user/home');
      }, 2000);
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || 'Failed to add property.');
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

  const sections = [
    { id: 'basic', label: 'Basic Info', icon: Home },
    { id: 'media', label: 'Media', icon: Image },
    { id: 'details', label: 'Details', icon: ClipboardList },
    { id: 'pricing', label: 'Pricing', icon: DollarSign },
    { id: 'facilities', label: 'Facilities', icon: Grid3x3 },
    { id: 'location', label: 'Location', icon: MapPin },
    { id: 'owner', label: 'Owner', icon: User },
    { id: 'additional', label: 'Additional', icon: Plus }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-base-100 to-base-200 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-base-content/70 hover:text-base-content transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-gradient-to-br from-primary to-primary/70 rounded-lg">
              <Home className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-base-content">Add New Property</h1>
              <p className="text-base-content/70">Fill in the details to list your property</p>
            </div>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2 mb-6">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${activeSection === section.id
                    ? 'bg-primary text-primary-content shadow-md'
                    : 'bg-base-200 hover:bg-base-300 text-base-content/70 hover:text-base-content'
                  }`}
              >
                <section.icon className="w-4 h-4" />
                <span className="text-sm font-medium">{section.label}</span>
              </button>
            ))}
          </div>
        </div>

        {message && (
          <div className={`mb-6 p-4 rounded-xl ${message.includes('success') ? 'bg-success/10 border border-success/20' : 'bg-error/10 border border-error/20'}`}>
            <div className="flex items-center gap-3">
              {message.includes('success') ? (
                <CheckCircle className="w-5 h-5 text-success" />
              ) : (
                <AlertCircle className="w-5 h-5 text-error" />
              )}
              <span className={message.includes('success') ? 'text-success' : 'text-error'}>{message}</span>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} encType="multipart/form-data" className="bg-base-100 rounded-2xl shadow-xl border border-base-300 overflow-hidden">
          {/* Basic Info Section */}
          {activeSection === 'basic' && (
            <div className="p-6 space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <Home className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-bold text-base-content">Basic Information</h2>
              </div>

              {/* Property Type */}
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-sm font-medium text-base-content">
                  <Building className="w-4 h-4" />
                  Property Type
                </label>
                <div className="flex flex-wrap gap-2">
                  {typeOptions.map(type => (
                    <button
                      key={type.id}
                      type="button"
                      className={`flex items-center gap-2 px-4 py-3 rounded-lg transition-all ${formState.type_id === type.id
                          ? 'bg-primary text-primary-content shadow-md'
                          : 'bg-base-200 hover:bg-base-300 text-base-content'
                        }`}
                      onClick={() => setFormState({ ...formState, type_id: type.id })}
                    >
                      {type.type_name}
                      {formState.type_id === type.id && <CheckCircle className="w-4 h-4" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Property Title */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-base-content">
                  <Edit2 className="w-4 h-4" />
                  Property Title
                </label>
                <input
                  type="text"
                  placeholder="Enter property name"
                  value={formState.property_tittle}
                  onChange={(e) =>
                    setFormState({ ...formState, property_tittle: e.target.value })
                  }
                  className="input input-bordered w-full focus:border-primary focus:ring-2 focus:ring-primary/20"
                  required
                />
              </div>

              {/* Property Description */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-base-content">
                  <ClipboardList className="w-4 h-4" />
                  Description
                </label>
                <ReactQuill
                  value={formState.description || ""}
                  onChange={(value) => setFormState((prev) => ({ ...prev, description: value }))}
                  placeholder="Describe your property..."
                  className="custom-quill bg-base-100 rounded-lg border border-base-300"
                  modules={{
                    toolbar: [
                      [{ header: [1, 2, false] }],
                      ["bold", "italic", "underline"],
                      [{ list: "ordered" }, { list: "bullet" }],
                      ["link"],
                      ["clean"]
                    ],
                  }}
                />
              </div>
            </div>
          )}

          {/* Media Section */}
          {activeSection === 'media' && (
            <div className="p-6 space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <Image className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-bold text-base-content">Property Images</h2>
              </div>

              {/* Upload Area */}
              <div
                className="flex flex-col items-center justify-center w-full p-8 rounded-xl border-2 border-dashed border-base-300 bg-base-200/50 hover:border-primary/50 transition-colors cursor-pointer"
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                onClick={() => document.getElementById('images').click()}
              >
                <div className="p-4 bg-primary/10 rounded-full mb-4">
                  <CloudUpload className="w-12 h-12 text-primary" />
                </div>
                <div className="text-center">
                  <p className="text-lg font-medium text-base-content mb-2">
                    Drop images here or click to upload
                  </p>
                  <p className="text-sm text-base-content/60">
                    Upload at least one image. PNG, JPG, GIF up to 10MB each
                  </p>
                </div>
                <input
                  id="images"
                  name="images"
                  type="file"
                  multiple
                  accept="image/*"
                  className="sr-only"
                  onChange={handleImagesChange}
                />
              </div>

              {/* Image Gallery */}
              {images.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Camera className="w-4 h-4 text-base-content/60" />
                      <span className="text-sm font-medium text-base-content">
                        {images.length} image{images.length > 1 ? 's' : ''} uploaded
                      </span>
                    </div>
                    <span className="text-xs text-base-content/50">Drag to reorder</span>
                  </div>

                  <DragDropContext onDragEnd={handleReorderImages}>
                    <Droppable droppableId="images-droppable" direction="horizontal">
                      {(provided) => (
                        <div
                          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4"
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                        >
                          {images.map((img, idx) => (
                            <Draggable key={idx} draggableId={`img-${idx}`} index={idx}>
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  className={`relative aspect-square rounded-lg overflow-hidden border-2 ${idx === 0 ? 'border-primary ring-2 ring-primary/20' : 'border-base-300'
                                    } ${snapshot.isDragging ? 'shadow-lg scale-105' : ''} transition-all`}
                                >
                                  <div
                                    {...provided.dragHandleProps}
                                    className="absolute top-2 left-2 z-20 p-1.5 bg-black/40 backdrop-blur-sm rounded cursor-move"
                                  >
                                    <GripVertical className="w-4 h-4 text-white" />
                                  </div>

                                  {idx === 0 && (
                                    <div className="absolute top-2 right-2 z-20 px-2 py-1 bg-primary text-primary-content text-xs font-medium rounded-full">
                                      <Star className="w-3 h-3 inline mr-1" />
                                      Main
                                    </div>
                                  )}

                                  <img
                                    alt={`Uploaded image ${idx + 1}`}
                                    src={typeof img === 'string' ? img : URL.createObjectURL(img)}
                                    className="w-full h-full object-cover"
                                  />

                                  <button
                                    type="button"
                                    onClick={() => handleRemoveImage(idx)}
                                    className="absolute bottom-2 right-2 z-20 p-1.5 bg-error text-error-content rounded-full hover:bg-error/90 transition-colors"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>

                                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 hover:opacity-100 transition-opacity">
                                    <div className="absolute bottom-2 left-2 text-white text-xs">
                                      Image {idx + 1}
                                    </div>
                                  </div>
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </DragDropContext>
                </div>
              )}
            </div>
          )}

          {/* Details Section */}
          {activeSection === 'details' && (
            <div className="p-6 space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <ClipboardList className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-bold text-base-content">Property Details</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-base-content">
                    <Bed className="w-4 h-4" />
                    Bedrooms
                  </label>
                  <input
                    type="number"
                    placeholder="Number of bedrooms"
                    value={formState.number_of_bedrooms}
                    onChange={e => setFormState({ ...formState, number_of_bedrooms: e.target.value })}
                    className="input input-bordered w-full focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-base-content">
                    <Bath className="w-4 h-4" />
                    Bathrooms
                  </label>
                  <input
                    type="number"
                    placeholder="Number of bathrooms"
                    value={formState.number_of_bathrooms}
                    onChange={e => setFormState({ ...formState, number_of_bathrooms: e.target.value })}
                    className="input input-bordered w-full focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-base-content">
                    <Users className="w-4 h-4" />
                    Maximum Guests
                  </label>
                  <input
                    type="number"
                    placeholder="Maximum guests"
                    value={formState.maximum_guest}
                    onChange={e => setFormState({ ...formState, maximum_guest: e.target.value })}
                    className="input input-bordered w-full focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-base-content">
                    <Clock className="w-4 h-4" />
                    Minimum Stay (months)
                  </label>
                  <input
                    type="number"
                    placeholder="Minimum stay in months"
                    value={formState.minimum_stay}
                    onChange={e => setFormState({ ...formState, minimum_stay: e.target.value })}
                    className="input input-bordered w-full focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>

              {/* Availability */}
              <div className="space-y-4 pt-4 border-t border-base-300">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-primary" />
                  <h3 className="font-medium text-base-content">Availability</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm text-base-content/70">Available From</label>
                    <input
                      type="datetime-local"
                      value={formState.availability.available_from}
                      onChange={e => setFormState({
                        ...formState,
                        availability: { ...formState.availability, available_from: e.target.value }
                      })}
                      className="input input-bordered w-full focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-base-content/70">Available To</label>
                    <input
                      type="datetime-local"
                      value={formState.availability.available_to}
                      onChange={e => setFormState({
                        ...formState,
                        availability: { ...formState.availability, available_to: e.target.value }
                      })}
                      className="input input-bordered w-full focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Pricing Section */}
          {activeSection === 'pricing' && (
            <div className="p-6 space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <DollarSign className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-bold text-base-content">Pricing Information</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-base-content">
                    <DollarSign className="w-4 h-4" />
                    Base Price
                  </label>
                  <input
                    type="number"
                    placeholder="Base price"
                    value={formState.price}
                    onChange={e => setFormState({ ...formState, price: e.target.value })}
                    className="input input-bordered w-full focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-base-content">
                    <Calendar className="w-4 h-4" />
                    Monthly Price
                  </label>
                  <input
                    type="number"
                    placeholder="Monthly price"
                    value={formState.monthly_price}
                    onChange={e => setFormState({ ...formState, monthly_price: e.target.value })}
                    className="input input-bordered w-full focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-base-content">
                    <Calendar className="w-4 h-4" />
                    Yearly Price
                  </label>
                  <input
                    type="number"
                    placeholder="Yearly price"
                    value={formState.yearly_price}
                    onChange={e => setFormState({ ...formState, yearly_price: e.target.value })}
                    className="input input-bordered w-full focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Facilities Section */}
          {activeSection === 'facilities' && (
            <div className="p-6 space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <Grid3x3 className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-bold text-base-content">Facilities & Amenities</h2>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {Object.entries(facilityIcons).map(([key, Icon]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() =>
                      setFormState({
                        ...formState,
                        facilities: {
                          ...formState.facilities,
                          [key]: !formState.facilities[key],
                        },
                      })
                    }
                    className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${formState.facilities[key]
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-base-300 hover:border-base-400 text-base-content/70 hover:text-base-content'
                      }`}
                  >
                    <Icon className="w-6 h-6 mb-2" />
                    <span className="text-xs font-medium text-center capitalize">
                      {key.replace(/_/g, ' ')}
                    </span>
                    <div className="mt-2">
                      {formState.facilities[key] ? (
                        <CheckSquare className="w-4 h-4 text-primary" />
                      ) : (
                        <Square className="w-4 h-4 text-base-300" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Location Section */}
          {activeSection === 'location' && (
            <div className="p-6 space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <MapPin className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-bold text-base-content">Location Information</h2>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-base-content">
                    <Navigation className="w-4 h-4" />
                    General Area
                  </label>
                  <select
                    value={formState.location.general_area}
                    onChange={e => setFormState({
                      ...formState,
                      location: { ...formState.location, general_area: e.target.value }
                    })}
                    className="select select-bordered w-full focus:border-primary focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="">Select area</option>
                    {generalAreas.map((area, idx) => (
                      <option key={idx} value={area.area}>{area.area}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm text-base-content/70">Longitude</label>
                    <input
                      type="text"
                      placeholder="Longitude"
                      value={formState.location.longitude}
                      onChange={e => setFormState({
                        ...formState,
                        location: { ...formState.location, longitude: e.target.value }
                      })}
                      className="input input-bordered w-full focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-base-content/70">Latitude</label>
                    <input
                      type="text"
                      placeholder="Latitude"
                      value={formState.location.latitude}
                      onChange={e => setFormState({
                        ...formState,
                        location: { ...formState.location, latitude: e.target.value }
                      })}
                      className="input input-bordered w-full focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-base-content/70">Map URL (Optional)</label>
                  <input
                    type="text"
                    placeholder="Google Maps or other map URL"
                    value={formState.location.map_url}
                    onChange={e => setFormState({
                      ...formState,
                      location: { ...formState.location, map_url: e.target.value }
                    })}
                    className="input input-bordered w-full focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Owner Section */}
          {activeSection === 'owner' && (
            <div className="p-6 space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <User className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-bold text-base-content">Property Owner Information</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-base-content">
                    <User className="w-4 h-4" />
                    Full Name
                  </label>
                  <input
                    type="text"
                    placeholder="Owner's full name"
                    value={formState.propertiesOwner.fullname}
                    onChange={e => setFormState({
                      ...formState,
                      propertiesOwner: { ...formState.propertiesOwner, fullname: e.target.value }
                    })}
                    className="input input-bordered w-full focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-base-content">
                    <User className="w-4 h-4" />
                    Display Name
                  </label>
                  <input
                    type="text"
                    placeholder="Display name"
                    value={formState.propertiesOwner.name}
                    onChange={e => setFormState({
                      ...formState,
                      propertiesOwner: { ...formState.propertiesOwner, name: e.target.value }
                    })}
                    className="input input-bordered w-full focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-base-content">
                    <Phone className="w-4 h-4" />
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    placeholder="Phone number"
                    value={formState.propertiesOwner.phone}
                    onChange={e => setFormState({
                      ...formState,
                      propertiesOwner: { ...formState.propertiesOwner, phone: e.target.value }
                    })}
                    className="input input-bordered w-full focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-base-content">
                    <MessageCircle className="w-4 h-4" />
                    WhatsApp
                  </label>
                  <input
                    type="tel"
                    placeholder="WhatsApp number"
                    value={formState.propertiesOwner.watsapp}
                    onChange={e => setFormState({
                      ...formState,
                      propertiesOwner: { ...formState.propertiesOwner, watsapp: e.target.value }
                    })}
                    className="input input-bordered w-full focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-base-content">
                    <Mail className="w-4 h-4" />
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="Email address"
                    value={formState.propertiesOwner.email}
                    onChange={e => setFormState({
                      ...formState,
                      propertiesOwner: { ...formState.propertiesOwner, email: e.target.value }
                    })}
                    className="input input-bordered w-full focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Additional Details Section */}
          {activeSection === 'additional' && (
            <div className="p-6 space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <Plus className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-bold text-base-content">Additional Details</h2>
              </div>

              {/* Basic Options */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-base-content">
                    <PawPrint className="w-4 h-4" />
                    Allow Pets
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      className="checkbox checkbox-primary"
                      checked={formState.additionalDetails.allow_pets}
                      onChange={e => setFormState({
                        ...formState,
                        additionalDetails: {
                          ...formState.additionalDetails,
                          allow_pets: e.target.checked
                        }
                      })}
                    />
                    <span>Allowed</span>
                  </label>
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-base-content">
                    <Construction className="w-4 h-4" />
                    Construction Nearby
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      className="checkbox checkbox-primary"
                      checked={formState.additionalDetails.construction_nearby}
                      onChange={e => setFormState({
                        ...formState,
                        additionalDetails: {
                          ...formState.additionalDetails,
                          construction_nearby: e.target.checked
                        }
                      })}
                    />
                    <span>Yes, construction nearby</span>
                  </label>
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-base-content">
                    <Sparkles className="w-4 h-4" />
                    Cleaning Frequency
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Weekly, Monthly"
                    value={formState.additionalDetails.cleaning_requency}
                    onChange={e => setFormState({
                      ...formState,
                      additionalDetails: {
                        ...formState.additionalDetails,
                        cleaning_requency: e.target.value
                      }
                    })}
                    className="input input-bordered w-full focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-base-content">
                    <Package className="w-4 h-4" />
                    Linen Change
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Every 3 days"
                    value={formState.additionalDetails.linen_chaneg}
                    onChange={e => setFormState({
                      ...formState,
                      additionalDetails: {
                        ...formState.additionalDetails,
                        linen_chaneg: e.target.value
                      }
                    })}
                    className="input input-bordered w-full focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>

              {/* Parking Options */}
              <div className="pt-4 border-t border-base-300">
                <div className="flex items-center gap-2 mb-4">
                  <Car className="w-5 h-5 text-primary" />
                  <h3 className="font-medium text-base-content">Parking Facilities</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {Object.entries(formState.additionalDetails.parking).map(([key, value]) => (
                    <label
                      key={key}
                      className="flex items-center gap-3 p-3 border border-base-300 rounded-lg hover:bg-base-200 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        className="checkbox checkbox-primary"
                        checked={value}
                        onChange={e => setFormState({
                          ...formState,
                          additionalDetails: {
                            ...formState.additionalDetails,
                            parking: {
                              ...formState.additionalDetails.parking,
                              [key]: e.target.checked
                            }
                          }
                        })}
                      />
                      <div>
                        <div className="font-medium capitalize">{key.replace(/_/g, ' ')}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* View Options */}
              <div className="pt-4 border-t border-base-300">
                <div className="flex items-center gap-2 mb-4">
                  <Eye className="w-5 h-5 text-primary" />
                  <h3 className="font-medium text-base-content">Property Views</h3>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                  {Object.entries(viewIcons).map(([key, Icon]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() =>
                        setFormState({
                          ...formState,
                          additionalDetails: {
                            ...formState.additionalDetails,
                            view: {
                              ...formState.additionalDetails.view,
                              [key]: !formState.additionalDetails.view[key]
                            }
                          }
                        })
                      }
                      className={`flex flex-col items-center justify-center p-3 rounded-lg border-2 transition-all ${formState.additionalDetails.view[key]
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-base-300 hover:border-base-400 text-base-content/70 hover:text-base-content'
                        }`}
                    >
                      <Icon className="w-5 h-5 mb-2" />
                      <span className="text-xs text-center capitalize">
                        {key.replace(/_/g, ' ')}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="p-6 border-t border-base-300 bg-base-200/50">
            <div className="flex justify-between">
              <button
                type="button"
                onClick={() => {
                  const currentIndex = sections.findIndex(s => s.id === activeSection);
                  if (currentIndex > 0) {
                    setActiveSection(sections[currentIndex - 1].id);
                  }
                }}
                className="btn btn-outline gap-2"
                disabled={activeSection === 'basic'}
              >
                <ArrowLeft className="w-4 h-4" />
                Previous
              </button>

              {activeSection !== 'additional' ? (
                <button
                  type="button"
                  onClick={() => {
                    const currentIndex = sections.findIndex(s => s.id === activeSection);
                    if (currentIndex < sections.length - 1) {
                      setActiveSection(sections[currentIndex + 1].id);
                    }
                  }}
                  className="btn btn-primary gap-2"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="submit"
                  className="btn btn-primary gap-2 shadow-lg hover:shadow-xl"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Submit Property
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProperty;