import { getChainById } from '@lifi/sdk';
import { supportedWallets } from '@lifi/wallet-management';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import LaunchIcon from '@mui/icons-material/Launch';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import { Breakpoint, Grid, Typography, useTheme } from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import Avatar from '@mui/material/Avatar';
import Snackbar from '@mui/material/Snackbar';
import { SpotButton } from '@transferto/shared/src/atoms';
import { useSettings } from '@transferto/shared/src/hooks';
import { Wallet } from '@transferto/shared/src/types';
import { openInNewTab, walletDigest } from '@transferto/shared/src/utils';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SubMenuKeys } from '../../../../const';
import { EventTrackingTools, useUserTracking } from '../../../../hooks';
import { useMenu } from '../../../../providers/MenuProvider';
import { useWallet } from '../../../../providers/WalletProvider';
import { NavbarMenu } from '../../index';

interface NavbarMenuProps {
  handleClose: (event: MouseEvent | TouchEvent) => void;
}
export const ConnectedMenu = ({ handleClose }: NavbarMenuProps) => {
  const i18Path = 'navbar.walletMenu.';
  const [copiedToClipboard, setCopiedToClipboard] = useState(false);
  const { t: translate } = useTranslation();
  const menu = useMenu();
  const { account, usedWallet, disconnect } = useWallet();
  const theme = useTheme();
  const { trackPageload, trackEvent } = useUserTracking();
  const settings = useSettings();
  const walletSource: Wallet[] = supportedWallets;
  const walletIcon: string = useMemo(() => {
    if (!!usedWallet) {
      return usedWallet.icon;
    } else {
      const walletKey: any = Object.keys(walletSource).filter(
        (el) => walletSource[el].name === localStorage.activeWalletName,
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
    openInNewTab(
      `${getChainById(account.chainId).metamask.blockExplorerUrls[0]}address/${
        account.address
      }`,
    );
    menu.onCloseAllNavbarMenus();
    trackPageload({
      source: 'connected-menu',
      destination: 'blokchain-explorer',
      url: `${
        getChainById(account.chainId).metamask.blockExplorerUrls[0]
      }address/${account.address}`,
      pageload: true,
      disableTrackingTool: [EventTrackingTools.arcx],
    });
  };

  const handleCopyButton = () => {
    navigator?.clipboard?.writeText(account.address);
    setCopiedToClipboard(true);
    trackEvent({
      category: 'menu',
      action: 'copyAddressToClipboard',
      label: 'copyAddressToClipboard',
      disableTrackingTool: [EventTrackingTools.arcx],
    });
    menu.onCloseAllNavbarMenus();
  };

  const handleDisconnectButton = () => {
    disconnect();
    menu.onCloseAllNavbarMenus();
    settings.onWalletDisconnect();
  };

  useEffect(() => {
    menu.openNavbarWalletMenu! && setCopiedToClipboard(false);
  }, [menu.openNavbarWalletMenu]);

  return !!menu.openNavbarWalletMenu ? (
    <NavbarMenu
      open={true}
      setOpen={menu.onOpenNavbarWalletMenu}
      handleClose={handleClose}
      isOpenSubMenu={menu.openNavbarSubMenu !== SubMenuKeys.none}
    >
      <Grid
        container
        m={`${theme.spacing(6)} auto`}
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
            // alt={`${!!usedWallet.name ? usedWallet.name : ''}wallet-logo`}
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
        <Grid item xs={4}>
          <SpotButton
            name={translate(`${i18Path}copy`)}
            onClick={handleCopyButton}
          >
            <ContentCopyIcon />
          </SpotButton>
        </Grid>
        <Grid item xs={4}>
          <SpotButton
            name={translate(`${i18Path}explore`)}
            onClick={handleExploreButton}
          >
            <LaunchIcon />
          </SpotButton>
        </Grid>
        <Grid item xs={4}>
          <SpotButton
            name={translate(`${i18Path}disconnect`)}
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
      sx={{ top: '78px !important' }}
    >
      <MuiAlert elevation={6} variant="filled" severity="success">
        {translate(`${i18Path}copiedMsg`)}
      </MuiAlert>
    </Snackbar>
  );
};
