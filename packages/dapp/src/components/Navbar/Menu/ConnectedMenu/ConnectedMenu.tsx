import { getChainById } from '@lifi/sdk';
import { wallets } from '@lifi/wallet-management';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import LaunchIcon from '@mui/icons-material/Launch';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import { Box, Breakpoint, Typography, useTheme } from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import Avatar from '@mui/material/Avatar';
import Snackbar from '@mui/material/Snackbar';
import type { TWallets } from '@transferto/dapp/src/types';
import { SpotButton } from '@transferto/shared/src/atoms';
import { useSettings } from '@transferto/shared/src/hooks';
import { openInNewTab, walletDigest } from '@transferto/shared/src/utils';
import { useMemo, useState } from 'react';
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
  const { trackPageload } = useUserTracking();
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

  return !!menu.openNavbarConnectedMenu ? (
    <NavbarMenu
      open={true}
      isScrollable={true}
      setOpen={menu.onOpenNavbarConnectedMenu}
      handleClose={handleClose}
      isOpenSubMenu={menu.openNavbarSubMenu !== SubMenuKeys.none}
    >
      <Box textAlign={'center'} mt={theme.spacing(3)}>
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
      <Box
        display={'flex'}
        flexDirection={'row'}
        justifyContent={'space-between'}
        sx={{
          margin: `${theme.spacing(3)} auto ${theme.spacing(2)}`,
          width: '75%',
          minWidth: '280px',

          [theme.breakpoints.up('sm' as Breakpoint)]: {
            marginTop: theme.spacing(6),
            width: 'auto',
            minWidth: 'inherit',
          },
        }}
      >
        <SpotButton
          name="Copy"
          onClick={() => {
            navigator?.clipboard?.writeText(account.address);
            setCopiedToClipboard(true);
          }}
        >
          <ContentCopyIcon />
        </SpotButton>
        <SpotButton
          name="Explore"
          onClick={() => {
            openInNewTab(
              `${
                getChainById(account.chainId).metamask.blockExplorerUrls[0]
              }address/${account.address}`,
            );
            trackPageload({
              source: 'connected-menu',
              destination: 'etherscan-account',
              url: `https://etherscan.io/address/${account?.address}`,
              pageload: true,
              disableTrackingTool: [EventTrackingTools.arcx],
            });
          }}
        >
          <LaunchIcon />
        </SpotButton>
        <SpotButton
          name={translate(`${i18Path}disconnect`)}
          variant={'primary'}
          onClick={() => {
            disconnect();
            settings.onWalletDisconnect();
          }}
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
          Copied to Clipboard
        </MuiAlert>
      </Snackbar>
    </NavbarMenu>
  ) : null;
};
