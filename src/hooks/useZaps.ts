import { useQuery } from '@tanstack/react-query';

interface UseZapsProps {
  chain: string;
  address: string;
  project: string;
}

export const useZaps = (zapParams: UseZapsProps) => {
  const apiBaseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  // request params
  const { chain, address, project } = zapParams;

  // get data
  const { data, isSuccess, isLoading } = useQuery({
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
  });

  return { data, isSuccess, isLoading };
};
