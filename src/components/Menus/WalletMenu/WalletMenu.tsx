import { Stack, useTheme } from '@mui/material';
import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Menu } from 'src/components';
import { MenuKeys, TrackingAction, TrackingCategory } from 'src/const';
import { useBlockchainExplorerURL, useUserTracking } from 'src/hooks';
// import { useWallet } from 'src/providers';
import { useMenuStore, useSettingsStore } from 'src/stores';
import { EventTrackingTool } from 'src/types';
import { openInNewTab, walletDigest } from 'src/utils';
import { useAccount } from 'src/hooks/useAccount';
import { WalletCard } from './WalletCard';
interface MenuProps {
  handleClose: (event: MouseEvent | TouchEvent) => void;
}

export const WalletMenu = ({ handleClose }: MenuProps) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const blockchainExplorerURL = useBlockchainExplorerURL();
  const { account } = useAccount();

  const { trackPageload, trackEvent } = useUserTracking();

  const [
    openWalletMenu,
    onOpenWalletMenu,
    onOpenSnackbar,
    openSubMenu,
    onCloseAllMenus,
  ] = useMenuStore((state) => [
    state.openWalletMenu,
    state.onOpenWalletMenu,
    state.onOpenSnackbar,
    state.openSubMenu,
    state.onCloseAllMenus,
  ]);
  const onWalletDisconnect = useSettingsStore(
    (state) => state.onWalletDisconnect,
  );

  const walletIcon: string = useMemo(() => {
    if (account.isConnected) {
      return account.connector?.icon || '';
    } else {
      return '';
    }
  }, [account]);

  const _walletDigest = useMemo(() => {
    return walletDigest(account);
  }, [account]);

  const handleExploreButton = () => {
    account.chainId && onCloseAllMenus();

    trackEvent({
      category: TrackingCategory.WalletMenu,
      action: TrackingAction.OpenBlockchainExplorer,
      label: 'open-blockchain-explorer-wallet',
      disableTrackingTool: [EventTrackingTool.ARCx, EventTrackingTool.Cookie3],
    });
    if (blockchainExplorerURL) {
      trackPageload({
        source: TrackingCategory.Wallet,
        destination: 'blokchain-explorer',
        url: blockchainExplorerURL || '',
        pageload: true,
        disableTrackingTool: [EventTrackingTool.Cookie3],
      });
      openInNewTab(blockchainExplorerURL);
    }
  };

  const handleCopyButton = () => {
    account.address && navigator.clipboard.writeText(account.address);
    onOpenSnackbar(true, t('navbar.walletMenu.copiedMsg'), 'success');
    trackEvent({
      category: TrackingCategory.WalletMenu,
      action: TrackingAction.CopyAddressToClipboard,
      label: 'copy_addr_to_clipboard',
      disableTrackingTool: [EventTrackingTool.ARCx, EventTrackingTool.Cookie3],
    });
    onCloseAllMenus();
  };

  const handleDisconnectButton = () => {
    onCloseAllMenus();
    onWalletDisconnect();
  };

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
      width={'fit-content'}
      styles={{
        background: theme.palette.surface1.main,
        padding: '16px',
      }}
    >
      <Stack
        spacing={2}
        sx={{ padding: '0 !important', margin: '0 !important' }}
      >
        <WalletCard />
        <WalletCard />
      </Stack>
    </Menu>
  ) : null;
};
