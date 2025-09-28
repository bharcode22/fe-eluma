import React, {useEffect, useState} from 'react';
import Api from '../../../service/api.js';
import { useCurrency } from "../../../context/CurrencyContext.jsx";
import Bedroom from "../../../assets/svg/bedroom.svg";
import Duration from "../../../assets/svg/duration.svg";

const ContactUs = ({id}) => {
    const [property, setProperty] = useState(null);
    const [loading, setLoading] = useState(true);
    const { currency, exchangeRates, convertPrice, getCurrencySymbol } = useCurrency();

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

  if (loading) return <p>Loading...</p>;
  if (!property) return <p>Property not found.</p>;

  return (
    <div className="max-w-md mx-auto rounded-xl shadow-lg overflow-hidden">
      <div className="p-6 bg-secondary/65">
        <h3 className="text-xl font-semibold mb-4 text-center">Contact Property</h3>

        {/* Harga */}
        <div className='bg-secondary/65 shadow-2xl px-5 py-5 rounded-2xl'>
          <h2 className="text-xl font-semibold">Harga</h2>

          <div className="mt-5 space-y-2">
            <p className="text-xl">monthly price: {getCurrencySymbol()}{convertPrice(property.monthly_price, currency, exchangeRates)}</p>
            <p className="text-xl">yearly price: {getCurrencySymbol()}{convertPrice(property.yearly_price, currency, exchangeRates)}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
            <div className="flex items-center gap-2 p-3 bg-secondary/80 rounded-lg shadow-md">
              <img src={Bedroom} alt="bedroom icon" className="w-6 h-6" />
              <p className="text-lg">Bedrooms: <strong>{property.number_of_bedrooms}</strong></p>
            </div>
            <div className="flex items-center gap-2 p-3 bg-secondary/80 rounded-lg shadow-md">
              <img src={Bedroom} alt="bathroom icon" className="w-6 h-6" />
              <p className="text-lg">Bathrooms: <strong >{property.number_of_bathrooms}</strong></p>
            </div>
          </div>
        </div>

        {/* kontak */}
        <div className='bg-secondary/65 shadow-2xl px-5 py-5 rounded-2xl mt-5'>
          <h2 className="text-xl font-semibold">Kontak</h2>

        </div>

      </div>
    </div>
  );
};

export default ContactUs;
