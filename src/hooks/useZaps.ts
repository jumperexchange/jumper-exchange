import { useQuery } from '@tanstack/react-query';

interface UseZapsProps {
  chain: string;
  project: string;
  product: string;
  method: string;
  params: any;
}

export const useZaps = (zapParams: UseZapsProps) => {
  const apiBaseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  // request params
  const { chain, project, product, method, params } = zapParams;

  // get data
  const { data, isSuccess, isLoading } = useQuery({
    queryKey: ['zaps', `${chain}-${product}-${project}-${method}`],
    queryFn: async () => {
      if (!chain || !project || !product || !method || !params) {
        return { data: null, isSuccess: false, isLoading: false };
      }

      // post request
      const res = await fetch(`${apiBaseUrl}/zaps/generate-zap-data`, {
        method: 'POST',
        body: JSON.stringify({ chain, product, project, method, params }),
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
