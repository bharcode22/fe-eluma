import React, { createContext, useContext, useState, useEffect } from "react";
import { translateNodes } from "../utils/translator";

const LanguageContext = createContext(null);

export const LanguageProvider = ({ children }) => {
    const [lang, setLang] = useState(() => {
        try {
            const storedLang = localStorage.getItem("appLanguage");
            return storedLang || "en";
        } catch (err) {
            console.warn("LanguageProvider: Failed to access localStorage", err);
            return "en";
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem("appLanguage", lang);
            if (typeof translateNodes === 'function') {
                translateNodes(document.body, lang);
            }
        } catch (err) {
            console.warn("LanguageProvider: Error in translation effect", err);
        }
    }, [lang]);

    return (
        <LanguageContext.Provider value={{ lang, setLang }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        return { lang: 'en', setLang: () => {} };
    }
    return context;
};
