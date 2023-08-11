import { useTranslation } from 'react-i18next';
import { shallow } from 'zustand/shallow';
import { useUserTracking } from '../../hooks';
import { useSettingsStore } from '../../stores';
import { EventTrackingTool } from '../../types';
import { TrackingActions, TrackingCategories } from '../trackingKeys';
import * as supportedLanguages from '../../i18n';

export const useLanguagesContent = () => {
  const { i18n } = useTranslation();
  const [languageMode, onChangeLanguage] = useSettingsStore(
    (state) => [state.languageMode, state.onChangeLanguage],
    shallow,
  );
  const { trackEvent } = useUserTracking();
  const handleSwitchLanguage = (newLanguage) => {
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

  console.log({ data: i18n.store.data });

  const languages = Object.entries(supportedLanguages)
    .sort()
    .map(([language, languageValue]) => ({
      label: languageValue.language.value,
      checkIcon: (languageMode || i18n.resolvedLanguage) === language,
      onClick: () => handleSwitchLanguage(language),
    }));

  return languages;
};
