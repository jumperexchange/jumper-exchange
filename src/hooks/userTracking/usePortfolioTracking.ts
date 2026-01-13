import {
  parseEarnPortfolioDataToTrackingData,
  parsePortfolioDataToTrackingData,
} from '@/utils/tracking/portfolio';
import { useUserTracking } from './useUserTracking';
import {
  TrackingCategory,
  TrackingAction,
  TrackingEventParameter,
} from '@/const/trackingKeys';
import type { DefiPosition } from '@/types/jumper-backend';
import type { MinimalToken } from '@/types/tokens';
import type { CacheToken } from '@/types/portfolio';
import { zeroAddress } from 'viem';
import type { ChainId } from '@lifi/sdk';
import { useChains } from '../useChains';
import { useCallback } from 'react';

export const usePortfolioTracking = () => {
  const { trackEvent } = useUserTracking();
  const { getChainById } = useChains();

  const trackPortfolioPageOverviewEvent = useCallback(
    (
      addresses: string[],
      tokens: MinimalToken[],
      defiPositionGroups: DefiPosition[][],
    ) => {
      const trackingData = parseEarnPortfolioDataToTrackingData(
        addresses,
        tokens,
        defiPositionGroups,
      );
      trackEvent({
        category: TrackingCategory.Portfolio,
        action: TrackingAction.PortfolioPageOverview,
        label: 'portfolio_page_overview',
        data: trackingData,
      });
    },
    [trackEvent],
  );

  const trackPortfolioBalanceLoadedEvent = useCallback(() => {
    trackEvent({
      category: TrackingCategory.Wallet,
      action: TrackingAction.PortfolioLoaded,
      label: 'portfolio_balance_loaded',
      data: {
        [TrackingEventParameter.Status]: 'success',
        [TrackingEventParameter.Timestamp]: new Date().toUTCString(),
      },
    });
  }, [trackEvent]);

  const trackPortfolioMenuOverviewEvent = useCallback(
    (totalValue: number, data: CacheToken[]) => {
      const returnNativeTokenAddresses = (chainsIds: ChainId[]) =>
        chainsIds.map(
          (chainId) =>
            getChainById(chainId)?.nativeToken?.address ?? zeroAddress,
        );

      const trackingData = parsePortfolioDataToTrackingData(
        totalValue,
        data,
        returnNativeTokenAddresses,
      );

      trackEvent({
        category: TrackingCategory.WalletMenu,
        action: TrackingAction.PortfolioOverview,
        label: 'portfolio_balance_overview',
        enableAddressable: true,
        data: trackingData,
      });
    },
    [trackEvent, getChainById],
  );

  return {
    trackPortfolioPageOverviewEvent,
    trackPortfolioBalanceLoadedEvent,
    trackPortfolioMenuOverviewEvent,
  };
};
