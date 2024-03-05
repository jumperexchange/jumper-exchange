import { SubMenu } from 'src/components';
import { MenuKeysEnum } from 'src/const';
import { useClientTranslation } from 'src/i18n';
import { useMenuStore } from 'src/stores';
import { useDevelopersContent } from '.';

export const DevelopersSubmenu = () => {
  const { t } = useClientTranslation();
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
