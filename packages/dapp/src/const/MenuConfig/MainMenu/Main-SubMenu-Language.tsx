import { useSettings } from '@transferto/shared/src/hooks';
import { useTranslation } from 'react-i18next';

export const useMainSubMenuLanguage = () => {
  const { i18n } = useTranslation();
  const settings = useSettings();

  const handleSwitchLanguage = (newLanguage) => {
    i18n.changeLanguage(newLanguage);
    settings.onChangeLanguage(newLanguage);
  };

  const languages = Object.keys(i18n.store.data)
    .sort()
    .map((lan) => ({
      label: i18n.store.data[lan].translation['navbar']['language']['value'],
      checkIcon: settings.languageMode === lan,
      onClick: () => handleSwitchLanguage(lan),
    }));

  return languages;
};
