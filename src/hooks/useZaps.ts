import { useQuery } from '@tanstack/react-query';
import config from '@/config/env-config';
import { ZapDataResponse } from 'src/providers/ZapInitProvider/ModularZaps/zap.jumper-backend';

interface UseZapsProps {
  chain?: string;
  address?: string;
  project?: string;
}

export const useZaps = (input: UseZapsProps) => {
  const chain = input?.chain;
  const address = input?.address;
  const project = input?.project;

  const apiBaseUrl = config.NEXT_PUBLIC_BACKEND_URL;

  // get data
  return useQuery<{ data: ZapDataResponse | null }>({
    queryKey: ['zaps', `${chain}-${address}-${project}`],
    queryFn: async () => {
      if (!chain || !address || !project) {
        throw new Error('No chain, address, or project');
      }

      // post request
      const res = await fetch(`${apiBaseUrl}/zaps/get-zap-data`, {
        method: 'POST',
        body: JSON.stringify({ chain, address, project }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) {
        throw new Error('Failed to fetch zap data');
      }

      const resFormatted = await res.json();

      if (!resFormatted || !('data' in resFormatted)) {
        throw new Error('Corrupted data from fetch zap data');
      }

      const { data } = resFormatted as { data: ZapDataResponse };

      return { data };
    },
    enabled: !!chain && !!address && !!project,
    refetchInterval: 1 * 60 * 1000,
  });
};
