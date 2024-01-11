import { Button, Stack, Typography, useTheme } from '@mui/material';
import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Menu, WalletButton } from 'src/components';
import { MenuKeys, TrackingAction, TrackingCategory } from 'src/const';
import { useBlockchainExplorerURL, useUserTracking } from 'src/hooks';
// import { useWallet } from 'src/providers';
import { useMenuStore, useSettingsStore } from 'src/stores';
import { EventTrackingTool } from 'src/types';
import { openInNewTab, walletDigest } from 'src/utils';
import { useAccounts } from 'src/hooks/useAccounts';
import { WalletCard } from './WalletCard';
interface MenuProps {
  handleClose: (event: MouseEvent | TouchEvent) => void;
}

export const WalletMenu = ({ handleClose }: MenuProps) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const { accounts } = useAccounts();

  const {
    openWalletMenu,
    onOpenWalletMenu,
    onOpenSnackbar,
    openSubMenu,
    onCloseAllMenus,
    onOpenWalletSelectMenu,
  } = useMenuStore((state) => state);

  useEffect(() => {
    openWalletMenu! && onOpenSnackbar(false);
  }, [onOpenSnackbar, openWalletMenu]);

  return openWalletMenu ? (
    <Menu
      open
      transformOrigin={'top left'}
      setOpen={onOpenWalletMenu}
      handleClose={handleClose}
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
            onCloseAllMenus();
            onOpenWalletSelectMenu(true);
          }}
        >
          <Typography variant="lifiBodySmallStrong">
            Connect another wallet
          </Typography>
        </WalletButton>
      </Stack>
    </Menu>
  ) : null;
};
