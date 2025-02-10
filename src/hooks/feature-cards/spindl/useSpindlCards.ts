import { useAccount } from '@lifi/wallet-management';
import {
  useWidgetEvents,
  WidgetEvent,
  type RouteExecutionUpdate,
} from '@lifi/widget';
import { useCallback, useEffect } from 'react';
import { useCallRequest } from 'src/hooks/useCallRequest';
import {
  isSpindlFetchResponse,
  type SpindlFetchData,
  type SpindlFetchParams,
} from 'src/types/spindl';
import { callRequest } from 'src/utils/callRequest';
import { getLocale } from 'src/utils/getLocale';
import { getSpindlConfig } from './spindlConfig';
import { useSpindlProcessData } from './useSpindlProcessData';

const FETCH_SPINDL_PATH = '/render/jumper';

export const useSpindlCards = () => {
  const { account } = useAccount();
  const widgetEvents = useWidgetEvents();
  const processSpindlData = useSpindlProcessData();
  const spindlConfig = getSpindlConfig();
  const { fetchData } = useCallRequest();

  const fetchSpindlData = useCallback(
    async ({ country, chainId, tokenAddress, address }: SpindlFetchParams) => {
      const locale = getLocale().split('-');
      const queryParams: Record<string, string | undefined> = {
        placement_id: 'notify_message',
        limit: '2',
        address,
        country: country || locale[1],
        chain_id: chainId?.toString(),
        token_address: tokenAddress,
      };

      const queryFn = async () =>
        callRequest<SpindlFetchData>({
          method: 'GET',
          path: FETCH_SPINDL_PATH,
          apiUrl: spindlConfig.apiUrl,
          headers: spindlConfig.headers,
          queryParams,
        });

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
    [fetchData, processSpindlData, spindlConfig.apiUrl, spindlConfig.headers],
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
