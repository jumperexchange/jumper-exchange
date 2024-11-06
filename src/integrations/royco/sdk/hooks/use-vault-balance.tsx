import { useQuery } from '@tanstack/react-query';
import { getVaultBalanceQueryOptions } from '../queries';

export const useVaultBalance = ({
  chain_id,
  account,
  vault_address,
}: {
  chain_id: number;
  account: string;
  vault_address: string;
}) => {
  return useQuery(
    getVaultBalanceQueryOptions(chain_id, account, vault_address),
  );
};
