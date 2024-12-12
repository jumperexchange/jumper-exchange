import { useENSSNS } from './useENSSNS';

export const useWalletLabel = (address?: string) => {
  const { name, isSuccess, isError } = useENSSNS(address);

  return { name, isSuccess, isError };
};
