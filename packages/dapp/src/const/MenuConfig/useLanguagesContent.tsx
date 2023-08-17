import { useTranslation } from 'react-i18next';
import { useUserTracking } from '../../hooks';
import { useSettingsStore } from '../../stores';
import { EventTrackingTool, LanguageKey } from '../../types';
import { TrackingActions, TrackingCategories } from '../trackingKeys';

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

  const languages = Object.keys(i18n.store.data)
    .sort()
    .map((lng) => ({
      label: t('navbar.language.value', { lng }),
      checkIcon: (languageMode || i18n.resolvedLanguage) === lng,
      onClick: () => handleSwitchLanguage(lng as LanguageKey),
    }));

  return languages;
};
