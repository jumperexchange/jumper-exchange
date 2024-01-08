import i18next from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import resourcesToBackend from 'i18next-resources-to-backend';
import type { PropsWithChildren } from 'react';
import React, { useMemo } from 'react';
import { I18nextProvider, initReactI18next } from 'react-i18next';
import { defaultLang } from 'src/config';
import { useSettingsStore } from 'src/stores';
import type { LanguageKey, LanguageResources } from 'src/types';
import * as supportedLanguages from '../i18n';
import translation from '../i18n/en/translation.json';

export const I18NProvider: React.FC<PropsWithChildren<{}>> = ({ children }) => {
  const languageMode = useSettingsStore((state) => state.languageMode);

  const i18n = useMemo(() => {
    const resources: Record<string, any> = {
      en: {
        translation,
      },
    };

    (
      Object.keys(supportedLanguages as LanguageResources) as LanguageKey[]
    ).forEach((language: LanguageKey) => {
      resources[language] = {
        ...resources[language],
        language: (supportedLanguages as LanguageResources)[language],
      };
    });

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
      returnEmptyString: false,
    });

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
