import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: {
          searchPlaceholder: 'Search Anything...',
          weAreHiring: 'We are hiring',
          offeredIn: 'offered in:',
          resultFor: 'Showing results for',
          filter: 'Filter',
        },
      },
      hi: {
        translation: {
          searchPlaceholder: 'कुछ भी खोजें...',
          weAreHiring: 'हम नौकरी पर रख रहे हैं',
          offeredIn: 'में उपलब्ध:',
          resultFor: 'परिणाम दिखा रहे हैं',
          filter: 'फ़िल्टर',
        },
      },
      bn: {
        translation: {
          searchPlaceholder: 'যেকোনো কিছু খুঁজুন...',
          weAreHiring: 'আমরা নিয়োগ করছি',
          offeredIn: 'প্রদত্ত:',
          resultFor: 'এর জন্য ফলাফল দেখানো হচ্ছে',
          filter: 'ফিল্টার',
        },
      },
      ar: {
        translation: {
          searchPlaceholder: 'ابحث عن أي شيء...',
          weAreHiring: 'نحن نوظف',
          offeredIn: 'مقدمة بـ:',
          resultFor: 'عرض النتائج لـ',
          filter: 'عامل التصفية',
        },
      },
    },
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
