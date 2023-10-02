import { supportedWallets } from '@lifi/wallet-management';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import LaunchIcon from '@mui/icons-material/Launch';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import type { Breakpoint } from '@mui/material';
import { Grid, Typography, useTheme } from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import Avatar from '@mui/material/Avatar';
import Snackbar from '@mui/material/Snackbar';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SpotButton } from 'src/atoms';
import { PopperMenu } from 'src/components';
import { MenuKeys, TrackingAction, TrackingCategory } from 'src/const';
import {
  useBlockchainExplorerURL,
  useMultisig,
  useUserTracking,
} from 'src/hooks';
import { useWallet } from 'src/providers';
import { useMenuStore, useSettingsStore } from 'src/stores';
import { EventTrackingTool } from 'src/types';
import { openInNewTab, walletDigest } from 'src/utils';
interface PopperMenuProps {
  handleClose: (event: MouseEvent | TouchEvent) => void;
}
export const WalletMenu = ({ handleClose }: PopperMenuProps) => {
  const { checkMultisigEnvironment } = useMultisig();
  const [copiedToClipboard, setCopiedToClipboard] = useState(false);
  const { t } = useTranslation();
  const theme = useTheme();
  const blockchainExplorerURL = useBlockchainExplorerURL();
  const { account, usedWallet, disconnect } = useWallet();
  const { trackPageload, trackEvent } = useUserTracking();
  const [isMultisigEnvironment, setIsMultisigEnvironment] = useState(false);
  const walletSource = supportedWallets;
  const [
    openWalletPopper,
    onOpenWalletPopper,
    openSubMenuPopper,
    onCloseAllPopperMenus,
  ] = useMenuStore((state) => [
    state.openWalletPopper,
    state.onOpenWalletPopper,
    state.openSubMenuPopper,
    state.onCloseAllPopperMenus,
  ]);

  const onWalletDisconnect = useSettingsStore(
    (state) => state.onWalletDisconnect,
  );

  const walletIcon: string = useMemo(() => {
    if (!!usedWallet) {
      return usedWallet.icon;
    } else {
      const walletKey: any = Object.keys(walletSource).filter(
        (el: string, index: number) =>
          walletSource[index].name === localStorage.activeWalletName,
      );
      return walletSource[walletKey]?.icon || '';
    }
  }, [usedWallet, walletSource]);

  const _walletDigest = useMemo(() => {
    return walletDigest(account);
  }, [account]);

  const handleCloseSnackbar = (
    event?: React.SyntheticEvent | Event,
    reason?: string,
  ) => {
    if (reason === 'clickaway') {
      return;
    }
    setCopiedToClipboard(false);
  };

  const handleExploreButton = () => {
    account.chainId && onCloseAllPopperMenus();

    trackEvent({
      category: TrackingCategory.WalletMenu,
      action: TrackingAction.OpenBlockchainExplorer,
      label: 'open-blockchain-explorer-wallet',
      disableTrackingTool: [EventTrackingTool.ARCx, EventTrackingTool.Raleon],
    });
    if (blockchainExplorerURL) {
      trackPageload({
        source: TrackingCategory.Wallet,
        destination: 'blokchain-explorer',
        url: blockchainExplorerURL || '',
        pageload: true,
        disableTrackingTool: [EventTrackingTool.ARCx, EventTrackingTool.Raleon],
      });
      openInNewTab(blockchainExplorerURL);
    }
  };

  const handleCopyButton = () => {
    account.address && navigator.clipboard.writeText(account.address);
    setCopiedToClipboard(true);
    trackEvent({
      category: TrackingCategory.WalletMenu,
      action: TrackingAction.CopyAddressToClipboard,
      label: 'copy_addr_to_clipboard',
      disableTrackingTool: [EventTrackingTool.ARCx, EventTrackingTool.Raleon],
    });
    onCloseAllPopperMenus();
  };

  const handleDisconnectButton = () => {
    disconnect();
    onCloseAllPopperMenus();
    onWalletDisconnect();
  };

  const handleMultisigEnvironmentCheck = useCallback(async () => {
    const response = await checkMultisigEnvironment();

    setIsMultisigEnvironment(response);
    // Check MultisigEnvironment only on first render
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    openWalletPopper! && setCopiedToClipboard(false);
  }, [openWalletPopper]);

  useEffect(() => {
    handleMultisigEnvironmentCheck();
  }, [account, handleMultisigEnvironmentCheck]);

  return openWalletPopper ? (
    <PopperMenu
      open
      transformOrigin={'top left'}
      setOpen={onOpenWalletPopper}
      handleClose={handleClose}
      isOpenSubMenu={openSubMenuPopper !== MenuKeys.None}
    >
      <Grid
        container
        m={`${theme.spacing(3)} auto !important`}
        sx={{
          maxWidth: '360px',
          [theme.breakpoints.up('sm' as Breakpoint)]: {
            maxWidth: 'auto',
          },
        }}
      >
        <Grid item xs={12} textAlign={'center'} mb={theme.spacing(3)}>
          <Avatar
            src={walletIcon}
            sx={{
              padding: theme.spacing(2.25),
              background:
                theme.palette.mode === 'light'
                  ? theme.palette.black.main
                  : theme.palette.white.main,
              margin: 'auto',
              height: '96px',
              width: '96px',
            }}
          />
          <Typography variant="lifiBodyLargeStrong" mt={theme.spacing(2)}>
            {_walletDigest}
          </Typography>
        </Grid>
        {!isMultisigEnvironment && (
          <Grid item xs={4}>
            <SpotButton name="Copy" onClick={handleCopyButton}>
              <ContentCopyIcon />
            </SpotButton>
          </Grid>
        )}
        <Grid item xs={!isMultisigEnvironment ? 4 : 6}>
          <SpotButton name="Explore" onClick={handleExploreButton}>
            <LaunchIcon />
          </SpotButton>
        </Grid>
        <Grid item xs={!isMultisigEnvironment ? 4 : 6}>
          <SpotButton
            name={t('navbar.walletMenu.disconnect')}
            variant={'primary'}
            onClick={handleDisconnectButton}
          >
            <PowerSettingsNewIcon />
          </SpotButton>
        </Grid>
      </Grid>
    </PopperMenu>
  ) : (
    <Snackbar
      open={copiedToClipboard}
      autoHideDuration={2000}
      onClose={handleCloseSnackbar}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      sx={{ top: '80px !important' }}
    >
      <MuiAlert elevation={6} variant="filled" severity="success">
        {t('navbar.walletMenu.copiedMsg')}
      </MuiAlert>
    </Snackbar>
  );
};
