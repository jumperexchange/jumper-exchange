import { useQuery } from '@tanstack/react-query';
import config from '@/config/env-config';
import { ProjectData } from 'src/types/questDetails';

interface UseZapDataProps {
  projectData: ProjectData;
}

export const useZapData = ({ projectData }: UseZapDataProps) => {
  const apiBaseUrl = config.NEXT_PUBLIC_BACKEND_URL;

  return useQuery({
    queryKey: ['zapData', `${projectData.chain}-${projectData.address}-${projectData.project}`],
    queryFn: async () => {
      if (!projectData.chain || !projectData.address || !projectData.project) {
        return { data: null, isSuccess: false, isLoading: false };
      }

      // POST request to get zap data
      const res = await fetch(`${apiBaseUrl}/zaps/get-zap-data`, {
        method: 'POST',
        body: JSON.stringify({
          chain: projectData.chain,
          address: projectData.address,
          project: projectData.project,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) {
        throw new Error(`Failed to fetch zap data: ${res.status}`);
      }

      const resFormatted = await res.json();

      if (!resFormatted || !('data' in resFormatted)) {
        return { data: null, isSuccess: false, isLoading: false };
      }

      const { data } = resFormatted;
      return { data };
    },
    enabled: !!projectData.chain && !!projectData.address && !!projectData.project,
    refetchInterval: 1 * 60 * 1000, // Refetch every minute
  });
};
