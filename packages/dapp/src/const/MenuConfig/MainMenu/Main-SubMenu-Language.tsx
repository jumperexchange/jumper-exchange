import { useTranslation } from 'react-i18next';
import { useSettings, useUserTracking } from '../../../hooks';

export const useMainSubMenuLanguage = () => {
  const { i18n } = useTranslation();
  const { settings, onChangeLanguage } = useSettings();
  const { trackEvent } = useUserTracking();
  const handleSwitchLanguage = (newLanguage) => {
    i18n.changeLanguage(newLanguage);
    onChangeLanguage(newLanguage);
    trackEvent({
      category: 'menu',
      action: 'switch-language',
      label: newLanguage,
      data: { language: `language-${newLanguage}` },
      // disableTrackingTool: [EventTrackingTools.arcx],
    });
  };

  const languages = Object.keys(i18n.store.data)
    .sort()
    .map((lan) => ({
      label: i18n.store.data[lan].translation['navbar']['language']['value'],
      checkIcon: (settings.languageMode || i18n.resolvedLanguage) === lan,
      onClick: () => handleSwitchLanguage(lan),
    }));

  return languages;
};
