let translations = {};
let currentLang = 'ro';

export async function loadTranslations(lang = 'ro') {
    if (lang === currentLang && Object.keys(translations).length > 0) return;
    currentLang = lang;
    const resp = await fetch(`src/i18n/${lang}.json`);
    translations = await resp.json();
}

function getNested(obj, path) {
  return path.split('.').reduce((o, k) => (o && o[k] !== undefined) ? o[k] : undefined, obj);
}

export function t(key) {
    const value = getNested(translations, key);
    return value !== undefined ? value : key;
}
