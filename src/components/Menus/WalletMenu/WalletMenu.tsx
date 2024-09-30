import { Menu } from '@/components/Menu/Menu';
import { MenuKeysEnum } from '@/const/menuKeys';
import { useMenuStore } from '@/stores/menu';
import { useAccount, useWalletMenu } from '@lifi/wallet-management';
import { Stack, Typography, useTheme } from '@mui/material';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { WalletButton } from '.';
import { WalletCard } from './WalletCard';

interface WalletMenuProps {
  anchorEl?: HTMLAnchorElement;
}

export const WalletMenu = ({ anchorEl }: WalletMenuProps) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';

  const { accounts } = useAccount();

  const { openWalletMenu } = useWalletMenu();

  const {
    openWalletMenu: _openWalletMenu,
    setWalletMenuState,
    setSnackbarState,
    openSubMenu,
  } = useMenuStore((state) => state);

  useEffect(() => {
    _openWalletMenu! && setSnackbarState(false);
  }, [setSnackbarState, _openWalletMenu]);

  useEffect(() => {
    if (
      _openWalletMenu &&
      accounts.every((account) => account.status === 'disconnected')
    ) {
      setWalletMenuState(false);
    }
  }, [accounts, setWalletMenuState, _openWalletMenu]);

  return (
    <Menu
      open={_openWalletMenu}
      setOpen={setWalletMenuState}
      isOpenSubMenu={openSubMenu !== MenuKeysEnum.None}
      width={'auto'}
      styles={{
        background: theme.palette.surface1.main,
        padding: '12px',
      }}
      anchorEl={anchorEl}
    >
      <Stack
        spacing={2}
        sx={{ padding: '0 !important', margin: '0 !important' }}
      >
        {accounts.map((account) =>
          account.isConnected ? (
            <WalletCard key={account.address} account={account} />
          ) : null,
        )}
        <WalletButton
          sx={{ width: '100%' }}
          onClick={(event) => {
            event.stopPropagation();
            openWalletMenu();
          }}
        >
          <Typography
            sx={{
              color: isDarkMode
                ? theme.palette.white.main
                : theme.palette.black.main,
            }}
            variant="bodySmallStrong"
          >
            {t('navbar.walletMenu.connectAnotherWallet')}
          </Typography>
        </WalletButton>
      </Stack>
    </Menu>
  );
};
