import type { Breakpoint, CSSObject } from '@mui/material';
import { Typography, darken } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import {
  Menu,
  MenuHeaderAppBar,
  MenuHeaderAppWrapper,
  MenuItem,
  SubMenu,
  useWalletSelectContent,
} from 'src/components';
import { MenuKeys } from 'src/const';
import { useMenuStore } from 'src/stores';
import { getContrastAlphaColor } from 'src/utils';

interface MenuProps {
  handleClose: (event: MouseEvent | TouchEvent) => void;
  open?: boolean;
}

const NUMBER_OF_WALLETS_DISPLAYED = 9;

export const WalletSelectMenu = ({ handleClose, open }: MenuProps) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const walletSelectMenuItems = useWalletSelectContent();
  const subMenuWalletSelectMore = useWalletSelectContent();
  const isDarkMode = theme.palette.mode === 'dark';
  const filteredWalletSelectMenuItems = walletSelectMenuItems.slice(
    0,
    NUMBER_OF_WALLETS_DISPLAYED,
  );
  const [
    openWalletSelectMenu,
    onOpenWalletSelectMenu,
    openSubMenu,
    onOpenSubMenu,
  ] = useMenuStore((state) => [
    state.openWalletSelectMenu,
    state.onOpenWalletSelectMenu,
    state.openSubMenu,
    state.onOpenSubMenu,
  ]);

  const handleClickSelectMore = () => {
    onOpenSubMenu(MenuKeys.WalletSelectMore);
  };

  const menuItemStyles: CSSObject = {
    margin: 0,
    flexDirection: 'column',
    flexWrap: 'wrap',
    height: '72px',
    width: '72px',
    placeContent: 'center',

    [theme.breakpoints.up('sm' as Breakpoint)]: {
      height: '72px',
    },
  };

  return (
    openWalletSelectMenu && (
      <Menu
        handleClose={handleClose}
        open={openWalletSelectMenu}
        cardsLayout={openSubMenu === MenuKeys.WalletSelectMore ? false : true}
        styles={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          justifyItems: 'center',
          ul: {
            gridColumnStart: 1,
            gridColumnEnd: 4,
          },
        }}
        transformOrigin={'top'}
        setOpen={onOpenWalletSelectMenu}
        isOpenSubMenu={openSubMenu === MenuKeys.WalletSelectMore}
      >
        {openSubMenu === MenuKeys.None && (
          <MenuHeaderAppWrapper
            sx={{
              gridColumn: 'span 3',
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
        {openSubMenu === MenuKeys.None &&
          filteredWalletSelectMenuItems.map((el, index) => (
            <MenuItem
              key={`${el.label}-${index}`}
              triggerSubMenu={MenuKeys.WalletSelect}
              showButton={false}
              styles={{
                borderRadius: '72px',
                backgroundColor:
                  theme.palette.mode === 'dark'
                    ? getContrastAlphaColor(theme, '12%')
                    : getContrastAlphaColor(theme, '4%'),

                '&:hover': {
                  backgroundColor:
                    theme.palette.mode === 'dark'
                      ? theme.palette.alphaLight300.main
                      : darken(theme.palette.white.main, 0.08),
                },
                ...menuItemStyles,
                ...el.styles,
              }}
              showMoreIcon={false}
              prefixIcon={el.prefixIcon}
              onClick={el.onClick}
              open={open || openWalletSelectMenu}
            />
          ))}
        {walletSelectMenuItems.length - NUMBER_OF_WALLETS_DISPLAYED > 0 &&
          openSubMenu === MenuKeys.None && (
            <MenuItem
              key={`select-more-wallets`}
              triggerSubMenu={MenuKeys.WalletSelectMore}
              showButton={true}
              showMoreIcon={false}
              open={true}
              styles={{
                ...menuItemStyles,
                gridColumn: 'span 3',
                padding: '0px',
                width: '100%',
                height: '48px !important',
                borderRadius: '24px',
                '> button': {
                  backgroundColor:
                    theme.palette.mode === 'dark'
                      ? getContrastAlphaColor(theme, '12%')
                      : getContrastAlphaColor(theme, '4%'),
                },
                '&:hover': {
                  backgroundColor: 'transparent',
                },

                '&:hover button': {
                  backgroundColor: getContrastAlphaColor(theme, '16%'),
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

        <SubMenu
          label={t('navbar.walletSelectMenu.wallets')}
          triggerSubMenu={MenuKeys.WalletSelectMore}
          open={openSubMenu === MenuKeys.WalletSelectMore}
          prevMenu={MenuKeys.None}
          subMenuList={subMenuWalletSelectMore}
        />
      </Menu>
    )
  );
};
