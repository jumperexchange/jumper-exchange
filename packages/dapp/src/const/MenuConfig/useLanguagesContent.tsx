import { useTranslation } from 'react-i18next';
import { useUserTracking } from '../../hooks';
import { useSettingsStore } from '../../stores';
import { EventTrackingTool, LanguageKey, ResourceKey } from '../../types';
import { TrackingActions, TrackingCategories } from '../trackingKeys';

export const useLanguagesContent = () => {
  const { i18n, t: translate } = useTranslation('translation');
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

  const languages = Object.keys(i18n.store.data as ResourceKey)
    .sort()
    .map((lng) => ({
      label: translate('navbar.language.value', 'translation', { lng }),
      checkIcon: (languageMode || i18n.resolvedLanguage) === lng,
      onClick: () => handleSwitchLanguage(lng as LanguageKey),
    }));

  return languages;
};
