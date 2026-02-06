import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from '../locales/en.json';
import ko from '../locales/ko.json';
import ja from '../locales/ja.json';
import zh from '../locales/zh.json';
import fr from '../locales/fr.json';
import es from '../locales/es.json';
import pt from '../locales/pt.json';

export const SUPPORTED_LANGUAGES = ['ko', 'ja', 'zh', 'en', 'fr', 'es', 'pt'];
export const LANGUAGE_STORAGE_KEY = 'quiz_language';

const storedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY);
const defaultLanguage = SUPPORTED_LANGUAGES.includes(storedLanguage) ? storedLanguage : 'en';

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    ko: { translation: ko },
    ja: { translation: ja },
    zh: { translation: zh },
    fr: { translation: fr },
    es: { translation: es },
    pt: { translation: pt }
  },
  lng: defaultLanguage,
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false
  }
});

export default i18n;
