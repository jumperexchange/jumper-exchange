import { useTranslation } from 'react-i18next';
import { shallow } from 'zustand/shallow';
import { useUserTracking } from '../../hooks';
import { useSettingsStore } from '../../stores';
import { EventTrackingTools, LanguageKey } from '../../types';
import { TrackingActions, TrackingCategories } from '../trackingKeys';

export const useLanguagesContent = () => {
  const { i18n } = useTranslation();
  const [languageMode, onChangeLanguage] = useSettingsStore(
    (state) => [state.languageMode, state.onChangeLanguage],
    shallow,
  );
  const { trackEvent } = useUserTracking();
  const handleSwitchLanguage = (newLanguage: LanguageKey) => {
    i18n.changeLanguage(newLanguage);
    onChangeLanguage(newLanguage);
    trackEvent({
      category: TrackingCategories.Language,
      action: TrackingActions.SwitchLanguage,
      label: `language-${newLanguage}`,
      data: { language: `language-${newLanguage}` },
      disableTrackingTool: [EventTrackingTools.arcx],
    });
  };

  const languages = Object.keys(i18n.store.data)
    .sort()
    .map((lan) => {
      console.log(
        "i18n.store.data[lan].translation['navbar']",
        i18n.store.data[lan].translation['navbar'],
      );

      return {
        label: i18n.store.data[lan].translation['navbar']['language']['value'],
        checkIcon: (languageMode || i18n.resolvedLanguage) === lan,
        onClick: () => handleSwitchLanguage(lan as LanguageKey),
      };
    });

  return languages;
};
