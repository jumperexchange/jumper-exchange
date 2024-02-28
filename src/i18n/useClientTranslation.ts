'use client';

import type { FlatNamespace, KeyPrefix } from 'i18next';
import { useContext, useEffect, useState } from 'react';
import type {
  FallbackNs,
  UseTranslationOptions,
  UseTranslationResponse,
} from 'react-i18next';
import { useTranslation as useTranslationOrg } from 'react-i18next';
import { ClientTranslationContext } from '.';
import { cookieName, runsOnServerSide } from './i18next-settings';
// import LocizeBackend from 'i18next-locize-backend'
import { useCookies } from 'react-cookie';

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
  const [activeLng, setActiveLng] = useState(i18n.resolvedLanguage);

  useEffect(() => {
    if (activeLng === i18n.resolvedLanguage) {
      return;
    }
    setActiveLng(i18n.resolvedLanguage);
  }, [activeLng, i18n.resolvedLanguage]);

  useEffect(() => {
    if (!lng || i18n.resolvedLanguage === lng) {
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

  if (runsOnServerSide && lng && i18n.resolvedLanguage !== lng) {
    i18n.changeLanguage(lng);
  }
  return ret;
}
