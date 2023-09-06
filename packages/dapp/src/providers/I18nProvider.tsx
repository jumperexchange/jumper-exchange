import { defaultLang } from '@transferto/shared/src/config';
import i18next from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import React, { PropsWithChildren, useMemo } from 'react';
import { I18nextProvider, initReactI18next } from 'react-i18next';
import { useSettingsStore } from '../stores/settings';
import resourcesToBackend from 'i18next-resources-to-backend';
import en from '../i18n/en/translation.json';

export const I18NProvider: React.FC<PropsWithChildren<{}>> = ({ children }) => {
  const languageMode = useSettingsStore((state) => state.languageMode);

  const resources = {
    en: {
      translation: en,
    },
  };

  const i18n = useMemo(() => {
    let i18n = i18next.createInstance({
      lng: languageMode,
      fallbackLng: defaultLang,
      lowerCaseLng: true,
      interpolation: {
        escapeValue: false,
      },
      resources,
      detection: {
        caches: [],
      },
    });

    if (!languageMode) {
      i18n = i18n.use(LanguageDetector);
    }

    i18n
      .use(LanguageDetector)
      .use(
        resourcesToBackend((language: string, namespace: string) => {
          return import(`../i18n/${language}/${namespace}.json`);
        }),
      )
      .use(initReactI18next)
      .init({
        // required to be true for paritally loading languages from resources and backend
        partialBundledLanguages: true,
        resources,
        fallbackLng: defaultLang,
        react: { useSuspense: false },
        ns: ['translation'],
      });

    return i18n;
  }, [languageMode]);

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
};
