import { SettingsContextProps } from '@transferto/shared/src/types';
import { useTranslation } from 'react-i18next';
import { EventTrackingTools, useUserTracking } from '../../../hooks';
import { useSettingsStore } from '../../../stores';
import { TrackingActions, TrackingCategories } from '../../trackingKeys';

export const useMainSubMenuLanguage = () => {
  const { i18n } = useTranslation();
  const languageMode = useSettingsStore(
    (state: SettingsContextProps) => state.languageMode,
  );
  const onChangeLanguage = useSettingsStore(
    (state: SettingsContextProps) => state.onChangeLanguage,
  );
  const { trackEvent } = useUserTracking();
  const handleSwitchLanguage = (newLanguage) => {
    i18n.changeLanguage(newLanguage);
    onChangeLanguage(newLanguage);
    trackEvent({
      category: TrackingCategories.LANGUAGE,
      action: TrackingActions.SWITCH_LANGUAGE,
      label: `language-${newLanguage}`,
      data: { language: `language-${newLanguage}` },
      disableTrackingTool: [EventTrackingTools.arcx],
    });
  };

  const languages = Object.keys(i18n.store.data)
    .sort()
    .map((lan) => ({
      label: i18n.store.data[lan].translation['navbar']['language']['value'],
      checkIcon: (languageMode || i18n.resolvedLanguage) === lan,
      onClick: () => handleSwitchLanguage(lan),
    }));

  return languages;
};
