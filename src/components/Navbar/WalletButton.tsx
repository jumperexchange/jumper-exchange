'use client';
import { useChains } from '@/hooks/useChains';
import { useMenuStore } from '@/stores/menu';
import { walletDigest } from '@/utils/walletDigest';
import type { Chain } from '@lifi/sdk';
import {
  getConnectorIcon,
  useAccount,
  useWalletMenu,
} from '@lifi/wallet-management';
import type { Theme } from '@mui/material';
import { Stack, Typography, useMediaQuery } from '@mui/material';
import { usePathname, useRouter } from 'next/navigation';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  DEFAULT_EFFIGY,
  JUMPER_LOYALTY_PATH,
  JUMPER_SCAN_PATH,
} from 'src/const/urls';
import useImageStatus from 'src/hooks/useImageStatus';
import { useLoyaltyPass } from 'src/hooks/useLoyaltyPass';
import { XPIcon } from '../illustrations/XPIcon';
import {
  ConnectButton,
  ImageWalletMenuButton,
  SkeletonWalletMenuButton,
  WalletLabel,
  WalletMenuButton,
  WalletMgmtBadge,
  WalletMgmtChainAvatar,
  WalletMgmtWalletAvatar,
} from './WalletButton.style';

export const WalletButtons = () => {
  const { chains } = useChains();
  const { account } = useAccount();
  const { t } = useTranslation();
  const { isSuccess } = useChains();
  const { openWalletMenu } = useWalletMenu();
  const { points, isLoading } = useLoyaltyPass();
  const router = useRouter();
  const imgLink = `https://effigy.im/a/${account?.address}.png`;
  const isImageValid = useImageStatus(imgLink);
  const isDesktop = useMediaQuery((theme: Theme) => theme.breakpoints.up('md'));
  const pathname = usePathname();

  const { openWalletMenu: _openWalletMenu, setWalletMenuState } = useMenuStore(
    (state) => state,
  );

  const _walletDigest = useMemo(() => {
    return walletDigest(account?.address);
  }, [account?.address]);

  const activeChain = useMemo(
    () => chains?.find((chainEl: Chain) => chainEl.id === account?.chainId),
    [chains, account?.chainId],
  );

  const handleXPClick = () => {
    router.push(JUMPER_LOYALTY_PATH);
  };

  const handleWalletMenuClick = () => {
    setWalletMenuState(!_openWalletMenu);
  };

  return (
    <>
      {!account?.address ? (
        <ConnectButton
          // Used in the widget
          id="connect-wallet-button"
          onClick={(event) => {
            event.stopPropagation();
            openWalletMenu();
          }}
        >
          <Typography
            variant={'bodyMediumStrong'}
            sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
            }}
          >
            {t('navbar.connect')}
          </Typography>
        </ConnectButton>
      ) : (
        <Stack direction="row" spacing={2}>
          {isDesktop && !pathname.includes(JUMPER_SCAN_PATH) && (
            <WalletMenuButton id="wallet-digest-button" onClick={handleXPClick}>
              <ImageWalletMenuButton
                src={isImageValid ? imgLink : DEFAULT_EFFIGY}
                alt="Effigy Wallet Icon"
                width={32}
                height={32}
                priority={false}
                unoptimized={true}
              />
              {isLoading ? (
                <SkeletonWalletMenuButton variant="circular" />
              ) : (
                <Typography
                  variant={'bodyMediumStrong'}
                  width={'auto'}
                  marginRight={1.1}
                  marginLeft={1}
                >
                  {points ?? 0}
                </Typography>
              )}
              <XPIcon size={32} />
            </WalletMenuButton>
          )}
          <WalletMenuButton
            id="wallet-digest-button"
            onClick={handleWalletMenuClick}
          >
            {isSuccess && activeChain ? (
              <WalletMgmtBadge
                overlap="circular"
                className="badge"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                badgeContent={
                  <WalletMgmtChainAvatar
                    src={activeChain?.logoURI || ''}
                    alt={'wallet-avatar'}
                  >
                    {activeChain.name[0]}
                  </WalletMgmtChainAvatar>
                }
              >
                <WalletMgmtWalletAvatar
                  src={getConnectorIcon(account.connector)}
                />
              </WalletMgmtBadge>
            ) : null}
            <WalletLabel variant={'bodyMediumStrong'}>
              {_walletDigest}
            </WalletLabel>
          </WalletMenuButton>
        </Stack>
      )}
    </>
  );
};
