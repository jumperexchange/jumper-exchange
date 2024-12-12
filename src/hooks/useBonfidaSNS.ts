import { useQuery } from '@tanstack/react-query';
import { checkAddressType } from 'src/utils/checkAddressType';

interface UseBonfidaSNSProps {
  walletAddress?: string;
}

export const useBonfidaSNS = ({ walletAddress }: UseBonfidaSNSProps) => {
  const addressType = checkAddressType(walletAddress);
  const { data, isLoading, isError, isSuccess } = useQuery({
    queryKey: ['bonfida', walletAddress],
    enabled: addressType === 'sol',
    queryFn: async () => {
      const response = await fetch(
        `https://sns-sdk-proxy.bonfida.workers.dev/reverse-lookup/${walletAddress}`,
      );
      const result = await response.json();
      return result;
    },
  });

  return {
    data:
      data?.s !== 'error' || data?.result !== 'Invalid input'
        ? data?.result
        : undefined,
    address: walletAddress,
    isLoading,
    isSuccess,
    isError,
  };
};
