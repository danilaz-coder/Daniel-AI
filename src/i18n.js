import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import ru from './locales/ru.json';
import en from './locales/en.json';
import zh from './locales/zh.json';
import tr from './locales/tr.json';
import hi from './locales/hi.json';

i18n
  .use(initReactI18next)
  .init({
    compatibilityJSON: 'v3',
    resources: {
      ru: { translation: ru },
      en: { translation: en },
      zh: { translation: zh },
      tr: { translation: tr },
      hi: { translation: hi },
    },
    lng: 'ru',
    fallbackLng: 'ru',
    interpolation: { escapeValue: false },
  });

export default i18n;