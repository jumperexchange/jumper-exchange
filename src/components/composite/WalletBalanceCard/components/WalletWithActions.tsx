import type { Account } from '@lifi/widget-provider';
import {
  getConnectorIcon,
  useAccountDisconnect,
} from '@lifi/wallet-management';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import { Stack, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import AvatarBadge from 'src/components/AvatarBadge/AvatarBadge';
import { ButtonTransparent } from 'src/components/Button';
import { JUMPER_SCAN_PATH } from 'src/const/urls';
import {
  TrackingAction,
  TrackingCategory,
  TrackingEventParameter,
} from '@/const/trackingKeys';
import { useDominantColorFromImage } from '@/hooks/images/useGetColorsFromImage';
import { useChains } from '@/hooks/useChains';
import { useMultisig } from '@/hooks/useMultisig';
import { useUserTracking } from '@/hooks/userTracking/useUserTracking';
import { useMenuStore } from '@/stores/menu';
import { openInNewTab } from '@/utils/openInNewTab';
import { walletDigest } from '@/utils/walletDigest';
import {
  DarkIconButton,
  SecondaryIconButton,
  WalletBalanceSharedContainer,
  WalletInfoContainer,
} from '../WalletBalanceCard.styles';

interface WalletWithActionsProps {
  account: Account;
}
export const WalletWithActions = ({ account }: WalletWithActionsProps) => {
  const { t } = useTranslation();

  const disconnectWallet = useAccountDisconnect();
  const { trackEvent } = useUserTracking();
  const { chains } = useChains();
  const { isSafe } = useMultisig();
  const router = useRouter();
  const activeChain = useMemo(
    () => chains?.find((chainEl) => chainEl.id === account.chainId),
    [chains, account.chainId],
  );

  const walletSrc = useMemo(
    () => getConnectorIcon(account?.connector),
    [account?.connector],
  );

  const dominantColor = useDominantColorFromImage(walletSrc ?? '', false, true);

  const chainSrc = activeChain?.logoURI;

  const { closeAllMenus, setSnackbarState } = useMenuStore((state) => state);

  const handleExploreButton = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    const blockchainExplorerUrl = activeChain?.metamask?.blockExplorerUrls?.[0];
    const url = `${blockchainExplorerUrl}/address/${account.address}`;

    trackEvent({
      category: TrackingCategory.WalletMenu,
      action: TrackingAction.OpenBlockchainExplorer,
      label: 'open-blockchain-explorer-wallet',
    });
    if (blockchainExplorerUrl) {
      trackEvent({
        category: TrackingCategory.Pageload,
        action: TrackingAction.PageLoad,
        label: 'pageload-explorer',
        data: {
          [TrackingEventParameter.PageloadSource]: TrackingCategory.Wallet,
          [TrackingEventParameter.PageloadDestination]: 'blokchain-explorer',
          [TrackingEventParameter.PageloadURL]: url || '',
          [TrackingEventParameter.PageloadExternal]: true,
        },
      });
      openInNewTab(url);
    }
  };

  const handleScanButton = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    account.chainId && closeAllMenus();
    const url = `${JUMPER_SCAN_PATH}/wallet/${account.address}`;

    trackEvent({
      category: TrackingCategory.WalletMenu,
      action: TrackingAction.OpenJumperScan,
      label: 'open-jumper-scan-wallet',
    });
    router.push(url);
  };

  const handleCopyButton = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    if (isSafe) {
      return;
    }
    account.address && navigator.clipboard.writeText(account.address);
    setSnackbarState(true, t('navbar.walletMenu.copiedMsg'), 'success');
    trackEvent({
      category: TrackingCategory.WalletMenu,
      action: TrackingAction.CopyAddressToClipboard,
      label: 'copy_addr_to_clipboard',
    });
  };

  const handleDisconnect = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    const walletAddress = account.address;
    if (!walletAddress) {
      return;
    }

    disconnectWallet(account);

    trackEvent({
      category: TrackingCategory.WalletMenu,
      action: TrackingAction.DisconnectWallet,
      label: 'disconnect_wallet',
    });
  };
  return (
    <WalletBalanceSharedContainer disableGutters>
      <WalletInfoContainer>
        <AvatarBadge
          avatarSrc={walletSrc}
          badgeSrc={chainSrc}
          avatarSize={40}
          // We need to account for the border
          badgeSize={20}
          badgeOffset={{ x: 7, y: 2.5 }}
          alt={'wallet-avatar'}
          badgeAlt={'chain-avatar'}
          maskEnabled={false}
          sxAvatar={(theme) => ({
            padding: theme.spacing(0.1),
          })}
          sxBadge={(theme) => ({
            border: '2px solid',
            borderColor: (theme.vars || theme).palette.surface1.main,
            background: 'transparent',
            ...theme.applyStyles('light', {
              backgroundColor: (theme.vars || theme).palette.alphaDark900.main,
            }),
          })}
          sx={(theme) => ({
            border: '2px solid',
            borderColor: (theme.vars || theme).palette.surface1.main,
            backgroundColor:
              dominantColor ?? (theme.vars || theme).palette.black.main,
            ...theme.applyStyles('light', {
              backgroundColor:
                dominantColor ??
                (theme.vars || theme).palette.alphaDark900.main,
            }),
          })}
        />

        <ButtonTransparent
          size="small"
          disabled={isSafe}
          onClick={handleCopyButton}
          sx={(_theme) => ({
            background: 'transparent !important',
          })}
        >
          <Typography variant="bodyMediumStrong">
            {walletDigest(account.address)}
          </Typography>
        </ButtonTransparent>
      </WalletInfoContainer>
      <Stack
        direction="row"
        spacing={1}
        sx={{
          alignItems: 'flex-end',
        }}
      >
        <DarkIconButton size="small" onClick={handleExploreButton}>
          <OpenInNewIcon sx={{ height: 20, width: 20 }} />
        </DarkIconButton>
        <DarkIconButton size="small" onClick={handleScanButton}>
          <ReceiptLongIcon sx={{ height: 20, width: 20 }} />
        </DarkIconButton>
        <SecondaryIconButton
          id="disconnect-wallet-button"
          size="small"
          onClick={handleDisconnect}
          sx={{ minWidth: 'auto' }}
        >
          <PowerSettingsNewIcon sx={{ height: 20, width: 20 }} />
        </SecondaryIconButton>
      </Stack>
    </WalletBalanceSharedContainer>
  );
};
