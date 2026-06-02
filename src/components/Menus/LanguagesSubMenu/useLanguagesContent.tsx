'use client';

import {
  TrackingAction,
  TrackingCategory,
  TrackingEventParameter,
} from '@/const/trackingKeys';
import { useUserTracking } from '@/hooks/userTracking/useUserTracking';
import { cookieName, fallbackLng } from '@/i18n/i18next-settings';
import * as supportedLanguages from '@/i18n/translations';
import type { LanguageKey } from '@/types/i18n';
import { usePathnameWithoutLocale } from '@/hooks/routing/usePathnameWithoutLocale';
import { useCookies } from 'react-cookie';
import { useTranslation } from 'react-i18next';
import { SECONDS_IN_A_MONTH } from '@/const/time';

export const useLanguagesContent = () => {
  const pathname = usePathnameWithoutLocale();
  const { i18n } = useTranslation();
  const [, setCookie] = useCookies([cookieName]);
  const { trackEvent } = useUserTracking();
  const handleSwitchLanguage = (newLanguage: LanguageKey) => {
    trackEvent({
      category: TrackingCategory.LanguageMenu,
      action: TrackingAction.SwitchLanguage,
      label: `language_${newLanguage}`,
      data: { [TrackingEventParameter.SwitchedLanguage]: newLanguage },
    });
    i18n.changeLanguage(newLanguage);
    setCookie(cookieName, newLanguage, {
      path: '/',
      sameSite: true,
      maxAge: SECONDS_IN_A_MONTH,
    });
    const newPath =
      newLanguage === fallbackLng ? pathname : `/${newLanguage}${pathname}`;
    window.history.replaceState(null, '', newPath);
  };

  const languages = Object.entries(supportedLanguages)
    .sort()
    .map(([language, languageValue]) => ({
      label: languageValue.language.value,
      checkIcon: i18n.language === language,
      onClick: () => {
        if (language === i18n.language) {
          return;
        }
        handleSwitchLanguage(language as LanguageKey);
      },
    }));

  return languages;
};
