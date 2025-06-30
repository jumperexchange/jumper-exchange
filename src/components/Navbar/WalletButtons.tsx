'use client';
import ConnectButton from '@/components/Navbar/ConnectButton';
import {
  TrackingAction,
  TrackingCategory,
  TrackingEventParameter,
} from '@/const/trackingKeys';
import { useWalletAddressImg } from '@/hooks/useAddressImg';
import { useChains } from '@/hooks/useChains';
import { useUserTracking } from '@/hooks/userTracking/useUserTracking';
import { useMenuStore } from '@/stores/menu';
import { getAddressLabel } from '@/utils/getAddressLabel';
import { walletDigest } from '@/utils/walletDigest';
import type { Chain } from '@lifi/sdk';
import { getConnectorIcon } from '@lifi/wallet-management';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { usePathname, useRouter } from 'next/navigation';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { JUMPER_PROFILE_PATH, JUMPER_SCAN_PATH } from 'src/const/urls';
import { useActiveAccountByChainType } from 'src/hooks/useActiveAccountByChainType';
import { useLoyaltyPass } from 'src/hooks/useLoyaltyPass';
import type { Address } from 'viem';
import { useEnsName } from 'wagmi';
import { mainnet } from 'wagmi/chains';
import AvatarBadge from '../AvatarBadge/AvatarBadge';
import {
  SkeletonWalletMenuButton,
  WalletLabel,
  WalletMenuButton,
} from './WalletButton.style';
import useMediaQuery from '@mui/system/useMediaQuery';
import type { Theme } from '@mui/material/styles';

export const WalletButtons = () => {
  const { chains } = useChains();
  const activeAccount = useActiveAccountByChainType();
  const { t } = useTranslation();
  const { isSuccess } = useChains();
  const { level, isLoading } = useLoyaltyPass(activeAccount?.address);
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
  const { trackEvent } = useUserTracking();

  const walletConnectorIcon = useMemo(
    () => getConnectorIcon(activeAccount?.connector),
    [activeAccount?.connector],
  );

  const handleLevelClick = () => {
    router.push(JUMPER_PROFILE_PATH);
  };

  const handleWalletMenuClick = () => {
    setWalletMenuState(!_openWalletMenu);
    if (!_openWalletMenu) {
      // Only track the event if the menu is not already open
      trackEvent({
        category: TrackingCategory.WalletMenu,
        action: TrackingAction.OpenMenu,
        label: 'open_portfolio_menu',
        data: {
          [TrackingEventParameter.Menu]: 'portfolio',
          [TrackingEventParameter.Timestamp]: new Date().toUTCString(),
        },
      });
    }
  };

  return (
    <>
      {!activeAccount?.address ? (
        <ConnectButton />
      ) : (
        <Stack direction="row" spacing={1}>
          {!pathname.includes(JUMPER_SCAN_PATH) && (
            <WalletMenuButton
              id="wallet-digest-button-xp"
              onClick={handleLevelClick}
            >
              <AvatarBadge
                avatarSrc={imgLink}
                alt={`${activeAccount?.address} wallet icon`}
                avatarSize={32}
                maskEnabled={false}
                sx={(theme) => ({
                  border: '2px solid',
                  borderColor: (theme.vars || theme).palette.surface1.main,
                  ...theme.applyStyles('light', {
                    borderColor: (theme.vars || theme).palette.white.main,
                  }),
                })}
              />
              {isDesktop &&
                (isLoading ? (
                  <SkeletonWalletMenuButton variant="circular" />
                ) : (
                  <Typography
                    variant={'bodyMediumStrong'}
                    width={'auto'}
                    marginRight={1.1}
                    marginLeft={1}
                  >
                    {`${t('profile_page.level')} ${level ?? 0}`}
                  </Typography>
                ))}
            </WalletMenuButton>
          )}
          <WalletMenuButton
            id="wallet-digest-button"
            onClick={handleWalletMenuClick}
          >
            {isSuccess && activeChain && (
              <AvatarBadge
                avatarSrc={walletConnectorIcon}
                badgeSrc={activeChain?.logoURI}
                avatarSize={32}
                badgeSize={12}
                badgeGap={4}
                badgeOffset={{ x: 2.5, y: 2.5 }}
                alt={'wallet-avatar'}
                badgeAlt={'chain-avatar'}
                maskEnabled={false}
                sxAvatar={(theme) => ({
                  padding: theme.spacing(0.5),
                })}
                sxBadge={(theme) => ({
                  border: '2px solid',
                  borderColor: (theme.vars || theme).palette.surface1.main,
                  background: 'transparent',
                  ...theme.applyStyles('light', {
                    backgroundColor: (theme.vars || theme).palette.alphaDark900
                      .main,
                    borderColor: (theme.vars || theme).palette.white.main,
                  }),
                })}
                sx={(theme) => ({
                  border: '2px solid',
                  backgroundPosition: 'center',
                  backgroundSize: 'cover',
                  // Use backgroundImage to repeat non-SVG icons in the padding ring; fallback to backgroundColor for SVGs
                  backgroundImage:
                    walletConnectorIcon && !walletConnectorIcon.includes('svg')
                      ? `url(${walletConnectorIcon})`
                      : 'none',
                  backgroundColor: (theme.vars || theme).palette.black.main,
                  borderColor: (theme.vars || theme).palette.surface1.main,
                  ...theme.applyStyles('light', {
                    backgroundColor: (theme.vars || theme).palette.alphaDark900
                      .main,
                    borderColor: (theme.vars || theme).palette.white.main,
                  }),
                })}
              />
            )}
            {isDesktop && (
              <WalletLabel variant={'bodyMediumStrong'}>
                {addressLabel ?? walletDigest(activeAccount?.address)}
              </WalletLabel>
            )}
          </WalletMenuButton>
        </Stack>
      )}
    </>
  );
};
