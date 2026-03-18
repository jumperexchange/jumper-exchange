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
import { CookiesProvider } from 'react-cookie';

interface MainMenuProps {
  anchorEl?: HTMLAnchorElement;
}

const socialLinksDividerStyles = (theme: Theme) => ({
  marginTop: {
    xs: 'auto !important',
    lg: theme.spacing(1),
  },
  marginBottom: theme.spacing(1),
});

const socialLinksStyles = {
  marginTop: '0 !important',
};

const footerLinksStyles = {
  height: 'auto !important',
  paddingBottom: '0 !important',
  '& > .MuiStack-root': {
    justifyContent: 'center',
  },
};

const footerLinksWrapperStyles = (theme: Theme) => ({
  flexWrap: 'wrap',
  gap: theme.spacing(0.5),
});

const mainItemsStackStyles = {
  overflowY: 'auto',
};

export const MainMenu = ({ anchorEl }: MainMenuProps) => {
  const isTablet = useMediaQuery((theme) => theme.breakpoints.down('lg'));
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
      <MenuItem
        key="social-links"
        open
        isInteractive={false}
        styles={socialLinksStyles}
      >
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
        <MenuItemContentWrapper styles={footerLinksWrapperStyles}>
          {mainMenuFooterLinks.map((footerLink, index) => (
            <MenuItemContentFooterLink
              key={footerLink.label}
              link={footerLink}
              useDivider={index !== mainMenuFooterLinks.length - 1}
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
      {isMainMenuVisible && isTablet && renderedMainMenuHeader}
      <Stack sx={mainItemsStackStyles}>
        {isMainMenuVisible && renderedMainMenuItems}
      </Stack>

      <CookiesProvider>
        <LanguagesSubmenu />
      </CookiesProvider>
      <DevelopersSubmenu />
      <ThemeModesSubmenu />
      <ThemeSubmenu />
      {(isMainMenuVisible || isTablet) && renderedSocialLinks}
      {(isMainMenuVisible || isTablet) && renderedFooterLinks}
    </Menu>
  );
};
