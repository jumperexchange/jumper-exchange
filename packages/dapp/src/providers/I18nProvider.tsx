import { defaultLang } from '@transferto/shared/src';
import i18next from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import React, { PropsWithChildren, useMemo } from 'react';
import { I18nextProvider, initReactI18next } from 'react-i18next';
import { de, en, fr, it, zh } from '../i18n';

export const I18NProvider: React.FC<PropsWithChildren<{}>> = ({ children }) => {
  const i18n = useMemo(() => {
    let resources = {
      en: {
        translation: en,
      },
      de: {
        translation: de,
      },
      it: {
        translation: it,
      },
      zh: {
        translation: zh,
      },
      fr: {
        translation: fr,
      },
    };

    let i18n = i18next.createInstance({
      fallbackLng: defaultLang.value,
      supportedLngs: ['de', 'en', 'it', 'zh', 'fr'],
      lowerCaseLng: true,
      interpolation: {
        escapeValue: false,
      },
      resources,
    });

    const DETECTION_OPTIONS = {
      order: ['localStorage', 'cookie', 'sessionStorage'],
    };

    i18n
      .use(initReactI18next)
      .use(LanguageDetector)
      .init({
        detection: DETECTION_OPTIONS,
        resources,
        fallbackLng: defaultLang.value,
        react: { useSuspense: false },
      });

    return i18n;
  }, []);

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
};
