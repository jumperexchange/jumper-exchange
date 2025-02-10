import type { QueryFunction } from '@tanstack/react-query';
import { useQueryClient } from '@tanstack/react-query';
import type { SpindlFetchParams } from 'src/types/spindl';

export const useCallRequest = () => {
  const queryClient = useQueryClient();

  const fetchData = async (
    queryFn: QueryFunction,
    params: SpindlFetchParams,
  ) => {
    try {
      const data = await queryClient.fetchQuery({
        queryKey: Object.values(params), // Use params as the query key
        queryFn, // Pass the query function
        staleTime: 1000 * 60 * 60, // Cache for 1 hour
      });
      return data;
    } catch (error) {
      console.error(error);
      throw error; // Re-throw the error so it can be handled by the caller
    }
  };

  return { fetchData };
};
