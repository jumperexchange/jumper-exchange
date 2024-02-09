'use client';
import { useLocale } from 'next-intl';
import * as supportedLanguages from 'root/messages';
import {
  TrackingAction,
  TrackingCategory,
  TrackingEventParameter,
} from 'src/const';
import { useUserTracking } from 'src/hooks';
import { usePathname, useRouter } from 'src/navigation';
import { useSettingsStore } from 'src/stores';
import type { LanguageKey } from 'src/types';
import { EventTrackingTool } from 'src/types';

export const useLanguagesContent = () => {
  const [languageMode, onChangeLanguage] = useSettingsStore((state) => [
    state.languageMode,
    state.onChangeLanguage,
  ]);
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();

  const { trackEvent } = useUserTracking();
  const handleSwitchLanguage = (newLanguage: LanguageKey) => {
    router.push(pathname, { locale: newLanguage });
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
