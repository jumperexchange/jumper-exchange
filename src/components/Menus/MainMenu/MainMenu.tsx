import { Menu } from '@/components/Menu/Menu';
import { MenuItem } from '@/components/Menu/MenuItem';
import { MenuItemBase } from '@/components/Menu/MenuItemBase';
import { MenuDelimiter } from '@/components/Menu';
import { Link } from '@/components/Link';
import { MenuKeysEnum } from '@/const/menuKeys';
import { useMenuStore } from '@/stores/menu';
import { Stack } from '@mui/system';
import { DevelopersSubmenu, LanguagesSubmenu, useMainMenuContent } from '..';
import { ThemeModesSubmenu } from '@/components/Menus/ThemeModesSubMenu/ThemeModesSubMenu';
import { ThemeSubmenu } from '@/components/Menus/ThemeSubMenu/ThemeSubMenu';
import { useMemo } from 'react';

interface MainMenuProps {
  anchorEl?: HTMLAnchorElement;
}

export const MainMenu = ({ anchorEl }: MainMenuProps) => {
  const { mainMenuItems, mainMenuSocialLinks } = useMainMenuContent();
  const { openMainMenu, setMainMenuState, openSubMenu } = useMenuStore(
    (state) => state,
  );

  const isMainMenuVisible = openSubMenu === MenuKeysEnum.None;

  const renderedMainMenuItems = useMemo(
    () =>
      mainMenuItems.map((item, index) => (
        <MenuItem
          key={`${item.label}-${index}`}
          autoFocus={index > 0}
          label={item.label}
          prefixIcon={item.prefixIcon}
          suffixIcon={item.suffixIcon}
          link={item.link}
          triggerSubMenu={item.triggerSubMenu}
          showMoreIcon={item.showMoreIcon}
          onClick={item.onClick}
          open
        />
      )),
    [mainMenuItems],
  );

  const renderedSocialLinks = useMemo(
    () => (
      <MenuItemBase>
        <Stack direction="column" spacing={2} marginTop={1} width="100%">
          <MenuDelimiter />
          <Stack direction="row" justifyContent="space-between" width="100%">
            {mainMenuSocialLinks.map((socialLink, index) => (
              <Link
                key={socialLink.label}
                href={socialLink.link.url}
                target="_blank"
                onClick={socialLink.onClick}
                aria-label={`${socialLink.label} social link`}
              >
                {socialLink.prefixIcon}
              </Link>
            ))}
          </Stack>
        </Stack>
      </MenuItemBase>
    ),
    [mainMenuSocialLinks],
  );

  return (
    <Menu
      keepMounted
      open={openMainMenu}
      setOpen={setMainMenuState}
      isOpenSubMenu={openSubMenu !== MenuKeysEnum.None}
      anchorEl={anchorEl}
    >
      {isMainMenuVisible && renderedMainMenuItems}
      {isMainMenuVisible && renderedSocialLinks}
      <LanguagesSubmenu />
      <DevelopersSubmenu />
      <ThemeModesSubmenu />
      <ThemeSubmenu />
    </Menu>
  );
};
