'use client';

import { useMemo } from 'react';
import { getLevelBasedOnPoints } from 'src/components/ProfilePage/utils/getLevelBasedOnPoints';
import { getLevelProgress } from 'src/components/ProfilePage/utils/getLevelProgress';
import { usePerks } from 'src/hooks/perks/usePerks';
import { useUnlockedPerks } from 'src/hooks/perks/useUnlockedPerks';
import { useActiveAccountByChainType } from 'src/hooks/useActiveAccountByChainType';
import { useLoyaltyPass } from 'src/hooks/useLoyaltyPass';
import { useChains } from '@/hooks/useChains';
import { useEnsName } from 'wagmi';
import { mainnet } from 'wagmi/chains';
import { getAddressLabel } from 'src/utils/getAddressLabel';
import {
  getConnectorIcon,
  useAccount,
} from '@jumperexchange/wallet-management';
import type { Chain } from '@lifi/sdk';
import type { Address } from 'viem';
import { walletDigest } from 'src/utils/walletDigest';
import { AppPaths } from 'src/const/urls';
import { useTranslation } from 'react-i18next';
import { usePathnameWithoutLocale } from 'src/hooks/routing/usePathnameWithoutLocale';
import {
  isEarnFeatureEnabled,
  isPortfolioFeatureEnabled,
} from 'src/app/lib/getFeatureFlag';
import { useABTest } from '@/hooks/useABTest';
import { AB_TEST_NAME } from '@/const/abtests';

export const usePassDisplayData = () => {
  // Use the primary connected account (same source as ProfileContext /
  // JumperPassCard) so the navbar's perk count matches the Jumper Pass card.
  // useActiveAccountByChainType can resolve to a different (e.g. non-EVM)
  // account than the loyalty pass is keyed on, which reported 0 perks.
  const { account } = useAccount();
  const { points, isLoading } = useLoyaltyPass(account?.address);
  const { perks, isLoading: arePerksLoading } = usePerks();
  const { unlockedPerks } = useUnlockedPerks(perks, account?.address);
  const levelData = getLevelBasedOnPoints(points);

  return {
    progress: getLevelProgress(points, levelData),
    unlockedPerksCount: unlockedPerks.length,
    points,
    level: levelData.level,
    isLoading: isLoading || arePerksLoading,
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
    activeChain: isSuccess ? activeChain : undefined,
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
  const { account } = useAccount();

  const isEarnEnabled = isEarnFeatureEnabled();
  const isPortfolioEnabled = isPortfolioFeatureEnabled();

  const tradeABTest = useABTest({
    feature: AB_TEST_NAME.A_B_TEST_TRADE_DISPLAY,
    address: account?.address ?? '',
  });

  const links = useMemo(() => {
    const _links: MainLink[] = [
      {
        value: AppPaths.Main,
        label:
          tradeABTest.isEnabled && tradeABTest.value === 'test'
            ? t('navbar.links.trade')
            : t('navbar.links.exchange'),
        subLinks: [AppPaths.Gas, AppPaths.Private],
        testId: 'navbar-exchange-button',
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

    if (isPortfolioEnabled) {
      _links.push({
        value: AppPaths.Portfolio,
        label: t('navbar.links.portfolio'),
        subLinks: [AppPaths.Portfolio],
        testId: 'navbar-portfolio-button',
      });
    }

    _links.push({
      value: AppPaths.Missions,
      label: t('navbar.links.missions'),
      subLinks: [AppPaths.Missions, AppPaths.Campaign, AppPaths.Zap],
      testId: 'navbar-missions-button',
    });

    return _links;
  }, [t, isEarnEnabled, isPortfolioEnabled, tradeABTest]);

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
