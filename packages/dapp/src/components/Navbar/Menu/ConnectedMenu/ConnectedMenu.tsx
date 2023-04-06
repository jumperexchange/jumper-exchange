import { getChainById } from '@lifi/sdk';
import { wallets } from '@lifi/wallet-management';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import LaunchIcon from '@mui/icons-material/Launch';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import { Box, Typography, useTheme } from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import Avatar from '@mui/material/Avatar';
import Snackbar from '@mui/material/Snackbar';
import type { TWallets } from '@transferto/dapp/src/types';
import { SpotButton } from '@transferto/shared/src/atoms';
import { useSettings } from '@transferto/shared/src/hooks';
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
  const walletSource: TWallets = wallets;
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
  };

  const handleDisconnectButton = () => {
    disconnect();
    settings.onWalletDisconnect();
  };

  useEffect(() => {
    menu.openNavbarConnectedMenu! && setCopiedToClipboard(false);
  }, [menu.openNavbarConnectedMenu]);

  return !!menu.openNavbarConnectedMenu ? (
    <NavbarMenu
      open={true}
      isScrollable={true}
      setOpen={menu.onOpenNavbarConnectedMenu}
      handleClose={handleClose}
      isOpenSubMenu={menu.openNavbarSubMenu !== SubMenuKeys.none}
    >
      <Box
        display={'grid'}
        gridTemplateColumns={'1fr 1fr 1fr'}
        m={`${theme.spacing(6)} 0`}
      >
        <Box
          textAlign={'center'}
          mb={theme.spacing(6)}
          sx={{ minWidth: 0, gridColumnStart: '1', gridColumnEnd: '4' }}
        >
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
        </Box>
        <SpotButton
          name="Copy"
          onClick={handleCopyButton}
          style={{ minWidth: 0, gridColumnStart: '1', gridColumnEnd: '2' }}
        >
          <ContentCopyIcon />
        </SpotButton>
        <SpotButton
          name="Explore"
          onClick={handleExploreButton}
          style={{ minWidth: 0, gridColumnStart: '2', gridColumnEnd: '3' }}
        >
          <LaunchIcon />
        </SpotButton>
        <SpotButton
          name={translate(`${i18Path}disconnect`)}
          variant={'primary'}
          onClick={handleDisconnectButton}
          style={{ minWidth: 0, gridColumnStart: '3', gridColumnEnd: '4' }}
        >
          <PowerSettingsNewIcon />
        </SpotButton>
      </Box>
      <Snackbar
        open={copiedToClipboard}
        autoHideDuration={2000}
        onClose={handleCloseSnackbar}
      >
        <MuiAlert elevation={6} variant="filled" severity="success">
          Wallet address copied
        </MuiAlert>
      </Snackbar>
    </NavbarMenu>
  ) : null;
};
