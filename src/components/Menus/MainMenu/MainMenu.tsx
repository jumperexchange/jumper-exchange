import { Menu } from '@/components/Menu/Menu';
import { MenuItem } from '@/components/Menu/MenuItem/MenuItem';
import { MenuKeysEnum } from '@/const/menuKeys';
import { useMenuStore } from '@/stores/menu';
import Stack from '@mui/material/Stack';
import { useMainMenuContent } from './hooks';
import { DevelopersSubmenu } from '@/components/Menus/DevelopersSubMenu/DevelopersSubMenu';
import { LanguagesSubmenu } from '@/components/Menus/LanguagesSubMenu/LanguageSubMenu';
import { ThemeModesSubmenu } from '@/components/Menus/ThemeModesSubMenu/ThemeModesSubMenu';
import { ThemeSubmenu } from '@/components/Menus/ThemeSubMenu/ThemeSubMenu';
import { useMemo } from 'react';
import { MenuItemContentHeader } from '@/components/Menu/MenuItemContent/MenuItemContentHeader';
import { MenuItemContentSocialLink } from '@/components/Menu/MenuItemContent/MenuItemContentSocialLink';
import { MenuItemContentFooterLink } from '@/components/Menu/MenuItemContent/MenuItemContentFooterLink';
import useMediaQuery from '@mui/material/useMediaQuery';
import { MenuItemContentWrapper } from '@/components/Menu/MenuItemContent/MenuItemContentWrapper';
import type { Theme } from '@mui/material/styles';

interface MainMenuProps {
  anchorEl?: HTMLAnchorElement;
}

const socialLinksDividerStyles = (theme: Theme) => ({
  marginTop: {
    xs: 'auto !important',
    md: theme.spacing(1),
  },
  marginBottom: theme.spacing(1),
});

const footerLinksStyles = {
  paddingBottom: '0 !important',
  '& > .MuiStack-root': {
    justifyContent: 'center',
  },
};

const mainItemsStackStyles = {
  overflowY: 'auto',
};

export const MainMenu = ({ anchorEl }: MainMenuProps) => {
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('md'));
  const { mainMenuItems, mainMenuSocialLinks, mainMenuFooterLinks } =
    useMainMenuContent();
  const { openMainMenu, setMainMenuState, openSubMenu } = useMenuStore(
    (state) => state,
  );

  const isMainMenuVisible = openSubMenu === MenuKeysEnum.None;

  const renderedMainMenuItems = useMemo(
    () =>
      mainMenuItems.map((item, index) => (
        <MenuItem
          key={`${item.label}-${index}`}
          // eslint-disable-next-line jsx-a11y/no-autofocus
          autoFocus={index > 0}
          label={item.label}
          prefixIcon={item.prefixIcon}
          suffixIcon={item.suffixIcon}
          link={item.link}
          triggerSubMenu={item.triggerSubMenu}
          showMoreIcon={item.showMoreIcon}
          onClick={item.onClick}
          isDivider={item.isDivider}
          open
        />
      )),
    [mainMenuItems],
  );

  const renderedSocialLinks = useMemo(
    () => [
      <MenuItem
        key="divider-social"
        isDivider
        open
        styles={socialLinksDividerStyles}
      />,
      <MenuItem key="social-links" open isInteractive={false}>
        <MenuItemContentWrapper>
          {mainMenuSocialLinks.map((socialLink) => (
            <MenuItemContentSocialLink
              key={socialLink.label}
              link={socialLink}
            />
          ))}
        </MenuItemContentWrapper>
      </MenuItem>,
    ],
    [mainMenuSocialLinks],
  );

  const renderedFooterLinks = useMemo(
    () => (
      <MenuItem open isInteractive={false} styles={footerLinksStyles}>
        <MenuItemContentWrapper>
          {mainMenuFooterLinks.map((footerLink) => (
            <MenuItemContentFooterLink
              key={footerLink.label}
              link={footerLink}
            />
          ))}
        </MenuItemContentWrapper>
      </MenuItem>
    ),
    [mainMenuFooterLinks],
  );

  const renderedMainMenuHeader = (
    <MenuItem open isInteractive={false}>
      <MenuItemContentWrapper>
        <MenuItemContentHeader onClose={() => setMainMenuState(false)} />
      </MenuItemContentWrapper>
    </MenuItem>
  );

  return (
    <Menu
      keepMounted
      open={openMainMenu}
      setOpen={setMainMenuState}
      isOpenSubMenu={openSubMenu !== MenuKeysEnum.None}
      anchorEl={anchorEl}
    >
      {isMainMenuVisible && isMobile && renderedMainMenuHeader}
      <Stack sx={mainItemsStackStyles}>
        {isMainMenuVisible && renderedMainMenuItems}
      </Stack>

      <LanguagesSubmenu />
      <DevelopersSubmenu />
      <ThemeModesSubmenu />
      <ThemeSubmenu />
      {(isMainMenuVisible || isMobile) && renderedSocialLinks}
      {(isMainMenuVisible || isMobile) && renderedFooterLinks}
    </Menu>
  );
};
