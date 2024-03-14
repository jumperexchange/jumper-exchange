import { useTranslation } from 'react-i18next';
import { SubMenu } from 'src/components';
import { MenuKeys } from 'src/const';
import { useMenuStore } from 'src/stores';
import { useLanguagesContent } from '.';

export const LanguagesSubmenu = () => {
  const { t } = useTranslation();
  const subMenuLanguages = useLanguagesContent();
  const openSubMenu = useMenuStore((state) => state.openSubMenu);
  return (
    <SubMenu
      label={t('language.key', { ns: 'language' })}
      triggerSubMenu={MenuKeys.Language}
      open={openSubMenu === MenuKeys.Language}
      prevMenu={MenuKeys.None}
      subMenuList={subMenuLanguages}
    />
  );
};
