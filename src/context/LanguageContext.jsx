import React, { createContext, useContext, useState, useEffect } from "react";

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
    const [targetLang, setTargetLang] = useState("id");
    const [translatedText, setTranslatedText] = useState("");

    const handleTranslate = async (text, lang = targetLang, format = "html") => {
        try {
        const res = await fetch(`${import.meta.env.VITE_LIBER_TRANSLATE_URL}/translate`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    q: text,
                    source: "auto",
                    target: lang,
                    format,
                }),
            }
        );

        console.log(res);

        const data = await res.json();
        return data.translatedText;
        } catch (err) {
            console.error("Translate error:", err);
            return text; 
        }
    };

    return (
        <LanguageContext.Provider
        value={{ targetLang, setTargetLang, handleTranslate, translatedText, setTranslatedText }}
        >
        {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const ctx = useContext(LanguageContext);
    if (!ctx) throw new Error("useLanguage must be used inside LanguageProvider");
    return ctx;
};
