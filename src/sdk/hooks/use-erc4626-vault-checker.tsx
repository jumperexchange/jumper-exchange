import { useQuery } from '@tanstack/react-query';
import { isERC4626VaultAddressValid } from '../utils';

export const useErc4626VaultChecker = ({
  chain_id,
  contract_address,
}: {
  chain_id: number;
  contract_address: string | null | undefined;
}) => {
  return useQuery({
    queryKey: [
      'contracts',
      chain_id,
      contract_address && contract_address.trim().toLowerCase(),
    ],
    queryFn: async () => {
      try {
        if (!contract_address) {
          return false;
        } else {
          const res = await isERC4626VaultAddressValid(
            chain_id,
            contract_address,
          );

          return res;
        }
      } catch (error) {
        return false;
      }
    },
    staleTime: 1000 * 60 * 60, // 60 minutes
  });
};
