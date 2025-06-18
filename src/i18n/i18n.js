let translations = {};
let currentLang = 'ro';

export async function loadTranslations(lang = 'ro') {
    if (lang === currentLang && Object.keys(translations).length > 0) return;
    currentLang = lang;
    const resp = await fetch(`src/i18n/${lang}.json`);
    translations = await resp.json();
}

export function t(key) {
    return translations[key] || key;
}
