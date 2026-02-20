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
import type { PortfolioBalance, WalletToken } from '@/types/tokens';
import { zeroAddress } from 'viem';
import type { ChainId } from '@lifi/sdk';
import { useChains } from '../useChains';
import { useCallback } from 'react';
import { usePortfolioFormatters } from '../tokens/usePortfolioFormatters';
import type { SummaryData } from '@/providers/PortfolioProvider/types';

export const usePortfolioTracking = () => {
  const { trackEvent } = useUserTracking();
  const { getChainById } = useChains();
  const { toAggregatedAmountUSD } = usePortfolioFormatters();

  const trackPortfolioPageOverviewEvent = useCallback(
    (addresses: string[], summary: SummaryData) => {
      const trackingData = parseEarnPortfolioDataToTrackingData(
        addresses,
        summary,
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
    (
      totalValue: number,
      data: Record<string, PortfolioBalance<WalletToken>[]>,
    ) => {
      const returnNativeTokenAddresses = (chainsIds: ChainId[]) =>
        chainsIds.map(
          (chainId) =>
            getChainById(chainId)?.nativeToken?.address ?? zeroAddress,
        );

      const trackingData = parsePortfolioDataToTrackingData(
        totalValue,
        data,
        returnNativeTokenAddresses,
        toAggregatedAmountUSD,
      );

      trackEvent({
        category: TrackingCategory.WalletMenu,
        action: TrackingAction.PortfolioOverview,
        label: 'portfolio_balance_overview',
        enableAddressable: true,
        data: trackingData,
      });
    },
    [trackEvent, getChainById, toAggregatedAmountUSD],
  );

  return {
    trackPortfolioPageOverviewEvent,
    trackPortfolioBalanceLoadedEvent,
    trackPortfolioMenuOverviewEvent,
  };
};
