import { SubMenu } from '@/components/Menu/SubMenu';
import { MenuKeysEnum } from '@/const/menuKeys';
import { useMenuStore } from '@/stores/menu';
import { useTranslation } from 'react-i18next';
import { useThemeContent } from '.';

export const ThemeSubmenu = () => {
  const { t } = useTranslation();
  const subMenuTheme = useThemeContent();
  const openSubMenu = useMenuStore((state) => state.openSubMenu);
  console.log('sub', subMenuTheme.themes);
  return (
    <SubMenu
      label={t('navbar.navbarMenu.theme')}
      triggerSubMenu={MenuKeysEnum.Theme}
      open={openSubMenu === MenuKeysEnum.Theme}
      prevMenu={MenuKeysEnum.None}
      subMenuList={subMenuTheme.themes}
    />
  );
};
