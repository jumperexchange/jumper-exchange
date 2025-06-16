import { SubMenu } from '@/components/Menu/SubMenu';
import { MenuKeysEnum } from '@/const/menuKeys';
import { useMenuStore } from '@/stores/menu';
import { useTranslation } from 'react-i18next';
import { useThemeModesMenuContent } from './useThemeModesMenuContent';

export const ThemeModesSubmenu = () => {
  const { t } = useTranslation();
  const { submenuItems } = useThemeModesMenuContent();
  const openSubMenu = useMenuStore((state) => state.openSubMenu);
  return (
    <SubMenu
      label={t('navbar.navbarMenu.theme')}
      triggerSubMenu={MenuKeysEnum.ThemeMode}
      open={openSubMenu === MenuKeysEnum.ThemeMode}
      prevMenu={MenuKeysEnum.None}
      subMenuList={submenuItems}
    />
  );
};
