import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

export const CurrencyContext = createContext();

export const CurrencyProvider = ({ children }) => {
    const [currency, setCurrency] = useState(() => {
        const storedCurrency = localStorage.getItem('currency');
        return storedCurrency || 'IDR'; // Default to Indonesian Rupiah
    });
    const [exchangeRates, setExchangeRates] = useState({});

    useEffect(() => {
        localStorage.setItem('currency', currency);
    }, [currency]);

    useEffect(() => {
        const fetchExchangeRates = async () => {
            try {
                const response = await axios.get('https://api.exchangerate-api.com/v4/latest/IDR'); // Ganti dengan API nilai tukar yang sesuai
                setExchangeRates(response.data.rates);
            } catch (error) {
                console.error("Error fetching exchange rates:", error);
            }
        };
        fetchExchangeRates();
    }, []);

    const convertPrice = (price) => {
        if (!price || !exchangeRates[currency]) return price; // Handle cases where price or exchange rate is not available
        return (price * exchangeRates[currency]).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 });
    };

    const getCurrencySymbol = () => {
        switch (currency) {
            case 'IDR':
                return 'Rp';
            case 'USD':
                return '$';
            case 'EUR':
                return '€';
            case 'JPY':
                return '¥';
            default:
                return '';
        }
    };

    return (
        <CurrencyContext.Provider value={{ currency, setCurrency, exchangeRates, convertPrice, getCurrencySymbol }}>
            {children}
        </CurrencyContext.Provider>
    );
};

export const useCurrency = () => useContext(CurrencyContext);