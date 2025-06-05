import { useQuery } from '@tanstack/react-query';
import getApiUrl from '@/utils/getApiUrl';

export const useDexsAndBridges = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['tools'],
    queryFn: async () => {
      const apiUrl = getApiUrl();
      // The widget query is automatically adding ? at the end of the URL,
      // so adding it there will avoid to duplicated the api call.
      const response = await fetch(`${apiUrl}/tools?`);
      const result = await response.json();
      return result;
    },
  });

  return {
    bridges: data?.bridges,
    exchanges: data?.exchanges,
    isLoading,
    error,
  };
};
