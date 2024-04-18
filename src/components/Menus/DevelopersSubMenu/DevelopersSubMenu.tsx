import { SubMenu } from '@/components/Menu/SubMenu';
import { MenuKeysEnum } from '@/const/menuKeys';
import { useMenuStore } from '@/stores/menu';
import { useTranslation } from 'react-i18next';
import { useDevelopersContent } from '.';

export const DevelopersSubmenu = () => {
  const { t } = useTranslation();
  const subMenuDevelopers = useDevelopersContent();
  const openSubMenu = useMenuStore((state) => state.openSubMenu);
  return (
    <SubMenu
      label={t('navbar.navbarMenu.developers')}
      triggerSubMenu={MenuKeysEnum.Devs}
      open={openSubMenu === MenuKeysEnum.Devs}
      prevMenu={MenuKeysEnum.None}
      subMenuList={subMenuDevelopers}
    />
  );
};
