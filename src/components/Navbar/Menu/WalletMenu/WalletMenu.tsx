import { getChainById } from '@lifi/sdk';
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
import { NavbarMenu } from 'src/components';
import { MenuKeys } from 'src/const';
import { useMultisig, useUserTracking } from 'src/hooks';
import { useWallet } from 'src/providers';
import { useMenuStore, useSettingsStore } from 'src/stores';
import { EventTrackingTool } from 'src/types';
import { openInNewTab, walletDigest } from 'src/utils';

interface NavbarMenuProps {
  handleClose: (event: MouseEvent | TouchEvent) => void;
}
export const WalletMenu = ({ handleClose }: NavbarMenuProps) => {
  const { checkMultisigEnvironment } = useMultisig();
  const [copiedToClipboard, setCopiedToClipboard] = useState(false);
  const { t } = useTranslation();
  const theme = useTheme();
  const { account, usedWallet, disconnect } = useWallet();
  const { trackPageload, trackEvent } = useUserTracking();
  const [isMultisigEnvironment, setIsMultisigEnvironment] = useState(false);
  const walletSource = supportedWallets;
  const [
    openNavbarWalletMenu,
    onOpenNavbarWalletMenu,
    openNavbarSubMenu,
    onCloseAllNavbarMenus,
  ] = useMenuStore((state) => [
    state.openNavbarWalletMenu,
    state.onOpenNavbarWalletMenu,
    state.openNavbarSubMenu,
    state.onCloseAllNavbarMenus,
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
    account.chainId &&
      openInNewTab(
        `${
          getChainById(account.chainId).metamask.blockExplorerUrls[0]
        }address/${account.address}`,
      );
    onCloseAllNavbarMenus();
    trackPageload({
      source: 'wallet-menu',
      destination: 'blokchain-explorer',
      url: !!account.chainId
        ? `${
            getChainById(account.chainId).metamask.blockExplorerUrls[0]
          }address/${account.address}`
        : '',
      pageload: true,
      disableTrackingTool: [EventTrackingTool.ARCx, EventTrackingTool.Raleon],
    });
  };

  const handleCopyButton = () => {
    account.address && navigator.clipboard.writeText(account.address);
    setCopiedToClipboard(true);
    trackEvent({
      category: 'menu',
      action: 'copyAddressToClipboard',
      label: 'copyAddressToClipboard',
      disableTrackingTool: [EventTrackingTool.ARCx, EventTrackingTool.Raleon],
    });
    onCloseAllNavbarMenus();
  };

  const handleDisconnectButton = () => {
    disconnect();
    onCloseAllNavbarMenus();
    onWalletDisconnect();
  };

  const handleMultisigEnvironmentCheck = useCallback(async () => {
    const response = await checkMultisigEnvironment();

    setIsMultisigEnvironment(response);
    // Check MultisigEnvironment only on first render
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    openNavbarWalletMenu! && setCopiedToClipboard(false);
  }, [openNavbarWalletMenu]);

  useEffect(() => {
    handleMultisigEnvironmentCheck();
  }, [account, handleMultisigEnvironmentCheck]);

  return openNavbarWalletMenu ? (
    <NavbarMenu
      open
      transformOrigin={'top left'}
      setOpen={onOpenNavbarWalletMenu}
      handleClose={handleClose}
      isOpenSubMenu={openNavbarSubMenu !== MenuKeys.None}
    >
      <Grid
        container
        m={`${theme.spacing(6)} auto !important`}
        sx={{
          maxWidth: '360px',
          [theme.breakpoints.up('sm' as Breakpoint)]: {
            maxWidth: 'auto',
          },
        }}
      >
        <Grid item xs={12} textAlign={'center'} mb={theme.spacing(6)}>
          <Avatar
            src={walletIcon}
            sx={{
              padding: theme.spacing(4.5),
              background:
                theme.palette.mode === 'light'
                  ? theme.palette.black.main
                  : theme.palette.white.main,
              margin: 'auto',
              height: '96px',
              width: '96px',
            }}
          />
          <Typography variant="lifiBodyLargeStrong" mt={theme.spacing(4)}>
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
    </NavbarMenu>
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
