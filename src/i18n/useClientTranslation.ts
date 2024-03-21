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

import { cookieName, getOptions, runsOnServerSide } from './i18next-settings';
// import LocizeBackend from 'i18next-locize-backend'
import i18next from 'i18next';
import resourcesToBackend from 'i18next-resources-to-backend';
import { useCookies } from 'react-cookie';

// on client side the normal singleton is ok
i18next
  .use(initReactI18next)
  .use(LanguageDetector)
  .use(
    resourcesToBackend(
      (language: string, namespace: string) =>
        import(`./locales_jumper/${language}/${namespace}.json`),
    ),
  )
  // .use(LocizeBackend) // locize backend could be used on client side, but prefer to keep it in sync with server side
  .init({
    ...getOptions(),
    lng: undefined, // let detect the language on client side
    detection: {
      order: ['path', 'htmlTag', 'cookie', 'navigator'],
    },
    preload: runsOnServerSide ? locales : [],
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
