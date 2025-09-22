import { createContext, useContext, useState, useEffect } from "react";
import { translateNodes } from "../utils/translator";

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
    const [lang, setLang] = useState(() => {
        const storedLang = localStorage.getItem("appLanguage");
        console.log("Initializing language from localStorage:", storedLang);
        return storedLang || "en";
    });

    useEffect(() => {
        console.log("Saving language to localStorage:", lang);
        localStorage.setItem("appLanguage", lang);
        // Panggil fungsi terjemahan setiap kali bahasa berubah
        translateNodes(document.body, lang);
    }, [lang]);

    return (
        <LanguageContext.Provider value={{ lang, setLang }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => useContext(LanguageContext);
