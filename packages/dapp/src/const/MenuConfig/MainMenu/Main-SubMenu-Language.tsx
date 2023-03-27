import { useSettingsStore } from '@transferto/shared/src/contexts/SettingsContext';
import { SettingsContextProps } from '@transferto/shared/src/types';
import { useTranslation } from 'react-i18next';
import { useUserTracking } from '../../../hooks';

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
      checkIcon: (languageMode || i18n.resolvedLanguage) === lan,
      onClick: () => handleSwitchLanguage(lan),
    }));

  return languages;
};
