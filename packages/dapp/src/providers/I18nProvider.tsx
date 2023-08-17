import { defaultLang } from '@transferto/shared/src/config';
import i18next from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import React, { PropsWithChildren, useMemo } from 'react';
import { I18nextProvider, initReactI18next } from 'react-i18next';
import * as supportedLanguages from '../i18n';
import { useSettingsStore } from '../stores/settings';
import {
  LanguageKey,
  LanguageResources,
  LanguageTranslationResources,
} from '../types';

export const I18NProvider: React.FC<PropsWithChildren<{}>> = ({ children }) => {
  const languageMode = useSettingsStore((state) => state.languageMode);

  const i18n = useMemo(() => {
    let resources = (Object.keys(supportedLanguages) as LanguageKey[]).reduce(
      (resources, lng) => {
        resources[lng] = {
          translation:
            (resources[lng] as LanguageResources[LanguageKey]) ||
            supportedLanguages[lng],
        };
        return resources;
      },
      {} as LanguageTranslationResources,
    );

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

    i18n.use(initReactI18next).init({
      resources,
      fallbackLng: defaultLang,
      react: { useSuspense: false },
    });

    return i18n;
  }, [languageMode]);

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
};
