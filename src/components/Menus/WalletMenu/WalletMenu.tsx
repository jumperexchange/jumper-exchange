import { Stack, Typography, useTheme } from '@mui/material';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Menu, WalletButton } from 'src/components';
import { MenuKeys } from 'src/const';
// import { useWallet } from 'src/providers';
import { useMenuStore } from 'src/stores';
import { useAccounts } from 'src/hooks/useAccounts';
import { WalletCard } from './WalletCard';

export const WalletMenu = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';

  const { accounts } = useAccounts();

  const {
    openWalletMenu,
    setWalletMenuState,
    setSnackbarState,
    openSubMenu,
    closeAllMenus,
    setWalletSelectMenuState,
  } = useMenuStore((state) => state);

  useEffect(() => {
    openWalletMenu! && setSnackbarState(false);
  }, [setSnackbarState, openWalletMenu]);
  useEffect(() => {
    if (accounts.every((account) => account.status === 'disconnected')) {
      setWalletMenuState(false);
    }
  }, [accounts, setWalletMenuState]);

  return openWalletMenu ? (
    <Menu
      open
      transformOrigin={'top left'}
      setOpen={setWalletMenuState}
      isOpenSubMenu={openSubMenu !== MenuKeys.None}
      width={'auto'}
      styles={{
        background: theme.palette.surface1.main,
        padding: '16px',
      }}
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
          sx={{ width: '324px' }}
          onClick={() => {
            closeAllMenus();
            setWalletSelectMenuState(
              true,
              document.getElementById('connect-wallet-button'),
            );
          }}
        >
          <Typography
            sx={{
              color: isDarkMode
                ? theme.palette.white.main
                : theme.palette.black.main,
            }}
            variant="lifiBodySmallStrong"
          >
            {t('navbar.walletMenu.connectAnotherWallet')}
          </Typography>
        </WalletButton>
      </Stack>
    </Menu>
  ) : null;
};
