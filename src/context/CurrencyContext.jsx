import React, { createContext, useState, useEffect, useContext } from 'react';

export const CurrencyContext = createContext();

export const CurrencyProvider = ({ children }) => {
    const [currency, setCurrency] = useState(() => {
        const storedCurrency = localStorage.getItem('currency');
        console.log("Initializing currency from localStorage:", storedCurrency);
        return storedCurrency || 'IDR'; // Default to Indonesian Rupiah
    });

    useEffect(() => {
        console.log("Saving currency to localStorage:", currency);
        localStorage.setItem('currency', currency);
    }, [currency]);

    return (
        <CurrencyContext.Provider value={{ currency, setCurrency }}>
            {children}
        </CurrencyContext.Provider>
    );
};

export const useCurrency = () => useContext(CurrencyContext);