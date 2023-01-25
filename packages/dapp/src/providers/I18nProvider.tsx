import { defaultLang } from '@transferto/shared/src';
import i18next from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import React, { PropsWithChildren, useMemo } from 'react';
import { I18nextProvider, initReactI18next } from 'react-i18next';
import * as supportedLanguages from '../i18n';
import { LanguageKey, LanguageTranslationResources } from '../types/i18n';

export const I18NProvider: React.FC<PropsWithChildren<{}>> = ({ children }) => {
  const i18n = useMemo(() => {
    let resources = (Object.keys(supportedLanguages) as LanguageKey[]).reduce(
      (resources, lng) => {
        resources[lng] = {
          translation: supportedLanguages[lng],
        };
        return resources;
      },
      {} as LanguageTranslationResources,
    );

    let i18n = i18next.createInstance({
      fallbackLng: defaultLang,
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
        fallbackLng: defaultLang,
        react: { useSuspense: false },
      });

    return i18n;
  }, []);

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
};
