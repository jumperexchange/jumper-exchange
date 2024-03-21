'use client';

import {
  TrackingAction,
  TrackingCategory,
  TrackingEventParameter,
} from '@/const/trackingKeys';
import { useUserTracking } from '@/hooks/userTracking/useUserTracking';
import * as supportedLanguages from '@/i18n/translations';
import { useClientTranslation } from '@/i18n/useClientTranslation';
import type { LanguageKey } from '@/types/i18n';
import { EventTrackingTool } from '@/types/userTracking';

export const useLanguagesContent = () => {
  // const { locale, asPath, pathname } = nextRouter();
  // const router = useRouter();
  const { i18n } = useClientTranslation();
  const { trackEvent } = useUserTracking();
  const handleSwitchLanguage = (newLanguage: LanguageKey) => {
    // router.push(pathname, asPath, { locale: newLanguage });
    i18n.changeLanguage(newLanguage);

    trackEvent({
      category: TrackingCategory.LanguageMenu,
      action: TrackingAction.SwitchLanguage,
      label: `language_${newLanguage}`,
      data: { [TrackingEventParameter.SwitchedLanguage]: newLanguage },
      disableTrackingTool: [EventTrackingTool.ARCx, EventTrackingTool.Cookie3],
    });
  };

  const languages = Object.entries(supportedLanguages)
    .sort()
    .map(([language, languageValue]) => ({
      label: languageValue.language.value,
      checkIcon: i18n.language === language,
      onClick: () => handleSwitchLanguage(language as LanguageKey),
    }));

  return languages;
};
