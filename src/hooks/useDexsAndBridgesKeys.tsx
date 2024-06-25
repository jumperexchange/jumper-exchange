import { useQuery } from '@tanstack/react-query';

export const useDexsAndBridgesKeys = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['tools'],
    queryFn: async () => {
      const apiUrl = process.env.NEXT_PUBLIC_LIFI_API_URL;
      const response = await fetch(`${apiUrl}/tools`);
      const result = await response.json();
      return result;
    },
  });

  return {
    bridgesKeys: data?.bridges
      ? Object.values(data?.bridges).map((elem: any) => elem.key)
      : [],
    exchangesKeys: data?.exchanges
      ? Object.values(data?.exchanges).map((elem: any) => elem.key)
      : [],
    isLoading,
    error,
  };
};
