import { QueryClient, useQuery } from '@tanstack/react-query';
import config from '@/config/env-config';
import { ONE_HOUR_MS } from 'src/const/time';

interface VerifyTaskResponse {
  id: number;
  questId: string;
  stepId: string;
  timestamp: Date;
}

export async function getVerifiedTasksQuery(
  address: string,
  shouldBustCache?: boolean,
) {
  const apiBaseUrl = config.NEXT_PUBLIC_BACKEND_URL;
  const res = await fetch(
    `${apiBaseUrl}/tasks_verification/verify/${address}${shouldBustCache ? `?cacheBust=${Date.now()}` : ''}`,
  );

  if (!res.ok) {
    throw new Error('Network error');
  }

  const jsonResponse: { data: VerifyTaskResponse[] } = await res.json();

  if (!jsonResponse) {
    throw new Error('No data found');
  }

  return jsonResponse.data;
}

export const updateVerifiedTasksQueryCache = async (
  queryClient: QueryClient,
  address: string,
) => {
  try {
    // Fetch fresh data with cache-busting
    const updatedData = await getVerifiedTasksQuery(address, true);

    // Update the React Query cache with fresh data
    queryClient.setQueryData(['task_verification', address], updatedData);
  } catch (error) {
    console.error('Failed to refetch with cache-busting:', error);
  }
};

export const useGetVerifiedTasks = (address?: string) => {
  return useQuery({
    queryKey: ['task_verification', address!],
    queryFn: () => getVerifiedTasksQuery(address!),
    enabled: !!address,
    refetchInterval: ONE_HOUR_MS,
  });
};
