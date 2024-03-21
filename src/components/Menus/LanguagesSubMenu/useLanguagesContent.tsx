'use client';

import {
  TrackingAction,
  TrackingCategory,
  TrackingEventParameter,
} from '@/const/trackingKeys';
import { useUserTracking } from '@/hooks/userTracking/useUserTracking';
import { useClientTranslation } from '@/i18n/useClientTranslation';
import type { LanguageKey } from '@/types/i18n';
import { EventTrackingTool } from '@/types/userTracking';
import { useSettingsStore } from 'src/stores/settings';
import * as supportedLanguages from '../../../../messages';

export const useLanguagesContent = () => {
  // const { locale, asPath, pathname } = nextRouter();
  // const router = useRouter();
  const { i18n } = useClientTranslation();
  const [languageMode, onChangeLanguage] = useSettingsStore((state) => [
    state.languageMode,
    state.onChangeLanguage,
  ]);

  const { trackEvent } = useUserTracking();
  const handleSwitchLanguage = (newLanguage: LanguageKey) => {
    // router.push(pathname, asPath, { locale: newLanguage });
    i18n.changeLanguage(newLanguage);

    onChangeLanguage(newLanguage);
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
