import { useQuery } from '@tanstack/react-query';
import config from '@/config/env-config';

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
  return useQuery({
    queryKey: ['zaps', `${chain}-${address}-${project}`],
    queryFn: async () => {
      if (!chain || !address || !project) {
        return { data: null, isSuccess: false, isLoading: false };
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
        return undefined;
      }

      const resFormatted = await res.json();

      if (!resFormatted || !('data' in resFormatted)) {
        return { data: null, isSuccess: false, isLoading: false };
      }

      const { data } = resFormatted;

      return { data };
    },
    enabled: !!chain && !!address && !!project,
    refetchInterval: 1 * 60 * 1000,
  });
};
