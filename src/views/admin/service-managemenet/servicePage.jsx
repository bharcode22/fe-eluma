import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { Loader2, AlertCircle } from 'lucide-react';
import api from '../../../service/api.js';

import ServiceTableHeader from './components/ServiceTableHeader.jsx';
import ServiceTableFilter from './components/ServiceTableFilter.jsx';
import ServiceTable from './components/ServiceTable.jsx';
import ServiceFormModal from './components/ServiceFormModal.jsx';
import DeleteConfirmModal from './components/DeleteConfirmModal.jsx';

const baseUrl = api.defaults.baseURL;

function ServicePage() {
    const [services, setServices] = useState([]);
    const [serviceTypes, setServiceTypes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // Modal States
    const [showFormModal, setShowFormModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedServiceId, setSelectedServiceId] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    // Form Data
    const [formState, setFormState] = useState({
        service_name: '',
        service_type: '',
        description: '',
        status: 'active',
        type_id: ''
    });

    // Image Management States
    const [existingImages, setExistingImages] = useState([]);
    const [deletedImageIds, setDeletedImageIds] = useState([]);
    const [selectedFiles, setSelectedFiles] = useState([]);

    // Delete Modal State
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [serviceToDelete, setServiceToDelete] = useState(null);

    const token = Cookies.get('token');

    const fetchServiceTypes = async () => {
        try {
            const res = await axios.get(`${baseUrl}/service/types`);
            setServiceTypes(res.data.data || []);
        } catch (err) {
            console.error('Failed to fetch service types:', err);
        }
    };

    const fetchServices = async () => {
        try {
            if (!token) {
                setError('Token tidak ditemukan. Harap login terlebih dahulu.');
                setLoading(false);
                return;
            }

            const response = await axios.get(
                `${baseUrl}/service?page=${currentPage}&limit=10&search=${searchQuery}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setServices(response.data.data || []);
            if (response.data.meta) {
                setTotalPages(response.data.meta.totalPages || 1);
            }
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Gagal memuat data service');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchServices();
        fetchServiceTypes();
        // eslint-disable-next-line
    }, [currentPage, searchQuery]);

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1);
    };

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    // Open Form for Adding
    const handleOpenAddModal = () => {
        setIsEditing(false);
        setSelectedServiceId(null);
        setFormState({
            service_name: '',
            service_type: '',
            description: '',
            status: 'active',
            type_id: ''
        });
        setExistingImages([]);
        setDeletedImageIds([]);
        setSelectedFiles([]);
        setShowFormModal(true);
    };

    // Open Form for Editing
    const handleOpenEditModal = (service) => {
        setIsEditing(true);
        setSelectedServiceId(service.id);
        setFormState({
            service_name: service.service_name || '',
            service_type: service.service_type || '',
            description: service.description || '',
            status: service.status || 'active',
            type_id: service.type_id || ''
        });
        setExistingImages(service.imagesService || []);
        setDeletedImageIds([]);
        setSelectedFiles([]);
        setShowFormModal(true);
    };

    // Handle Deleting Existing Image in Edit Form
    const handleDeleteExistingImage = (imageId) => {
        setExistingImages((prev) => prev.filter((img) => img.id !== imageId));
        setDeletedImageIds((prev) => [...prev, imageId]);
    };

    // Submit Add or Edit Form
    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);

        const formDataToSend = new FormData();
        formDataToSend.append('service_name', formState.service_name);
        formDataToSend.append('service_type', formState.service_type);
        formDataToSend.append('description', formState.description);
        formDataToSend.append('status', formState.status);
        if (formState.type_id) {
            formDataToSend.append('type_id', formState.type_id);
        }

        if (isEditing && deletedImageIds.length > 0) {
            formDataToSend.append('deleteImageIds', JSON.stringify(deletedImageIds));
        }

        selectedFiles.forEach((file) => {
            formDataToSend.append('images', file);
        });

        try {
            if (isEditing) {
                await axios.patch(`${baseUrl}/service/${selectedServiceId}`, formDataToSend, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data',
                    },
                });
            } else {
                await axios.post(`${baseUrl}/service`, formDataToSend, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data',
                    },
                });
            }

            setShowFormModal(false);
            fetchServices();
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Gagal menyimpan service');
        } finally {
            setSubmitting(false);
        }
    };

    // Open Delete Modal
    const handleOpenDeleteModal = (id) => {
        setServiceToDelete(id);
        setShowDeleteConfirm(true);
    };

    // Confirm Delete
    const handleConfirmDelete = async () => {
        try {
            await axios.delete(`${baseUrl}/service/${serviceToDelete}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setShowDeleteConfirm(false);
            setServiceToDelete(null);
            fetchServices();
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Gagal menghapus service');
            setShowDeleteConfirm(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-base-100 to-base-200 p-4 md:p-8 flex justify-center items-center">
                <div className="text-center space-y-3">
                    <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto" />
                    <p className="text-base-content/70 font-medium">Loading service data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-base-100 to-base-200 p-4 md:p-8">
            <div className="max-w-7xl mx-auto space-y-6">

                {/* Page Header Component */}
                <ServiceTableHeader onOpenAddModal={handleOpenAddModal} />

                {/* Global Error Banner */}
                {error && (
                    <div className="p-4 bg-error/10 border border-error/30 text-error rounded-2xl flex items-center gap-3">
                        <AlertCircle className="w-5 h-5 flex-shrink-0" />
                        <span className="text-sm font-medium">{error}</span>
                    </div>
                )}

                {/* Main Content Card Container */}
                <div className="bg-base-100 rounded-2xl border border-base-300 shadow-sm p-6 space-y-6">
                    {/* Search Bar & Pagination Info Component */}
                    <ServiceTableFilter
                        searchQuery={searchQuery}
                        onSearchChange={handleSearch}
                        currentPage={currentPage}
                        totalPages={totalPages}
                    />

                    {/* Service Table Component */}
                    <ServiceTable
                        services={services}
                        baseUrl={baseUrl}
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                        onOpenEditModal={handleOpenEditModal}
                        onOpenDeleteModal={handleOpenDeleteModal}
                    />
                </div>

                {/* Add / Edit Form Modal Component */}
                <ServiceFormModal
                    showModal={showFormModal}
                    isEditing={isEditing}
                    formState={formState}
                    setFormState={setFormState}
                    serviceTypes={serviceTypes}
                    existingImages={existingImages}
                    onDeleteExistingImage={handleDeleteExistingImage}
                    selectedFiles={selectedFiles}
                    setSelectedFiles={setSelectedFiles}
                    submitting={submitting}
                    baseUrl={baseUrl}
                    onClose={() => setShowFormModal(false)}
                    onSubmit={handleFormSubmit}
                />

                {/* Delete Confirmation Modal Component */}
                <DeleteConfirmModal
                    showModal={showDeleteConfirm}
                    onClose={() => setShowDeleteConfirm(false)}
                    onConfirm={handleConfirmDelete}
                />

            </div>
        </div>
    );
}

export default ServicePage;