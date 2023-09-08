import { defaultLang } from '@transferto/shared/src/config';
import i18next from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import resourcesToBackend from 'i18next-resources-to-backend';
import React, { PropsWithChildren, useMemo } from 'react';
import { I18nextProvider, initReactI18next } from 'react-i18next';
import { TrackingUserProperties } from '../const';
import { useUserTracking } from '../hooks';
import * as supportedLanguages from '../i18n';
import translation from '../i18n/en/translation.json';
import { useSettingsStore } from '../stores/settings';
import { LanguageKey, LanguageResources } from '../types';

export const I18NProvider: React.FC<PropsWithChildren<{}>> = ({ children }) => {
  const languageMode = useSettingsStore((state) => state.languageMode);
  const { trackAttribute } = useUserTracking();

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

  if (!languageMode && i18n?.resolvedLanguage) {
    trackAttribute({
      data: {
        [TrackingUserProperties.Language]: i18n.language,
        [TrackingUserProperties.DefaultLanguage]: i18n.language,
      },
    });
  }

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
};
