import {
  MenuHeaderAppBar,
  MenuHeaderAppWrapper,
  MenuList,
  MenuPaper,
} from '@/components/Menu/Menu.style';
import { MenuKeysEnum } from '@/const/menuKeys';
import {
  type Breakpoint,
  darken,
  type SxProps,
  type Theme,
  Typography,
} from '@mui/material';
import { useMenuStore } from '@/stores/menu';
import type { ReactNode } from 'react';
import {
  EcosystemSelectMenu,
  useWalletSelectContent,
} from '@/components/Menus';
import { MenuItem } from '@/components/Menu';
import { getContrastAlphaColor } from '@/utils/colors';
import { WalletSelectMoreSubMenu } from '@/components/Menus/WalletSelectMoreSubMenu';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';

const NUMBER_OF_WALLETS_DISPLAYED = 9;

interface WalletSelectMenuContentProps {
  openWalletSelectMenu: boolean;
  showAllButton?: boolean;
}

function WalletSelectMenuContent({
  openWalletSelectMenu,
  showAllButton = true,
}: WalletSelectMenuContentProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  const walletSelectMenuItems = useWalletSelectContent();
  const filteredWalletSelectMenuItems = walletSelectMenuItems.slice(
    0,
    NUMBER_OF_WALLETS_DISPLAYED,
  );
  const { openSubMenu, setSubMenuState } = useMenuStore((state) => state);
  const dd = useMenuStore((state) => state);

  const menuItemStyles: SxProps<Theme> = {
    margin: 0,
    flexDirection: 'column',
    flexWrap: 'wrap',
    height: 72,
    width: 72,
    placeContent: 'center',

    [theme.breakpoints.up('sm' as Breakpoint)]: {
      height: 72,
    },
  };

  return (
    <>
      {openSubMenu === MenuKeysEnum.EcosystemSelect && <EcosystemSelectMenu />}
      {openSubMenu === MenuKeysEnum.None && (
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
              variant={'bodyMediumStrong'}
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
      {openSubMenu === MenuKeysEnum.None &&
        filteredWalletSelectMenuItems.map((el, index) => (
          <MenuItem
            key={`${el.label}-${index}`}
            triggerSubMenu={MenuKeysEnum.WalletSelect}
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
              margin: 0,
              flexDirection: 'column',
              flexWrap: 'wrap',
              height: 72,
              width: 72,
              placeContent: 'center',

              [theme.breakpoints.up('sm' as Breakpoint)]: {
                height: 72,
              },
              ...el.styles,
            }}
            showMoreIcon={false}
            prefixIcon={el.prefixIcon}
            onClick={el.onClick}
            open={openWalletSelectMenu}
          />
        ))}
      {showAllButton &&
        walletSelectMenuItems.length - NUMBER_OF_WALLETS_DISPLAYED > 0 &&
        openSubMenu === MenuKeysEnum.None && (
          <MenuItem
            key={`select-more-wallets`}
            open
            showButton
            triggerSubMenu={MenuKeysEnum.WalletSelectMore}
            showMoreIcon={false}
            onClick={() =>
              openSubMenu === MenuKeysEnum.None &&
              setSubMenuState(MenuKeysEnum.WalletSelectMore)
            }
            styles={{
              ...menuItemStyles,
              gridColumn: 'span 3',
              padding: 0,
              width: '100%',
              height: '48px !important',
              borderRadius: 24,
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
                variant={'bodySmallStrong'}
                sx={{
                  color: isDarkMode
                    ? theme.palette.white.main
                    : theme.palette.black.main,
                }}
              >
                {t('navbar.seeAllWallets')}
              </Typography>
            }
          />
        )}

      <WalletSelectMoreSubMenu />
    </>
  );
}

export default WalletSelectMenuContent;
