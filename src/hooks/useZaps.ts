import type { TokenAmount } from '@lifi/widget';
import { useQuery } from '@tanstack/react-query';

const CHAINS: Record<string, number> = {
  ethereum: 1,
  base: 8453,
};

interface UseZapsProps {
  chain: string;
  project: string;
  product: string;
  method: string;
  params: Record<string, string>;
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

      return {
        data,
        isSuccess: true,
        isLoading: false,
      };
    },
  });

  const token: TokenAmount = {
    chainId: CHAINS[chain],
    address: data?.data?.depositToken.address,
    symbol: data?.data?.depositToken.symbol,
    name: data?.data?.depositToken.name,
    decimals: data?.data?.depositToken.decimals,
    priceUSD: data?.data?.depositToken.priceUSD,
    coinKey: undefined,
    logoURI: data?.data?.depositToken.logoURI,
    amount: BigInt(params.amount),
  };

  return { data, token, isSuccess, isLoading };
};
