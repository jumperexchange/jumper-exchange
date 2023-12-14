import { useTranslation } from 'react-i18next';
import { SubMenu } from 'src/components';
import { MenuKeys } from 'src/const';
import { useMenuStore } from 'src/stores';
import { useDevelopersContent } from '.';

export const DevelopersSubmenu = () => {
  const { t } = useTranslation();
  const subMenuDevelopers = useDevelopersContent();
  const openSubMenu = useMenuStore((state) => state.openSubMenu);
  return (
    <SubMenu
      label={t('navbar.navbarMenu.developers')}
      triggerSubMenu={MenuKeys.Devs}
      open={openSubMenu === MenuKeys.Devs}
      prevMenu={MenuKeys.None}
      subMenuList={subMenuDevelopers}
    />
  );
};
