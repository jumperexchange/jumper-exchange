import { Stack, Typography, useTheme } from '@mui/material';
import { useEffect } from 'react';
import { Menu, WalletButton } from 'src/components';
import { MenuKeysEnum } from 'src/const';
import { useAccounts } from 'src/hooks';
import { useClientTranslation } from 'src/i18n';
import { useMenuStore } from 'src/stores';
import { WalletCard } from './WalletCard';

interface WalletMenuProps {
  anchorEl: any;
}

export const WalletMenu = ({ anchorEl }: WalletMenuProps) => {
  const { t } = useClientTranslation();
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
    if (
      openWalletMenu &&
      accounts.every((account) => account.status === 'disconnected')
    ) {
      setWalletMenuState(false);
    }
  }, [accounts, setWalletMenuState, openWalletMenu]);

  return (
    <Menu
      open={openWalletMenu}
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
