'use client';
import { Stack, Typography, useTheme } from '@mui/material';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';
import { Menu, WalletButton } from 'src/components';
import { MenuKeysEnum } from 'src/const';
import type { Account } from 'src/hooks';
import { useAccounts } from 'src/hooks';
import { useMenuStore } from 'src/stores';
import { WalletCard } from './WalletCard';

interface WalletMenuProps {
  anchorEl: any;
}

export const WalletMenu = ({ anchorEl }: WalletMenuProps) => {
  const t = useTranslations();
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
    if (accounts.every((account: any) => account.status === 'disconnected')) {
      setWalletMenuState(false);
    }
  }, [accounts, setWalletMenuState]);

  return (
    <Menu
      open={openWalletMenu}
      setOpen={setWalletMenuState}
      isOpenSubMenu={openSubMenu !== MenuKeysEnum.None}
      width={'auto'}
      styles={{
        background: theme.palette.surface1.main,
        padding: '16px',
      }}
      anchorEl={anchorEl}
    >
      <Stack
        spacing={2}
        sx={{ padding: '0 !important', margin: '0 !important' }}
      >
        {accounts.map((account: Account) =>
          account.isConnected ? (
            <WalletCard key={account.address} account={account} />
          ) : null,
        )}
        <WalletButton
          sx={{ width: '100%' }}
          onClick={() => {
            closeAllMenus();
            setWalletSelectMenuState(true);
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
  );
};
