'use client';
import ConnectButton from '@/components/Navbar/ConnectButton';
import { useWalletAddressImg } from '@/hooks/useAddressImg';
import { useChains } from '@/hooks/useChains';
import { useMenuStore } from '@/stores/menu';
import { getAddressLabel } from '@/utils/getAddressLabel';
import { walletDigest } from '@/utils/walletDigest';
import type { Chain } from '@lifi/sdk';
import { getConnectorIcon } from '@lifi/wallet-management';
import type { Theme } from '@mui/material';
import { Stack, Typography, useMediaQuery } from '@mui/material';
import { usePathname, useRouter } from 'next/navigation';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { JUMPER_LOYALTY_PATH, JUMPER_SCAN_PATH } from 'src/const/urls';
import { useActiveAccountByChainType } from 'src/hooks/useActiveAccountByChainType';
import { useLoyaltyPass } from 'src/hooks/useLoyaltyPass';
import type { Address } from 'viem';
import { useEnsName } from 'wagmi';
import { mainnet } from 'wagmi/chains';
import { XPIcon } from '../illustrations/XPIcon';
import {
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
  const activeAccount = useActiveAccountByChainType();
  const { t } = useTranslation();
  const { isSuccess } = useChains();
  const { points, isLoading } = useLoyaltyPass(activeAccount?.address);
  const router = useRouter();
  const imgLink = useWalletAddressImg({
    userAddress: activeAccount?.address,
  });
  const isDesktop = useMediaQuery((theme: Theme) => theme.breakpoints.up('md'));
  const pathname = usePathname();

  const { openWalletMenu: _openWalletMenu, setWalletMenuState } = useMenuStore(
    (state) => state,
  );

  const { data: ensName, isSuccess: isSuccessEnsName } = useEnsName({
    address: activeAccount?.address as Address | undefined,
    chainId: mainnet.id,
  });
  const addressLabel = getAddressLabel({
    isSuccess: isSuccessEnsName,
    ensName,
    address: activeAccount?.address,
  });

  const activeChain = useMemo(
    () =>
      chains?.find((chainEl: Chain) => chainEl.id === activeAccount?.chainId),
    [chains, activeAccount?.chainId],
  );

  const handleXPClick = () => {
    router.push(JUMPER_LOYALTY_PATH);
  };

  const handleWalletMenuClick = () => {
    setWalletMenuState(!_openWalletMenu);
  };

  return (
    <>
      {!activeAccount?.address ? (
        <ConnectButton />
      ) : (
        <Stack direction="row" spacing={2}>
          {isDesktop && !pathname.includes(JUMPER_SCAN_PATH) && (
            <WalletMenuButton id="wallet-digest-button" onClick={handleXPClick}>
              <ImageWalletMenuButton
                src={imgLink}
                alt={`${activeAccount?.address} wallet Icon`}
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
                  {points ? t('format.decimal2Digit', { value: points }) : 0}
                </Typography>
              )}
              <XPIcon sx={{ width: 32, height: 32 }} />
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
                  src={getConnectorIcon(activeAccount?.connector)}
                />
              </WalletMgmtBadge>
            ) : null}
            <WalletLabel variant={'bodyMediumStrong'}>
              {addressLabel ?? walletDigest(activeAccount?.address)}
            </WalletLabel>
          </WalletMenuButton>
        </Stack>
      )}
    </>
  );
};
