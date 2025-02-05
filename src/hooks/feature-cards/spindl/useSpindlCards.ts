import { useAccount } from '@lifi/wallet-management';
import {
  useWidgetEvents,
  WidgetEvent,
  type RouteExecutionUpdate,
} from '@lifi/widget';
import { useCallback, useMemo, useState } from 'react';
import type { SpindlFetchData, SpindlFetchParams } from 'src/types/spindl';
import { getLocale } from 'src/utils/getLocale';
import { useCallRequest } from '../../useCallRequest';
import { getSpindlConfig } from './spindlConfig';
import { useSpindlProcessData } from './useSpindlProcessData';

const FETCH_SPINDL_PATH = '/render/jumper';

export const useSpindlCards = () => {
  const { account } = useAccount();
  const widgetEvents = useWidgetEvents();
  const [params, setParams] = useState<Record<string, string | undefined>>();
  const processSpindlData = useSpindlProcessData();
  const spindlConfig = getSpindlConfig();

  const { data, error, refetch } = useCallRequest<SpindlFetchData>({
    method: 'GET',
    path: FETCH_SPINDL_PATH,
    apiUrl: spindlConfig?.apiUrl,
    headers: spindlConfig?.headers,
    queryParams: params,
    errors: {
      missingParams: 'Spindl configuration is missing',
      error: 'HTTP error while fetching Spindl cards!',
    },
    enabled: false, // Start with the query disabled and trigger on refetch
  });

  const fetchSpindlData = useCallback(
    ({ country, chainId, tokenAddress, address }: SpindlFetchParams) => {
      const locale = getLocale().split('-');
      const queryParams: Record<string, string | undefined> = {
        placement_id: 'notify_message',
        limit: '2',
        address,
        country: country || locale[1],
        chain_id: chainId?.toString(),
        token_address: tokenAddress,
      };
      setParams(queryParams);
      refetch();
      processSpindlData(data);
    },
    [data, processSpindlData, refetch],
  );

  const spindlCards = useMemo(() => {
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

  if (error) {
    console.error('Error fetching Spindl data:', error);
    return null;
  }

  return spindlCards;
};
