import { useQuery } from '@tanstack/react-query';

export const useFetchDexsAndBridges = () => {
  const { data, isLoading, error } = useQuery(['tools'], async () => {
    const apiUrl = import.meta.env.VITE_LIFI_API_URL;
    const response = await fetch(`${apiUrl}/tools`);
    const result = await response.json();
    return result;
  });

  return {
    data,
    isLoading,
    error,
  };
};
