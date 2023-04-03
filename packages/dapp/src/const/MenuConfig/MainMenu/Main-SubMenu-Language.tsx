import { useSettings } from '@transferto/shared/src/hooks';
import { useTranslation } from 'react-i18next';
import { EventTrackingTools, useUserTracking } from '../../../hooks';

export const useMainSubMenuLanguage = () => {
  const { i18n } = useTranslation();
  const settings = useSettings();
  const { trackEvent } = useUserTracking();
  const handleSwitchLanguage = (newLanguage) => {
    i18n.changeLanguage(newLanguage);
    settings.onChangeLanguage(newLanguage);
    trackEvent({
      category: 'menu',
      action: 'switch-language',
      label: newLanguage,
      data: { language: `language-${newLanguage}` },
      disableTrackingTool: [EventTrackingTools.arcx],
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
