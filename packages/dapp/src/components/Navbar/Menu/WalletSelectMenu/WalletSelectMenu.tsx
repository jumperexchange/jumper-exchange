import { Box, Breakpoint, CSSObject, Typography } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import { useTheme } from '@mui/material/styles';
import { MenuKeys, useWalletSelectContent } from '@transferto/dapp/src/const';
import { useMenuStore } from '@transferto/dapp/src/stores';
import { getContrastAlphaColor } from '@transferto/shared/src/utils';
import { useTranslation } from 'react-i18next';
import { MenuHeaderAppBar, MenuHeaderAppWrapper } from '../../Navbar.style';
import { MenuItemComponent, NavbarMenu, SubMenuComponent } from '../../index';

interface NavbarMenuProps {
  handleClose: (event: MouseEvent | TouchEvent) => void;
  open?: boolean;
}

const numberOfWalletsDisplayed = 9;

export const WalletSelectMenu = ({ handleClose, open }: NavbarMenuProps) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const walletSelectMenuItems = useWalletSelectContent();
  const subMenuWalletSelectMore = useWalletSelectContent();
  const isDarkMode = theme.palette.mode === 'dark';
  const filteredWalletSelectMenuItems = walletSelectMenuItems.slice(
    0,
    numberOfWalletsDisplayed,
  );
  const [
    openNavbarWalletSelectMenu,
    onOpenNavbarWalletSelectMenu,
    openNavbarSubMenu,
    onOpenNavbarSubMenu,
  ] = useMenuStore((state) => [
    state.openNavbarWalletSelectMenu,
    state.onOpenNavbarWalletSelectMenu,
    state.openNavbarSubMenu,
    state.onOpenNavbarSubMenu,
  ]);

  const handleClickSelectMore = () => {
    onOpenNavbarSubMenu(MenuKeys.WalletSelectMore);
  };

  if (!walletSelectMenuItems.length) {
    return (
      <Box textAlign={'center'} mt={theme.spacing(1)}>
        <CircularProgress />
      </Box>
    );
  }

  const menuItemStyles: CSSObject = {
    margin: 0,
    flexDirection: 'column',
    flexWrap: 'wrap',
    // backgroundColor: `${getContrastAlphaColor(theme, '2%')} !important`,
    height: '72px',
    width: '72px',
    placeContent: 'center',

    [theme.breakpoints.up('sm' as Breakpoint)]: {
      height: '72px',
    },
  };

  return (
    openNavbarWalletSelectMenu && (
      <NavbarMenu
        handleClose={handleClose}
        open={openNavbarWalletSelectMenu}
        cardsLayout={
          openNavbarSubMenu === MenuKeys.WalletSelectMore ? false : true
        }
        transformOrigin={'top'}
        setOpen={onOpenNavbarWalletSelectMenu}
        isOpenSubMenu={openNavbarSubMenu === MenuKeys.WalletSelectMore}
      >
        {openNavbarSubMenu === MenuKeys.None && (
          <MenuHeaderAppWrapper
            styles={{
              marginBottom: '-12px',
            }}
          >
            <MenuHeaderAppBar component="div" elevation={0}>
              <Typography
                sx={{
                  color: isDarkMode
                    ? theme.palette.white.main
                    : theme.palette.black.main,
                }}
                variant={'lifiBodyMediumStrong'}
                width={'100%'}
                align={'center'}
                flex={1}
                noWrap
              >
                {t('navbar.walletSelectMenu.connectWallet')}
              </Typography>
            </MenuHeaderAppBar>
          </MenuHeaderAppWrapper>
        )}
        {openNavbarSubMenu === MenuKeys.None &&
          filteredWalletSelectMenuItems.map((el, index) => (
            <MenuItemComponent
              key={`${el.label}-${index}`}
              triggerSubMenu={MenuKeys.WalletSelect}
              showButton={false}
              styles={{
                borderRadius: '72px',
                backgroundColor: getContrastAlphaColor(theme, '2%'),
                ...menuItemStyles,

                '&:hover': {
                  backgroundColor: getContrastAlphaColor(theme, '4%'),
                },
              }}
              showMoreIcon={false}
              prefixIcon={el.prefixIcon}
              onClick={el.onClick}
              open={open || openNavbarWalletSelectMenu}
            />
          ))}
        {walletSelectMenuItems.length - numberOfWalletsDisplayed > 0 &&
          openNavbarSubMenu === MenuKeys.None && (
            <MenuItemComponent
              key={`select-more-wallets`}
              triggerSubMenu={MenuKeys.WalletSelectMore}
              showButton={true}
              showMoreIcon={false}
              open={true}
              styles={{
                ...menuItemStyles,
                padding: '0px',
                width: '100%',
                height: '48px !important',
                borderRadius: '24px',
                '> button': {
                  backgroundColor: getContrastAlphaColor(theme, '2%'),
                },
                '&:hover > button': {
                  backgroundColor: getContrastAlphaColor(theme, '4%'),
                },
              }}
              prefixIcon={
                <Typography
                  variant={'lifiBodyMediumStrong'}
                  sx={{
                    color: isDarkMode
                      ? theme.palette.white.main
                      : theme.palette.black.main,
                  }}
                >
                  {t('navbar.seeAllWallets')}
                </Typography>
              }
              onClick={handleClickSelectMore}
            />
          )}

        <SubMenuComponent
          label={t('navbar.walletSelectMenu.wallets')}
          triggerSubMenu={MenuKeys.WalletSelectMore}
          open={openNavbarSubMenu === MenuKeys.WalletSelectMore}
          prevMenu={MenuKeys.None}
          subMenuList={subMenuWalletSelectMore}
        />
      </NavbarMenu>
    )
  );
};
