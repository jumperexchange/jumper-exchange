import i18next from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import React, { PropsWithChildren, useMemo } from 'react';
import { I18nextProvider, initReactI18next } from 'react-i18next';
import { defaultLang, localStorageKey } from '../../../shared/src/config';
import * as supportedLanguages from '../i18n';
import {
  LanguageKey,
  LanguageResources,
  LanguageTranslationResources,
} from '../types';

export const I18NProvider: React.FC<PropsWithChildren<{}>> = ({ children }) => {
  const i18n = useMemo(() => {
    let resources = (Object.keys(supportedLanguages) as LanguageKey[]).reduce(
      (resources, lng) => {
        resources[lng] = {
          translation: resources?.[lng]
            ? (resources?.[lng] as LanguageResources[LanguageKey])
            : supportedLanguages[lng],
        };
        return resources;
      },
      {} as LanguageTranslationResources,
    );

    let i18n = i18next.createInstance({
      lng: localStorage.getItem(localStorageKey.languageMode),
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

    if (!localStorage.getItem(localStorageKey.languageMode)) {
      i18n = i18n.use(LanguageDetector);
    }

    i18n.use(initReactI18next).init({
      resources,
      fallbackLng: defaultLang,
      react: { useSuspense: false },
    });

    return i18n;
  }, []);

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
};
