'use client';

import { useMemo } from 'react';
import { useActiveAccountByChainType } from 'src/hooks/useActiveAccountByChainType';
import { useWalletAddressImg } from 'src/hooks/useAddressImg';
import { useLoyaltyPass } from 'src/hooks/useLoyaltyPass';
import { useChains } from '@/hooks/useChains';
import { useEnsName } from 'wagmi';
import { mainnet } from 'wagmi/chains';
import { getAddressLabel } from 'src/utils/getAddressLabel';
import { getConnectorIcon } from '@lifi/wallet-management';
import type { Chain } from '@lifi/sdk';
import type { Address } from 'viem';
import { walletDigest } from 'src/utils/walletDigest';
import { AppPaths } from 'src/const/urls';
import { useTranslation } from 'react-i18next';
import { usePathnameWithoutLocale } from 'src/hooks/routing/usePathnameWithoutLocale';
import { isEarnFeatureEnabled } from 'src/app/lib/getFeatureFlag';

export const useLevelDisplayData = () => {
  const activeAccount = useActiveAccountByChainType();
  const imageUrl = useWalletAddressImg({
    userAddress: activeAccount?.address,
  });
  const { level, isLoading } = useLoyaltyPass(activeAccount?.address);

  return {
    isLoading,
    imageAlt: activeAccount?.address,
    imageUrl,
    value: level,
  };
};

export const useWalletDisplayData = () => {
  const activeAccount = useActiveAccountByChainType();
  const { chains, isSuccess } = useChains();
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

  const walletConnectorIcon = useMemo(
    () => getConnectorIcon(activeAccount?.connector),
    [activeAccount?.connector],
  );

  return {
    badgeSrc: isSuccess ? activeChain?.logoURI : undefined,
    avatarSrc: walletConnectorIcon,
    label: addressLabel ?? walletDigest(activeAccount?.address),
    isDisconnected: !activeAccount?.address,
  };
};

export const useIsDisconnected = () => {
  const activeAccount = useActiveAccountByChainType();
  return !activeAccount?.address;
};

interface MainLink {
  value: AppPaths;
  label: string;
  subLinks?: AppPaths[];
  testId?: string;
}

export const useMainLinks = () => {
  const { t } = useTranslation();
  const pathname = usePathnameWithoutLocale();

  const isEarnEnabled = isEarnFeatureEnabled();

  const links = useMemo(() => {
    const _links: MainLink[] = [
      {
        value: AppPaths.Main,
        label: t('navbar.links.exchange'),
        subLinks: [AppPaths.Gas],
        testId: 'navbar-exchange-button',
      },
      {
        value: AppPaths.Missions,
        label: t('navbar.links.missions'),
        subLinks: [AppPaths.Missions, AppPaths.Campaign, AppPaths.Zap],
        testId: 'navbar-missions-button',
      },
    ];

    if (isEarnEnabled) {
      _links.push({
        value: AppPaths.Earn,
        label: t('navbar.links.earn'),
        subLinks: [AppPaths.Earn],
        testId: 'navbar-earn-button',
      });
    }
    return _links;
  }, [t, isEarnEnabled]);

  const activeLink = useMemo(
    () =>
      links.find(
        ({ value, subLinks }) =>
          pathname === value ||
          subLinks?.some((subLink) => pathname.startsWith(subLink)),
      ),
    [pathname, links],
  );

  return {
    links,
    activeLink,
  };
};
