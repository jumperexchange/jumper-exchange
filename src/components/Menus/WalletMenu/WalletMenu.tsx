import type { Chain } from '@lifi/types';
import { supportedWallets } from '@lifi/wallet-management';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import LaunchIcon from '@mui/icons-material/Launch';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import type { Breakpoint } from '@mui/material';
import { Grid, Typography, darken, lighten, useTheme } from '@mui/material';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Menu, SpotButton } from 'src/components';
import { MenuKeys, TrackingAction, TrackingCategory } from 'src/const';
import {
  useBlockchainExplorerURL,
  useChains,
  useMultisig,
  useUserTracking,
} from 'src/hooks';
import { useWallet } from 'src/providers';
import { useMenuStore, useSettingsStore } from 'src/stores';
import { EventTrackingTool } from 'src/types';
import { openInNewTab, walletDigest } from 'src/utils';
import { AvatarContainer, ChainAvatar, WalletAvatar } from '.';
interface MenuProps {
  handleClose: (event: MouseEvent | TouchEvent) => void;
}

export const WalletMenu = ({ handleClose }: MenuProps) => {
  const { checkMultisigEnvironment } = useMultisig();
  const { t } = useTranslation();
  const theme = useTheme();
  const blockchainExplorerURL = useBlockchainExplorerURL();
  const { account, usedWallet, disconnect } = useWallet();
  const { trackPageload, trackEvent } = useUserTracking();
  const [isMultisigEnvironment, setIsMultisigEnvironment] = useState(false);
  const walletSource = supportedWallets;
  const { chains } = useChains();
  const activeChain = useMemo(
    () => chains?.find((chainEl: Chain) => chainEl.id === account.chainId),
    [chains, account.chainId],
  );

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
    disconnect();
    onCloseAllMenus();
    onWalletDisconnect();
  };

  const handleMultisigEnvironmentCheck = useCallback(async () => {
    const response = await checkMultisigEnvironment();

    setIsMultisigEnvironment(response);
    // Check MultisigEnvironment only on first render
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    openWalletMenu! && onOpenSnackbar(false);
  }, [onOpenSnackbar, openWalletMenu]);

  useEffect(() => {
    handleMultisigEnvironmentCheck();
  }, [account, handleMultisigEnvironmentCheck]);

  return openWalletMenu ? (
    <Menu
      open
      transformOrigin={'top left'}
      setOpen={onOpenWalletMenu}
      handleClose={handleClose}
      isOpenSubMenu={openSubMenu !== MenuKeys.None}
    >
      <Grid
        container
        m={`${theme.spacing(3, 'auto')} !important`}
        sx={{
          maxWidth: 360,
          [theme.breakpoints.up('sm' as Breakpoint)]: {
            maxWidth: 'auto',
          },
        }}
      >
        <Grid item xs={12} textAlign={'center'} mb={theme.spacing(2.5)}>
          {activeChain && (
            <AvatarContainer>
              <WalletAvatar src={walletIcon} />
              <ChainAvatar
                src={activeChain.logoURI || 'empty'}
                alt={`${activeChain.name}chain-logo`}
              />
            </AvatarContainer>
          )}
          <Typography variant="lifiBodyLargeStrong" mt={theme.spacing(1.5)}>
            {_walletDigest}
          </Typography>
        </Grid>
        {!isMultisigEnvironment && (
          <Grid item xs={4} sx={{ paddingLeft: theme.spacing(2.5) }}>
            <SpotButton
              name={t('navbar.walletMenu.copy')}
              onClick={handleCopyButton}
              typography="lifiBodyXSmall"
              styles={{
                p: {
                  color: lighten(theme.palette.black.main, 0.48),
                },
              }}
            >
              <ContentCopyIcon />
            </SpotButton>
          </Grid>
        )}
        <Grid item xs={!isMultisigEnvironment ? 4 : 6}>
          <SpotButton
            name={t('navbar.walletMenu.explore')}
            onClick={handleExploreButton}
            typography="lifiBodyXSmall"
            styles={{
              p: {
                color: lighten(theme.palette.black.main, 0.48),
              },
            }}
          >
            <LaunchIcon />
          </SpotButton>
        </Grid>
        <Grid
          item
          xs={!isMultisigEnvironment ? 4 : 6}
          sx={{ paddingRight: 2.5 }}
        >
          <SpotButton
            name={t('navbar.walletMenu.disconnect')}
            onClick={handleDisconnectButton}
            typography="lifiBodyXSmall"
            styles={{
              button: {
                background: theme.palette.secondary.main,
              },
              'button:hover': {
                background:
                  theme.palette.mode === 'light'
                    ? darken(theme.palette.secondary.main, 0.04)
                    : lighten(theme.palette.secondary.main, 0.04),
              },
              p: {
                color:
                  theme.palette.mode === 'light'
                    ? lighten(theme.palette.black.main, 0.48)
                    : darken(theme.palette.white.main, 0.48),
              },
            }}
          >
            <PowerSettingsNewIcon
              sx={{
                color:
                  theme.palette.mode === 'dark'
                    ? theme.palette.accent1Alt.main
                    : theme.palette.accent1.main,
              }}
            />
          </SpotButton>
        </Grid>
      </Grid>
    </Menu>
  ) : null;
};
