'use client';

import {
  TrackingAction,
  TrackingCategory,
  TrackingEventParameter,
} from '@/const/trackingKeys';
import { useUserTracking } from '@/hooks/userTracking/useUserTracking';
import { cookieName } from '@/i18n/i18next-settings';
import * as supportedLanguages from '@/i18n/translations';
import type { LanguageKey } from '@/types/i18n';
import { usePathnameWithoutLocale } from '@/hooks/routing/usePathnameWithoutLocale';
import { replaceLocaleInUrl } from '@/utils/replaceLocaleInUrl';
import { useCookies } from 'react-cookie';
import { useTranslation } from 'react-i18next';
import { SECONDS_IN_A_MONTH } from '@/const/time';

export const useLanguagesContent = () => {
  const pathname = usePathnameWithoutLocale();
  const { i18n } = useTranslation();
  const [, setCookie] = useCookies([cookieName]);
  const { trackEvent } = useUserTracking();
  const handleSwitchLanguage = (language: LanguageKey) => {
    trackEvent({
      category: TrackingCategory.LanguageMenu,
      action: TrackingAction.SwitchLanguage,
      label: `language_${language}`,
      data: { [TrackingEventParameter.SwitchedLanguage]: language },
    });
    i18n.changeLanguage(language);
    setCookie(cookieName, language, {
      path: '/',
      sameSite: 'lax',
      secure: true,
      maxAge: SECONDS_IN_A_MONTH,
    });
    replaceLocaleInUrl(pathname, language);
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
