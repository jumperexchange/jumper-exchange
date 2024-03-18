'use client';

import i18next from 'i18next';
import resourcesToBackend from 'i18next-resources-to-backend';
import { initReactI18next } from 'react-i18next';
// import LocizeBackend from 'i18next-locize-backend'
import type { LanguageKey, LanguageResources } from '@/types/i18n';
import LanguageDetector from 'i18next-browser-languagedetector';
import { locales } from './i18next-locales';
import { fallbackLng, getOptions, runsOnServerSide } from './i18next-settings';
import translation from './locales_jumper/en/translation.json';

const resources: Record<string, any> = {
  en: {
    translation,
  },
};

const translations = (
  Object.keys(translation as LanguageResources) as LanguageKey[]
).forEach((language: LanguageKey) => {
  resources[language] = {
    ...resources[language],
    language: (locales as LanguageResources)[language],
  };
});

// on client side the normal singleton is ok
i18next
  .use(initReactI18next)
  .use(LanguageDetector)
  .use(
    resourcesToBackend((language: string, namespace: string) => translations),
  )
  // .use(LocizeBackend) // locize backend could be used on client side, but prefer to keep it in sync with server side
  .init({
    ...getOptions(),
    lng: undefined, // let detect the language on client side
    detection: {
      order: ['path', 'htmlTag', 'cookie', 'navigator'],
    },
    preload: runsOnServerSide ? locales : [],
    // required to be true for paritally loading languages from resources and backend
    partialBundledLanguages: true,
    resources,
    fallbackLng: fallbackLng,
    react: { useSuspense: false },
    // ns: ['translation', 'language'],
    returnEmptyString: false,
  });
