import { useQuery } from '@tanstack/react-query';

// The useDexsAndBridges hook fetches a list of DEXs and bridges from the LiFi API.
// It uses environment variables for API URLs to ensure secure and environment-specific configurations.
export const useDexsAndBridges = () => {
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
    bridges: data?.bridges,
    exchanges: data?.exchanges,
    isLoading,
    error,
  };
};
