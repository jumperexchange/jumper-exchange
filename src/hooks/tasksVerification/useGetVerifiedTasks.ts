import { useQuery } from '@tanstack/react-query';

interface VerifyTaskResponse {
  id: number;
  questId: string;
  stepId: string;
  timestamp: Date;
}

export async function getVerifiedTasksQuery({
  queryKey: [, address],
}: {
  queryKey: [string, string];
}) {
  const apiBaseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const res = await fetch(`${apiBaseUrl}/tasks_verification/verify/${address}`);

  if (!res.ok) {
    throw new Error('Network error');
  }

  const jsonResponse: { data: VerifyTaskResponse[] } = await res.json();

  if (!jsonResponse) {
    throw new Error('No data found');
  }

  return jsonResponse.data;
}

export const useGetVerifiedTasks = (address?: string) => {
  return useQuery({
    queryKey: ['task_verification', address!],
    queryFn: getVerifiedTasksQuery,
    enabled: !!address,
    refetchInterval: 1000 * 60 * 60,
  });
};
