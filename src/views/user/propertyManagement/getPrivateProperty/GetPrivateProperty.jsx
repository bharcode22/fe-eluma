/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { Link } from 'react-router-dom';

import { useLanguage } from "../../../../context/LanguageContext.jsx";
import { useCurrency } from "../../../../context/CurrencyContext.jsx";
import { translateNodes } from "../../../../utils/translator.js";

import location from '../../../../assets/svg/location.svg';
import bedroom from '../../../../assets/svg/bedroom.svg';
import guest from '../../../../assets/svg/guest.svg';
import calender from '../../../../assets/svg/calender.svg';
import duration from '../../../../assets/svg/duration.svg';
import api from '../../../../service/api.js';

const baseUrl = api.defaults.baseURL;

const GetMyProperty = () => {
	const [properties, setProperties] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [carouselIndexes, setCarouselIndexes] = useState({});
	const [priceView, setPriceView] = useState('monthly');
	const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
	const [propertyToDelete, setPropertyToDelete] = useState(null);
	const token = Cookies.get('token');
	const divRef = useRef(null);
	const { lang } = useLanguage();
	const { currency } = useCurrency();

	useEffect(() => {
		if (divRef.current) {
			translateNodes(divRef.current, lang);
		}
	}, [lang]);

	const exchangeRates = {
		IDR: 1,
		USD: 15000, // Example rate: 1 USD = 15000 IDR
		EUR: 16500, // Example rate: 1 EUR = 16500 IDR
	};

	const convertPrice = (priceInIDR) => {
		if (!priceInIDR) return 0;
		const rate = exchangeRates[currency] || 1;
		return (priceInIDR / rate).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 });
	};

	const getCurrencySymbol = () => {
		switch (currency) {
			case 'IDR':
				return 'Rp';
			case 'USD':
				return '$';
			case 'EUR':
				return '€';
			default:
				return '';
		}
	};

	const fetchData = async () => {
		try {
		const response = await axios.get(`${baseUrl}/property/my/private`, {
			headers: { Authorization: `Bearer ${token}` },
		});
		setProperties(response.data.data || []);

		const initialIndexes = {};
		response.data.data.forEach((property) => {
			initialIndexes[property.id] = 0;
		});
		setCarouselIndexes(initialIndexes);
		} catch (err) {
		setError(err.response?.data?.message || err.message);
		} finally {
		setLoading(false);
		}
	};

	const DeleteData = (propertyId) => {
		setPropertyToDelete(propertyId);
		setShowDeleteConfirm(true);
	};

	const handleConfirmDelete = async () => {
		try {
			await axios.delete(`${baseUrl}/property/${propertyToDelete}`, {
				headers: { Authorization: `Bearer ${token}` },
			});
			fetchData();
			setShowDeleteConfirm(false);
			setPropertyToDelete(null);
		} catch (err) {
			setError(err.response?.data?.message || err.message);
			setShowDeleteConfirm(false);
			setPropertyToDelete(null);
		}
	};

	const handleCancelDelete = () => {
		setShowDeleteConfirm(false);
		setPropertyToDelete(null);
	};

	const ToglePropertyStatus = async (propertyId) => {
		try {
			await axios.put(
				`${baseUrl}/property/status/${propertyId}`,
				{},
				{
				headers: { Authorization: `Bearer ${token}` },
				}
			);

			fetchData();
		} catch (err) {
			setError(err.response?.data?.message || err.message);
		}
	};

	useEffect(() => {
		if (!token) {
		setError('Token tidak ditemukan. Harap login terlebih dahulu.');
		setLoading(false);
		return;
		}

		fetchData();
	}, []);

	const handlePrev = (propertyId, totalImages) => {
		setCarouselIndexes((prevIndexes) => ({
		...prevIndexes,
		[propertyId]: prevIndexes[propertyId] === 0
			? totalImages - 1
			: prevIndexes[propertyId] - 1,
		}));
	};

	const handleNext = (propertyId, totalImages) => {
		setCarouselIndexes((prevIndexes) => ({
		...prevIndexes,
		[propertyId]: (prevIndexes[propertyId] + 1) % totalImages,
		}));
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

	if (error) {
		return (
		<div className="flex justify-center items-center min-h-screen">
			<div className="alert alert-error text-center p-4">
			<span>{error}</span>
			</div>
		</div>
		);
	}

	return (
		<div ref={divRef} className="container mx-auto p-4">
			<div className="mb-6">
				<h2 className="text-3xl font-bold text-accent mb-2">Properti Private Saya</h2>
				<p className="text-gray-600">Private Property</p>
			</div>

			{properties.length === 0 ? (
				<p className="text-center text-gray-500">Tidak ada properti yang ditemukan.</p>
			) : (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{properties.map((property) => {
						const currentIndex = carouselIndexes[property.id] || 0;

						return (
							<div key={property.id} className="bg-white/90 backdrop-blur-2xl rounded-3xl shadow-2xl overflow-hidden">
								{/* Carousel */}
								<div className="relative w-full h-64 overflow-hidden">
									<div
										className="flex transition-transform duration-700 ease-in-out h-full"
										style={{ transform: `translateX(-${currentIndex * 100}%)` }}
									>
										{property.images.map((image) => (
											<img
												key={image.id}
												src={`${baseUrl}/propertyImages/${image.imageName}`}
												alt={image.imageName}
												className="w-full h-64 object-cover flex-shrink-0"
											/>
										))}
									</div>

									<div className="absolute top-3 right-3 flex gap-3">
										<div>
											<Link to={`/user/update/property/${property.id}`} className="backdrop-blur-lg bg-primary bg-opacity-70 text-primary-content px-3 py-1 rounded-md hover:bg-primary-focus transition-colors">
												<span>Update</span>
											</Link>
										</div>

										<div>
											<Link onClick={() => DeleteData(property.id)} className="backdrop-blur-lg bg-error bg-opacity-70 text-error-content px-3 py-1 rounded-md hover:bg-red-700 transition-colors" >
												<span>Hapus</span>
											</Link>
										</div>

										<div>
											<Link onClick={() => ToglePropertyStatus(property.id)} className="backdrop-blur-lg bg-info bg-opacity-70 text-info-content px-3 py-1 rounded-md hover:bg-blue-700 transition-colors" >
												<span>Public</span>
											</Link>
										</div>
									</div>

									{/* Carousel Nav */}
									<div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between z-10">
										<button onClick={() => handlePrev(property.id, property.images.length)} className="btn btn-circle backdrop-blur-xs bg-accent/70 hover:bg-accent/50">
											❮
										</button>
										<button onClick={() => handleNext(property.id, property.images.length)} className="btn btn-circle backdrop-blur-xs bg-accent/70 hover:bg-accent/50">
											❯
										</button>
									</div>
								</div>

								<div className="p-4">
									<h2 className="text-xl font-bold mb-2 text-primary">{property.property_code}</h2>
									<hr className="border-t-2 border-accent pr-10" />

									<div className="flex items-center justify-between mb-4 mt-4">
										<div>
											<div className="flex items-center gap-3 mb-2">
												<img src={location} alt="Location" className='w-5 h-5' />
												<p className="text-primary font-bold">{property.location[0]?.general_area || '-'}</p>
											</div>

											<div className="flex items-center gap-3 mb-2">
												<img src={bedroom} alt="Bedroom" className='w-5 h-5' />
												<p className="text-primary font-bold">{property.number_of_bedrooms} kamar tidur</p>
											</div>

											<div className="flex items-center gap-3 mb-2">
												<img src={guest} alt="Guests" className='w-5 h-5' />
												<p className="text-primary font-bold">Max Guests: {property.maximum_guest}</p>
											</div>

											<div className="flex items-center gap-3 mb-2">
												<img src={calender} alt="Availability" className='w-5 h-5' />
												<p className="text-primary font-bold">
													{property.availability.length > 0
														? `${new Date(property.availability[0].available_from).toLocaleDateString()} - ${new Date(property.availability[0].available_to).toLocaleDateString()}`
														: '-'}
												</p>
											</div>

											<div className="flex items-center gap-3 mb-2">
												<img src={duration} alt="Duration" className='w-5 h-5' />
												<p className="text-primary font-bold">Min stay: {property.minimum_stay} bulan</p>
											</div>
										</div>
									</div>

									<div className="flex flex-row justify-between items-center bg-secondary/65 p-4 rounded-2xl shadow-xl">
										<div className="border-2 border-accent p-4 rounded-lg shadow-md">
											<p className="font-bold text-primary text-xl">
												{getCurrencySymbol()} {convertPrice(priceView === 'monthly' ? property.monthly_price : property.yearly_price)}
											</p>
											<p className="text-sm text-primary">/ {priceView === 'monthly' ? 'Bulan' : 'Tahun'}</p>
										</div>

										<div>
											<button onClick={() => setPriceView('monthly')} className={`px-2 py-1 rounded-l-lg border border-accent ${priceView === 'monthly' ? 'bg-accent text-white' : 'bg-white text-accent'}`}>
												Bulan
											</button>
											<button onClick={() => setPriceView('yearly')} className={`px-2 py-1 rounded-r-lg border border-accent ${priceView === 'yearly' ? 'bg-accent text-white' : 'bg-white text-accent'}`}>
												Tahun
											</button>
										</div>
									</div>

									<div className="flex justify-end text-accent mt-5 gap-5">
										<Link to={`/detail/${property.id}`} className="font-bold flex gap-2 items-center">
											<span>Detail</span>
											<span>❯</span>
										</Link>
									</div>
								</div>
							</div>
						);
					})}
				</div>
			)}
			{showDeleteConfirm && (
				<div className="fixed inset-0 bg-slate-800/15 backdrop-blur-sm flex items-center justify-center z-50">
					<div className="bg-secondary/50 backdrop-blur-2xl rounded-lg p-6 w-full max-w-md text-center">
						<h3 className="text-lg font-bold mb-4">Konfirmasi Hapus</h3>
						<p className="mb-6">Apakah Anda yakin ingin menghapus properti ini?</p>
						<div className="flex justify-center gap-4">
							<button
								onClick={handleCancelDelete}
								className="btn bg-gray-300 hover:bg-gray-400 text-gray-800"
							>
								Batal
							</button>
							<button
								onClick={handleConfirmDelete}
								className="btn bg-error hover:bg-red-700 text-white"
							>
								Hapus
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default GetMyProperty;
