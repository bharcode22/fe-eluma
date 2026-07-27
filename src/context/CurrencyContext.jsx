import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

export const CurrencyContext = createContext(null);

export const CurrencyProvider = ({ children }) => {
    const [currency, setCurrency] = useState(() => {
        try {
            const storedCurrency = localStorage.getItem('currency');
            return storedCurrency || 'IDR';
        } catch {
            return 'IDR';
        }
    });
    const [exchangeRates, setExchangeRates] = useState({});

    useEffect(() => {
        try {
            localStorage.setItem('currency', currency);
        } catch (err) {
            console.warn('Failed to save currency to localStorage:', err);
        }
    }, [currency]);

    useEffect(() => {
        const fetchExchangeRates = async () => {
            try {
                const response = await axios.get('https://api.exchangerate-api.com/v4/latest/IDR');
                setExchangeRates(response.data?.rates || {});
            } catch (error) {
                console.error("Error fetching exchange rates:", error);
            }
        };
        fetchExchangeRates();
    }, []);

    const convertPrice = (price) => {
        if (!price) return 0;
        const rate = exchangeRates[currency];
        if (!rate) return price;
        return Math.round(price * rate);
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
                return 'Rp';
        }
    };

    return (
        <CurrencyContext.Provider value={{ currency, setCurrency, exchangeRates, convertPrice, getCurrencySymbol }}>
            {children}
        </CurrencyContext.Provider>
    );
};

export const useCurrency = () => {
    const context = useContext(CurrencyContext);
    if (!context) {
        return {
            currency: 'IDR',
            setCurrency: () => {},
            exchangeRates: {},
            convertPrice: (price) => price || 0,
            getCurrencySymbol: () => 'Rp'
        };
    }
    return context;
};