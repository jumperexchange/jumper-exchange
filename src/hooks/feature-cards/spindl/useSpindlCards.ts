import { useAccount } from '@jumperexchange/wallet-management';
import {
  useWidgetEvents,
  WidgetEvent,
  type RouteExecutionUpdate,
} from '@jumperexchange/widget';
import { useCallback, useEffect } from 'react';
import { useCallRequest } from '@/hooks/useCallRequest';
import { isSpindlFetchResponse, type SpindlFetchParams } from '@/types/spindl';
import { getLocale } from '@/utils/getLocale';
import { fetchSpindlCards } from './fetchSpindlCards';
import { useSpindlProcessData } from './useSpindlProcessData';

export const useSpindlCards = () => {
  const { account } = useAccount();
  const widgetEvents = useWidgetEvents();
  const processSpindlData = useSpindlProcessData();
  const { fetchData } = useCallRequest();

  const fetchSpindlData = useCallback(
    async ({ country, chainId, tokenAddress, address }: SpindlFetchParams) => {
      const locale = getLocale().split('-');
      const queryParams: SpindlFetchParams = {
        country: country || locale[1],
        chainId,
        tokenAddress,
        address,
      };

      const queryFn = () => fetchSpindlCards(queryParams);

      try {
        const response = await fetchData(queryFn, queryParams);
        if (isSpindlFetchResponse(response)) {
          processSpindlData(response);
        } else {
          console.error('Invalid Spindl API response:', response);
        }
      } catch (error) {
        console.error('Error fetching Spindl data:', error);
      }
    },
    [fetchData, processSpindlData],
  );

  useEffect(() => {
    const handleRouteUpdated = async (route: RouteExecutionUpdate) => {
      await fetchSpindlData({
        address: account?.address,
        chainId: route.route.toToken.chainId,
        tokenAddress: route.route.toToken.address,
      });
    };

    widgetEvents.on(WidgetEvent.RouteExecutionUpdated, handleRouteUpdated);

    return () => {
      widgetEvents.off(WidgetEvent.RouteExecutionUpdated, handleRouteUpdated);
    };
  }, [account?.address, fetchSpindlData, widgetEvents]);

  return { fetchSpindlData };
};
