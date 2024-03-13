'use client';

import { useUserTracking } from '@/hooks/userTracking/useUserTracking';
import { useClientTranslation } from '@/i18n/useClientTranslation';
import {
  TrackingAction,
  TrackingCategory,
  TrackingEventParameter,
} from 'src/const';
import { useSettingsStore } from 'src/stores';
import type { LanguageKey } from 'src/types';
import { EventTrackingTool } from 'src/types';
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
      checkIcon: (languageMode || i18n.resolvedLanguage) === language,
      onClick: () => handleSwitchLanguage(language as LanguageKey),
    }));

  return languages;
};
