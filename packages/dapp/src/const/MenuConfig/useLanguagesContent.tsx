import { useTranslation } from 'react-i18next';
import { useUserTracking } from '../../hooks';
import * as supportedLanguages from '../../i18n';
import { useSettingsStore } from '../../stores';
import { EventTrackingTool, LanguageKey } from '../../types';
import {
  TrackingActions,
  TrackingCategories,
  TrackingEventParameters,
  TrackingUserProperties,
} from '../trackingKeys';

export const useLanguagesContent = () => {
  const { i18n } = useTranslation();
  const [languageMode, onChangeLanguage] = useSettingsStore((state) => [
    state.languageMode,
    state.onChangeLanguage,
  ]);
  const { trackEvent, trackAttribute } = useUserTracking();
  const handleSwitchLanguage = (newLanguage: LanguageKey) => {
    i18n.changeLanguage(newLanguage);
    onChangeLanguage(newLanguage);
    trackAttribute({
      data: {
        [TrackingUserProperties.Language]: newLanguage,
      },
    });
    trackEvent({
      category: TrackingCategories.LanguageMenu,
      action: TrackingActions.SwitchLanguage,
      label: `language_${newLanguage}`,
      data: { [TrackingEventParameters.SwitchedLanguage]: newLanguage },
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
