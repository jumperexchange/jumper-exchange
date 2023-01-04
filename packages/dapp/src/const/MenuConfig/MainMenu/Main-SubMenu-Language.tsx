import { DappLanguagesSupported } from '@transferto/shared';
import { useSettings } from '@transferto/shared/src/hooks';
import { useTranslation } from 'react-i18next';

const SubMenuLanguage = () => {
  const { i18n } = useTranslation();
  const settings = useSettings();

  const handleSwitchLanguage = (newLanguage) => {
    i18n.changeLanguage(newLanguage);
    settings.onChangeLanguage(newLanguage);
  };

  const _SubMenuLanguage = [];

  Object.values(DappLanguagesSupported).map((lan) =>
    _SubMenuLanguage.push({
      label: i18n.store.data[lan].translation['navbar']['language']['value'],
      checkIcon: settings.languageMode === lan,
      onClick: () => handleSwitchLanguage(lan),
    }),
  );

  return _SubMenuLanguage;
};

export default SubMenuLanguage;
