import { Box, Typography } from '@mui/material';
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

const numberOfWalletsDisplayed = 8;

export const WalletSelectMenu = ({ handleClose, open }: NavbarMenuProps) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const walletSelectMenuItems = useWalletSelectContent();
  const subMenuWalletSelectMore = useWalletSelectContent();
  const isDarkMode = theme.palette.mode === 'dark';
  const filteredWalletSelectMenuItems = walletSelectMenuItems.slice(0, 6);
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
    console.log('clicked more');
    onOpenNavbarSubMenu(MenuKeys.WalletSelectMore);
  };

  if (!walletSelectMenuItems.length) {
    return (
      <Box textAlign={'center'} mt={theme.spacing(1)}>
        <CircularProgress />
      </Box>
    );
  }

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
        isOpenSubMenu={openNavbarSubMenu === MenuKeys.WalletSelect}
      >
        {openNavbarSubMenu === MenuKeys.None && (
          <MenuHeaderAppWrapper cardsLayout={true}>
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
                {t('navbar.chooseWallet')}
              </Typography>
            </MenuHeaderAppBar>
          </MenuHeaderAppWrapper>
        )}
        {
          <>
            {openNavbarSubMenu === MenuKeys.None &&
              filteredWalletSelectMenuItems.map((el, index) => (
                <MenuItemComponent
                  key={`${el.label}-${index}`}
                  // label={`${el.label || ' '}`}
                  triggerSubMenu={MenuKeys.WalletSelect}
                  showButton={false}
                  customHoverStyles={{
                    backgroundColor: getContrastAlphaColor(theme, '4%'),
                  }}
                  cardsLayout={true}
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
                  showButton={false}
                  cardsLayout={true}
                  showMoreIcon={false}
                  open={true}
                  customHoverStyles={{
                    backgroundColor: getContrastAlphaColor(theme, '4%'),
                    color: isDarkMode
                      ? theme.palette.white.main
                      : theme.palette.black.main,
                  }}
                  prefixIcon={
                    <Typography
                      variant={'lifiBodyLarge'}
                      sx={{
                        color: isDarkMode
                          ? theme.palette.white.main
                          : theme.palette.black.main,
                        '&:hover': {
                          color:
                            theme.palette.mode === 'dark'
                              ? theme.palette.black.main
                              : theme.palette.white.main,
                        },
                      }}
                    >
                      +{walletSelectMenuItems.length - numberOfWalletsDisplayed}
                    </Typography>
                  }
                  onClick={handleClickSelectMore}
                />
              )}
          </>
        }
        <SubMenuComponent
          label={t('navbar.chooseWallet')}
          triggerSubMenu={MenuKeys.WalletSelectMore}
          open={openNavbarSubMenu === MenuKeys.WalletSelectMore}
          prevMenu={MenuKeys.None}
          subMenuList={subMenuWalletSelectMore}
        />
      </NavbarMenu>
    )
  );
};
