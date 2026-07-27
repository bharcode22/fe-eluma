import axios from "axios";

// Ambil URL server penerjemah dari .env
const getTranslateUrl = () => {
  const envUrl = import.meta.env.VITE_LIBER_TRANSLATE_URL;
  if (!envUrl) return null;
  const cleaned = envUrl.replace(/\/+$/, "");
  return cleaned.endsWith("/translate") ? cleaned : `${cleaned}/translate`;
};

const VITE_LIBER_TRANSLATE_URL = getTranslateUrl();

const getCache = (key) => {
  try {
    const data = localStorage.getItem("translationCache");
    if (data) {
      const cache = JSON.parse(data);
      return cache[key] || null;
    }
  } catch (e) {
    return null;
  }
  return null;
};

const setCache = (key, value) => {
  try {
    const data = localStorage.getItem("translationCache");
    let cache = {};
    if (data) {
      cache = JSON.parse(data);
    }
    cache[key] = value;
    localStorage.setItem("translationCache", JSON.stringify(cache));
  } catch (e) {
    // Ignore storage errors
  }
};

export const translateNodes = async (node, targetLang) => {
  // Jika bahasa tujuan adalah bahasa asal ('id') atau URL translate belum diset, lewati
  if (!node || !targetLang || targetLang === "id" || !VITE_LIBER_TRANSLATE_URL) return;

  if (node.nodeType === Node.TEXT_NODE && node.nodeValue && node.nodeValue.trim() !== "") {
    const textToTranslate = node.nodeValue.trim();
    const cacheKey = `${textToTranslate}_${targetLang}`;
    const cached = getCache(cacheKey);

    if (cached) {
      node.nodeValue = node.nodeValue.replace(textToTranslate, cached);
    } else {
      try {
        const res = await axios.post(
          VITE_LIBER_TRANSLATE_URL,
          {
            q: textToTranslate,
            source: "id",
            target: targetLang,
            format: "text",
          },
          {
            headers: { "Content-Type": "application/json" },
            timeout: 3000,
          }
        );

        const translated = res.data?.translatedText || res.data?.translated_text;
        if (translated) {
          node.nodeValue = node.nodeValue.replace(textToTranslate, translated);
          setCache(cacheKey, translated);
        }
      } catch (err) {
        // Catat warning saja agar tidak memenuhi console jika server offline / 404
        console.warn(`Translation service unavailable (${VITE_LIBER_TRANSLATE_URL}):`, err.message);
      }
    }
  } else if (node.childNodes && node.childNodes.length > 0) {
    for (const child of Array.from(node.childNodes)) {
      await translateNodes(child, targetLang);
    }
  }
};
