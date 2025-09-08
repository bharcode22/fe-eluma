export const extractStrings = (obj, texts = []) => {
    if (Array.isArray(obj)) {
        obj.forEach((item) => extractStrings(item, texts));
    } else if (obj && typeof obj === "object") {
        Object.values(obj).forEach((value) => extractStrings(value, texts));
    } else if (typeof obj === "string") {
        texts.push(obj);
    }
    return texts;
};

export const injectStrings = (obj, translations, index = { value: 0 }) => {
    if (Array.isArray(obj)) {
        return obj.map((item) => injectStrings(item, translations, index));
    } else if (obj && typeof obj === "object") {
        const newObj = {};
        for (const key in obj) {
        newObj[key] = injectStrings(obj[key], translations, index);
        }
        return newObj;
    } else if (typeof obj === "string") {
        return translations[index.value++] || obj;
    }
    return obj;
};
