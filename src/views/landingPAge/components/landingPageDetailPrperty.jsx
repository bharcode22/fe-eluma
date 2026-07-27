import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Api from '../../../service/api.js';
import { useLanguage } from "../../../context/LanguageContext.jsx";
import { translateNodes } from "../../../utils/translator.js";
import { useCurrency } from "../../../context/CurrencyContext.jsx";
import NavbarLandingPage from "../../../components/NavbarLandingPage.jsx";
import FooterLandingPage from "../../../components/FooterLandingPage.jsx";
import ContactUs from "./ContactUs.jsx";

import PropertyDetailHeader from "./detailProperty/PropertyDetailHeader.jsx";
import PropertyStats from "./detailProperty/PropertyStats.jsx";
import PropertyGallery from "./detailProperty/PropertyGallery.jsx";
import PropertyTabs from "./detailProperty/PropertyTabs.jsx";
import PropertyHostCard from "./detailProperty/PropertyHostCard.jsx";

import { ChevronLeft, Sparkles, AlertCircle, RefreshCw } from 'lucide-react';

const LoadingSpinner = () => (
  <div className="flex justify-center items-center min-h-[60vh]">
    <div className="text-center space-y-4">
      <div className="relative mx-auto w-16 h-16">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary/20 border-t-primary"></div>
        <Sparkles className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-primary animate-pulse" size={20} />
      </div>
      <p className="text-lg font-medium text-primary animate-pulse">Loading Property Details...</p>
    </div>
  </div>
);

const ErrorMessage = ({ message }) => (
  <div className="flex justify-center items-center min-h-[60vh] px-4">
    <div className="text-center space-y-4 max-w-md bg-base-100 p-8 rounded-3xl border border-base-300 shadow-xl">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-error/10 text-error">
        <AlertCircle className="w-8 h-8" />
      </div>
      <div className="space-y-2">
        <h3 className="text-xl font-bold text-error">Oops! Something went wrong</h3>
        <p className="text-sm text-base-content/70">{message}</p>
      </div>
      <button
        onClick={() => window.location.reload()}
        className="btn btn-primary gap-2 rounded-xl text-white w-full"
      >
        <RefreshCw size={18} />
        Try Again
      </button>
    </div>
  </div>
);

function LandingPageDetailProperty() {
  const { id } = useParams();
  const navigate = useNavigate();
  const divRef = useRef(null);
  const { lang } = useLanguage();
  const { currency, exchangeRates, convertPrice, getCurrencySymbol } = useCurrency();

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sanitizedHTML, setSanitizedHTML] = useState('');

  const baseUrl = Api.defaults.baseURL;

  useEffect(() => {
    if (divRef.current) {
      translateNodes(divRef.current, lang);
    }
  }, [lang]);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const res = await Api.get(`/property/${id}`);
        const data = res.data?.data;
        const propObj = Array.isArray(data) ? data[0] : data;
        setProperty(propObj);
      } catch (error) {
        console.error('Failed to load property data:', error);
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
          console.error("Failed to import DOMPurify:", err);
          if (isMounted) setSanitizedHTML(property.description);
        }
      }
    };

    sanitize();
    return () => {
      isMounted = false;
    };
  }, [property]);

  if (loading) return <LoadingSpinner />;
  if (!property) return <ErrorMessage message="Property not found. Please check the property ID or try again later." />;

  // Relation helper
  const getFirstOrObj = (val) => (Array.isArray(val) ? val[0] : val) || {};

  const locationData = getFirstOrObj(property.location);
  const availabilityData = getFirstOrObj(property.availability);
  const facilitiesData = getFirstOrObj(property.facilities);
  const ownerData = getFirstOrObj(property.propertiesOwner);
  const additionalData = getFirstOrObj(property.additionalDetails);
  const parkingData = getFirstOrObj(additionalData.Parking || additionalData.parking);
  const viewData = getFirstOrObj(additionalData.View || additionalData.view);

  // Price calculations
  const monthlyPriceVal = property.monthly_price || property.price || 0;
  const yearlyPriceVal = property.yearly_price || 0;

  const displayMonthlyPrice = convertPrice(monthlyPriceVal, currency, exchangeRates);
  const displayYearlyPrice = yearlyPriceVal ? convertPrice(yearlyPriceVal, currency, exchangeRates) : 0;
  const currencySymbol = getCurrencySymbol();

  return (
    <div ref={divRef} className="min-h-screen bg-gradient-to-b from-base-100 via-base-200/50 to-base-100 flex flex-col">
      <NavbarLandingPage />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 flex-grow w-full">

        {/* Back Button */}
        <div>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="btn btn-ghost btn-sm gap-2 text-base-content/70 hover:bg-base-200 rounded-xl"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
        </div>

        {/* Header (Title, Code, Map, Pricing) */}
        <PropertyDetailHeader
          property={property}
          locationData={locationData}
          displayMonthlyPrice={displayMonthlyPrice}
          displayYearlyPrice={displayYearlyPrice}
          yearlyPriceVal={yearlyPriceVal}
          currencySymbol={currencySymbol}
        />

        {/* Property Stats Bar */}
        <PropertyStats property={property} />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            <PropertyGallery
              images={property.images}
              baseUrl={baseUrl}
            />

            <PropertyTabs
              property={property}
              sanitizedHTML={sanitizedHTML}
              facilitiesData={facilitiesData}
              availabilityData={availabilityData}
              additionalData={additionalData}
              parkingData={parkingData}
              viewData={viewData}
            />

            {/* <PropertyHostCard ownerData={ownerData} /> */}
          </div>

          {/* Right Column (Contact Sticky Widget) */}
          <div className="lg:col-span-1">
            <div className="sticky top-20 space-y-6">
              <ContactUs id={id} />
            </div>
          </div>

        </div>

      </div>

      <FooterLandingPage />
    </div>
  );
}

export default LandingPageDetailProperty;