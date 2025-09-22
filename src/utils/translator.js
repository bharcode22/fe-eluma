import axios from "axios";

const VITE_LIBER_TRANSLATE_URL = `${import.meta.env.VITE_LIBER_TRANSLATE_URL}/translate`;

const getCache = (key) => {
  const data = localStorage.getItem("translationCache");
  if (data) {
    const cache = JSON.parse(data);
    return cache[key] || null;
  }
  return null;
};

const setCache = (key, value) => {
  const data = localStorage.getItem("translationCache");
  let cache = {};
  if (data) {
    cache = JSON.parse(data);
  }
  cache[key] = value;
  localStorage.setItem("translationCache", JSON.stringify(cache));
};

export const translateNodes = async (node, targetLang) => {
  if (node.nodeType === Node.TEXT_NODE && node.nodeValue.trim() !== "") {
    const cacheKey = `${node.nodeValue}_${targetLang}`;
    const cached = getCache(cacheKey);

    if (cached) {
      node.nodeValue = cached;
    } else {
      try {
        console.log("Attempting to translate:", node.nodeValue, "to", targetLang);
        const res = await axios.post(VITE_LIBER_TRANSLATE_URL, {
          q: node.nodeValue,
          source: "en", // Mengubah 'auto' menjadi 'en' (English) sebagai bahasa sumber eksplisit.
          target: targetLang,
          format: "text",
        });

        const translated = res.data.translatedText;
        node.nodeValue = translated;
        setCache(cacheKey, translated);
      } catch (err) {
        console.error("Error translating text:", err.response ? err.response.data : err.message);
      }
    }
  } else {
    for (const child of node.childNodes) {
      await translateNodes(child, targetLang);
    }
  }
};
