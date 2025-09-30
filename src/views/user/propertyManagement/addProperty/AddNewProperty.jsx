import React, { useState, useEffect } from 'react';
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import api from '../../../../service/api';

const AddProperty = () => {
  const [message, setMessage] = useState('');
  const [images, setImages] = useState([]);
  const baseUrl = api.defaults.baseURL;
  const [generalAreas, setGeneralAreas] = useState([]);
  const [typeOptions, setTypeOptions] = useState([]);

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = Cookies.get('token');

        if (!token) {
            setMessage('Token tidak tersedia. Harap login terlebih dahulu.');
            return;
        }

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
        setMessage('Properti berhasil ditambahkan!');
        console.log(res.data);
        console.log(res);
        navigate('/user/home');
        } catch (err) {
            console.error(err);
            setMessage(err.response?.data?.message || 'Gagal menambahkan properti.');
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
    <div className="p-6 max-w-4xl mx-auto shadow-md rounded-md">
      <div className='flex justify-center'>
        <h2 className="text-2xl font-bold mb-4">Upload Properti</h2>
      </div>
      <form onSubmit={handleSubmit} encType="multipart/form-data">

        {/* tipe property */}
        <div className="flex flex-wrap gap-2 mb-5 justify-center p-2 rounded-lg bg-secondary/50 backdrop-blur-lg py-5">
          {typeOptions.map(type => (
            <button key={type.id} type="button"
              className={`btn shadow-2xl ${formState.type_id === type.id ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setFormState({ ...formState, type_id: type.id })}
            >
              {type.type_name}
            </button>
          ))}
        </div>

      {/* judul property */}
      <div className="flex flex-wrap gap-2 mb-5 justify-center p-2 rounded-lg bg-secondary/50 backdrop-blur-lg py-5">
        <input
          type="text"
          placeholder="Property Name"
          value={formState.property_tittle}
          onChange={(e) =>
            setFormState({ ...formState, property_tittle: e.target.value })
          }
          className="input input-primary w-full rounded-lg bg-secondary/50 backdrop-blur-lg shadow-lg"
        />
      </div>

      {/* Upload image */}
      <div className="gap-2 mb-5 justify-center p-2 rounded-lg bg-secondary/50 backdrop-blur-lg py-5">
        <label
          htmlFor="images"
          className="block text-sm font-medium text-gray-100 mb-4"
        >
          Upload Image
          <span className="text-red-400 ml-1">*</span>
          <span className="text-sm text-gray-300 ml-2">
            (Upload at least one image)
          </span>
        </label>

        <div
          className="flex flex-col items-center justify-center w-full py-8 px-4 rounded-lg border-2 border-dashed border-gray-400 bg-secondary/50 backdrop-blur-lg shadow-lg hover:border-amber-500 transition-colors"
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
        >
          {/* Icon & text */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="36"
            height="36"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="mb-3 text-gray-300"
            viewBox="0 0 24 24"
          >
            <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
            <circle cx="9" cy="9" r="2" />
            <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
          </svg>

          <label
            htmlFor="images"
            className="cursor-pointer text-amber-400 hover:text-amber- font-medium"
          >
            <span>Upload or drag image here</span>
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

          <p className="mt-2 text-xs text-gray-300">
            PNG, JPG, GIF maximum 10MB per file
          </p>
        </div>

        {images && images.length > 0 && (
          <DragDropContext onDragEnd={handleReorderImages}>
            <Droppable droppableId="images-droppable" direction="horizontal">
              {(provided) => (
                <div
                  className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mt-5"
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
                          className={`relative aspect-square select-none rounded-lg overflow-hidden bg-secondary/50 backdrop-blur-lg shadow-md border ${idx === 0 ? 'border-amber-400 ring-2 ring-amber-400' : 'border-gray-300'} cursor-move`}
                          style={{
                            ...provided.draggableProps.style,
                            opacity: snapshot.isDragging ? 0.9 : 1,
                            zIndex: snapshot.isDragging ? 50 : 1,
                            transition: 'box-shadow 0.2s, opacity 0.2s',
                          }}
                        >
                          {idx === 0 && (
                            <div className="absolute top-2 left-2 z-20 bg-amber-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                              Main Image
                            </div>
                          )}

                          <img
                            alt={`Uploaded image ${idx + 1}`}
                            src={
                              typeof img === 'string'
                                ? img
                                : URL.createObjectURL(img)
                            }
                            className="w-full h-full object-cover rounded-lg"
                            draggable={false}
                          />

                          <button
                            type="button"
                            onClick={() => handleRemoveImage(idx)}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors z-10"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              viewBox="0 0 24 24"
                            >
                              <path d="M18 6 6 18" />
                              <path d="m6 6 12 12" />
                            </svg>
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

        {/* deskripsi */}
        <div className="bg-secondary/50 backdrop-blur-lg rounded-2xl p-4 shadow-md mb-5">
          <label className="block text-lg font-semibold mb-2 text-white">
            Deskripsi Properti
          </label>

          <ReactQuill
            value={formState.description || ""}
            onChange={(value) => setFormState((prev) => ({ ...prev, description: value }))}
            placeholder="Tulis deskripsi properti di sini..."
            className="custom-quill"
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

        {/* detail property */}
        <div className='bg-secondary/50 backdrop-blur-lg mb-8 px-4 py-4 rounded-lg'>
          <p className="text-lg font-semibold mb-4 text-white">Detail Properti</p>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div>
              <label htmlFor="number_of_bedrooms" className="block text-sm font-medium text-white mb-1">number of bedrooms</label>
              <input type="number" id="number_of_bedrooms" placeholder="number of bedrooms" value={formState.number_of_bedrooms}
                onChange={e => setFormState({ ...formState, number_of_bedrooms: e.target.value })}
                className="input input-primary w-full rounded-lg bg-secondary/50 backdrop-blur-lg shadow-lg"
              />
            </div>
            <div>
              <label htmlFor="number_of_bathrooms" className="block text-sm font-medium text-white mb-1">number of bathrooms</label>
              <input type="number" id="number_of_bathrooms" placeholder="number of bathrooms" value={formState.number_of_bathrooms}
                onChange={e => setFormState({ ...formState, number_of_bathrooms: e.target.value })}
                className="input input-primary w-full rounded-lg bg-secondary/50 backdrop-blur-lg shadow-lg"
              />
            </div>
            <div>
              <label htmlFor="maximum_guest" className="block text-sm font-medium text-white mb-1">maximum guest</label>
              <input type="number" id="maximum_guest" placeholder="maximum guest" value={formState.maximum_guest}
                onChange={e => setFormState({ ...formState, maximum_guest: e.target.value })}
                className="input input-primary w-full rounded-lg bg-secondary/50 backdrop-blur-lg shadow-lg"
              />
            </div>
            <div>
              <label htmlFor="minimum_stay" className="block text-sm font-medium text-white mb-1">minimum stay</label>
              <input type="number" id="minimum_stay" placeholder="minimum stay" value={formState.minimum_stay}
                onChange={e => setFormState({ ...formState, minimum_stay: e.target.value })}
                className="input input-primary w-full rounded-lg bg-secondary/50 backdrop-blur-lg shadow-lg"
              />
            </div>
          </div>
        </div>

        {/* pricing */}
        <div className='bg-secondary/50 backdrop-blur-lg mb-5 px-4 py-4 rounded-lg'>
          <p className="text-lg font-semibold mb-4 text-white">Pricing</p>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-white mb-1">price</label>
              <input type="number" id="price" placeholder="price" value={formState.price}
                onChange={e => setFormState({ ...formState, price: e.target.value })}
                className="input input-primary w-full rounded-lg bg-secondary/50 backdrop-blur-lg shadow-lg"
              />
            </div>
            <div>
              <label htmlFor="monthly_price" className="block text-sm font-medium text-white mb-1">monthly price</label>
              <input type="number" id="monthly_price" placeholder="monthly price" value={formState.monthly_price}
                onChange={e => setFormState({ ...formState, monthly_price: e.target.value })}
                className="input input-primary w-full rounded-lg bg-secondary/50 backdrop-blur-lg shadow-lg"
              />
            </div>
            <div>
              <label htmlFor="yearly_price" className="block text-sm font-medium text-white mb-1">yearly price</label>
              <input type="number" id="yearly_price" placeholder="yearly price" value={formState.yearly_price}
                onChange={e => setFormState({ ...formState, yearly_price: e.target.value })}
                className="input input-primary w-full rounded-lg bg-secondary/50 backdrop-blur-lg shadow-lg"
              />
            </div>
          </div>
        </div>

        {/* Availability Group */}
        <div className="p-4 shadow-sm bg-secondary/50 backdrop-blur-lg rounded-lg mb-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col items-start">
              <label htmlFor="available_from" className="mb-1 font-medium">available from</label>
              <input
                id="available_from"
                type="datetime-local"
                placeholder="Tersedia Dari"
                value={formState.availability.available_from}
                onChange={e => setFormState({ ...formState, availability: { ...formState.availability, available_from: e.target.value } })}
                className="input input-primary w-full rounded-lg bg-secondary/50 backdrop-blur-lg shadow-lg"
              />
            </div>
            <div className="flex flex-col items-start">
              <label htmlFor="available_to" className="mb-1 font-medium">available to</label>
              <input
                id="available_to"
                type="datetime-local"
                placeholder="available to"
                value={formState.availability.available_to}
                onChange={e => setFormState({ ...formState, availability: { ...formState.availability, available_to: e.target.value } })}
                className="input input-primary w-full rounded-lg bg-secondary/50 backdrop-blur-lg shadow-lg"
              />
            </div>
          </div>
        </div>

        {/* Facilities Group */}
        <div className="mb-5 p-6 bg-secondary/50 backdrop-blur-lg rounded-lg">
          <div className="font-bold mb-1">Facilities</div>
          <div className="flex flex-wrap gap-3 justify-center">
            {Object.keys(formState.facilities).map((key) => (
              <button
                key={key}
                type="button"
                className={`btn ${formState.facilities[key] ? 'btn-primary shadow-lg' : 'btn-secondary shadow-lg'}`}
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
        <div className="mb-5 p-5 bg-secondary/50 backdrop-blur-lg rounded-lg">
          <div className="font-bold mb-1">Location</div>
          <select value={formState.location.general_area} onChange={e => setFormState({ ...formState, location: { ...formState.location, general_area: e.target.value } })} className="input input-primary w-full rounded-lg bg-secondary backdrop-blur-lg shadow-lg mb-2">
            <option>General Area</option>
            {generalAreas.map((area, idx) => (
              <option key={idx} value={area.area}>{area.area}</option>
            ))}
          </select>

          {/* <input type="text" placeholder="Map URL" value={formState.location.map_url}
            onChange={e => setFormState({ ...formState, location: { ...formState.location, map_url: e.target.value } })}
            className="input input-primary w-full rounded-lg bg-secondary/50 backdrop-blur-lg shadow-lg"
          />
          <input type="text" placeholder="Longitude" value={formState.location.longitude}
            onChange={e => setFormState({ ...formState, location: { ...formState.location, longitude: e.target.value } })}
            className="input input-primary w-full rounded-lg bg-secondary/50 backdrop-blur-lg shadow-lg"
          />
          <input type="text" placeholder="Latitude" value={formState.location.latitude}
            onChange={e => setFormState({ ...formState, location: { ...formState.location, latitude: e.target.value } })}
            className="input input-primary w-full rounded-lg bg-secondary/50 backdrop-blur-lg shadow-lg"
          /> */}
        </div>

        {/* Owner Group */}
        <div className="mb-5 p-5 bg-secondary/50 backdrop-blur-lg rounded-lg">
          <div className="font-bold mb-1">Property Owner</div>
          <input type="text" placeholder="Full Name" value={formState.propertiesOwner.fullname}
            onChange={e => setFormState({ ...formState, propertiesOwner: { ...formState.propertiesOwner, fullname: e.target.value } })}
            className="input input-primary w-full rounded-lg bg-secondary/50 backdrop-blur-lg shadow-lg mb-2"
          />
          <input type="text" placeholder="Name" value={formState.propertiesOwner.name}
            onChange={e => setFormState({ ...formState, propertiesOwner: { ...formState.propertiesOwner, name: e.target.value } })}
            className="input input-primary w-full rounded-lg bg-secondary/50 backdrop-blur-lg shadow-lg mb-2"
          />
          <input type="number" placeholder="Phone" value={formState.propertiesOwner.phone}
            onChange={e => setFormState({ ...formState, propertiesOwner: { ...formState.propertiesOwner, phone: e.target.value } })}
            className="input input-primary w-full rounded-lg bg-secondary/50 backdrop-blur-lg shadow-lg mb-2"
          />
          <input type="number" placeholder="WhatsApp" value={formState.propertiesOwner.watsapp}
            onChange={e => setFormState({ ...formState, propertiesOwner: { ...formState.propertiesOwner, watsapp: e.target.value } })}
            className="input input-primary w-full rounded-lg bg-secondary/50 backdrop-blur-lg shadow-lg mb-2"
          />
          <input type="email" placeholder="Email" value={formState.propertiesOwner.email}
            onChange={e => setFormState({ ...formState, propertiesOwner: { ...formState.propertiesOwner, email: e.target.value } })}
            className="input input-primary w-full rounded-lg bg-secondary/50 backdrop-blur-lg shadow-lg mb-2"
          />
        </div>

        {/* Additional Details Group */}
        <div className="mb-5 p-5 bg-secondary/50 backdrop-blur-lg rounded-lg">
          <div className="font-bold mb-1">Additional Details</div>
          <div className="flex items-center mb-1">
            <input type="checkbox" id="allow_pets" checked={formState.additionalDetails.allow_pets}
              onChange={e => setFormState({ ...formState, additionalDetails: { ...formState.additionalDetails, allow_pets: e.target.checked } })}
              className="checkbox checkbox-secondary"
            />
            <label htmlFor="allow_pets" className="ml-2">Allow Path</label>
          </div>
          <div className="flex items-center mb-1">
            <input type="checkbox" id="construction_nearby" checked={formState.additionalDetails.construction_nearby}
              onChange={e => setFormState({ ...formState, additionalDetails: { ...formState.additionalDetails, construction_nearby: e.target.checked } })}
              className="checkbox checkbox-secondary"
            />
            <label htmlFor="construction_nearby" className="ml-2">Construction Nearby</label>
          </div>
          <input type="text" placeholder="Cleaning Frequency" value={formState.additionalDetails.cleaning_requency}
            onChange={e => setFormState({ ...formState, additionalDetails: { ...formState.additionalDetails, cleaning_requency: e.target.value } })}
            className="input input-primary w-full rounded-lg bg-secondary/50 backdrop-blur-lg shadow-lg mb-2"
          />
          <input type="text" placeholder="Linen Change" value={formState.additionalDetails.linen_chaneg}
            onChange={e => setFormState({ ...formState, additionalDetails: { ...formState.additionalDetails, linen_chaneg: e.target.value } })}
            className="input input-primary w-full rounded-lg bg-secondary/50 backdrop-blur-lg shadow-lg mb-2"
          />
          <div className="font-bold mt-2 mb-1">Parking</div>
          <div className="flex items-center mb-1">
            <input type="checkbox" id="car_parking" checked={formState.additionalDetails.parking.car_parking}
              onChange={e => setFormState({ ...formState, additionalDetails: { ...formState.additionalDetails, parking: { ...formState.additionalDetails.parking, car_parking: e.target.checked } } })}
              className="checkbox checkbox-secondary"
            />
            <label htmlFor="car_parking" className="ml-2">Car Parking</label>
          </div>
          <div className="flex items-center mb-1">
            <input type="checkbox" id="bike_parking" checked={formState.additionalDetails.parking.bike_parking}
              onChange={e => setFormState({ ...formState, additionalDetails: { ...formState.additionalDetails, parking: { ...formState.additionalDetails.parking, bike_parking: e.target.checked } } })}
              className="checkbox checkbox-secondary"
            />
            <label htmlFor="bike_parking" className="ml-2">Bike Parking</label>
          </div>
          <div className="flex items-center mb-1">
            <input type="checkbox" id="both_car_and_bike" checked={formState.additionalDetails.parking.both_car_and_bike}
              onChange={e => setFormState({ ...formState, additionalDetails: { ...formState.additionalDetails, parking: { ...formState.additionalDetails.parking, both_car_and_bike: e.target.checked } } })}
              className="checkbox checkbox-secondary"
            />
            <label htmlFor="both_car_and_bike" className="ml-2">Both Car and Bike Parking</label>
          </div>
          <div className="font-bold mt-2 mb-1">View</div>
          <div className="flex items-center mb-1">
            <input type="checkbox" id="ocean_view" checked={formState.additionalDetails.view.ocean_view}
              onChange={e => setFormState({ ...formState, additionalDetails: { ...formState.additionalDetails, view: { ...formState.additionalDetails.view, ocean_view: e.target.checked } } })}
              className="checkbox checkbox-secondary"
            />
            <label htmlFor="ocean_view" className="ml-2">Ocean View</label>
          </div>
          <div className="flex items-center mb-1">
            <input type="checkbox" id="sunset_view" checked={formState.additionalDetails.view.sunset_view}
              onChange={e => setFormState({ ...formState, additionalDetails: { ...formState.additionalDetails, view: { ...formState.additionalDetails.view, sunset_view: e.target.checked } } })}
              className="checkbox checkbox-secondary"
            />
            <label htmlFor="sunset_view" className="ml-2">Sunset View</label>
          </div>
          <div className="flex items-center mb-1">
            <input type="checkbox" id="garden_view" checked={formState.additionalDetails.view.garden_view}
              onChange={e => setFormState({ ...formState, additionalDetails: { ...formState.additionalDetails, view: { ...formState.additionalDetails.view, garden_view: e.target.checked } } })}
              className="checkbox checkbox-secondary"
            />
            <label htmlFor="garden_view" className="ml-2">Garden View</label>
          </div>
          <div className="flex items-center mb-1">
            <input type="checkbox" id="beach_view" checked={formState.additionalDetails.view.beach_view}
              onChange={e => setFormState({ ...formState, additionalDetails: { ...formState.additionalDetails, view: { ...formState.additionalDetails.view, beach_view: e.target.checked } } })}
              className="checkbox checkbox-secondary"
            />
            <label htmlFor="beach_view" className="ml-2">Beach View</label>
          </div>
          <div className="flex items-center mb-1">
            <input type="checkbox" id="jungle_view" checked={formState.additionalDetails.view.jungle_view}
              onChange={e => setFormState({ ...formState, additionalDetails: { ...formState.additionalDetails, view: { ...formState.additionalDetails.view, jungle_view: e.target.checked } } })}
              className="checkbox checkbox-secondary"
            />
            <label htmlFor="jungle_view" className="ml-2">Jungle View</label>
          </div>
          <div className="flex items-center mb-1">
            <input type="checkbox" id="montain_view" checked={formState.additionalDetails.view.montain_view}
              onChange={e => setFormState({ ...formState, additionalDetails: { ...formState.additionalDetails, view: { ...formState.additionalDetails.view, montain_view: e.target.checked } } })}
              className="checkbox checkbox-secondary"
            />
            <label htmlFor="montain_view" className="ml-2">Montain View</label>
          </div>
          <div className="flex items-center mb-1">
            <input type="checkbox" id="pool_view" checked={formState.additionalDetails.view.pool_view}
              onChange={e => setFormState({ ...formState, additionalDetails: { ...formState.additionalDetails, view: { ...formState.additionalDetails.view, pool_view: e.target.checked } } })}
              className="checkbox checkbox-secondary"
            />
            <label htmlFor="pool_view" className="ml-2">Pool View</label>
          </div>
          <div className="flex items-center mb-1">
            <input type="checkbox" id="rice_field" checked={formState.additionalDetails.view.rice_field}
              onChange={e => setFormState({ ...formState, additionalDetails: { ...formState.additionalDetails, view: { ...formState.additionalDetails.view, rice_field: e.target.checked } } })}
              className="checkbox checkbox-secondary"
            />
            <label htmlFor="rice_field" className="ml-2">Rice Field View</label>
          </div>
          <div className="flex items-center mb-1">
            <input type="checkbox" id="sunrise_view" checked={formState.additionalDetails.view.sunrise_view}
              onChange={e => setFormState({ ...formState, additionalDetails: { ...formState.additionalDetails, view: { ...formState.additionalDetails.view, sunrise_view: e.target.checked } } })}
              className="checkbox checkbox-secondary"
            />
            <label htmlFor="sunrise_view" className="ml-2">Sunrise View</label>
          </div>
          <div className="flex items-center mb-1">
            <input type="checkbox" id="volcano_view" checked={formState.additionalDetails.view.volcano_view}
              onChange={e => setFormState({ ...formState, additionalDetails: { ...formState.additionalDetails, view: { ...formState.additionalDetails.view, volcano_view: e.target.checked } } })}
              className="checkbox checkbox-secondary"
            />
            <label htmlFor="volcano_view" className="ml-2">Volcano View</label>
          </div>
        </div>

        {/* Tombol Submit */}
        <div>
          <button type="submit" className="btn btn-primary w-full">Upload</button>
        </div>

        {/* Tombol Kembali */}
        <div className="mt-2">
          <button type="button" className="btn btn-secondary w-full" onClick={() => navigate(-1)}> Kembali </button>
        </div>

      </form>
        {message && <p className="mt-4 text-center text-red-500">{message}</p>}
    </div>
  );
};

export default AddProperty;