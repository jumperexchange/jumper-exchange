import { useQuery } from '@tanstack/react-query';
import { pick } from 'lodash';
import getApiUrl from '@/utils/getApiUrl';
import { getQueryKey } from '@/utils/queries/getQueryKey';

interface LimitOrderTool {
  key: string;
  name: string;
  logoURI: string;
}

interface LimitOrderToolsResponse {
  bridges: LimitOrderTool[];
  exchanges: LimitOrderTool[];
}

export const useLimitOrdersTools = () => {
  const {
    data: tools,
    isLoading,
    error,
  } = useQuery({
    queryKey: [getQueryKey('limit-order-tools')],
    queryFn: async () => {
      const apiUrl = getApiUrl({ isLimitVariant: true });
      const response = await fetch(`${apiUrl}/tools`);
      return (await response.json()) as LimitOrderToolsResponse;
    },
    select: (data) =>
      [...data.bridges, ...data.exchanges].map((tool) =>
        pick(tool, ['key', 'name', 'logoURI']),
      ),
  });

  return { tools, isLoading, error };
};
