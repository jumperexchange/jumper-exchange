import { useSettings } from '@transferto/shared/src/hooks';
import { hotjar } from 'react-hotjar';
import { useTranslation } from 'react-i18next';
import { gaEventTrack } from '../../../utils/google-analytics';

export const useMainSubMenuLanguage = () => {
  const { i18n } = useTranslation();
  const settings = useSettings();

  const handleSwitchLanguage = (newLanguage) => {
    hotjar.initialized() &&
      hotjar.event(`settings-changeLanguage-${newLanguage}`);
    gaEventTrack({
      category: 'settings',
      action: 'changeLanguage',
      label: `${newLanguage}`,
    });
    i18n.changeLanguage(newLanguage);
    settings.onChangeLanguage(newLanguage);
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
