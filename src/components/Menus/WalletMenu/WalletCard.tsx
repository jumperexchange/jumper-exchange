import { WalletCardStack } from '@/components/Menus/WalletMenu/WalletCardStack';
import {
  TrackingAction,
  TrackingCategory,
  TrackingEventParameter,
} from '@/const/trackingKeys';
import { useChains } from '@/hooks/useChains';
import { useMultisig } from '@/hooks/useMultisig';
import { useUserTracking } from '@/hooks/userTracking/useUserTracking';
import { useMenuStore } from '@/stores/menu';
import { usePortfolioStore } from '@/stores/portfolio';
import { openInNewTab } from '@/utils/openInNewTab';
import { walletDigest } from '@/utils/walletDigest';
import type { Account } from '@lifi/wallet-management';
import {
  getConnectorIcon,
  useAccountDisconnect,
} from '@lifi/wallet-management';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import { Skeleton, Stack, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ButtonSecondary } from 'src/components/Button';
import { JUMPER_SCAN_PATH } from 'src/const/urls';
import {
  Button,
  WalletAvatar,
  WalletCardBadge,
  WalletCardContainer,
  WalletChainAvatar,
} from './WalletCard.style';

interface WalletCardProps {
  account: Account;
}

export const WalletCard = ({ account }: WalletCardProps) => {
  const { t } = useTranslation();
  const disconnectWallet = useAccountDisconnect();
  const { trackEvent } = useUserTracking();
  const { chains } = useChains();
  const { checkMultisigEnvironment } = useMultisig();
  const [isMultisigEnvironment, setIsMultisigEnvironment] = useState(false);
  const router = useRouter();
  const activeChain = useMemo(
    () => chains?.find((chainEl) => chainEl.id === account.chainId),
    [chains, account.chainId],
  );
  const deleteCacheTokenAddress = usePortfolioStore(
    (state) => state.deleteCacheTokenAddress,
  );
  const { closeAllMenus, setSnackbarState } = useMenuStore((state) => state);

  const handleMultisigEnvironmentCheck = useCallback(async () => {
    const response = await checkMultisigEnvironment();

    setIsMultisigEnvironment(response);
    // Check MultisigEnvironment only on first render
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    handleMultisigEnvironmentCheck();
  }, [account, handleMultisigEnvironmentCheck]);

  const handleExploreButton = () => {
    const blockchainExplorerUrl = activeChain?.metamask?.blockExplorerUrls?.[0];

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
          [TrackingEventParameter.PageloadURL]: blockchainExplorerUrl || '',
          [TrackingEventParameter.PageloadExternal]: true,
        },
      });
      openInNewTab(blockchainExplorerUrl);
    }
  };

  const handleScanButton = () => {
    account.chainId && closeAllMenus();
    const url = `${JUMPER_SCAN_PATH}/wallet/${account.address}`;

    trackEvent({
      category: TrackingCategory.WalletMenu,
      action: TrackingAction.OpenJumperScan,
      label: 'open-jumper-scan-wallet',
    });
    router.push(url);
  };

  const handleCopyButton = () => {
    if (isMultisigEnvironment) {
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

  const handleDisconnect = () => {
    if (!account?.address) {
      return;
    }

    disconnectWallet(account);
    deleteCacheTokenAddress(account.address);
    trackEvent({
      category: TrackingCategory.WalletMenu,
      action: TrackingAction.DisconnectWallet,
      label: 'disconnect_wallet',
    });
  };

  return (
    <WalletCardContainer disableGutters>
      <WalletCardStack>
        <WalletCardBadge
          overlap="circular"
          className="badge"
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          badgeContent={
            activeChain?.logoURI ? (
              <WalletChainAvatar
                src={activeChain?.logoURI || ''}
                alt={'wallet-avatar'}
                sx={{ width: 18, height: 18 }}
              />
            ) : (
              <Skeleton variant="circular" />
            )
          }
        >
          <WalletAvatar src={getConnectorIcon(account.connector)} />
        </WalletCardBadge>
        <Button
          size="small"
          disabled={isMultisigEnvironment}
          onClick={() => handleCopyButton()}
          sx={(theme) => ({
            background: 'transparent',
            '&:hover': {
              backgroundColor:
                theme.palette.mode === 'dark'
                  ? theme.palette.alphaLight300.main
                  : theme.palette.white.main,
            },
          })}
        >
          <Typography variant="bodySmallStrong" sx={{ fontSize: '16px' }}>
            {walletDigest(account.address)}
          </Typography>
        </Button>
        <Stack direction="row" alignItems="flex-end" spacing={1}>
          <Button size="small" onClick={() => handleExploreButton()}>
            <OpenInNewIcon sx={{ height: '16px' }} />
          </Button>
          <Button size="small" onClick={() => handleScanButton()}>
            <ReceiptLongIcon sx={{ height: '16px' }} />
          </Button>
          <ButtonSecondary
            size="small"
            onClick={() => {
              handleDisconnect();
            }}
            sx={{ minWidth: 'auto' }}
          >
            <PowerSettingsNewIcon sx={{ height: '16px' }} />
          </ButtonSecondary>
        </Stack>
      </WalletCardStack>
    </WalletCardContainer>
  );
};
