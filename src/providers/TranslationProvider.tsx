'use client';

import type { Resource } from 'i18next';
import { createInstance } from 'i18next';
import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { I18nextProvider } from 'react-i18next';
import { fallbackLng } from 'src/i18n';
import initTranslations from '../app/i18n';

export default function TranslationsProvider({
  children,
  locale,
  namespaces,
  resources,
}: {
  children: ReactNode;
  locale?: string;
  namespaces: string[];
  resources?: Resource;
}) {
  const i18n = createInstance();

  initTranslations(locale || fallbackLng, namespaces, i18n, resources);

  useEffect(() => {
    const i18nLanguageChangedListener = function (lng: string) {
      document.documentElement.setAttribute('lang', lng); //set the lang here
    };

    i18n.on('languageChanged', i18nLanguageChangedListener);

    // set the initial language
    document.documentElement.setAttribute('lang', locale!); //set the lang here

    return () => {
      i18n.off('languageChanged', i18nLanguageChangedListener);
    };
  }, []);

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
