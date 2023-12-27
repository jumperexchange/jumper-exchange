import { Container, Stack, Typography, useTheme } from '@mui/material';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import {
  AvatarContainer,
  WalletAvatar,
  ChainAvatar,
  WalletButton,
} from './WalletMenu.style';
import { useChains, useUserTracking } from 'src/hooks';
import type { Account } from 'src/hooks/useAccounts';
import { useAccountDisconnect } from 'src/hooks/useAccounts';
import { openInNewTab, walletDigest } from 'src/utils';
import { useMenuStore, useSettingsStore } from 'src/stores';
import { TrackingAction, TrackingCategory } from 'src/const';
import { EventTrackingTool } from 'src/types';
import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';
import { Chain } from '@lifi/sdk';

interface WalletCardProps {
  account: Account;
}

export const WalletCard = ({ account }: WalletCardProps) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const disconnectWallet = useAccountDisconnect();
  const { trackPageload, trackEvent } = useUserTracking();
  const { chains } = useChains();
  const activeChain = useMemo(
    () => chains?.find((chainEl: Chain) => chainEl.id === account.chainId),
    [chains, account.chainId],
  );
  const { onCloseAllMenus, onOpenSnackbar } = useMenuStore((state) => state);
  const onWalletDisconnect = useSettingsStore(
    (state) => state.onWalletDisconnect,
  );

  const handleExploreButton = () => {
    account.chainId && onCloseAllMenus();

    trackEvent({
      category: TrackingCategory.WalletMenu,
      action: TrackingAction.OpenBlockchainExplorer,
      label: 'open-blockchain-explorer-wallet',
      disableTrackingTool: [EventTrackingTool.ARCx, EventTrackingTool.Cookie3],
    });
    if (account.blockChainExplorerUrl) {
      trackPageload({
        source: TrackingCategory.Wallet,
        destination: 'blokchain-explorer',
        url: account.blockChainExplorerUrl || '',
        pageload: true,
        disableTrackingTool: [EventTrackingTool.Cookie3],
      });
      openInNewTab(account.blockChainExplorerUrl);
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

  const handleDisconnect = () => {
    disconnectWallet(account);
    onWalletDisconnect();
  };

  return (
    <Container
      sx={{
        boxShadow: '0px 1px 4px 0px rgba(0, 0, 0, 0.04)',
        padding: '24px',
        display: 'flex',
        cursor: 'pointer',
        background: theme.palette.surface2.main,
        borderRadius: '16px',
      }}
    >
      <Stack direction={'row'} spacing={4} sx={{ margin: 'auto' }}>
        <AvatarContainer>
          <WalletAvatar src={account.walletIcon} />
          <ChainAvatar src={activeChain?.logoURI} />
        </AvatarContainer>
        <Container
          sx={{
            display: 'grid',
            gridTemplateRows: 'repeat(2, auto)',
            gridTemplateColumns: 'repeat(2, auto)',
            gridGap: '12px',
            justifyItems: 'center',
            alignItems: 'center',
            width: 'fit-content',
            padding: '0 !important',
          }}
        >
          <WalletButton
            sx={{ gridColumn: '1/3', gridRow: '1/2' }}
            onClick={() => handleCopyButton()}
          >
            <Typography variant="lifiBodySmallStrong">
              {walletDigest(account.address)}
            </Typography>
          </WalletButton>

          <WalletButton
            onClick={() => handleExploreButton()}
            sx={{
              gridColumn: '1/2',
              gridRow: '2/3',
            }}
          >
            <OpenInNewIcon sx={{ height: '20px' }} />
          </WalletButton>

          <WalletButton
            colored
            onClick={() => handleDisconnect()}
            sx={{
              gridColumn: '2/3',
              gridRow: '2/3',
            }}
          >
            <PowerSettingsNewIcon sx={{ height: '20px' }} />
          </WalletButton>
        </Container>
      </Stack>
    </Container>
  );
};
