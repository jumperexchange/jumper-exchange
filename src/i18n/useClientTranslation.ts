'use client';

import type { FlatNamespace, KeyPrefix } from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { useContext, useEffect, useState } from 'react';
import type {
  FallbackNs,
  UseTranslationOptions,
  UseTranslationResponse,
} from 'react-i18next';
import {
  initReactI18next,
  useTranslation as useTranslationOrg,
} from 'react-i18next';
import { ClientTranslationContext, locales } from '.';

import i18next from 'i18next';
import resourcesToBackend from 'i18next-resources-to-backend';
import { useCookies } from 'react-cookie';
import { cookieName, getOptions, runsOnServerSide } from './i18next-settings';

// on client side the normal singleton is ok
i18next
  .use(initReactI18next)
  .use(LanguageDetector)
  .use(
    resourcesToBackend(
      (language: string, namespace: string) =>
        import(`./translations/${language}/${namespace}.json`),
      // {
      //   // Import both translation.json and language.json
      //   const translationPromise = import(
      //     `../i18n/translations/${language}/translation.json`
      //   );
      //   const languagePromise = import(
      //     `../i18n/translations/${language}/language.json`
      //   );
      //   // Resolve both promises and return an object with translation and language resources
      //   return Promise.all([translationPromise, languagePromise]).then(
      //     ([translation, language]) => ({
      //       translation,
      //       language,
      //     }),
      //   );
      // }
    ),
  )
  .init({
    ...getOptions(),
    lng: undefined, // let detect the language on client side
    detection: {
      order: ['path', 'htmlTag', 'cookie', 'navigator'],
    },
    preload: runsOnServerSide ? locales : [],
    // required to be true for paritally loading languages from resources and backend
    partialBundledLanguages: true,
    react: { useSuspense: false },
    // resources,
    // fallbackLng: fallbackLng,
    ns: ['translation', 'language'],
    returnEmptyString: false,
  });

export function useClientTranslation<
  Ns extends FlatNamespace,
  KPrefix extends KeyPrefix<FallbackNs<Ns>> = undefined,
>(
  ns?: Ns,
  options?: UseTranslationOptions<KPrefix>,
): UseTranslationResponse<FallbackNs<Ns>, KPrefix> {
  const { lng } = useContext(ClientTranslationContext);
  const [cookies, setCookie] = useCookies([cookieName]);
  const ret = useTranslationOrg(ns, options);
  const { i18n } = ret;
  const [activeLng, setActiveLng] = useState(i18n.language);
  useEffect(() => {
    if (activeLng === i18n.language) {
      return;
    }
    setActiveLng(i18n.language);
  }, [activeLng, i18n.language]);

  useEffect(() => {
    if (!lng || i18n.language === lng) {
      return;
    }
    i18n.changeLanguage(lng);
  }, [lng, i18n]);

  useEffect(() => {
    if (cookies.i18next === lng) {
      return;
    }
    setCookie(cookieName, lng, { path: '/' });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lng, cookies.i18next]);

  if (runsOnServerSide && lng && i18n.language !== lng) {
    i18n.changeLanguage(lng);
  }
  return ret;
}
