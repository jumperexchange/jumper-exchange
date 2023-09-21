import * as supportedLanguages from 'i18n';
import { useTranslation } from 'react-i18next';
import { TrackingActions, TrackingCategories } from 'src/const';
import { useUserTracking } from 'src/hooks';
import { useSettingsStore } from 'src/stores';
import type { LanguageKey } from 'src/types';
import { EventTrackingTool } from 'src/types';
export const useLanguagesContent = () => {
  const { i18n, t } = useTranslation();
  const [languageMode, onChangeLanguage] = useSettingsStore((state) => [
    state.languageMode,
    state.onChangeLanguage,
  ]);
  const { trackEvent } = useUserTracking();
  const handleSwitchLanguage = (newLanguage: LanguageKey) => {
    i18n.changeLanguage(newLanguage);
    onChangeLanguage(newLanguage);
    trackEvent({
      category: TrackingCategories.Language,
      action: TrackingActions.SwitchLanguage,
      label: `language-${newLanguage}`,
      data: { language: `language-${newLanguage}` },
      disableTrackingTool: [EventTrackingTool.ARCx, EventTrackingTool.Raleon],
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
