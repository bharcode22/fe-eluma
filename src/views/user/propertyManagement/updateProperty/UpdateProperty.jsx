import React, { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useParams, useNavigate } from "react-router-dom";
import Api from "../../../../service/api.js";
import Cookies from "js-cookie";
import { Link } from 'react-router-dom';

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

  const API_URL = "http://localhost:3002";
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
    availability: {
      available_from: "",
      available_to: ""
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
      fullname: "",
      name: "",
      phone: "",
      watsapp: "",
      email: ""
    }
  });

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const res = await Api.get(`/property/${id}`);
        setProperty(res.data.data[0]);
      } catch (error) {
        console.error('Gagal memuat data properti:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id]);

  useEffect(() => {
    let isMounted = true;
  
    const sanitize = async () => {
      if (property && property.description) {
        try {
          const module = await import("dompurify");
          const clean = module.default.sanitize(property.description);
          if (isMounted) setSanitizedHTML(clean);
        } catch (err) {
          console.error("Gagal import DOMPurify:", err);
        }
      }
    };
  
    sanitize();
    return () => {
      isMounted = false;
    };
  }, [property]);

  const handleDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    setNewImages(prev => [...prev, ...files]);
  };

  useEffect(() => {
    Api.get("/type-property")
      .then((res) => {
        if (res.data.data) setTypeOptions(res.data.data);
      })
      .catch((err) => console.error("Failed to fetch type property:", err));
  }, []);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const res = await Api.get(`/property/${id}`);
        const property = res.data.data[0];

        const locationData = property.location?.[0] || {};
        const availabilityData = property.availability?.[0] || {};
        const facilitiesData = property.facilities?.[0] || {};
        const ownerData = property.propertiesOwner?.[0] || {};

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
          availability: {
            available_from: availabilityData.available_from || "",
            available_to: availabilityData.available_to || ""
          },
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
          }
        });

        if (property.images && property.images.length > 0) {
          const formattedImages = property.images.map(img => 
            img.imagesUrl.startsWith('http') ? img.imagesUrl : `${API_URL}${img.imagesUrl}`
          );
          setImages(formattedImages);
        }
      } catch (error) {
        console.error("Gagal memuat data properti:", error);
        setMessage("Gagal memuat data properti");
      } finally {
        setLoading(false);
      }
    };
    fetchProperty();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    fetch(`${API_URL}/general-area`)
      .then(res => res.json())
      .then(data => {
        setGeneralAreas(data.data || []);
      })
      .catch(err => console.error('Failed to fetch general areas:', err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formDataToSend = new FormData();
    const token = Cookies.get('token');
    
    if (!token) {
      setMessage('Token tidak tersedia. Harap login terlebih dahulu.');
      return;
    }
    
    formDataToSend.append("type_id", formData.type_id);
    formDataToSend.append("property_tittle", formData.property_tittle);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("number_of_bedrooms", formData.number_of_bedrooms);
    formDataToSend.append("number_of_bathrooms", formData.number_of_bathrooms);
    formDataToSend.append("maximum_guest", formData.maximum_guest);
    formDataToSend.append("minimum_stay", formData.minimum_stay);
    formDataToSend.append("price", formData.price);
    formDataToSend.append("monthly_price", formData.monthly_price);
    formDataToSend.append("yearly_price", formData.yearly_price);
    formDataToSend.append("location", JSON.stringify(formData.location));
    formDataToSend.append("availability", JSON.stringify(formData.availability));
    formDataToSend.append("facilities", JSON.stringify(formData.facilities));
    formDataToSend.append("propertiesOwner", JSON.stringify(formData.propertiesOwner));
    newImages.forEach((file) => {
      formDataToSend.append("images", file);
    });

    try {
      await Api.patch(`/property/${id}`, formDataToSend, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        }
      });
      navigate('/user/home');
    } catch (error) {
      console.error("Gagal update property:", error);
      setMessage("Gagal update property: " + (error.response?.data?.message || error.message));
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

  return (
    <div className="max-w-3xl mx-auto p-6 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">Update Property</h1>
      {message && <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">{message}</div>}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {property.images.map((img, index) => (
          <img
            key={img.id}
            src={`${baseUrl}${img.imagesUrl}`}
            alt={img.imageName}
            onClick={() => setSelectedImageIndex(index)}
            className="w-full h-64 object-cover rounded-md cursor-pointer hover:scale-105 transition-transform duration-200"
          />
        ))}
      </div>

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
              {property.images.map((img, index) => (
                <div
                  key={img.id}
                  id={`slide${index}`}
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
        <div className='flex justify-end text-accent mt-5'>
          <Link to={`/user/update/image/property/${id}`} className="font-bold">
            <div className='flex gap-3'>
              <p>edit image</p>
            </div>
          </Link>
        </div>

        <div className="flex flex-wrap gap-2 mb-2 justify-center p-2 border rounded">
          {typeOptions.map((type) => (
            <button
              key={type.id}
              type="button"
              className={`px-4 py-2 rounded shadow ${
                formData.type_id === type.id ? "bg-blue-600 text-white" : "bg-gray-200"
              }`}
              onClick={() => setFormData((prev) => ({ ...prev, type_id: type.id }))}
            >
              {type.type_name}
            </button>
          ))}
        </div>

        <div>
          <label className="block font-medium">Judul Properti</label>
          <input
            type="text"
            name="property_tittle"
            value={formData.property_tittle}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div className="bg-secondary rounded-2xl p-4 shadow-md mb-5">
          <label className="block text-lg font-semibold mb-2 text-white">
            Deskripsi Properti
          </label>

          <ReactQuill
            value={formData.description || ""}
            onChange={(value) => setFormData((prev) => ({ ...prev, description: value }))}
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
            <input
              type="number"
              placeholder="Jumlah Kamar Tidur"
              value={formData.number_of_bedrooms}
              onChange={e => setFormData({ ...formData, number_of_bedrooms: e.target.value })}
              className="input input-bordered w-full mb-2"
            />

            <input
              type="number"
              placeholder="Jumlah Kamar Mandi"
              value={formData.number_of_bathrooms}
              onChange={e => setFormData({ ...formData, number_of_bathrooms: e.target.value })}
              className="input input-bordered w-full mb-2"
            />
          </div>

          <div className='flex gap-5'>
            <input
              type="number"
              placeholder="Tamu Maksimal"
              value={formData.maximum_guest}
              onChange={e => setFormData({ ...formData, maximum_guest: e.target.value })}
              className="input input-bordered w-full mb-2"
            />

            <input
              type="number"
              placeholder="Minimal Menginap"
              value={formData.minimum_stay}
              onChange={e => setFormData({ ...formData, minimum_stay: e.target.value })}
              className="input input-bordered w-full mb-2"
            />
          </div>
        </div>

        <div className='bg-secondary mb-8 px-4 py-4 rounded-lg'>
          <p>Pricing</p>
          <input
            type="number"
            placeholder="Harga Harian"
            value={formData.price}
            onChange={e => setFormData({ ...formData, price: e.target.value })}
            className="input input-bordered w-full mb-2"
          />

          <input
            type="number"
            placeholder="Harga Bulanan"
            value={formData.monthly_price}
            onChange={e => setFormData({ ...formData, monthly_price: e.target.value })}
            className="input input-bordered w-full mb-2"
          />

          <input
            type="number"
            placeholder="Harga Tahunan"
            value={formData.yearly_price}
            onChange={e => setFormData({ ...formData, yearly_price: e.target.value })}
            className="input input-bordered w-full mb-2"
          />
        </div>

        <div className="mb-2 p-2 border rounded">
          <div className="font-bold mb-1">Lokasi</div>

          <select
            value={formData.location.general_area}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                location: {
                  ...prev.location,
                  general_area: e.target.value,
                },
              }))
            }
            className="input input-bordered w-full mb-1"
          >
            <option value="">Pilih General Area</option>
            {generalAreas.map((area, idx) => (
              <option key={idx} value={area.area}>
                {area.area}
              </option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Map URL"
            value={formData.location.map_url}
            onChange={(e) =>
              setFormData((prev) => ({
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
              setFormData((prev) => ({
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
              setFormData((prev) => ({
                ...prev,
                location: {
                  ...prev.location,
                  latitude: e.target.value,
                },
              }))
            }
            className="input input-bordered w-full mb-1"
          />
        </div>

{/* Facilities Group */}
<div className="mb-2 p-2 border rounded">
  <div className="font-bold mb-1">Fasilitas</div>
  <div className="flex flex-wrap gap-3 justify-center">
    {Object.keys(formData?.facilities ?? {}).map((key) => (
      <button
        key={key}
        type="button"
        className={`btn ${formData.facilities[key] ? 'btn-primary' : 'btn-secondary'}`}
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


        {/* Owner Group */}
        <div className="mb-2 p-2 border rounded">
          <div className="font-bold mb-1">Data Pemilik Properti</div>

          {/* Nama Lengkap */}
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
            className="input input-bordered w-full mb-1"
          />

          {/* Nama */}
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
            className="input input-bordered w-full mb-1"
          />

          {/* No. Telepon */}
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
            className="input input-bordered w-full mb-1"
          />

          {/* No. WhatsApp */}
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
            className="input input-bordered w-full mb-1"
          />

          {/* Email */}
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
            className="input input-bordered w-full mb-1"
          />
        </div>

        {/* Availability Group */}
        <div className="mb-2 p-4 border rounded bg-base-100 shadow-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Tersedia Dari */}
            <div className="flex flex-col items-start">
              <label htmlFor="available_from" className="mb-1 font-medium">Tersedia Dari</label>
              <input
                id="available_from"
                type="datetime-local"
                value={
                  formData.availability[0]?.available_from
                    ? new Date(formData.availability[0].available_from)
                        .toISOString()
                        .slice(0, 16)
                    : ""
                }
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    availability: [
                      {
                        ...prev.availability[0],
                        available_from: e.target.value,
                      },
                    ],
                  }))
                }
                className="input input-bordered w-full"
              />
            </div>

            {/* Tersedia Sampai */}
            <div className="flex flex-col items-start">
              <label htmlFor="available_to" className="mb-1 font-medium">Tersedia Sampai</label>
              <input
                id="available_to"
                type="datetime-local"
                value={
                  formData.availability[0]?.available_to
                    ? new Date(formData.availability[0].available_to)
                        .toISOString()
                        .slice(0, 16)
                    : ""
                }
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    availability: [
                      {
                        ...prev.availability[0],
                        available_to: e.target.value,
                      },
                    ],
                  }))
                }
                className="input input-bordered w-full"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
        >
          Simpan Perubahan
        </button>
      </form>
    </div>
  );
}

export default UpdatePropertyForm;