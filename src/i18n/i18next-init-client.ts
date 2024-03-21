'use client';

import translation from './translations/en/translation.json';

const resources: Record<string, any> = {
  en: {
    translation,
  },
};

// const translations = (
//   Object.keys(translation as LanguageResources) as LanguageKey[]
// ).forEach((language: LanguageKey) => {
//   resources[language] = {
//     ...resources[language],
//     language: (locales as LanguageResources)[language],
//   };
// });
