import { Menu } from '@/components/Menu/Menu';
import { MenuItem } from '@/components/Menu/MenuItem';
import { MenuKeysEnum } from '@/const/menuKeys';
import { useMenuStore } from '@/stores/menu';
import { getContrastAlphaColor } from '@/utils/colors';
import { isWalletInstalled } from '@lifi/wallet-management';
import type { Breakpoint, SxProps, Theme } from '@mui/material';
import { Typography, darken } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import { useConnect } from 'wagmi';
import { WalletSelectMoreSubMenu } from '../WalletSelectMoreSubMenu';
import { useWalletSelectContent } from './useWalletSelectContent';

interface MenuProps {
  anchorEl?: HTMLAnchorElement;
}

const NUMBER_OF_WALLETS_DISPLAYED = 9;

export const WalletSelectMenu = ({ anchorEl }: MenuProps) => {
  const { connectors } = useConnect();
  const { t } = useTranslation();
  const theme = useTheme();
  const walletSelectMenuItems = useWalletSelectContent();
  const isDarkMode = theme.palette.mode === 'dark';
  const filteredWalletSelectMenuItems = walletSelectMenuItems.slice(
    0,
    NUMBER_OF_WALLETS_DISPLAYED,
  );
  const {
    openWalletSelectMenu,
    setWalletSelectMenuState,
    openSubMenu,
    setSubMenuState,
  } = useMenuStore((state) => state);

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
  const anyWidnow = typeof window !== 'undefined' ? (window as any) : undefined;
  return (
    <Menu
      open={openWalletSelectMenu}
      cardsLayout={openSubMenu === MenuKeysEnum.WalletSelectMore ? false : true}
      styles={{
        display: 'flex',
      }}
      setOpen={setWalletSelectMenuState}
      isOpenSubMenu={openSubMenu === MenuKeysEnum.WalletSelectMore}
      anchorEl={anchorEl}
    >
      {openSubMenu === MenuKeysEnum.None && (
        <div style={{ flex: 1, width: '300px', height: '400px' }}>
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
          {`isWalletInstalled: ${isWalletInstalled('coinbase')}`}
          <div>{`${anyWidnow?.ethereum?.isCoinbaseWallet}`}</div>
          <div>{`${anyWidnow?.coinbaseWalletExtension?.isCoinbaseWallet}`}</div>
          <div>
            {anyWidnow?.ethereum?.providers?.map((provider: any) =>
              Object.keys(provider)
                .filter((key) => key.toLowerCase().includes('coinbase'))
                .map((k) => <span>{`${k} ${provider[k]} `}</span>),
            )}
          </div>
          <div>
            {Object.keys(anyWidnow?.ethereum).map((k) => (
              <span>{k} </span>
            ))}
          </div>
        </div>
      )}
      {connectors.map((c) => (
        <span>
          {c.id} {c.name}{' '}
        </span>
      ))}
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
      {walletSelectMenuItems.length - NUMBER_OF_WALLETS_DISPLAYED > 0 &&
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
    </Menu>
  );
};
