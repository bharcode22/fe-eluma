import React, { useState, useEffect } from 'react';
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import api from '../../../../service/api';

const AddProperty = () => {
  const [generalAreas, setGeneralAreas] = useState([]);
  useEffect(() => {
    fetch('http://localhost:3000/general-area')
      .then(res => res.json())
      .then(data => {
        setGeneralAreas(data.data || []);
      })
      .catch(err => console.error('Failed to fetch general areas:', err));
  }, []);
  const [message, setMessage] = useState('');
  const [images, setImages] = useState([]);
  const baseUrl = api.defaults.baseURL;

    const [typeOptions, setTypeOptions] = useState([]);
    useEffect(() => {
        fetch(`${baseUrl}/type-property/`)
            .then(res => res.json())
            .then(data => {
                if (data.data) setTypeOptions(data.data);
            })
            .catch(err => console.error('Failed to fetch type property:', err));
    });
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
        }
        // additionalDetails: {
        //     // Tambahkan field sesuai kebutuhan backend, contoh:
        //     notes: '',
        //     // tambahkan field lain jika perlu
        // }
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
            propertiesOwner
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

    useEffect(() => {
      fetch(`${baseUrl}/general-area`)
        .then(res => res.json())
        .then(data => {
          // adjust based on your backend response structure
          setGeneralAreas(data.data || []);
        })
        .catch(err => console.error('Failed to fetch general areas:', err));
    });

  return (
    <div className="p-6 max-w-4xl mx-auto shadow-md rounded-md">
      <div className='flex justify-center'>
        <h2 className="text-2xl font-bold mb-4">Upload Properti</h2>
      </div>
      <form onSubmit={handleSubmit} encType="multipart/form-data">

        {/* tipe property */}
        <div className="flex flex-wrap gap-2 mb-2 justify-center p-2 border rounded">
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
        <input type="text" placeholder="Judul Properti" value={formState.property_tittle}
          onChange={(e) => setFormState({ ...formState, property_tittle: e.target.value })}
          className="input input-bordered w-full mb-2"
        />

        {/* Upload Gambar */}
        <div className="mb-6">
          <label htmlFor="images" className="block text-sm font-medium text-gray-700 mb-2">
            Unggah Gambar
            <span className="text-red-500 ml-1">*</span>
            <span className="text-sm text-gray-500 ml-2">(Minimal satu gambar diperlukan)</span>
          </label>
          <div
            className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-amber-500 transition-colors"
            onDrop={handleDrop}
            onDragOver={e => e.preventDefault()}
          >
            <div className="space-y-1 text-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2"
                className="mx-auto h-12 w-12 text-gray-400" viewBox="0 0 24 24">
                <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/>
                <circle cx="9" cy="9" r="2"/>
                <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
              </svg>
              <div className="flex text-sm text-gray-600 justify-center">
                <label htmlFor="images" className="relative cursor-pointer bg-white rounded-md font-medium text-amber-600 hover:text-amber-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-amber-500 px-2">
                  <span>Unggah file atau seret dan lepas</span>
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
              </div>
              <p className="text-xs text-gray-500">PNG, JPG, GIF maksimal 10MB per file</p>
            </div>
          </div>

          {images && images.length > 0 && (
            <DragDropContext onDragEnd={handleReorderImages}>
              <Droppable droppableId="images-droppable" direction="horizontal ">
                {(provided) => (
                  <div
                    className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-4 mt-2 md:mt-4"
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
                            className={`relative aspect-square select-none border ${idx === 0 ? 'border-amber-400 ring-2 ring-amber-400 shadow-lg' : 'border-gray-200'} cursor-move bg-white`}
                            style={{
                              ...provided.draggableProps.style,
                              opacity: snapshot.isDragging ? 0.8 : 1,
                              zIndex: snapshot.isDragging ? 50 : 1,
                              transition: 'box-shadow 0.2s, opacity 0.2s'
                            }}
                          >
                            {idx === 0 && (
                              <div className="absolute top-2 left-2 z-20 bg-amber-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                                Main Image
                              </div>
                            )}
                            <img
                              alt={`Uploaded image ${idx + 1}`}
                              src={typeof img === 'string' ? img : URL.createObjectURL(img)}
                              className="rounded-md object-cover w-full h-full"
                              draggable={false}
                            />
                            <button
                              type="button"
                              onClick={() => handleRemoveImage(idx)}
                              className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors z-10"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"
                                className="lucide lucide-x" viewBox="0 0 24 24">
                                <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
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
        <div className="bg-secondary rounded-2xl p-4 shadow-md mb-5">
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

        <div className='bg-secondary mb-8 px-4 py-4 rounded-lg'>
          <p>Detail</p>
          <div className='flex gap-5'>
                <input type="number" placeholder="Jumlah Kamar Tidur" value={formState.number_of_bedrooms}
                  onChange={e => setFormState({ ...formState, number_of_bedrooms: e.target.value })}
                  className="input input-bordered w-full mb-2"
                />

                <input type="number" placeholder="Jumlah Kamar Mandi" value={formState.number_of_bathrooms}
                  onChange={e => setFormState({ ...formState, number_of_bathrooms: e.target.value })}
                  className="input input-bordered w-full mb-2"
                />
          </div>

          <div className='flex gap-5'>
                <input type="number" placeholder="Tamu Maksimal" value={formState.maximum_guest}
                  onChange={e => setFormState({ ...formState, maximum_guest: e.target.value })}
                  className="input input-bordered w-full mb-2"
                />

                <input type="number" placeholder="Minimal Menginap" value={formState.minimum_stay}
                  onChange={e => setFormState({ ...formState, minimum_stay: e.target.value })}
                  className="input input-bordered w-full mb-2"
                />
          </div>
        </div>

        <div className='bg-secondary mb-8 px-4 py-4 rounded-lg'>
          <div className='bg-secondary'>
            <p>Pricing</p>
                <input type="number" placeholder="Harga Harian" value={formState.price}
                  onChange={e => setFormState({ ...formState, price: e.target.value })}
                  className="input input-bordered w-full mb-2"
                />

                <input type="number" placeholder="Harga Bulanan" value={formState.monthly_price}
                  onChange={e => setFormState({ ...formState, monthly_price: e.target.value })}
                  className="input input-bordered w-full mb-2"
                />

                <input type="number" placeholder="Harga Tahunan" value={formState.yearly_price}
                  onChange={e => setFormState({ ...formState, yearly_price: e.target.value })}
                  className="input input-bordered w-full mb-2"
                />
          </div>
        </div>

        {/* Availability Group */}
        <div className="mb-2 p-4 border rounded bg-base-100 shadow-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col items-start">
              <label htmlFor="available_from" className="mb-1 font-medium">Tersedia Dari</label>
              <input
                id="available_from"
                type="datetime-local"
                placeholder="Tersedia Dari"
                value={formState.availability.available_from}
                onChange={e => setFormState({ ...formState, availability: { ...formState.availability, available_from: e.target.value } })}
                className="input input-bordered w-full"
              />
            </div>
            <div className="flex flex-col items-start">
              <label htmlFor="available_to" className="mb-1 font-medium">Tersedia Sampai</label>
              <input
                id="available_to"
                type="datetime-local"
                placeholder="Tersedia Sampai"
                value={formState.availability.available_to}
                onChange={e => setFormState({ ...formState, availability: { ...formState.availability, available_to: e.target.value } })}
                className="input input-bordered w-full"
              />
            </div>
          </div>
        </div>

        {/* Facilities Group */}
        <div className="mb-2 p-2 border rounded">
          <div className="font-bold mb-1">Fasilitas</div>
          <div className="flex flex-wrap gap-3 justify-center">
            {Object.keys(formState.facilities).map((key) => (
              <button
                key={key}
                type="button"
                className={`btn ${formState.facilities[key] ? 'btn-primary' : 'btn-secondary'}`}
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
        <div className="mb-2 p-2 border rounded">
          <div className="font-bold mb-1">Lokasi</div>
          <select value={formState.location.general_area} onChange={e => setFormState({ ...formState, location: { ...formState.location, general_area: e.target.value } })} className="input input-bordered w-full mb-1" >
            <option value="">Pilih General Area</option>
            {generalAreas.map((area, idx) => (
              <option key={idx} value={area.area}>{area.area}</option>
            ))}
          </select>

          <input type="text" placeholder="Map URL" value={formState.location.map_url}
            onChange={e => setFormState({ ...formState, location: { ...formState.location, map_url: e.target.value } })}
            className="input input-bordered w-full mb-1"
          />
          <input type="text" placeholder="Longitude" value={formState.location.longitude}
            onChange={e => setFormState({ ...formState, location: { ...formState.location, longitude: e.target.value } })}
            className="input input-bordered w-full mb-1"
          />
          <input type="text" placeholder="Latitude" value={formState.location.latitude}
            onChange={e => setFormState({ ...formState, location: { ...formState.location, latitude: e.target.value } })}
            className="input input-bordered w-full mb-1"
          />
        </div>

        {/* Owner Group */}
        <div className="mb-2 p-2 border rounded">
          <div className="font-bold mb-1">Data Pemilik Properti</div>
          <input type="text" placeholder="Nama Lengkap" value={formState.propertiesOwner.fullname}
            onChange={e => setFormState({ ...formState, propertiesOwner: { ...formState.propertiesOwner, fullname: e.target.value } })}
            className="input input-bordered w-full mb-1"
          />
          <input type="text" placeholder="Nama" value={formState.propertiesOwner.name}
            onChange={e => setFormState({ ...formState, propertiesOwner: { ...formState.propertiesOwner, name: e.target.value } })}
            className="input input-bordered w-full mb-1"
          />
          <input type="number" placeholder="No. Telepon" value={formState.propertiesOwner.phone}
            onChange={e => setFormState({ ...formState, propertiesOwner: { ...formState.propertiesOwner, phone: e.target.value } })}
            className="input input-bordered w-full mb-1"
          />
          <input type="number" placeholder="No. WhatsApp" value={formState.propertiesOwner.watsapp}
            onChange={e => setFormState({ ...formState, propertiesOwner: { ...formState.propertiesOwner, watsapp: e.target.value } })}
            className="input input-bordered w-full mb-1"
          />
          <input type="email" placeholder="Email" value={formState.propertiesOwner.email}
            onChange={e => setFormState({ ...formState, propertiesOwner: { ...formState.propertiesOwner, email: e.target.value } })}
            className="input input-bordered w-full mb-1"
          />
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
