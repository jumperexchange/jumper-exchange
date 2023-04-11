import { useSettings } from '@transferto/shared/src/hooks';
import { useTranslation } from 'react-i18next';
import { EventTrackingTools, useUserTracking } from '../../../hooks';
import { trackingActions, trackingCategories } from '../../trackingKeys';

export const useMainSubMenuLanguage = () => {
  const { i18n } = useTranslation();
  const settings = useSettings();
  const { trackEvent } = useUserTracking();
  const handleSwitchLanguage = (newLanguage) => {
    i18n.changeLanguage(newLanguage);
    settings.onChangeLanguage(newLanguage);
    trackEvent({
      category: trackingCategories.language,
      action: trackingActions.switchLanguage,
      label: `language-${newLanguage}`,
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
