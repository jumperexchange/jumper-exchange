import { DappLanguagesSupported } from '@transferto/shared';
import { LanguageFlags } from '@transferto/shared/src/atoms/icons';
import { useSettings } from '@transferto/shared/src/hooks';
import { useTranslation } from 'react-i18next';

const SubMenuLanguage = () => {
  const { t: translate } = useTranslation();
  const i18Path = 'Navbar.';
  const settings = useSettings();
  const { i18n } = useTranslation();

  const languageFlags = LanguageFlags();

  const handleSwitchLanguage = (newLanguage) => {
    i18n.changeLanguage(newLanguage);
    settings.onChangeLanguage(newLanguage);
  };

  const _SubMenuLanguage = [];

  Object.values(DappLanguagesSupported).map((lan) =>
    _SubMenuLanguage.push({
      label: translate(`${i18Path}Languages.${lan}`),
      // listIcon: languageFlags[lan],
      checkIcon: settings.languageMode === lan,
      onClick: () => handleSwitchLanguage(lan),
    }),
  );

  return _SubMenuLanguage;
};

export default SubMenuLanguage;
